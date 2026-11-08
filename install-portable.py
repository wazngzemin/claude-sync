#!/usr/bin/env python3
"""便携安装器：只更新 Claude 同步程序，不分发配置或工作文件。"""
import argparse
import datetime
import os
from pathlib import Path
import re
import shlex
import shutil
import signal
import subprocess
import sys
import tempfile
import time

REMOTE = "https://github.com/wazngzemin/claude-sync.git"
REQUIRED = ("sync-server.py", "dashboard.html", "sync-engine.sh", "launch.sh",
            "large_files.py", "upload.py", "家里-一键拉取.command")
OPTIONAL = ("安装.command", "家里首次设置.txt", "办公室-一键推送.command",
            "AppIcon.icns", "AppIcon.png")
ALLOWLIST = REQUIRED + OPTIONAL


class InstallError(RuntimeError):
    pass


def clean(text):
    text = re.sub(r"(https?://)[^/\s@]+@", r"\1[已隐藏凭证]@", text)
    return re.sub(r"\b(?:gh[pousr]_[A-Za-z0-9]+|github_pat_[A-Za-z0-9_]+)\b", "[已隐藏凭证]", text)


class Installer:
    def __init__(self, home, payload, remote=REMOTE, log=None):
        self.home = Path(home).resolve()
        self.payload = Path(payload).resolve()
        self.repo = self.home / ".claude-sync"
        self.state = self.home / ".claude-sync-state"
        self.remote = remote  # 可供隔离测试注入本地 bare 仓库，不是命令行选项。
        self.log = log
        self.git_prefix = ["git"]
        self.use_gh_credentials = False

    def say(self, message):
        message = clean(str(message))
        print(message, flush=True)
        if self.log:
            self.log.write(message + "\n")
            self.log.flush()

    def run(self, args, cwd=None, check=True, timeout=600):
        try:
            result = subprocess.run(args, cwd=cwd, text=True, stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE, timeout=timeout)
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise InstallError(clean(str(exc))) from exc
        if result.stdout.strip():
            self.say(result.stdout.strip())
        if result.stderr.strip():
            self.say(result.stderr.strip())
        if check and result.returncode:
            raise InstallError("命令失败（退出码 %s）：%s" % (result.returncode, Path(args[0]).name))
        return result

    def check_payload(self):
        if not self.payload.is_dir():
            raise InstallError("缺少 payload 文件夹，请完整解压安装包后再运行。")
        for name in ALLOWLIST:
            p = self.payload / name
            if p.is_symlink():
                raise InstallError("安装文件不能是符号链接：" + name)
            if name in REQUIRED and not p.is_file():
                raise InstallError("安装包缺少：" + name)
            if p.exists() and not p.is_file():
                raise InstallError("安装文件类型不正确：" + name)
        for name in REQUIRED:
            p = self.payload / name
            if name.endswith(".py"):
                try:
                    compile(p.read_text(encoding="utf-8"), str(p), "exec")
                except (SyntaxError, UnicodeError) as exc:
                    raise InstallError("Python 文件校验失败：" + name) from exc
            elif name.endswith((".sh", ".command")):
                self.run(["/bin/bash", "-n", str(p)], timeout=15)
        self.say("安装包校验通过；仅允许固定名单中的 Claude 程序文件。")

    def prepare_credentials(self):
        if self.remote != REMOTE or not shutil.which("gh"):
            return
        result = subprocess.run(["gh", "auth", "status", "--hostname", "github.com"],
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                timeout=30)
        if result.returncode == 0:
            self.use_gh_credentials = True
            self.git_prefix += ["-c", "credential.https://github.com.helper=",
                                "-c", "credential.https://github.com.helper=!gh auth git-credential"]
            self.say("使用这台电脑已有的 GitHub CLI 登录。")

    def configure_repository_access(self):
        """仅在已验证的生产仓库内保存 HTTPS 和已有 gh 登录方式。"""
        if self.remote != REMOTE:
            return
        self.state.mkdir(parents=True, exist_ok=True)
        backup = Path(tempfile.mkdtemp(prefix="git-config-backup-", dir=self.state))
        config = self.repo / ".git" / "config"
        shutil.copy2(config, backup / "config")
        try:
            self.run(["git", "remote", "set-url", "origin", REMOTE], cwd=self.repo)
            if self.use_gh_credentials:
                key = "credential.https://github.com.helper"
                self.run(["git", "config", "--local", "--replace-all", key, ""], cwd=self.repo)
                self.run(["git", "config", "--local", "--add", key,
                          "!gh auth git-credential"], cwd=self.repo)
        except Exception:
            shutil.copy2(backup / "config", config)
            raise
        self.say("仓库已使用 HTTPS；Git 配置原件备份：" + str(backup))
        if self.use_gh_credentials:
            self.say("已为此仓库保存 GitHub CLI 凭证助手，后续 App 拉取可复用登录。")

    def valid_remote(self, value):
        if self.remote != REMOTE:
            return value == self.remote
        return value in (REMOTE, REMOTE[:-4], "git@github.com:wazngzemin/claude-sync.git",
                         "git@github.com:wazngzemin/claude-sync",
                         "ssh://git@github.com/wazngzemin/claude-sync.git")

    def update_repository(self):
        if self.repo.is_symlink():
            raise InstallError("~/.claude-sync 是符号链接，已停止；请保留现有内容并检查路径。")
        self.prepare_credentials()
        if self.repo.exists():
            if not self.repo.is_dir() or not (self.repo / ".git").is_dir():
                raise InstallError("~/.claude-sync 已存在但不是完整 Git 仓库；已保留，请不要删除或覆盖。")
            remote = subprocess.run(["git", "remote", "get-url", "origin"], cwd=self.repo,
                                    capture_output=True, text=True)
            if remote.returncode or not self.valid_remote(remote.stdout.strip()):
                raise InstallError("现有仓库 origin 不是预期的 wazngzemin/claude-sync，已停止。")
            status = subprocess.run(["git", "status", "--porcelain", "--untracked-files=normal"],
                                    cwd=self.repo, capture_output=True, text=True)
            if status.returncode:
                raise InstallError("无法检查现有仓库状态，已停止。")
            if status.stdout.strip():
                raise InstallError("现有仓库有未提交或未跟踪文件，已停止并保留全部内容。请先处理本机修改，不要强制覆盖。")
            branch = subprocess.run(["git", "symbolic-ref", "--quiet", "--short", "HEAD"],
                                    cwd=self.repo, capture_output=True, text=True)
            if branch.returncode:
                raise InstallError("仓库处于分离 HEAD 状态，已停止。")
            if branch.stdout.strip() != "main":
                raise InstallError("当前分支不是 main，已停止；请先确认并处理分支差异。")
            self.configure_repository_access()
            self.say("检查云端版本并安全更新仓库……")
            self.run(self.git_prefix + ["fetch", "origin"], cwd=self.repo)
            self.run(self.git_prefix + ["pull", "--ff-only", "origin", branch.stdout.strip()], cwd=self.repo)
        else:
            self.say("首次下载同步仓库；需要此电脑已有 GitHub 仓库访问权限。")
            with tempfile.TemporaryDirectory(prefix=".claude-sync-install-", dir=self.home) as temp:
                checkout = Path(temp) / "checkout"
                self.run(self.git_prefix + ["clone", "--branch", "main", self.remote, str(checkout)])
                if self.repo.exists():
                    raise InstallError("下载期间目标目录被创建，已停止以避免覆盖。")
                checkout.rename(self.repo)
            self.configure_repository_access()
        self.say("仓库更新成功。尚未向 Claude 配置目录或工作目录分发文件。")

    def deploy(self):
        self.state.mkdir(parents=True, exist_ok=True)
        backup = Path(tempfile.mkdtemp(prefix="portable-backup-", dir=self.state))
        changed = []
        try:
            for name in ALLOWLIST:
                src = self.payload / name
                if not src.is_file():
                    continue
                dst = self.repo / name
                if dst.is_symlink() or (dst.exists() and not dst.is_file()):
                    raise InstallError("目标程序不是普通文件，停止部署：" + name)
                existed = dst.exists()
                if existed:
                    shutil.copy2(dst, backup / name)
                fd, temporary = tempfile.mkstemp(prefix=".portable-", dir=self.repo)
                os.close(fd)
                try:
                    shutil.copy2(src, temporary)
                    if name.endswith((".sh", ".command")):
                        os.chmod(temporary, 0o755)
                    os.replace(temporary, dst)
                    changed.append((name, existed))
                finally:
                    if os.path.exists(temporary):
                        os.unlink(temporary)
        except Exception:
            for name, existed in reversed(changed):
                if existed:
                    shutil.copy2(backup / name, self.repo / name)
                else:
                    (self.repo / name).unlink()
            raise
        self.say("程序已更新；原件备份：" + str(backup))
        return backup

    def build_app(self, backup):
        desktop = self.home / "Desktop"
        desktop.mkdir(parents=True, exist_ok=True)
        app = desktop / "Claude同步管理.app"
        with tempfile.TemporaryDirectory(prefix="app-build-", dir=self.state) as temp:
            new_app = Path(temp) / app.name
            source = 'on run\n do shell script "bash \\\"$HOME/.claude-sync/launch.sh\\\" >/dev/null 2>&1 &"\n delay 1\nend run'
            self.run(["osacompile", "-o", str(new_app), "-e", source], timeout=60)
            previous = backup / app.name
            if app.exists() or app.is_symlink():
                app.rename(previous)
            try:
                new_app.rename(app)
            except Exception:
                if previous.exists() or previous.is_symlink():
                    previous.rename(app)
                raise
        self.say("桌面 App 已更新。")

    def stop_old_server(self):
        result = subprocess.run(["lsof", "-tiTCP:9527", "-sTCP:LISTEN"],
                                capture_output=True, text=True)
        for token in set(result.stdout.split()):
            if not token.isdigit():
                continue
            pid = int(token)
            cmd = subprocess.run(["ps", "-p", token, "-o", "command="], capture_output=True, text=True)
            cwd = subprocess.run(["lsof", "-a", "-p", token, "-d", "cwd", "-Fn"], capture_output=True, text=True)
            paths = [line[1:] for line in cwd.stdout.splitlines() if line.startswith("n")]
            try:
                words = shlex.split(cmd.stdout.strip())
            except ValueError:
                words = []
            expected = str(self.repo / "sync-server.py")
            matches = expected in words or ("sync-server.py" in words and str(self.repo) in paths)
            if not matches:
                raise InstallError("9527 端口被其他程序占用，未终止该程序。关闭占用程序后重新打开 App。")
            self.say("停止此同步目录的旧 Claude 服务……")
            try:
                os.kill(pid, signal.SIGTERM)
            except ProcessLookupError:
                continue
            for _ in range(30):
                try:
                    os.kill(pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.1)
            else:
                raise InstallError("旧服务尚未退出，未强制结束；请稍后重新打开 App。")

    def install(self):
        self.check_payload()
        for name in ("git", "rsync", "osacompile", "lsof", "bash"):
            if not shutil.which(name):
                raise InstallError("缺少依赖：" + name)
        self.update_repository()
        backup = self.deploy()
        self.build_app(backup)
        self.stop_old_server()
        self.run(["/bin/bash", str(self.repo / "launch.sh")], timeout=90)
        self.say("安装完成。请在新 App 中点「拉取全部」获取配置和工作文件；本安装器未自动覆盖这些数据。")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="仅离线检查同目录 payload，不安装、不联网")
    args = parser.parse_args(argv)
    payload = Path(__file__).resolve().parent / "payload"
    installer = Installer(Path.home(), payload)
    if args.check:
        try:
            installer.check_payload()
            return 0
        except InstallError as exc:
            print("校验失败：" + clean(str(exc)), file=sys.stderr)
            return 1
    installer.state.mkdir(parents=True, exist_ok=True)
    log_path = installer.state / ("portable-install-" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + ".log")
    with log_path.open("a", encoding="utf-8") as log:
        installer.log = log
        installer.say("安装日志：" + str(log_path))
        try:
            installer.install()
        except (InstallError, OSError, subprocess.TimeoutExpired) as exc:
            installer.say("安装未完成：" + str(exc))
            installer.say("现有数据已保留。请查看上方错误和日志；不要使用强制重置解决。")
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
