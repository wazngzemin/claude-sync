"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var _a, _b;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs$k = require("node:fs/promises");
const path$m = require("node:path");
const node_url = require("node:url");
const require$$1 = require("electron");
const node_child_process = require("node:child_process");
const fs$j = require("node:fs");
const node_stream = require("node:stream");
const promises = require("node:stream/promises");
const node_module = require("node:module");
const node_https = require("node:https");
const node_util = require("node:util");
const node_crypto = require("node:crypto");
const node_perf_hooks = require("node:perf_hooks");
const node_http = require("node:http");
const os$1 = require("node:os");
const require$$1$1 = require("fs");
const require$$0 = require("constants");
const require$$0$1 = require("stream");
const require$$4 = require("util");
const require$$5 = require("assert");
const require$$1$2 = require("path");
const require$$1$5 = require("child_process");
const require$$0$2 = require("events");
const require$$0$3 = require("crypto");
const require$$1$3 = require("tty");
const require$$2 = require("os");
const require$$2$1 = require("url");
const require$$1$4 = require("string_decoder");
const require$$14 = require("zlib");
const require$$4$1 = require("http");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
if (process.env["VITE_DEV_SERVER_URL"]) {
  const devUserDataPath = path$m.join(require$$1.app.getPath("appData"), "Recordly-dev");
  require$$1.app.setPath("userData", devUserDataPath);
  require$$1.app.setPath("sessionData", path$m.join(devUserDataPath, "session"));
}
const USER_DATA_PATH = require$$1.app.getPath("userData");
const RECORDINGS_DIR = path$m.join(USER_DATA_PATH, "recordings");
const PY_HIDE_WIN = `
import ctypes, sys

class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]

class CURSORINFO(ctypes.Structure):
    _fields_ = [
        ("cbSize", ctypes.c_uint),
        ("flags", ctypes.c_uint),
        ("hCursor", ctypes.c_void_p),
        ("ptScreenPos", POINT),
    ]

user32 = ctypes.windll.user32
CURSOR_SHOWING = 0x00000001

for _ in range(32):
    info = CURSORINFO()
    info.cbSize = ctypes.sizeof(CURSORINFO)
    if user32.GetCursorInfo(ctypes.byref(info)) and not (info.flags & CURSOR_SHOWING):
        sys.exit(0)
    user32.ShowCursor(False)

sys.exit(0)
`.trim();
const PY_SHOW_WIN = `
import ctypes, sys

class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]

class CURSORINFO(ctypes.Structure):
    _fields_ = [
        ("cbSize", ctypes.c_uint),
        ("flags", ctypes.c_uint),
        ("hCursor", ctypes.c_void_p),
        ("ptScreenPos", POINT),
    ]

user32 = ctypes.windll.user32
CURSOR_SHOWING = 0x00000001

for _ in range(32):
    info = CURSORINFO()
    info.cbSize = ctypes.sizeof(CURSORINFO)
    if user32.GetCursorInfo(ctypes.byref(info)) and (info.flags & CURSOR_SHOWING):
        sys.exit(0)
    user32.ShowCursor(True)

sys.exit(0)
`.trim();
function getPowerShellCommand(show) {
  const desiredFlag = show ? 1 : 0;
  const showLiteral = show ? "$true" : "$false";
  return [
    '$signature = @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public struct POINT { public int X; public int Y; }",
    "public struct CURSORINFO { public int cbSize; public int flags; public IntPtr hCursor; public POINT ptScreenPos; }",
    "public static class CursorNative {",
    '  [DllImport("user32.dll")] public static extern int ShowCursor(bool show);',
    '  [DllImport("user32.dll")] public static extern bool GetCursorInfo(ref CURSORINFO info);',
    "}",
    '"@;',
    "Add-Type -TypeDefinition $signature -Language CSharp -ErrorAction SilentlyContinue | Out-Null;",
    "$info = New-Object CURSORINFO;",
    "$info.cbSize = [Runtime.InteropServices.Marshal]::SizeOf([type]CURSORINFO);",
    "for ($i = 0; $i -lt 32; $i++) {",
    "  if ([CursorNative]::GetCursorInfo([ref]$info) -and (($info.flags -band 1) -eq " + desiredFlag + ")) { exit 0 }",
    "  [CursorNative]::ShowCursor(" + showLiteral + ") | Out-Null;",
    "}",
    "exit 0"
  ].join(" ");
}
function runPythonSnippet(code) {
  for (const executable of ["python", "python3", "py"]) {
    const result = node_child_process.spawnSync(executable, ["-c", code], { timeout: 5e3 });
    if (!result.error && result.status === 0) {
      return true;
    }
  }
  return false;
}
function runPowerShellSnippet(command) {
  const result = node_child_process.spawnSync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", command],
    { timeout: 8e3 }
  );
  return !result.error && result.status === 0;
}
let cursorHidden = false;
function hideCursor() {
  if (process.platform !== "win32" || cursorHidden) {
    return false;
  }
  try {
    const didHide = runPythonSnippet(PY_HIDE_WIN) || runPowerShellSnippet(getPowerShellCommand(false));
    if (didHide) {
      cursorHidden = true;
    }
    return didHide;
  } catch (error2) {
    console.error("[cursorHider] Failed to hide Windows cursor:", error2);
    return false;
  }
}
function showCursor() {
  if (process.platform !== "win32" || !cursorHidden) {
    return false;
  }
  try {
    const didShow = runPythonSnippet(PY_SHOW_WIN) || runPowerShellSnippet(getPowerShellCommand(true));
    if (didShow) {
      cursorHidden = false;
    }
    return didShow;
  } catch (error2) {
    console.error("[cursorHider] Failed to show Windows cursor:", error2);
    return false;
  }
}
const EXTENSIONS_DIR_NAME = "extensions";
const MANIFEST_FILE_NAME = "recordly-extension.json";
const BUILTIN_EXTENSIONS_DIR = "builtin-extensions";
const EXTENSION_STATE_FILE_NAME = "extension-state.json";
const extensionRegistry = /* @__PURE__ */ new Map();
function getExtensionsDirectory() {
  return path$m.join(require$$1.app.getPath("userData"), EXTENSIONS_DIR_NAME);
}
function getBuiltinExtensionsDirectory() {
  if (require$$1.app.isPackaged) {
    return path$m.join(process.resourcesPath, BUILTIN_EXTENSIONS_DIR);
  }
  return path$m.join(require$$1.app.getAppPath(), "public", BUILTIN_EXTENSIONS_DIR);
}
function getExtensionStateFilePath() {
  return path$m.join(require$$1.app.getPath("userData"), EXTENSION_STATE_FILE_NAME);
}
function isPersistedExtensionStatus(value) {
  return value === "active" || value === "disabled" || value === "installed";
}
async function readPersistedExtensionStatuses() {
  const stateFile = getExtensionStateFilePath();
  if (!fs$j.existsSync(stateFile)) {
    return {};
  }
  try {
    const raw = await fs$k.readFile(stateFile, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const entries = Object.entries(parsed).filter(
      ([key, value]) => typeof key === "string" && isPersistedExtensionStatus(value)
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}
async function writePersistedExtensionStatuses(statuses) {
  const stateFile = getExtensionStateFilePath();
  await fs$k.mkdir(path$m.dirname(stateFile), { recursive: true });
  await fs$k.writeFile(stateFile, JSON.stringify(statuses, null, 2), "utf-8");
}
async function updatePersistedExtensionStatus(id, status) {
  const statuses = await readPersistedExtensionStatuses();
  if (status) {
    statuses[id] = status;
  } else {
    delete statuses[id];
  }
  await writePersistedExtensionStatuses(statuses);
}
async function ensureExtensionsDirectory() {
  const dir = getExtensionsDirectory();
  await fs$k.mkdir(dir, { recursive: true });
}
function validateManifest(manifest, extensionPath) {
  if (!manifest || typeof manifest !== "object") {
    return null;
  }
  const m = manifest;
  if (typeof m.id !== "string" || m.id.length === 0) return null;
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(m.id)) return null;
  if (typeof m.name !== "string" || m.name.length === 0) return null;
  if (typeof m.version !== "string") return null;
  if (typeof m.main !== "string" || m.main.length === 0) return null;
  const resolvedMain = path$m.resolve(extensionPath, m.main);
  const relativeMain = path$m.relative(extensionPath, resolvedMain);
  if (relativeMain.startsWith("..") || path$m.isAbsolute(relativeMain)) {
    console.warn(`[extensions] Extension ${m.id}: main entry escapes extension directory`);
    return null;
  }
  const validPermissions = /* @__PURE__ */ new Set([
    "render",
    "cursor",
    "audio",
    "timeline",
    "ui",
    "assets",
    "export"
  ]);
  const permissions = Array.isArray(m.permissions) ? m.permissions : [];
  const safePermissions = permissions.filter(
    (p) => typeof p === "string" && validPermissions.has(p)
  );
  return {
    id: m.id,
    name: m.name,
    version: m.version,
    description: typeof m.description === "string" ? m.description : "",
    author: typeof m.author === "string" ? m.author : void 0,
    homepage: typeof m.homepage === "string" ? m.homepage : void 0,
    license: typeof m.license === "string" ? m.license : void 0,
    engine: typeof m.engine === "string" ? m.engine : void 0,
    icon: typeof m.icon === "string" ? m.icon : void 0,
    main: m.main,
    permissions: safePermissions,
    contributes: typeof m.contributes === "object" && m.contributes !== null ? m.contributes : void 0
  };
}
async function scanExtensionsIn(directory, builtin) {
  const results = [];
  if (!fs$j.existsSync(directory)) {
    return results;
  }
  let entries;
  try {
    entries = await fs$k.readdir(directory);
  } catch {
    return results;
  }
  for (const entry of entries) {
    const extDir = path$m.join(directory, entry);
    let stat2;
    try {
      stat2 = await fs$k.lstat(extDir);
    } catch {
      continue;
    }
    if (!stat2.isDirectory()) continue;
    const manifestPath = path$m.join(extDir, MANIFEST_FILE_NAME);
    if (!fs$j.existsSync(manifestPath)) continue;
    try {
      const raw = await fs$k.readFile(manifestPath, "utf-8");
      const parsed = JSON.parse(raw);
      const manifest = validateManifest(parsed, extDir);
      if (!manifest) {
        results.push({
          manifest: {
            id: entry,
            name: entry,
            version: "0.0.0",
            main: "",
            permissions: [],
            description: "Invalid manifest"
          },
          status: "error",
          path: extDir,
          error: "Invalid or incomplete manifest",
          builtin
        });
        continue;
      }
      const entryPath = path$m.join(extDir, manifest.main);
      if (!fs$j.existsSync(entryPath)) {
        results.push({
          manifest,
          status: "error",
          path: extDir,
          error: `Entry file not found: ${manifest.main}`,
          builtin
        });
        continue;
      }
      results.push({
        manifest,
        status: "installed",
        path: extDir,
        builtin
      });
    } catch (err) {
      results.push({
        manifest: {
          id: entry,
          name: entry,
          version: "0.0.0",
          main: "",
          permissions: [],
          description: "Failed to load"
        },
        status: "error",
        path: extDir,
        error: String(err),
        builtin
      });
    }
  }
  return results;
}
async function discoverExtensions() {
  await ensureExtensionsDirectory();
  const builtinDir = getBuiltinExtensionsDirectory();
  const userDir = getExtensionsDirectory();
  const [builtinExts, userExts] = await Promise.all([
    scanExtensionsIn(builtinDir, true),
    scanExtensionsIn(userDir, false)
  ]);
  const persistedStatuses = await readPersistedExtensionStatuses();
  const applyPersistedStatus = (ext) => {
    if (ext.status === "error") {
      return ext;
    }
    return {
      ...ext,
      status: persistedStatuses[ext.manifest.id] ?? (ext.builtin ? "active" : "installed")
    };
  };
  const normalizedBuiltinExts = builtinExts.map(applyPersistedStatus);
  const normalizedUserExts = userExts.map(applyPersistedStatus);
  extensionRegistry.clear();
  for (const ext of normalizedBuiltinExts) {
    extensionRegistry.set(ext.manifest.id, ext);
  }
  for (const ext of normalizedUserExts) {
    extensionRegistry.set(ext.manifest.id, ext);
  }
  return Array.from(extensionRegistry.values());
}
function getRegisteredExtensions() {
  return Array.from(extensionRegistry.values());
}
function getExtension(id) {
  return extensionRegistry.get(id);
}
async function setExtensionStatus(id, status) {
  const ext = extensionRegistry.get(id);
  if (!ext) return false;
  ext.status = status;
  if (status === "active" || status === "disabled" || status === "installed") {
    await updatePersistedExtensionStatus(id, status);
  }
  return true;
}
async function installExtensionFromPath(sourcePath) {
  const manifestPath = path$m.join(sourcePath, MANIFEST_FILE_NAME);
  if (!fs$j.existsSync(manifestPath)) {
    return null;
  }
  let manifest;
  try {
    const raw = await fs$k.readFile(manifestPath, "utf-8");
    manifest = validateManifest(JSON.parse(raw), sourcePath);
  } catch {
    return null;
  }
  if (!manifest) return null;
  const targetDir = path$m.join(getExtensionsDirectory(), manifest.id);
  if (fs$j.existsSync(targetDir)) {
    await fs$k.rm(targetDir, { recursive: true, force: true });
  }
  await fs$k.cp(sourcePath, targetDir, { recursive: true });
  const info = {
    manifest,
    status: "installed",
    path: targetDir
  };
  extensionRegistry.set(manifest.id, info);
  await updatePersistedExtensionStatus(manifest.id, "installed");
  return info;
}
async function uninstallExtension(id) {
  const ext = extensionRegistry.get(id);
  if (!ext || ext.builtin) return false;
  try {
    await fs$k.rm(ext.path, { recursive: true, force: true });
    extensionRegistry.delete(id);
    await updatePersistedExtensionStatus(id, null);
    return true;
  } catch {
    return false;
  }
}
function getErrorMessage(error2) {
  return error2 instanceof Error ? error2.message : String(error2);
}
const MARKETPLACE_API_BASE = "https://marketplace.recordly.dev/extensions/api/v1";
const REQUEST_TIMEOUT_MS = 15e3;
async function assertNoEscapedFiles(dir, root2) {
  const entries = await fs$k.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path$m.join(dir, entry.name);
    const real = await fs$k.realpath(entryPath);
    if (!real.startsWith(root2 + path$m.sep) && real !== root2) {
      await fs$k.rm(entryPath, { recursive: true, force: true }).catch(() => void 0);
      throw new Error(
        `Zip-slip detected: ${entry.name} resolves outside extraction directory`
      );
    }
    if (entry.isDirectory()) {
      await assertNoEscapedFiles(entryPath, root2);
    }
  }
}
function getMarketplaceUrl() {
  if (process.env.RECORDLY_MARKETPLACE_URL) return process.env.RECORDLY_MARKETPLACE_URL;
  return MARKETPLACE_API_BASE;
}
function getAdminKey() {
  return process.env.RECORDLY_ADMIN_KEY;
}
async function marketplaceFetch(endpoint, options = {}) {
  const url = `${getMarketplaceUrl()}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? REQUEST_TIMEOUT_MS);
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Recordly-Version": require$$1.app.getVersion(),
      "X-Recordly-Platform": process.platform
    };
    if (options.admin) {
      const key = getAdminKey();
      if (!key) throw new Error("Admin key not configured (set RECORDLY_ADMIN_KEY env var)");
      headers["X-Admin-Key"] = key;
    }
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : void 0,
      signal: controller.signal
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Marketplace API error ${response.status}: ${text}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
async function searchMarketplace(params) {
  var _a2;
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set("query", params.query);
  if ((_a2 = params.tags) == null ? void 0 : _a2.length) searchParams.set("tags", params.tags.join(","));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  const qs = searchParams.toString();
  const result = await marketplaceFetch(
    `/extensions${qs ? `?${qs}` : ""}`
  );
  const installed = getRegisteredExtensions();
  const installedIds = new Set(installed.map((e) => e.manifest.id));
  for (const ext of result.extensions) {
    ext.installed = installedIds.has(ext.id);
  }
  return result;
}
async function getMarketplaceExtension(id) {
  try {
    const ext = await marketplaceFetch(
      `/extensions/${encodeURIComponent(id)}`
    );
    const installed = getRegisteredExtensions();
    ext.installed = installed.some((e) => e.manifest.id === ext.id);
    return ext;
  } catch {
    return null;
  }
}
async function downloadAndInstallExtension(extensionId, downloadUrl) {
  const allowedOrigins = [
    "https://marketplace.recordly.dev",
    "https://recordly.dev",
    ...require$$1.app.isPackaged ? [] : ["http://localhost:3001"]
  ];
  try {
    const url = new URL(downloadUrl);
    if (!allowedOrigins.some((o) => url.origin === o)) {
      return { success: false, error: `Untrusted download origin: ${url.origin}` };
    }
  } catch {
    return { success: false, error: "Invalid download URL" };
  }
  const tempDir = path$m.join(require$$1.app.getPath("temp"), `recordly-ext-${extensionId}-${Date.now()}`);
  const zipPath = path$m.join(tempDir, "extension.zip");
  try {
    await fs$k.mkdir(tempDir, { recursive: true });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6e4);
    let response;
    try {
      response = await fetch(downloadUrl, {
        signal: controller.signal,
        headers: {
          "X-Recordly-Version": require$$1.app.getVersion()
        }
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }
    if (!response.body) {
      throw new Error("Download response has no body");
    }
    const fileStream = fs$j.createWriteStream(zipPath);
    await promises.pipeline(node_stream.Readable.fromWeb(response.body), fileStream);
    const extractDir = path$m.join(tempDir, "extracted");
    await fs$k.mkdir(extractDir, { recursive: true });
    const { execFile } = await import("node:child_process");
    await new Promise((resolve, reject) => {
      if (process.platform === "win32") {
        execFile(
          "powershell",
          [
            "-NoProfile",
            "-NonInteractive",
            "-command",
            "Expand-Archive",
            "-LiteralPath",
            zipPath,
            "-DestinationPath",
            extractDir,
            "-Force"
          ],
          (error2) => {
            if (error2) reject(error2);
            else resolve();
          }
        );
      } else {
        execFile("unzip", ["-o", zipPath, "-d", extractDir], (error2) => {
          if (error2) reject(error2);
          else resolve();
        });
      }
    });
    const resolvedExtractDir = await fs$k.realpath(extractDir);
    await assertNoEscapedFiles(resolvedExtractDir, resolvedExtractDir);
    const entries = await fs$k.readdir(extractDir, { withFileTypes: true });
    let manifestDir = extractDir;
    const dirs = entries.filter((e) => e.isDirectory());
    if (dirs.length === 1 && !fs$j.existsSync(path$m.join(extractDir, "recordly-extension.json"))) {
      manifestDir = path$m.join(extractDir, dirs[0].name);
    }
    if (!fs$j.existsSync(path$m.join(manifestDir, "recordly-extension.json"))) {
      throw new Error(
        "Downloaded extension does not contain a recordly-extension.json manifest"
      );
    }
    const info = await installExtensionFromPath(manifestDir);
    if (!info) {
      throw new Error("Extension validation failed after download");
    }
    fetch(`${getMarketplaceUrl()}/extensions/${encodeURIComponent(extensionId)}/download`, {
      method: "POST",
      headers: { "X-Recordly-Version": require$$1.app.getVersion() }
    }).catch(() => void 0);
    return { success: true };
  } catch (error2) {
    return { success: false, error: getErrorMessage(error2) };
  } finally {
    await fs$k.rm(tempDir, { recursive: true, force: true }).catch(() => void 0);
  }
}
async function fetchPendingReviews(params) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  const qs = searchParams.toString();
  return marketplaceFetch(
    `/admin/reviews${qs ? `?${qs}` : ""}`,
    { admin: true }
  );
}
async function updateReviewStatus(reviewId, status, notes) {
  return marketplaceFetch(
    `/admin/reviews/${encodeURIComponent(reviewId)}`,
    {
      method: "PATCH",
      body: { status, notes },
      admin: true
    }
  );
}
async function submitExtensionForReview(extensionId) {
  try {
    return await marketplaceFetch(
      `/extensions/${encodeURIComponent(extensionId)}/submit`,
      { method: "POST" }
    );
  } catch (error2) {
    return { success: false, error: getErrorMessage(error2) };
  }
}
function serializeExtensionInfo(info) {
  return {
    manifest: info.manifest,
    status: info.status,
    path: info.path,
    error: info.error,
    builtin: info.builtin ?? false
  };
}
function registerExtensionIpcHandlers() {
  require$$1.ipcMain.handle("extensions:discover", async () => {
    const extensions = await discoverExtensions();
    return extensions.map(serializeExtensionInfo);
  });
  require$$1.ipcMain.handle("extensions:list", () => {
    return getRegisteredExtensions().map(serializeExtensionInfo);
  });
  require$$1.ipcMain.handle("extensions:get", (_event, id) => {
    const ext = getExtension(id);
    return ext ? serializeExtensionInfo(ext) : null;
  });
  require$$1.ipcMain.handle("extensions:enable", async (_event, id) => {
    return setExtensionStatus(id, "active");
  });
  require$$1.ipcMain.handle("extensions:disable", async (_event, id) => {
    return setExtensionStatus(id, "disabled");
  });
  require$$1.ipcMain.handle("extensions:install-from-folder", async (event) => {
    const window2 = require$$1.BrowserWindow.fromWebContents(event.sender);
    const result = await require$$1.dialog.showOpenDialog(window2, {
      title: "Select Extension Folder",
      properties: ["openDirectory"],
      message: "Select a folder containing a recordly-extension.json manifest"
    });
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, reason: "cancelled" };
    }
    const info = await installExtensionFromPath(result.filePaths[0]);
    if (!info) {
      return {
        success: false,
        reason: "Invalid extension: missing or invalid recordly-extension.json"
      };
    }
    return { success: true, extension: serializeExtensionInfo(info) };
  });
  require$$1.ipcMain.handle("extensions:uninstall", async (_event, id) => {
    const success = await uninstallExtension(id);
    return { success };
  });
  require$$1.ipcMain.handle("extensions:get-directory", () => {
    return getExtensionsDirectory();
  });
  require$$1.ipcMain.handle("extensions:open-directory", async () => {
    const dir = getExtensionsDirectory();
    await require$$1.shell.openPath(dir);
    return { success: true };
  });
  require$$1.ipcMain.handle(
    "extensions:marketplace-search",
    async (_event, params) => {
      try {
        return await searchMarketplace(params);
      } catch (error2) {
        return {
          extensions: [],
          total: 0,
          page: 1,
          pageSize: 20,
          error: getErrorMessage(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle("extensions:marketplace-get", async (_event, id) => {
    return getMarketplaceExtension(id);
  });
  require$$1.ipcMain.handle(
    "extensions:marketplace-install",
    async (_event, extensionId, downloadUrl) => {
      return downloadAndInstallExtension(extensionId, downloadUrl);
    }
  );
  require$$1.ipcMain.handle("extensions:marketplace-submit", async (_event, extensionId) => {
    return submitExtensionForReview(extensionId);
  });
  require$$1.ipcMain.handle(
    "extensions:reviews-list",
    async (_event, params) => {
      try {
        return await fetchPendingReviews(params);
      } catch (error2) {
        return { reviews: [], total: 0, error: getErrorMessage(error2) };
      }
    }
  );
  require$$1.ipcMain.handle(
    "extensions:review-update",
    async (_event, reviewId, status, notes) => {
      return updateReviewStatus(reviewId, status, notes);
    }
  );
}
function normalizeLinuxWindowSystem(value) {
  const normalized = value == null ? void 0 : value.trim().toLowerCase();
  if (normalized === "wayland" || normalized === "x11") {
    return normalized;
  }
  return null;
}
function getForcedLinuxWindowSystem(env) {
  return normalizeLinuxWindowSystem(env.OZONE_PLATFORM) ?? normalizeLinuxWindowSystem(env.ELECTRON_OZONE_PLATFORM_HINT);
}
function shouldForceLinuxEgl(env) {
  var _a2;
  const forcedWindowSystem = getForcedLinuxWindowSystem(env);
  if (forcedWindowSystem === "wayland") {
    return false;
  }
  if (forcedWindowSystem === "x11") {
    return true;
  }
  const sessionType = (_a2 = env.XDG_SESSION_TYPE) == null ? void 0 : _a2.toLowerCase();
  if (sessionType === "wayland") {
    return false;
  }
  if (sessionType === "x11") {
    return true;
  }
  return !env.WAYLAND_DISPLAY;
}
function getGpuSwitches(platform2, env = process.env) {
  if (platform2 === "darwin") {
    return {
      useAngle: "metal",
      disableFeatures: ["MacCatapLoopbackAudioForScreenShare"]
    };
  }
  if (platform2 === "win32") {
    return { useAngle: "d3d11" };
  }
  if (platform2 === "linux") {
    return {
      useGl: shouldForceLinuxEgl(env) ? "egl" : void 0,
      disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"]
    };
  }
  return {};
}
const PROJECT_FILE_EXTENSION = "recordly";
const LEGACY_PROJECT_FILE_EXTENSIONS = ["openscreen"];
const PROJECTS_DIRECTORY_NAME = "Projects";
const PROJECT_THUMBNAIL_SUFFIX = ".preview.png";
const RECENT_PROJECTS_FILE = path$m.join(USER_DATA_PATH, "recent-projects.json");
const MAX_RECENT_PROJECTS = 16;
const SHORTCUTS_FILE = path$m.join(USER_DATA_PATH, "shortcuts.json");
const RECORDINGS_SETTINGS_FILE = path$m.join(USER_DATA_PATH, "recordings-settings.json");
const COUNTDOWN_SETTINGS_FILE = path$m.join(USER_DATA_PATH, "countdown-settings.json");
const AUTO_RECORDING_PREFIX = "recording-";
const AUTO_RECORDING_RETENTION_COUNT = 20;
const AUTO_RECORDING_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1e3;
const ALLOW_RECORDLY_WINDOW_CAPTURE = Boolean(process.env["VITE_DEV_SERVER_URL"]);
const RECORDING_SESSION_MANIFEST_SUFFIX = ".recordly-session.json";
const WHISPER_MODEL_DOWNLOAD_URL = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin";
const WHISPER_MODEL_DIR = path$m.join(USER_DATA_PATH, "whisper");
const WHISPER_SMALL_MODEL_PATH = path$m.join(WHISPER_MODEL_DIR, "ggml-small.bin");
const COMPANION_AUDIO_LAYOUTS = [
  { platform: "mac", systemSuffix: ".system.m4a", micSuffix: ".mic.m4a" },
  { platform: "win", systemSuffix: ".system.wav", micSuffix: ".mic.wav" },
  { platform: "mac", systemSuffix: ".system.webm", micSuffix: ".mic.webm" }
];
const CURSOR_TELEMETRY_VERSION = 2;
const CURSOR_SAMPLE_INTERVAL_MS = 33;
const MAX_CURSOR_SAMPLES = 60 * 60 * 30;
let selectedSource = null;
let currentProjectPath = null;
let currentVideoPath = null;
let currentRecordingSession = null;
const approvedLocalReadPaths = /* @__PURE__ */ new Set();
let nativeScreenRecordingActive = false;
let nativeCaptureProcess = null;
let nativeCaptureOutputBuffer = "";
let nativeCaptureTargetPath = null;
let nativeCaptureStopRequested = false;
let nativeCaptureSystemAudioPath = null;
let nativeCaptureMicrophonePath = null;
let nativeCapturePaused = false;
let nativeCursorMonitorProcess = null;
let nativeCursorMonitorOutputBuffer = "";
let windowsCaptureProcess = null;
let windowsCaptureOutputBuffer = "";
let windowsCaptureTargetPath = null;
let windowsNativeCaptureActive = false;
let windowsCaptureStopRequested = false;
let windowsCapturePaused = false;
let windowsSystemAudioPath = null;
let windowsMicAudioPath = null;
let windowsOrphanedMicAudioPath = null;
let windowsPendingVideoPath = null;
let lastNativeCaptureDiagnostics = null;
let ffmpegScreenRecordingActive = false;
let ffmpegCaptureProcess = null;
let ffmpegCaptureOutputBuffer = "";
let ffmpegCaptureTargetPath = null;
let customRecordingsDir = null;
let recordingsDirLoaded = false;
let cachedSystemCursorAssets = null;
let cachedSystemCursorAssetsSourceMtimeMs = null;
let countdownTimer = null;
let countdownCancelled = false;
let countdownInProgress = false;
let countdownRemaining = null;
let currentCursorVisualType = void 0;
let cursorCaptureInterval = null;
let cursorCaptureStartTimeMs = 0;
let cursorCaptureAccumulatedPausedMs = 0;
let cursorCapturePauseStartedAtMs = null;
let activeCursorSamples = [];
let pendingCursorSamples = [];
let isCursorCaptureActive = false;
let interactionCaptureCleanup = null;
let hasLoggedInteractionHookFailure = false;
let lastLeftClick = null;
let linuxCursorScreenPoint = null;
let selectedWindowBounds = null;
let windowBoundsCaptureInterval = null;
let cachedNativeMacWindowSources = null;
let cachedNativeMacWindowSourcesAtMs = 0;
let cachedNativeVideoEncoder = null;
let nativeHelperMigrationPromise = null;
function setSelectedSource(v) {
  selectedSource = v;
}
function setCurrentProjectPath(v) {
  currentProjectPath = v;
}
function setCurrentVideoPath(v) {
  currentVideoPath = v;
}
function setCurrentRecordingSession(v) {
  currentRecordingSession = v;
}
function setNativeScreenRecordingActive(v) {
  nativeScreenRecordingActive = v;
}
function setNativeCaptureProcess(v) {
  nativeCaptureProcess = v;
}
function setNativeCaptureOutputBuffer(v) {
  nativeCaptureOutputBuffer = v;
}
function setNativeCaptureTargetPath(v) {
  nativeCaptureTargetPath = v;
}
function setNativeCaptureStopRequested(v) {
  nativeCaptureStopRequested = v;
}
function setNativeCaptureSystemAudioPath(v) {
  nativeCaptureSystemAudioPath = v;
}
function setNativeCaptureMicrophonePath(v) {
  nativeCaptureMicrophonePath = v;
}
function setNativeCapturePaused(v) {
  nativeCapturePaused = v;
}
function setNativeCursorMonitorProcess(v) {
  nativeCursorMonitorProcess = v;
}
function setNativeCursorMonitorOutputBuffer(v) {
  nativeCursorMonitorOutputBuffer = v;
}
function setWindowsCaptureProcess(v) {
  windowsCaptureProcess = v;
}
function setWindowsCaptureOutputBuffer(v) {
  windowsCaptureOutputBuffer = v;
}
function setWindowsCaptureTargetPath(v) {
  windowsCaptureTargetPath = v;
}
function setWindowsNativeCaptureActive(v) {
  windowsNativeCaptureActive = v;
}
function setWindowsCaptureStopRequested(v) {
  windowsCaptureStopRequested = v;
}
function setWindowsCapturePaused(v) {
  windowsCapturePaused = v;
}
function setWindowsSystemAudioPath(v) {
  windowsSystemAudioPath = v;
}
function setWindowsMicAudioPath(v) {
  windowsMicAudioPath = v;
}
function setWindowsOrphanedMicAudioPath(v) {
  windowsOrphanedMicAudioPath = v;
}
function setWindowsPendingVideoPath(v) {
  windowsPendingVideoPath = v;
}
function setLastNativeCaptureDiagnostics(v) {
  lastNativeCaptureDiagnostics = v;
}
function setFfmpegScreenRecordingActive(v) {
  ffmpegScreenRecordingActive = v;
}
function setFfmpegCaptureProcess(v) {
  ffmpegCaptureProcess = v;
}
function setFfmpegCaptureOutputBuffer(v) {
  ffmpegCaptureOutputBuffer = v;
}
function setFfmpegCaptureTargetPath(v) {
  ffmpegCaptureTargetPath = v;
}
function setCustomRecordingsDir(v) {
  customRecordingsDir = v;
}
function setRecordingsDirLoaded(v) {
  recordingsDirLoaded = v;
}
function setCachedSystemCursorAssets(v) {
  cachedSystemCursorAssets = v;
}
function setCachedSystemCursorAssetsSourceMtimeMs(v) {
  cachedSystemCursorAssetsSourceMtimeMs = v;
}
function setCountdownTimer(v) {
  countdownTimer = v;
}
function setCountdownCancelled(v) {
  countdownCancelled = v;
}
function setCountdownInProgress(v) {
  countdownInProgress = v;
}
function setCountdownRemaining(v) {
  countdownRemaining = v;
}
function setCurrentCursorVisualType(v) {
  currentCursorVisualType = v;
}
function setCursorCaptureInterval(v) {
  cursorCaptureInterval = v;
}
function setCursorCaptureStartTimeMs(v) {
  cursorCaptureStartTimeMs = v;
}
function setCursorCaptureAccumulatedPausedMs(v) {
  cursorCaptureAccumulatedPausedMs = v;
}
function setCursorCapturePauseStartedAtMs(v) {
  cursorCapturePauseStartedAtMs = v;
}
function setActiveCursorSamples(v) {
  activeCursorSamples = v;
}
function setPendingCursorSamples(v) {
  pendingCursorSamples = v;
}
function setIsCursorCaptureActive(v) {
  isCursorCaptureActive = v;
}
function setInteractionCaptureCleanup(v) {
  interactionCaptureCleanup = v;
}
function setHasLoggedInteractionHookFailure(v) {
  hasLoggedInteractionHookFailure = v;
}
function setLastLeftClick(v) {
  lastLeftClick = v;
}
function setLinuxCursorScreenPoint(v) {
  linuxCursorScreenPoint = v;
}
function setSelectedWindowBounds(v) {
  selectedWindowBounds = v;
}
function setWindowBoundsCaptureInterval(v) {
  windowBoundsCaptureInterval = v;
}
function setCachedNativeMacWindowSources(v) {
  cachedNativeMacWindowSources = v;
}
function setCachedNativeMacWindowSourcesAtMs(v) {
  cachedNativeMacWindowSourcesAtMs = v;
}
function setCachedNativeVideoEncoder(v) {
  cachedNativeVideoEncoder = v;
}
function setNativeHelperMigrationPromise(v) {
  nativeHelperMigrationPromise = v;
}
const nodeRequire$3 = node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href);
function getScreen$1() {
  if (!require$$1.app.isReady()) {
    throw new Error(
      "getScreen() called before app is ready. Ensure all screen access happens after app.whenReady()."
    );
  }
  return nodeRequire$3("electron").screen;
}
function normalizePath(filePath) {
  return path$m.resolve(filePath);
}
function normalizeVideoSourcePath(videoPath) {
  if (typeof videoPath !== "string") {
    return null;
  }
  const trimmed = videoPath.trim();
  if (!trimmed) {
    return null;
  }
  if (/^file:\/\//i.test(trimmed)) {
    try {
      return node_url.fileURLToPath(trimmed);
    } catch {
    }
  }
  return trimmed;
}
function parseWindowId(sourceId) {
  if (!sourceId) return null;
  const match = sourceId.match(/^window:(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}
function getTelemetryPathForVideo(videoPath) {
  return `${videoPath}.cursor.json`;
}
function isAutoRecordingPath(filePath) {
  return path$m.basename(filePath).startsWith(AUTO_RECORDING_PREFIX);
}
async function moveFileWithOverwrite(sourcePath, destinationPath) {
  await fs$k.mkdir(path$m.dirname(destinationPath), { recursive: true });
  await fs$k.rm(destinationPath, { force: true });
  try {
    await fs$k.rename(sourcePath, destinationPath);
  } catch (error2) {
    const nodeError = error2;
    if (nodeError.code !== "EXDEV") {
      throw error2;
    }
    await fs$k.copyFile(sourcePath, destinationPath);
    await fs$k.unlink(sourcePath);
  }
}
async function loadRecordingsDirectorySetting() {
  if (recordingsDirLoaded) {
    return;
  }
  setRecordingsDirLoaded(true);
  try {
    const content = await fs$k.readFile(RECORDINGS_SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (typeof parsed.recordingsDir === "string" && parsed.recordingsDir.trim()) {
      setCustomRecordingsDir(path$m.resolve(parsed.recordingsDir));
    }
  } catch {
    setCustomRecordingsDir(null);
  }
}
async function getRecordingsDir() {
  await loadRecordingsDirectorySetting();
  const targetDir = customRecordingsDir ?? RECORDINGS_DIR;
  await fs$k.mkdir(targetDir, { recursive: true });
  return targetDir;
}
function getMacPrivacySettingsUrl(pane) {
  if (pane === "screen")
    return "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture";
  if (pane === "microphone")
    return "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone";
  return "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility";
}
function approveUserPath(filePath) {
  if (!filePath) return;
  try {
    approvedLocalReadPaths.add(path$m.resolve(filePath));
  } catch {
  }
}
const MEDIA_CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".avi": "video/x-msvideo",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};
function getMediaContentType(filePath) {
  return MEDIA_CONTENT_TYPES[path$m.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function isSupportedLocalMediaPath(filePath) {
  return path$m.extname(filePath).toLowerCase() in MEDIA_CONTENT_TYPES;
}
function getAssetRootPath() {
  if (require$$1.app.isPackaged) {
    return path$m.join(process.resourcesPath, "assets");
  }
  return path$m.join(require$$1.app.getAppPath(), "public");
}
function isPathInsideDirectory(candidatePath, directoryPath) {
  const normalizedCandidatePath = normalizePath(candidatePath);
  const normalizedDirectoryPath = normalizePath(directoryPath);
  return normalizedCandidatePath === normalizedDirectoryPath || normalizedCandidatePath.startsWith(`${normalizedDirectoryPath}${path$m.sep}`);
}
function isAllowedLocalReadPath(candidatePath) {
  const allowedPrefixes = [RECORDINGS_DIR, USER_DATA_PATH, getAssetRootPath(), require$$1.app.getPath("temp")];
  const normalizedCandidatePath = normalizePath(candidatePath);
  return fs$j.existsSync(normalizedCandidatePath) || allowedPrefixes.some((prefix) => isPathInsideDirectory(normalizedCandidatePath, prefix)) || approvedLocalReadPaths.has(normalizedCandidatePath);
}
async function isAllowedLocalMediaPath(candidatePath) {
  const normalizedCandidatePath = normalizePath(candidatePath);
  return isAllowedLocalReadPath(normalizedCandidatePath);
}
async function collectApprovedLocalReadPaths(filePath) {
  const normalizedPath = normalizeVideoSourcePath(filePath);
  if (!normalizedPath) {
    return [];
  }
  const approvedPaths = [normalizePath(normalizedPath)];
  try {
    const realPath = await fs$k.realpath(approvedPaths[0]);
    const normalizedRealPath = normalizePath(realPath);
    if (!approvedPaths.includes(normalizedRealPath)) {
      approvedPaths.push(normalizedRealPath);
    }
  } catch {
  }
  return approvedPaths;
}
async function rememberApprovedLocalReadPath(filePath) {
  const normalizedPath = normalizeVideoSourcePath(filePath);
  if (!normalizedPath) {
    return;
  }
  const approvedPaths = await collectApprovedLocalReadPaths(normalizedPath);
  for (const approvedPath of approvedPaths) {
    approvedLocalReadPaths.add(approvedPath);
  }
}
async function resolveApprovedLocalMediaPath(candidatePath) {
  const normalizedCandidatePath = normalizePath(candidatePath);
  const realPath = await fs$k.realpath(normalizedCandidatePath).catch(() => null);
  if (!realPath) {
    return null;
  }
  const stat2 = await fs$k.stat(realPath).catch(() => null);
  if (!(stat2 == null ? void 0 : stat2.isFile()) || !isSupportedLocalMediaPath(realPath)) {
    return null;
  }
  if (!await isAllowedLocalMediaPath(realPath)) {
    return null;
  }
  await rememberApprovedLocalReadPath(candidatePath);
  return realPath;
}
async function replaceApprovedSessionLocalReadPaths(filePaths) {
  const nextApprovedPaths = /* @__PURE__ */ new Set();
  const approvedPathLists = await Promise.all(
    filePaths.map((filePath) => collectApprovedLocalReadPaths(filePath))
  );
  for (const approvedPathList of approvedPathLists) {
    for (const approvedPath of approvedPathList) {
      nextApprovedPaths.add(approvedPath);
    }
  }
  approvedLocalReadPaths.clear();
  for (const approvedPath of nextApprovedPaths) {
    approvedLocalReadPaths.add(approvedPath);
  }
}
async function resolveProjectMediaSources(project) {
  var _a2, _b2, _c, _d;
  if (!project || typeof project !== "object") {
    return { success: false, message: "Invalid project file format" };
  }
  const rawVideoPath = project.videoPath;
  if (typeof rawVideoPath !== "string") {
    return { success: false, message: "Project file is missing a video path" };
  }
  const normalizedVideoPath = normalizeVideoSourcePath(rawVideoPath);
  if (!normalizedVideoPath) {
    return { success: false, message: "Project file is missing a valid video path" };
  }
  try {
    await fs$k.access(normalizedVideoPath, fs$j.constants.F_OK);
  } catch {
    return {
      success: false,
      message: `Project video file not found: ${normalizedVideoPath}`
    };
  }
  const rawWebcamPath = typeof ((_b2 = (_a2 = project.editor) == null ? void 0 : _a2.webcam) == null ? void 0 : _b2.sourcePath) === "string" ? ((_d = (_c = project.editor) == null ? void 0 : _c.webcam) == null ? void 0 : _d.sourcePath) ?? null : null;
  const normalizedWebcamPath = normalizeVideoSourcePath(rawWebcamPath);
  if (!normalizedWebcamPath) {
    return {
      success: true,
      videoPath: normalizedVideoPath,
      webcamPath: null
    };
  }
  try {
    await fs$k.access(normalizedWebcamPath, fs$j.constants.F_OK);
    return {
      success: true,
      videoPath: normalizedVideoPath,
      webcamPath: normalizedWebcamPath
    };
  } catch {
    return {
      success: true,
      videoPath: normalizedVideoPath,
      webcamPath: null
    };
  }
}
async function getProjectsDir() {
  const projectsDir = path$m.join(await getRecordingsDir(), PROJECTS_DIRECTORY_NAME);
  await fs$k.mkdir(projectsDir, { recursive: true });
  return projectsDir;
}
async function persistRecordingsDirectorySetting(nextDir) {
  setCustomRecordingsDir(path$m.resolve(nextDir));
  setRecordingsDirLoaded(true);
  await fs$k.writeFile(
    RECORDINGS_SETTINGS_FILE,
    JSON.stringify({ recordingsDir: path$m.resolve(nextDir) }, null, 2),
    "utf-8"
  );
}
function hasProjectFileExtension(filePath) {
  const extension = path$m.extname(filePath).replace(/^\./, "").toLowerCase();
  return [PROJECT_FILE_EXTENSION, ...LEGACY_PROJECT_FILE_EXTENSIONS].includes(extension);
}
function getProjectThumbnailPath(projectPath) {
  return `${projectPath}${PROJECT_THUMBNAIL_SUFFIX}`;
}
async function saveProjectThumbnail(projectPath, thumbnailDataUrl) {
  const thumbnailPath = getProjectThumbnailPath(projectPath);
  if (thumbnailDataUrl === void 0) {
    return fs$j.existsSync(thumbnailPath) ? thumbnailPath : null;
  }
  if (!thumbnailDataUrl) {
    await fs$k.rm(thumbnailPath, { force: true }).catch(() => void 0);
    return null;
  }
  const match = thumbnailDataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!match) {
    throw new Error("Project thumbnail must be a PNG data URL.");
  }
  await fs$k.writeFile(thumbnailPath, Buffer.from(match[1], "base64"));
  return thumbnailPath;
}
async function loadRecentProjectPaths() {
  try {
    const content = await fs$k.readFile(RECENT_PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.paths) ? parsed.paths.filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ) : [];
  } catch {
    return [];
  }
}
async function saveRecentProjectPaths(paths) {
  const normalizedPaths = Array.from(new Set(paths.map((value) => normalizePath(value)))).slice(
    0,
    MAX_RECENT_PROJECTS
  );
  await fs$k.writeFile(
    RECENT_PROJECTS_FILE,
    JSON.stringify({ paths: normalizedPaths }, null, 2),
    "utf-8"
  );
}
async function rememberRecentProject(projectPath) {
  if (!hasProjectFileExtension(projectPath)) {
    return;
  }
  const existingPaths = await loadRecentProjectPaths();
  await saveRecentProjectPaths([projectPath, ...existingPaths]);
}
async function buildProjectLibraryEntry(projectPath, projectsDir) {
  try {
    const normalizedPath = normalizePath(projectPath);
    if (!hasProjectFileExtension(normalizedPath)) {
      return null;
    }
    const stats = await fs$k.stat(normalizedPath);
    if (!stats.isFile()) {
      return null;
    }
    const thumbnailPath = getProjectThumbnailPath(normalizedPath);
    const thumbnailExists = await fs$k.access(thumbnailPath, fs$j.constants.R_OK).then(() => true).catch(() => false);
    return {
      path: normalizedPath,
      name: path$m.basename(normalizedPath).replace(
        new RegExp(`\\.(${[PROJECT_FILE_EXTENSION, ...LEGACY_PROJECT_FILE_EXTENSIONS].join("|")})$`, "i"),
        ""
      ),
      updatedAt: stats.mtimeMs,
      thumbnailPath: thumbnailExists ? thumbnailPath : null,
      isCurrent: Boolean(
        currentProjectPath && normalizePath(currentProjectPath) === normalizedPath
      ),
      isInProjectsDirectory: path$m.dirname(normalizedPath) === normalizePath(projectsDir)
    };
  } catch {
    return null;
  }
}
async function listProjectLibraryEntries() {
  const projectsDir = await getProjectsDir();
  const projectPaths = [];
  try {
    const entries2 = await fs$k.readdir(projectsDir, { withFileTypes: true });
    for (const entry of entries2) {
      if (!entry.isFile()) {
        continue;
      }
      const entryPath = path$m.join(projectsDir, entry.name);
      if (hasProjectFileExtension(entryPath)) {
        projectPaths.push(entryPath);
      }
    }
  } catch {
  }
  const recentProjectPaths = await loadRecentProjectPaths();
  const candidatePaths = Array.from(/* @__PURE__ */ new Set([...projectPaths, ...recentProjectPaths]));
  const entries = (await Promise.all(
    candidatePaths.map(
      (candidatePath) => buildProjectLibraryEntry(candidatePath, projectsDir)
    )
  )).filter((entry) => entry != null).sort((left, right) => right.updatedAt - left.updatedAt);
  await saveRecentProjectPaths(entries.map((entry) => entry.path));
  return {
    projectsDir,
    entries
  };
}
async function loadProjectFromPath(projectPath) {
  const normalizedPath = normalizePath(projectPath);
  let project;
  try {
    const content = await fs$k.readFile(normalizedPath, "utf-8");
    project = JSON.parse(content);
  } catch (error2) {
    return {
      success: false,
      canceled: false,
      message: `Failed to read project file: ${error2 instanceof Error ? error2.message : String(error2)}`
    };
  }
  const mediaSources = await resolveProjectMediaSources(project);
  if (!mediaSources.success) {
    return {
      success: false,
      canceled: false,
      message: mediaSources.message
    };
  }
  const projectObj = project;
  const editorObj = projectObj == null ? void 0 : projectObj.editor;
  const audioTracks = editorObj == null ? void 0 : editorObj.audioTracks;
  const approvedProjectPaths = [
    mediaSources.videoPath,
    mediaSources.webcamPath
  ];
  if (Array.isArray(audioTracks)) {
    for (const track of audioTracks) {
      if (typeof (track == null ? void 0 : track.sourcePath) === "string") {
        approvedProjectPaths.push(track.sourcePath);
      }
    }
  }
  await replaceApprovedSessionLocalReadPaths(approvedProjectPaths);
  await rememberRecentProject(normalizedPath);
  setCurrentProjectPath(normalizedPath);
  setCurrentVideoPath(mediaSources.videoPath);
  setCurrentRecordingSession({
    videoPath: mediaSources.videoPath,
    webcamPath: mediaSources.webcamPath,
    timeOffsetMs: 0
  });
  return {
    success: true,
    path: normalizedPath,
    project
  };
}
function isTrustedProjectPath(filePath) {
  if (!filePath || !currentProjectPath) return false;
  return normalizePath(filePath) === normalizePath(currentProjectPath);
}
function registerAssetHandlers() {
  const THUMB_SIZE = 96;
  const thumbCacheDir = path$m.join(USER_DATA_PATH, "wallpaper-thumbs");
  let thumbGenerationQueue = Promise.resolve();
  require$$1.ipcMain.handle("generate-wallpaper-thumbnail", async (_, filePath) => {
    try {
      const resolved = normalizePath(filePath);
      const realResolved = await fs$k.realpath(resolved).catch(() => resolved);
      if (!isAllowedLocalReadPath(resolved) && !isAllowedLocalReadPath(realResolved)) {
        return { success: false, error: "Access denied" };
      }
      const stat2 = await fs$k.stat(resolved);
      const cacheKey = Buffer.from(`${resolved}:${stat2.mtimeMs}`).toString("base64url");
      const thumbPath = path$m.join(thumbCacheDir, `${cacheKey}.jpg`);
      if (fs$j.existsSync(thumbPath)) {
        const data = await fs$k.readFile(thumbPath);
        return { success: true, data };
      }
      let jpegData;
      const generation = thumbGenerationQueue.then(async () => {
        const { nativeImage } = await import("electron");
        const img = nativeImage.createFromPath(resolved);
        if (img.isEmpty()) {
          throw new Error("Failed to load image");
        }
        const { width, height } = img.getSize();
        const scale = THUMB_SIZE / Math.min(width, height);
        const resized = img.resize({
          width: Math.round(width * scale),
          height: Math.round(height * scale),
          quality: "good"
        });
        jpegData = resized.toJPEG(70);
        await fs$k.mkdir(thumbCacheDir, { recursive: true });
        await fs$k.writeFile(thumbPath, jpegData);
      });
      thumbGenerationQueue = generation.catch(() => {
      });
      await generation;
      return { success: true, data: jpegData };
    } catch (error2) {
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-asset-base-path", () => {
    try {
      const assetPath = getAssetRootPath();
      return node_url.pathToFileURL(`${assetPath}${path$m.sep}`).toString();
    } catch (err) {
      console.error("Failed to resolve asset base path:", err);
      return null;
    }
  });
  require$$1.ipcMain.handle("list-asset-directory", async (_, relativeDir) => {
    try {
      const normalizedRelativeDir = String(relativeDir ?? "").replace(/\\/g, "/").replace(/^\/+/, "");
      const assetRootPath = path$m.resolve(getAssetRootPath());
      const targetDirPath = path$m.resolve(assetRootPath, normalizedRelativeDir);
      if (targetDirPath !== assetRootPath && !targetDirPath.startsWith(`${assetRootPath}${path$m.sep}`)) {
        return { success: false, error: "Invalid asset directory" };
      }
      const entries = await fs$k.readdir(targetDirPath, { withFileTypes: true });
      const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort(new Intl.Collator(void 0, { numeric: true, sensitivity: "base" }).compare);
      return { success: true, files };
    } catch (error2) {
      console.error("Failed to list asset directory:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("read-local-file", async (_, filePath) => {
    try {
      const resolved = normalizePath(filePath);
      const realResolved = await fs$k.realpath(resolved).catch(() => resolved);
      if (!isAllowedLocalReadPath(resolved) && !isAllowedLocalReadPath(realResolved)) {
        console.warn(`[read-local-file] Blocked read outside allowed directories: ${resolved}`);
        return { success: false, error: "Access denied: path outside allowed directories" };
      }
      const data = await fs$k.readFile(resolved);
      return { success: true, data };
    } catch (error2) {
      console.error("Failed to read local file:", error2);
      return { success: false, error: String(error2) };
    }
  });
}
function sendWhisperModelDownloadProgress(webContents, payload) {
  webContents.send("whisper-small-model-download-progress", payload);
}
async function getWhisperSmallModelStatus() {
  try {
    await fs$k.access(WHISPER_SMALL_MODEL_PATH, fs$j.constants.R_OK);
    return {
      success: true,
      exists: true,
      path: WHISPER_SMALL_MODEL_PATH
    };
  } catch {
    return {
      success: true,
      exists: false,
      path: null
    };
  }
}
function downloadFileWithProgress(url, destinationPath, onProgress) {
  const request = (currentUrl, redirectCount = 0) => {
    return new Promise((resolve, reject) => {
      const req = node_https.get(currentUrl, { timeout: 3e4 }, (response) => {
        const statusCode = response.statusCode ?? 0;
        const location = response.headers.location;
        if (statusCode >= 300 && statusCode < 400 && location) {
          response.resume();
          if (redirectCount >= 5) {
            reject(new Error("Too many redirects while downloading Whisper model."));
            return;
          }
          const nextUrl = new URL(location, currentUrl).toString();
          void request(nextUrl, redirectCount + 1).then(resolve).catch(reject);
          return;
        }
        if (statusCode < 200 || statusCode >= 300) {
          response.resume();
          reject(new Error(`Whisper model download failed with status ${statusCode}.`));
          return;
        }
        const totalBytes = Number.parseInt(
          String(response.headers["content-length"] ?? "0"),
          10
        );
        let downloadedBytes = 0;
        const fileStream = fs$j.createWriteStream(destinationPath);
        response.on("data", (chunk) => {
          downloadedBytes += chunk.length;
          if (Number.isFinite(totalBytes) && totalBytes > 0) {
            onProgress(Math.min(100, Math.round(downloadedBytes / totalBytes * 100)));
          }
        });
        response.on("error", (error2) => {
          fileStream.destroy(error2);
        });
        fileStream.on("error", (error2) => {
          response.destroy(error2);
          reject(error2);
        });
        fileStream.on("finish", () => {
          onProgress(100);
          resolve();
        });
        response.pipe(fileStream);
      });
      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy(new Error("Whisper model download timed out."));
      });
    });
  };
  return request(url);
}
async function downloadWhisperSmallModel(webContents) {
  await fs$k.mkdir(WHISPER_MODEL_DIR, { recursive: true });
  const tempPath = `${WHISPER_SMALL_MODEL_PATH}.download`;
  sendWhisperModelDownloadProgress(webContents, {
    status: "downloading",
    progress: 0,
    path: null
  });
  try {
    await fs$k.rm(tempPath, { force: true });
    await downloadFileWithProgress(WHISPER_MODEL_DOWNLOAD_URL, tempPath, (progress) => {
      sendWhisperModelDownloadProgress(webContents, {
        status: "downloading",
        progress,
        path: null
      });
    });
    await fs$k.rename(tempPath, WHISPER_SMALL_MODEL_PATH);
    sendWhisperModelDownloadProgress(webContents, {
      status: "downloaded",
      progress: 100,
      path: WHISPER_SMALL_MODEL_PATH
    });
    return WHISPER_SMALL_MODEL_PATH;
  } catch (error2) {
    await fs$k.rm(tempPath, { force: true }).catch(() => void 0);
    sendWhisperModelDownloadProgress(webContents, {
      status: "error",
      progress: 0,
      path: null,
      error: String(error2)
    });
    throw error2;
  }
}
async function deleteWhisperSmallModel() {
  await fs$k.rm(WHISPER_SMALL_MODEL_PATH, { force: true });
}
const nodeRequire$2 = node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href);
function loadFfmpegStatic() {
  try {
    const moduleExports = nodeRequire$2("ffmpeg-static");
    if (typeof moduleExports === "string") {
      return moduleExports;
    }
    if (typeof (moduleExports == null ? void 0 : moduleExports.default) === "string") {
      return moduleExports.default;
    }
  } catch {
  }
  return null;
}
function resolveSystemFfmpegBinaryPath() {
  const locator = process.platform === "win32" ? "where" : "which";
  const result = node_child_process.spawnSync(locator, ["ffmpeg"], {
    encoding: "utf-8",
    windowsHide: true
  });
  if (result.status === 0) {
    const candidate = result.stdout.split(/\r?\n/).map((line) => line.trim()).find((line) => line.length > 0);
    if (candidate) {
      return candidate;
    }
  }
  if (process.platform !== "win32") {
    const commonPaths = [
      "/opt/homebrew/bin/ffmpeg",
      "/usr/local/bin/ffmpeg",
      "/usr/bin/ffmpeg"
    ];
    for (const p of commonPaths) {
      if (fs$j.existsSync(p)) {
        return p;
      }
    }
  }
  return null;
}
function getFfmpegBinaryPath() {
  const ffmpegStatic = loadFfmpegStatic();
  if (ffmpegStatic && typeof ffmpegStatic === "string") {
    const bundledPath = require$$1.app.isPackaged ? ffmpegStatic.replace(/\.asar([/\\])/, ".asar.unpacked$1") : ffmpegStatic;
    if (fs$j.existsSync(bundledPath)) {
      return bundledPath;
    }
  }
  const systemFfmpeg = resolveSystemFfmpegBinaryPath();
  if (systemFfmpeg) {
    return systemFfmpeg;
  }
  throw new Error(
    "FFmpeg binary is unavailable. Install ffmpeg-static for this platform or make ffmpeg available on PATH."
  );
}
const execFileAsync$8 = node_util.promisify(node_child_process.execFile);
function resolveUnpackedAppPath(...segments) {
  const base = require$$1.app.getAppPath();
  const resolved = path$m.join(base, ...segments);
  if (require$$1.app.isPackaged) {
    return resolved.replace(/\.asar([/\\])/, ".asar.unpacked$1");
  }
  return resolved;
}
function getNativeCaptureHelperSourcePath() {
  return resolveUnpackedAppPath("electron", "native", "ScreenCaptureKitRecorder.swift");
}
function getNativeArchTag() {
  if (process.platform === "darwin") {
    return process.arch === "arm64" ? "darwin-arm64" : "darwin-x64";
  }
  if (process.platform === "win32") {
    return process.arch === "arm64" ? "win32-arm64" : "win32-x64";
  }
  if (process.platform === "linux") {
    return process.arch === "arm64" ? "linux-arm64" : "linux-x64";
  }
  return `${process.platform}-${process.arch}`;
}
function getPrebundledNativeHelperPath(binaryName) {
  return resolveUnpackedAppPath("electron", "native", "bin", getNativeArchTag(), binaryName);
}
function resolvePreferredWindowsNativeHelperPath(helperDirectory, binaryName) {
  const buildOutputPath = resolveUnpackedAppPath(
    "electron",
    "native",
    helperDirectory,
    "build",
    "Release",
    binaryName
  );
  const prebundledPath = getPrebundledNativeHelperPath(binaryName);
  if (fs$j.existsSync(buildOutputPath)) {
    return buildOutputPath;
  }
  if (fs$j.existsSync(prebundledPath)) {
    return prebundledPath;
  }
  return buildOutputPath;
}
function getBundledWhisperExecutableCandidates() {
  const binaryNames = process.platform === "win32" ? ["whisper-cli.exe", "whisper-cpp.exe", "whisper.exe", "main.exe"] : ["whisper-cli", "whisper-cpp", "whisper", "main"];
  return binaryNames.map((binaryName) => getPrebundledNativeHelperPath(binaryName));
}
function getNativeCaptureHelperBinaryPath() {
  return path$m.join(require$$1.app.getPath("userData"), "native-tools", "recordly-screencapturekit-helper");
}
function getSystemCursorHelperSourcePath() {
  return resolveUnpackedAppPath("electron", "native", "SystemCursorAssets.swift");
}
function getSystemCursorHelperBinaryPath() {
  return path$m.join(require$$1.app.getPath("userData"), "native-tools", "recordly-system-cursors");
}
function getNativeCursorMonitorSourcePath() {
  return resolveUnpackedAppPath("electron", "native", "NativeCursorMonitor.swift");
}
function getNativeCursorMonitorBinaryPath() {
  return path$m.join(require$$1.app.getPath("userData"), "native-tools", "recordly-native-cursor-monitor");
}
function getNativeWindowListSourcePath() {
  return resolveUnpackedAppPath("electron", "native", "ScreenCaptureKitWindowList.swift");
}
function getNativeWindowListBinaryPath() {
  return path$m.join(require$$1.app.getPath("userData"), "native-tools", "recordly-window-list");
}
function getWindowsCaptureExePath() {
  return resolvePreferredWindowsNativeHelperPath("wgc-capture", "wgc-capture.exe");
}
function getCursorMonitorExePath() {
  return resolvePreferredWindowsNativeHelperPath("cursor-monitor", "cursor-monitor.exe");
}
async function migrateLegacyNativeHelperBinaries() {
  const legacyToCurrentPaths = [
    [
      path$m.join(require$$1.app.getPath("userData"), "native-tools", "openscreen-screencapturekit-helper"),
      getNativeCaptureHelperBinaryPath()
    ],
    [
      path$m.join(require$$1.app.getPath("userData"), "native-tools", "openscreen-window-list"),
      getNativeWindowListBinaryPath()
    ],
    [
      path$m.join(require$$1.app.getPath("userData"), "native-tools", "openscreen-system-cursors"),
      getSystemCursorHelperBinaryPath()
    ],
    [
      path$m.join(require$$1.app.getPath("userData"), "native-tools", "openscreen-native-cursor-monitor"),
      getNativeCursorMonitorBinaryPath()
    ]
  ];
  for (const [legacyPath, currentPath] of legacyToCurrentPaths) {
    if (legacyPath === currentPath || fs$j.existsSync(currentPath) || !fs$j.existsSync(legacyPath)) {
      continue;
    }
    try {
      await fs$k.mkdir(path$m.dirname(currentPath), { recursive: true });
      await fs$k.rename(legacyPath, currentPath);
    } catch (error2) {
      console.warn("[native-tools] Failed to migrate helper binary", {
        legacyPath,
        currentPath,
        error: error2
      });
    }
  }
}
async function ensureNativeHelperMigration() {
  if (!nativeHelperMigrationPromise) {
    setNativeHelperMigrationPromise(
      migrateLegacyNativeHelperBinaries().catch((error2) => {
        setNativeHelperMigrationPromise(null);
        throw error2;
      })
    );
  }
  return nativeHelperMigrationPromise;
}
async function ensureSwiftHelperBinary(sourcePath, binaryPath, label, prebundledBinaryName) {
  if (prebundledBinaryName) {
    const prebundledPath = getPrebundledNativeHelperPath(prebundledBinaryName);
    try {
      await fs$k.access(prebundledPath, fs$j.constants.X_OK);
      return prebundledPath;
    } catch {
      if (require$$1.app.isPackaged) {
        throw new Error(
          `${label} is missing from this app build (${prebundledPath}). Reinstall or update the app.`
        );
      }
    }
  }
  const helperDir = path$m.dirname(binaryPath);
  await fs$k.mkdir(helperDir, { recursive: true });
  let shouldCompile = false;
  try {
    const [sourceStat, binaryStat] = await Promise.all([
      fs$k.stat(sourcePath),
      fs$k.stat(binaryPath).catch(() => null)
    ]);
    shouldCompile = !binaryStat || sourceStat.mtimeMs > binaryStat.mtimeMs;
  } catch (error2) {
    throw new Error(`${label} source is unavailable: ${String(error2)}`);
  }
  if (!shouldCompile) {
    return binaryPath;
  }
  try {
    await execFileAsync$8("swiftc", ["-O", sourcePath, "-o", binaryPath], {
      encoding: "utf8",
      timeout: 12e4
    });
  } catch (error2) {
    const err = error2;
    const details = [err.stderr, err.stdout].filter(Boolean).join("\n").trim();
    throw new Error(details || `Failed to compile ${label}`);
  }
  return binaryPath;
}
async function ensureNativeCaptureHelperBinary() {
  await ensureNativeHelperMigration();
  return ensureSwiftHelperBinary(
    getNativeCaptureHelperSourcePath(),
    getNativeCaptureHelperBinaryPath(),
    "native ScreenCaptureKit helper",
    "recordly-screencapturekit-helper"
  );
}
async function ensureNativeWindowListBinary() {
  await ensureNativeHelperMigration();
  return ensureSwiftHelperBinary(
    getNativeWindowListSourcePath(),
    getNativeWindowListBinaryPath(),
    "native ScreenCaptureKit window list helper",
    "recordly-window-list"
  );
}
async function ensureNativeCursorMonitorBinary() {
  await ensureNativeHelperMigration();
  return ensureSwiftHelperBinary(
    getNativeCursorMonitorSourcePath(),
    getNativeCursorMonitorBinaryPath(),
    "native cursor monitor helper",
    "recordly-native-cursor-monitor"
  );
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function buildCaptionTextFromWords(words) {
  return words.map((word, index) => `${index > 0 && word.leadingSpace ? " " : ""}${word.text}`).join("").trim();
}
function parseWhisperJsonWords(tokens) {
  var _a2, _b2;
  if (!Array.isArray(tokens)) {
    return [];
  }
  const words = [];
  let nextLeadingSpace = false;
  for (const token of tokens) {
    if (!token || typeof token !== "object") {
      continue;
    }
    const tokenData = token;
    const tokenText = typeof tokenData.text === "string" ? tokenData.text : "";
    if (!tokenText) {
      continue;
    }
    const tokenStartMs = isFiniteNumber((_a2 = tokenData.offsets) == null ? void 0 : _a2.from) ? Math.round(tokenData.offsets.from) : null;
    const tokenEndMs = isFiniteNumber((_b2 = tokenData.offsets) == null ? void 0 : _b2.to) ? Math.round(tokenData.offsets.to) : null;
    const parts = tokenText.match(/\s+|[^\s]+/g) ?? [];
    for (const part of parts) {
      if (/^\s+$/.test(part)) {
        nextLeadingSpace = words.length > 0;
        continue;
      }
      if (tokenStartMs == null || tokenEndMs == null || tokenEndMs <= tokenStartMs) {
        return [];
      }
      const previousWord = words.length > 0 ? words[words.length - 1] : null;
      if (!previousWord || nextLeadingSpace) {
        words.push({
          text: part,
          startMs: tokenStartMs,
          endMs: tokenEndMs,
          ...words.length > 0 && nextLeadingSpace ? { leadingSpace: true } : {}
        });
      } else {
        previousWord.text += part;
        previousWord.endMs = Math.max(previousWord.endMs, tokenEndMs);
      }
      nextLeadingSpace = false;
    }
  }
  return words.filter((word) => word.text.trim().length > 0);
}
function parseWhisperJsonCues(content) {
  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.transcription)) {
      return [];
    }
    return parsed.transcription.map((segment, index) => {
      var _a2, _b2;
      if (!segment || typeof segment !== "object") {
        return null;
      }
      const segmentData = segment;
      const startMs = isFiniteNumber((_a2 = segmentData.offsets) == null ? void 0 : _a2.from) ? Math.round(segmentData.offsets.from) : null;
      const endMs = isFiniteNumber((_b2 = segmentData.offsets) == null ? void 0 : _b2.to) ? Math.round(segmentData.offsets.to) : null;
      const segmentText = typeof segmentData.text === "string" ? segmentData.text.trim() : "";
      if (startMs == null || endMs == null || endMs <= startMs) {
        return null;
      }
      const words = parseWhisperJsonWords(segmentData.tokens);
      const text = words.length > 0 ? buildCaptionTextFromWords(words) : segmentText;
      if (!text) {
        return null;
      }
      return {
        id: `caption-${index + 1}`,
        startMs,
        endMs,
        text,
        ...words.length > 0 ? { words } : {}
      };
    }).filter((cue) => cue != null);
  } catch (error2) {
    console.warn("[auto-captions] Failed to parse Whisper JSON output:", error2);
    return [];
  }
}
function parseSrtTimestamp(value) {
  const match = value.trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) {
    return null;
  }
  const [, hours, minutes, seconds, milliseconds] = match;
  return Number(hours) * 60 * 60 * 1e3 + Number(minutes) * 60 * 1e3 + Number(seconds) * 1e3 + Number(milliseconds);
}
function parseSrtCues(content) {
  return content.split(/\r?\n\r?\n/).map((block, index) => {
    const lines = block.split(/\r?\n/).map((line) => line.trim());
    const timingLine = lines.find((line) => line.includes("-->"));
    if (!timingLine) {
      return null;
    }
    const [rawStart, rawEnd] = timingLine.split("-->").map((part) => part.trim());
    const startMs = parseSrtTimestamp(rawStart);
    const endMs = parseSrtTimestamp(rawEnd);
    if (startMs == null || endMs == null || endMs <= startMs) {
      return null;
    }
    const text = lines.slice(lines.indexOf(timingLine) + 1).filter((line) => line.length > 0).join("\n").trim();
    if (!text) {
      return null;
    }
    return {
      id: `caption-${index + 1}`,
      startMs,
      endMs,
      text
    };
  }).filter((cue) => cue != null);
}
function shouldRetryWhisperWithoutJson(error2) {
  const message = error2 instanceof Error ? error2.message : String(error2);
  return /unknown argument|output-json-full|output-json|ojf|\boj\b/i.test(message);
}
function normalizeRecordingTimeOffsetMs$1(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
}
function getRecordingSessionManifestPath(videoPath) {
  const extension = path$m.extname(videoPath);
  const baseName = path$m.basename(videoPath, extension);
  return path$m.join(path$m.dirname(videoPath), `${baseName}${RECORDING_SESSION_MANIFEST_SUFFIX}`);
}
async function persistRecordingSessionManifest(session) {
  const normalizedVideoPath = normalizeVideoSourcePath(session.videoPath);
  if (!normalizedVideoPath) {
    return;
  }
  const normalizedWebcamPath = normalizeVideoSourcePath(session.webcamPath ?? null);
  const manifestPath = getRecordingSessionManifestPath(normalizedVideoPath);
  if (!normalizedWebcamPath) {
    await fs$k.rm(manifestPath, { force: true });
    return;
  }
  const manifest = {
    version: 2,
    videoFileName: path$m.basename(normalizedVideoPath),
    webcamFileName: path$m.basename(normalizedWebcamPath),
    timeOffsetMs: normalizeRecordingTimeOffsetMs$1(session.timeOffsetMs)
  };
  await fs$k.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}
async function resolveRecordingSessionManifest(videoPath) {
  const normalizedVideoPath = normalizeVideoSourcePath(videoPath);
  if (!normalizedVideoPath) {
    return null;
  }
  const manifestPath = getRecordingSessionManifestPath(normalizedVideoPath);
  try {
    const content = await fs$k.readFile(manifestPath, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed.version !== 1 && parsed.version !== 2) {
      return null;
    }
    const webcamFileName = typeof parsed.webcamFileName === "string" && parsed.webcamFileName.trim() ? parsed.webcamFileName.trim() : null;
    if (!webcamFileName) {
      return {
        videoPath: normalizedVideoPath,
        webcamPath: null,
        timeOffsetMs: normalizeRecordingTimeOffsetMs$1(parsed.timeOffsetMs)
      };
    }
    const webcamPath = path$m.join(path$m.dirname(normalizedVideoPath), webcamFileName);
    const webcamExists = await fs$k.access(webcamPath, fs$j.constants.F_OK).then(() => true).catch(() => false);
    return {
      videoPath: normalizedVideoPath,
      webcamPath: webcamExists ? webcamPath : null,
      timeOffsetMs: normalizeRecordingTimeOffsetMs$1(parsed.timeOffsetMs)
    };
  } catch {
    return null;
  }
}
async function resolveLinkedWebcamPath(videoPath) {
  const normalizedVideoPath = normalizeVideoSourcePath(videoPath);
  if (!normalizedVideoPath) {
    return null;
  }
  const extension = path$m.extname(normalizedVideoPath);
  const baseName = path$m.basename(normalizedVideoPath, extension);
  if (!baseName || baseName.endsWith("-webcam")) {
    return null;
  }
  const candidateExtensions = Array.from(
    new Set([extension, ".webm", ".mp4", ".mov", ".mkv", ".avi"].filter(Boolean))
  );
  for (const candidateExtension of candidateExtensions) {
    const candidatePath = path$m.join(
      path$m.dirname(normalizedVideoPath),
      `${baseName}-webcam${candidateExtension}`
    );
    try {
      await fs$k.access(candidatePath, fs$j.constants.F_OK);
      return candidatePath;
    } catch {
      continue;
    }
  }
  return null;
}
async function resolveRecordingSession(videoPath) {
  const manifestSession = await resolveRecordingSessionManifest(videoPath);
  if (manifestSession) {
    return manifestSession;
  }
  const normalizedVideoPath = normalizeVideoSourcePath(videoPath);
  if (!normalizedVideoPath) {
    return null;
  }
  const linkedWebcamPath = await resolveLinkedWebcamPath(normalizedVideoPath);
  return {
    videoPath: normalizedVideoPath,
    webcamPath: linkedWebcamPath
  };
}
const execFileAsync$7 = node_util.promisify(node_child_process.execFile);
async function ensureReadableFile(filePath, options) {
  await fs$k.access(filePath, fs$j.constants.R_OK);
  if (options == null ? void 0 : options.executable) {
    try {
      await fs$k.access(filePath, fs$j.constants.X_OK);
    } catch {
      throw new Error("The selected Whisper executable is not marked as executable.");
    }
  }
}
async function isExecutableFile(filePath) {
  try {
    await fs$k.access(filePath, fs$j.constants.R_OK | fs$j.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
async function resolveWhisperExecutablePath(preferredPath) {
  var _a2;
  const candidatePaths = [
    (preferredPath == null ? void 0 : preferredPath.trim()) || null,
    ...getBundledWhisperExecutableCandidates(),
    ((_a2 = process.env["WHISPER_CPP_PATH"]) == null ? void 0 : _a2.trim()) || null,
    process.platform === "darwin" ? "/opt/homebrew/bin/whisper-cli" : null,
    process.platform === "darwin" ? "/usr/local/bin/whisper-cli" : null,
    process.platform === "darwin" ? "/opt/homebrew/bin/whisper-cpp" : null,
    process.platform === "darwin" ? "/usr/local/bin/whisper-cpp" : null
  ].filter((value) => Boolean(value));
  for (const candidate of candidatePaths) {
    const normalized = path$m.resolve(candidate);
    if (await isExecutableFile(normalized)) {
      return normalized;
    }
  }
  const pathCommand = process.platform === "win32" ? "where" : "which";
  const binaryNames = process.platform === "win32" ? ["whisper-cli.exe", "whisper.exe", "main.exe"] : ["whisper-cli", "whisper-cpp", "whisper", "main"];
  for (const binaryName of binaryNames) {
    const result = node_child_process.spawnSync(pathCommand, [binaryName], { encoding: "utf-8" });
    if (result.status === 0) {
      const resolvedPath = result.stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
      if (resolvedPath && await isExecutableFile(resolvedPath)) {
        return resolvedPath;
      }
    }
  }
  throw new Error(
    "No Whisper runtime was found. Recordly looked for a bundled binary first, then checked common system install locations."
  );
}
async function resolveCaptionAudioCandidates(videoPath) {
  const candidates = [];
  const seenPaths = /* @__PURE__ */ new Set();
  const pushCandidate = (candidatePath, label) => {
    const normalizedCandidatePath = normalizeVideoSourcePath(candidatePath);
    if (!normalizedCandidatePath || seenPaths.has(normalizedCandidatePath)) {
      return;
    }
    seenPaths.add(normalizedCandidatePath);
    candidates.push({ path: normalizedCandidatePath, label });
  };
  pushCandidate(videoPath, "recording");
  const requestedRecordingSession = await resolveRecordingSession(videoPath);
  pushCandidate(requestedRecordingSession == null ? void 0 : requestedRecordingSession.webcamPath, "linked webcam recording");
  return candidates;
}
async function extractCaptionAudioSource(options) {
  const candidates = await resolveCaptionAudioCandidates(options.videoPath);
  const attemptedCandidates = [];
  for (const candidate of candidates) {
    try {
      await ensureReadableFile(candidate.path);
      await execFileAsync$7(
        options.ffmpegPath,
        [
          "-y",
          "-i",
          candidate.path,
          "-map",
          "0:a:0",
          "-vn",
          "-ac",
          "1",
          "-ar",
          "16000",
          "-c:a",
          "pcm_s16le",
          options.wavPath
        ],
        { timeout: 5 * 60 * 1e3, maxBuffer: 20 * 1024 * 1024 }
      );
      attemptedCandidates.push({ ...candidate, readable: true, extractedAudio: true });
      return candidate;
    } catch (error2) {
      attemptedCandidates.push({
        ...candidate,
        readable: true,
        extractedAudio: false,
        error: error2 instanceof Error ? error2.message : String(error2)
      });
    }
  }
  console.warn(
    "[auto-captions] No audio source candidate could be extracted:",
    attemptedCandidates
  );
  throw new Error(
    "No audio was found to transcribe in the saved recording file. Captions need an audio track. If this recording should have contained sound, the recording was saved without an audio stream."
  );
}
async function generateAutoCaptionsFromVideo(options) {
  const ffmpegPath = getFfmpegBinaryPath();
  const normalizedVideoPath = normalizeVideoSourcePath(options.videoPath);
  if (!normalizedVideoPath) {
    throw new Error("Missing source video path.");
  }
  const whisperExecutablePath = await resolveWhisperExecutablePath(options.whisperExecutablePath);
  const whisperModelPath = path$m.resolve(options.whisperModelPath);
  await ensureReadableFile(whisperExecutablePath, { executable: true });
  await ensureReadableFile(whisperModelPath);
  const tempBase = path$m.join(
    require$$1.app.getPath("temp"),
    `recordly-captions-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const wavPath = `${tempBase}.wav`;
  const outputBase = `${tempBase}-whisper`;
  const srtPath = `${outputBase}.srt`;
  const jsonPath = `${outputBase}.json`;
  try {
    const audioSource = await extractCaptionAudioSource({
      videoPath: normalizedVideoPath,
      ffmpegPath,
      wavPath
    });
    const language = options.language && options.language.trim() ? options.language.trim() : "auto";
    const whisperBaseArgs = [
      "-m",
      whisperModelPath,
      "-f",
      wavPath,
      "-osrt",
      "-of",
      outputBase,
      "-l",
      language,
      "-np"
    ];
    let jsonEnabled = true;
    try {
      await execFileAsync$7(whisperExecutablePath, [...whisperBaseArgs, "-ojf"], {
        timeout: 30 * 60 * 1e3,
        maxBuffer: 20 * 1024 * 1024
      });
    } catch (error2) {
      if (!shouldRetryWhisperWithoutJson(error2)) {
        throw error2;
      }
      jsonEnabled = false;
      console.warn(
        "[auto-captions] Whisper runtime does not support JSON full output, retrying with SRT only:",
        error2
      );
      await execFileAsync$7(whisperExecutablePath, whisperBaseArgs, {
        timeout: 30 * 60 * 1e3,
        maxBuffer: 20 * 1024 * 1024
      });
    }
    const timedCues = jsonEnabled ? parseWhisperJsonCues(await fs$k.readFile(jsonPath, "utf-8")) : [];
    const cues = timedCues.length > 0 ? timedCues : parseSrtCues(await fs$k.readFile(srtPath, "utf-8"));
    if (cues.length === 0) {
      throw new Error("Whisper completed, but no caption cues were produced.");
    }
    return {
      cues,
      audioSourceLabel: audioSource.label
    };
  } finally {
    await Promise.allSettled([
      fs$k.rm(wavPath, { force: true }),
      fs$k.rm(srtPath, { force: true }),
      fs$k.rm(jsonPath, { force: true })
    ]);
  }
}
function registerCaptionHandlers() {
  require$$1.ipcMain.handle("open-video-file-picker", async () => {
    try {
      const recordingsDir = await getRecordingsDir();
      const result = await require$$1.dialog.showOpenDialog({
        title: "Select Video File",
        defaultPath: recordingsDir,
        filters: [
          { name: "Video Files", extensions: ["webm", "mp4", "mov", "avi", "mkv"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      approveUserPath(result.filePaths[0]);
      setCurrentProjectPath(null);
      return {
        success: true,
        path: result.filePaths[0]
      };
    } catch (error2) {
      console.error("Failed to open file picker:", error2);
      return {
        success: false,
        message: "Failed to open file picker",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("open-audio-file-picker", async () => {
    try {
      const result = await require$$1.dialog.showOpenDialog({
        title: "Select Audio File",
        filters: [
          { name: "Audio Files", extensions: ["mp3", "wav", "aac", "m4a", "flac", "ogg"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      approveUserPath(result.filePaths[0]);
      return {
        success: true,
        path: result.filePaths[0]
      };
    } catch (error2) {
      console.error("Failed to open audio file picker:", error2);
      return {
        success: false,
        message: "Failed to open audio file picker",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("open-whisper-executable-picker", async () => {
    try {
      const result = await require$$1.dialog.showOpenDialog({
        title: "Select Whisper Executable",
        filters: [
          { name: "Executables", extensions: process.platform === "win32" ? ["exe", "cmd", "bat"] : ["*"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      approveUserPath(result.filePaths[0]);
      return { success: true, path: result.filePaths[0] };
    } catch (error2) {
      console.error("Failed to open Whisper executable picker:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("open-whisper-model-picker", async () => {
    try {
      const result = await require$$1.dialog.showOpenDialog({
        title: "Select Whisper Model",
        filters: [
          { name: "Whisper Models", extensions: ["bin"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      approveUserPath(result.filePaths[0]);
      return { success: true, path: result.filePaths[0] };
    } catch (error2) {
      console.error("Failed to open Whisper model picker:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-whisper-small-model-status", async () => {
    try {
      return await getWhisperSmallModelStatus();
    } catch (error2) {
      return { success: false, exists: false, path: null, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("download-whisper-small-model", async (event) => {
    try {
      const existing = await getWhisperSmallModelStatus();
      if (existing.exists) {
        sendWhisperModelDownloadProgress(event.sender, {
          status: "downloaded",
          progress: 100,
          path: existing.path
        });
        return { success: true, path: existing.path, alreadyDownloaded: true };
      }
      const modelPath = await downloadWhisperSmallModel(event.sender);
      return { success: true, path: modelPath };
    } catch (error2) {
      console.error("Failed to download Whisper small model:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("delete-whisper-small-model", async (event) => {
    try {
      await deleteWhisperSmallModel();
      sendWhisperModelDownloadProgress(event.sender, {
        status: "idle",
        progress: 0,
        path: null
      });
      return { success: true };
    } catch (error2) {
      console.error("Failed to delete Whisper small model:", error2);
      const status = await getWhisperSmallModelStatus();
      if (!status.exists) {
        sendWhisperModelDownloadProgress(event.sender, {
          status: "idle",
          progress: 0,
          path: null
        });
        return { success: true };
      }
      sendWhisperModelDownloadProgress(event.sender, {
        status: "error",
        progress: 0,
        path: null,
        error: String(error2)
      });
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("generate-auto-captions", async (_, options) => {
    try {
      const result = await generateAutoCaptionsFromVideo(options);
      return {
        success: true,
        cues: result.cues,
        message: result.audioSourceLabel === "recording" ? `Generated ${result.cues.length} caption cues.` : `Generated ${result.cues.length} caption cues from the ${result.audioSourceLabel}.`
      };
    } catch (error2) {
      console.error("Failed to generate auto captions:", error2);
      return {
        success: false,
        error: String(error2),
        message: "Failed to generate auto captions"
      };
    }
  });
}
const exportStreamSessions = /* @__PURE__ */ new Map();
const EXTENSION_ALLOWLIST = /^[a-z0-9]{1,8}$/;
const SESSION_DIR_PREFIX = "recordly-export-";
const ownedExportPaths = /* @__PURE__ */ new Set();
function normalizeOwnedPath(candidate) {
  return path$m.resolve(candidate);
}
function registerOwnedExportPath(candidate) {
  ownedExportPaths.add(normalizeOwnedPath(candidate));
}
function releaseOwnedExportPath(candidate) {
  ownedExportPaths.delete(normalizeOwnedPath(candidate));
}
function isOwnedExportPath(candidate) {
  return ownedExportPaths.has(normalizeOwnedPath(candidate));
}
function generateStreamId() {
  return `recordly-export-stream-${node_crypto.randomUUID()}`;
}
async function openExportStream(options) {
  const extension = (options == null ? void 0 : options.extension) ?? "mp4";
  if (!EXTENSION_ALLOWLIST.test(extension)) {
    throw new Error(`Invalid export stream extension: ${extension}`);
  }
  const streamId = generateStreamId();
  const sessionDir = await fs$k.mkdtemp(path$m.join(require$$1.app.getPath("temp"), SESSION_DIR_PREFIX));
  try {
    await fs$k.chmod(sessionDir, 448);
  } catch {
  }
  const tempPath = path$m.join(sessionDir, `${streamId}.${extension}`);
  const fileHandle = await fs$k.open(
    tempPath,
    fs$j.constants.O_RDWR | fs$j.constants.O_CREAT | fs$j.constants.O_EXCL,
    384
  );
  exportStreamSessions.set(streamId, {
    streamId,
    sessionDir,
    tempPath,
    fileHandle,
    bytesWritten: 0,
    highestWatermark: 0,
    writeQueue: Promise.resolve(),
    aborted: false
  });
  registerOwnedExportPath(tempPath);
  return { streamId, tempPath };
}
async function writeToExportStream(streamId, position, chunk) {
  const session = exportStreamSessions.get(streamId);
  if (!session) {
    throw new Error(`Export stream not found: ${streamId}`);
  }
  if (session.aborted) {
    throw new Error("Export stream was aborted");
  }
  const previous = session.writeQueue;
  const next = previous.then(async () => {
    if (session.aborted) {
      return;
    }
    const buffer = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    await session.fileHandle.write(buffer, 0, buffer.byteLength, position);
    session.bytesWritten += buffer.byteLength;
    const end = position + buffer.byteLength;
    if (end > session.highestWatermark) {
      session.highestWatermark = end;
    }
  });
  session.writeQueue = next.catch(() => void 0);
  await next;
}
async function closeExportStream(streamId, options) {
  const session = exportStreamSessions.get(streamId);
  if (!session) {
    throw new Error(`Export stream not found: ${streamId}`);
  }
  const abort = (options == null ? void 0 : options.abort) === true;
  if (abort) {
    session.aborted = true;
  }
  try {
    await session.writeQueue;
  } catch {
  }
  try {
    await session.fileHandle.close();
  } catch {
  }
  exportStreamSessions.delete(streamId);
  if (abort) {
    releaseOwnedExportPath(session.tempPath);
    try {
      await fs$k.rm(session.tempPath, { force: true });
    } catch {
    }
    try {
      await fs$k.rm(session.sessionDir, { recursive: true, force: true });
    } catch {
    }
    return { tempPath: null, bytesWritten: 0 };
  }
  return {
    tempPath: session.tempPath,
    bytesWritten: session.highestWatermark
  };
}
async function cleanupAllExportStreams() {
  const sessions = Array.from(exportStreamSessions.values());
  exportStreamSessions.clear();
  ownedExportPaths.clear();
  await Promise.allSettled(
    sessions.map(async (session) => {
      try {
        await session.fileHandle.close();
      } catch {
      }
      try {
        await fs$k.rm(session.tempPath, { force: true });
      } catch {
      }
      try {
        await fs$k.rm(session.sessionDir, { recursive: true, force: true });
      } catch {
      }
    })
  );
}
const MAX_AUDIO_SYNC_DELAY_MS = 15e3;
const ATEMPO_FILTER_EPSILON = 5e-4;
function buildAtempoFilters(tempoRatio) {
  if (!Number.isFinite(tempoRatio) || tempoRatio <= 0) {
    return [];
  }
  const filters = [];
  let remaining = tempoRatio;
  while (remaining < 0.5) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  while (remaining > 2) {
    filters.push("atempo=2.0");
    remaining /= 2;
  }
  if (Math.abs(remaining - 1) > ATEMPO_FILTER_EPSILON) {
    filters.push(`atempo=${remaining.toFixed(6)}`);
  }
  return filters;
}
function getAudioSyncAdjustment(videoDuration, audioDuration) {
  if (!Number.isFinite(videoDuration) || !Number.isFinite(audioDuration) || videoDuration <= 0 || audioDuration <= 0) {
    return { mode: "none", delayMs: 0, tempoRatio: 1, durationDeltaMs: 0 };
  }
  const durationDeltaMs = Math.round((videoDuration - audioDuration) * 1e3);
  const absDeltaMs = Math.abs(durationDeltaMs);
  if (absDeltaMs <= 20) {
    return { mode: "none", delayMs: 0, tempoRatio: 1, durationDeltaMs };
  }
  if (durationDeltaMs < 0) {
    return { mode: "none", delayMs: 0, tempoRatio: 1, durationDeltaMs };
  }
  const tempoRatio = Math.max(0.5, Math.min(2, audioDuration / videoDuration));
  const relativeDelta = absDeltaMs / Math.max(videoDuration * 1e3, 1);
  if (relativeDelta <= 0.03 || absDeltaMs <= 1500) {
    return { mode: "tempo", delayMs: 0, tempoRatio, durationDeltaMs };
  }
  if (durationDeltaMs > MAX_AUDIO_SYNC_DELAY_MS) {
    return { mode: "pad", delayMs: 0, tempoRatio: 1, durationDeltaMs };
  }
  return { mode: "delay", delayMs: durationDeltaMs, tempoRatio: 1, durationDeltaMs };
}
function applyRecordedAudioStartDelay(adjustment, recordedStartDelayMs) {
  if (!Number.isFinite(recordedStartDelayMs) || (recordedStartDelayMs ?? 0) < 0) {
    return adjustment;
  }
  const delayMs = Math.max(0, Math.round(recordedStartDelayMs ?? 0));
  if (delayMs > 20) {
    return {
      mode: "delay",
      delayMs,
      tempoRatio: 1,
      durationDeltaMs: adjustment.durationDeltaMs
    };
  }
  if (adjustment.mode !== "delay" && adjustment.mode !== "pad") {
    return adjustment;
  }
  return {
    mode: "pad",
    delayMs: 0,
    tempoRatio: 1,
    durationDeltaMs: adjustment.durationDeltaMs
  };
}
function appendSyncedAudioFilter(filterParts, inputLabel, outputLabel, adjustment, options = 1) {
  const volumeMultiplier = typeof options === "number" ? options : options.volumeMultiplier ?? 1;
  const preFilters = typeof options === "number" ? [] : options.preFilters ?? [];
  const filters = [...preFilters];
  if (adjustment.mode === "delay" && adjustment.delayMs > 0) {
    filters.push(`adelay=${adjustment.delayMs}|${adjustment.delayMs}`);
  }
  if (adjustment.mode === "tempo") {
    filters.push(...buildAtempoFilters(adjustment.tempoRatio));
  }
  if (adjustment.mode === "pad" && adjustment.durationDeltaMs > 0) {
    filters.push(`apad=pad_dur=${formatFfmpegSeconds$1(adjustment.durationDeltaMs)}`);
  }
  if (Number.isFinite(volumeMultiplier) && volumeMultiplier > 0 && Math.abs(volumeMultiplier - 1) > 5e-4) {
    filters.push(`volume=${volumeMultiplier.toFixed(3)}`);
  }
  filters.push("aresample=async=1:first_pts=0", "asetpts=PTS-STARTPTS");
  filterParts.push(`${inputLabel}${filters.join(",")}[${outputLabel}]`);
}
function formatFfmpegSeconds$1(milliseconds) {
  return (milliseconds / 1e3).toFixed(3);
}
function normalizePauseSegments(pauseSegments) {
  if (!Array.isArray(pauseSegments) || pauseSegments.length === 0) {
    return [];
  }
  const normalized = pauseSegments.map((segment) => {
    const startMs = Number(segment == null ? void 0 : segment.startMs);
    const endMs = Number(segment == null ? void 0 : segment.endMs);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
      return null;
    }
    const clampedStart = Math.max(0, Math.round(startMs));
    const clampedEnd = Math.max(0, Math.round(endMs));
    if (clampedEnd <= clampedStart) {
      return null;
    }
    return { startMs: clampedStart, endMs: clampedEnd };
  }).filter((segment) => !!segment).sort((left, right) => left.startMs - right.startMs);
  if (normalized.length <= 1) {
    return normalized;
  }
  const merged = [{ ...normalized[0] }];
  for (const segment of normalized.slice(1)) {
    const previous = merged[merged.length - 1];
    if (segment.startMs <= previous.endMs) {
      previous.endMs = Math.max(previous.endMs, segment.endMs);
    } else {
      merged.push({ ...segment });
    }
  }
  return merged;
}
function buildPausedAudioFilter(inputLabel, outputLabel, pauseSegments) {
  if (pauseSegments.length === 0) {
    return null;
  }
  const activeSegments = [];
  let cursorMs = 0;
  for (const pauseSegment of pauseSegments) {
    if (pauseSegment.startMs > cursorMs) {
      activeSegments.push({ startMs: cursorMs, endMs: pauseSegment.startMs });
    }
    cursorMs = Math.max(cursorMs, pauseSegment.endMs);
  }
  activeSegments.push({ startMs: cursorMs });
  const filterParts = [];
  const segmentLabels = [];
  activeSegments.forEach((segment, index) => {
    if (typeof segment.endMs === "number" && segment.endMs <= segment.startMs) {
      return;
    }
    const segmentLabel = `${outputLabel}_part${index}`;
    const trimArgs = typeof segment.endMs === "number" ? `start=${formatFfmpegSeconds$1(segment.startMs)}:end=${formatFfmpegSeconds$1(segment.endMs)}` : `start=${formatFfmpegSeconds$1(segment.startMs)}`;
    filterParts.push(`[${inputLabel}]atrim=${trimArgs},asetpts=PTS-STARTPTS[${segmentLabel}]`);
    segmentLabels.push(`[${segmentLabel}]`);
  });
  if (segmentLabels.length === 0) {
    return null;
  }
  if (segmentLabels.length === 1) {
    filterParts.push(`${segmentLabels[0]}anull[${outputLabel}]`);
  } else {
    filterParts.push(
      `${segmentLabels.join("")}concat=n=${segmentLabels.length}:v=0:a=1[${outputLabel}]`
    );
  }
  return filterParts.join(";");
}
const NATIVE_EXPORT_INPUT_BYTES_PER_PIXEL = 4;
const MIN_EDITED_TRACK_TEMPO_SPEED = 0.5;
const MAX_EDITED_TRACK_TEMPO_SPEED = 2;
function getNativeVideoInputByteSize(width, height) {
  return width * height * NATIVE_EXPORT_INPUT_BYTES_PER_PIXEL;
}
function parseAvailableFfmpegEncoders(stdout) {
  const encoders = /* @__PURE__ */ new Set();
  for (const line of stdout.split(/\r?\n/)) {
    const match = line.match(/^\s*[A-Z.]{6}\s+([a-z0-9_]+)/i);
    if (match == null ? void 0 : match[1]) {
      encoders.add(match[1]);
    }
  }
  return encoders;
}
function getPreferredNativeVideoEncoders(platform2) {
  switch (platform2) {
    case "darwin":
      return ["h264_videotoolbox", "libx264"];
    case "win32":
      return ["h264_nvenc", "h264_qsv", "h264_amf", "h264_mf", "libx264"];
    case "linux":
      return ["h264_nvenc", "h264_qsv", "libx264"];
    default:
      return ["libx264"];
  }
}
function getLibx264ModeArgs(encodingMode) {
  switch (encodingMode) {
    case "fast":
      return ["-preset", "ultrafast", "-tune", "zerolatency"];
    case "quality":
      return ["-preset", "slow"];
    case "balanced":
    default:
      return ["-preset", "medium"];
  }
}
function getBitrateArgs(bitrate) {
  const effectiveBitrate = Math.max(15e5, Math.round(bitrate));
  const maxRate = Math.max(effectiveBitrate, Math.round(effectiveBitrate * 1.2));
  const bufferSize = Math.max(maxRate * 2, effectiveBitrate * 2);
  return [
    "-b:v",
    String(effectiveBitrate),
    "-maxrate",
    String(maxRate),
    "-bufsize",
    String(bufferSize)
  ];
}
function buildNativeVideoExportArgs(encoder, options, outputPath) {
  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgba",
    "-s:v",
    `${options.width}x${options.height}`,
    "-framerate",
    String(options.frameRate),
    "-i",
    "pipe:0",
    "-vf",
    "vflip",
    "-an",
    "-c:v",
    encoder,
    "-g",
    String(Math.max(1, Math.round(options.frameRate * 5))),
    ...getBitrateArgs(options.bitrate)
  ];
  if (encoder === "libx264") {
    args.push(...getLibx264ModeArgs(options.encodingMode));
  }
  args.push("-pix_fmt", "yuv420p", "-movflags", "+faststart", outputPath);
  return args;
}
function formatFfmpegSeconds(milliseconds) {
  return (milliseconds / 1e3).toFixed(3);
}
function buildTrimmedSourceAudioFilter(segments) {
  if (segments.length === 0) {
    return null;
  }
  const filterParts = [];
  const segmentLabels = [];
  segments.forEach((segment, index) => {
    const label = `trimmed_audio_${index}`;
    filterParts.push(
      `[1:a]atrim=start=${formatFfmpegSeconds(segment.startMs)}:end=${formatFfmpegSeconds(segment.endMs)},asetpts=PTS-STARTPTS[${label}]`
    );
    segmentLabels.push(`[${label}]`);
  });
  if (segmentLabels.length === 1) {
    filterParts.push(`${segmentLabels[0]}anull[aout]`);
  } else {
    filterParts.push(`${segmentLabels.join("")}concat=n=${segmentLabels.length}:v=0:a=1[aout]`);
  }
  return filterParts.join(";");
}
function buildEditedTrackSourceAudioFilter(segments, sourceSampleRate) {
  if (segments.length === 0 || !Number.isFinite(sourceSampleRate) || sourceSampleRate <= 0) {
    return null;
  }
  const normalizedSourceSampleRate = Math.round(sourceSampleRate);
  if (normalizedSourceSampleRate < 1) {
    return null;
  }
  const filterParts = [];
  const segmentLabels = [];
  let hasInvalidSegment = false;
  segments.forEach((segment, index) => {
    if (!Number.isFinite(segment.startMs) || !Number.isFinite(segment.endMs) || segment.startMs < 0 || segment.endMs < 0) {
      hasInvalidSegment = true;
      return;
    }
    if (segment.endMs - segment.startMs <= 0.5) {
      hasInvalidSegment = true;
      return;
    }
    const label = `edited_audio_${index}`;
    const speed = segment.speed;
    if (!Number.isFinite(speed) || speed < MIN_EDITED_TRACK_TEMPO_SPEED || speed > MAX_EDITED_TRACK_TEMPO_SPEED) {
      hasInvalidSegment = true;
      return;
    }
    const segmentFilter = [
      `[1:a]atrim=start=${formatFfmpegSeconds(segment.startMs)}:end=${formatFfmpegSeconds(segment.endMs)}`,
      "asetpts=PTS-STARTPTS"
    ];
    const tempoFilters = buildAtempoFilters(speed);
    if (tempoFilters.length > 0) {
      segmentFilter.push(...tempoFilters);
    } else if (Math.abs(speed - 1) > ATEMPO_FILTER_EPSILON) {
      hasInvalidSegment = true;
      return;
    }
    filterParts.push(`${segmentFilter.join(",")}[${label}]`);
    segmentLabels.push(`[${label}]`);
  });
  if (hasInvalidSegment || segmentLabels.length === 0) {
    return null;
  }
  if (segmentLabels.length === 1) {
    filterParts.push(`${segmentLabels[0]}anull[aout]`);
  } else {
    filterParts.push(`${segmentLabels.join("")}concat=n=${segmentLabels.length}:v=0:a=1[aout]`);
  }
  return filterParts.join(";");
}
function buildNativeH264StreamExportArgs(config) {
  return [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    // Input 0: pre-encoded H.264 Annex B stream from browser VideoEncoder via stdin
    "-f",
    "h264",
    "-r",
    String(config.frameRate),
    "-i",
    "pipe:0",
    "-an",
    // audio handled separately by muxNativeVideoExportAudio
    "-c:v",
    "copy",
    "-movflags",
    "+faststart",
    config.outputPath
  ];
}
function getEditedAudioExtension(mimeType) {
  if (!mimeType) {
    return ".webm";
  }
  if (mimeType.includes("wav")) {
    return ".wav";
  }
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return ".m4a";
  }
  if (mimeType.includes("ogg")) {
    return ".ogg";
  }
  return ".webm";
}
const execFileAsync$6 = node_util.promisify(node_child_process.execFile);
const getNowMs = () => node_perf_hooks.performance.now();
const nativeVideoExportSessions = /* @__PURE__ */ new Map();
function cleanupNativeVideoExportSessions() {
  for (const [sessionId, session] of nativeVideoExportSessions) {
    session.terminating = true;
    try {
      if (!session.ffmpegProcess.stdin.destroyed) {
        session.ffmpegProcess.stdin.destroy();
      }
    } catch {
    }
    try {
      session.ffmpegProcess.kill("SIGKILL");
    } catch {
    }
    nativeVideoExportSessions.delete(sessionId);
  }
}
function getNativeVideoExportMaxQueuedWriteBytes(inputByteSize) {
  if (inputByteSize === 0) return 8 * 1024 * 1024;
  return Math.min(64 * 1024 * 1024, Math.max(16 * 1024 * 1024, inputByteSize * 4));
}
function isHardwareAcceleratedVideoEncoder(encoderName) {
  return /(videotoolbox|nvenc|qsv|amf|mf)/i.test(encoderName);
}
async function removeTemporaryExportFile(filePath) {
  if (!filePath) {
    return;
  }
  try {
    await fs$k.rm(filePath, { force: true });
  } catch {
  }
}
function getNativeVideoExportSessionError(session, fallback) {
  var _a2, _b2;
  return ((_a2 = session.stdinError) == null ? void 0 : _a2.message) || ((_b2 = session.processError) == null ? void 0 : _b2.message) || session.stderrOutput.trim() || fallback;
}
function sendNativeVideoExportWriteFrameResult(sender, sessionId, requestId, result) {
  if (!sender || sender.isDestroyed()) {
    return;
  }
  sender.send("native-video-export-write-frame-result", {
    sessionId,
    requestId,
    ...result
  });
}
function settleNativeVideoExportWriteFrameRequest(sessionId, session, requestId, result) {
  session.pendingWriteRequestIds.delete(requestId);
  sendNativeVideoExportWriteFrameResult(session.sender, sessionId, requestId, result);
}
function flushNativeVideoExportPendingWriteRequests(sessionId, session, error2) {
  for (const requestId of session.pendingWriteRequestIds) {
    sendNativeVideoExportWriteFrameResult(session.sender, sessionId, requestId, {
      success: false,
      error: error2
    });
  }
  session.pendingWriteRequestIds.clear();
}
function isIgnorableNativeVideoExportStreamError(error2) {
  if (!error2) {
    return false;
  }
  const errno = error2;
  return errno.code === "EPIPE" || errno.code === "ERR_STREAM_DESTROYED" || /broken pipe|stream destroyed|eof/i.test(error2.message);
}
async function waitForNativeVideoExportDrain(session) {
  if (session.stdinError || session.processError || session.ffmpegProcess.stdin.destroyed || session.ffmpegProcess.stdin.writableEnded || !session.ffmpegProcess.stdin.writable || session.ffmpegProcess.stdin.writableLength <= 0) {
    return;
  }
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(
        new Error("Timed out while waiting for native export writer backpressure to clear")
      );
    }, 15e3);
    const cleanup = () => {
      clearTimeout(timeout);
      session.ffmpegProcess.stdin.off("drain", handleDrain);
      session.ffmpegProcess.stdin.off("error", handleError2);
      session.ffmpegProcess.off("close", handleClose);
    };
    const handleDrain = () => {
      cleanup();
      resolve();
    };
    const handleError2 = (error2) => {
      cleanup();
      reject(error2);
    };
    const handleClose = () => {
      cleanup();
      reject(
        new Error(
          getNativeVideoExportSessionError(
            session,
            "Native video export writer closed before draining"
          )
        )
      );
    };
    session.ffmpegProcess.stdin.once("drain", handleDrain);
    session.ffmpegProcess.stdin.once("error", handleError2);
    session.ffmpegProcess.once("close", handleClose);
  });
}
function getNativeVideoExportFrameLength(frameData) {
  return frameData.byteLength;
}
async function writeNativeVideoExportFrame(session, frameData) {
  if (session.inputMode !== "h264-stream" && getNativeVideoExportFrameLength(frameData) !== session.inputByteSize) {
    throw new Error(
      `Native video export expected ${session.inputByteSize} bytes per frame but received ${getNativeVideoExportFrameLength(frameData)}`
    );
  }
  if (session.stdinError || session.processError || session.ffmpegProcess.stdin.destroyed || session.ffmpegProcess.stdin.writableEnded || !session.ffmpegProcess.stdin.writable) {
    throw new Error(
      getNativeVideoExportSessionError(
        session,
        "Native video export encoder is not accepting frames"
      )
    );
  }
  const frameBuffer = frameData instanceof ArrayBuffer ? Buffer.from(frameData) : Buffer.from(frameData.buffer, frameData.byteOffset, frameData.byteLength);
  try {
    session.ffmpegProcess.stdin.write(frameBuffer);
  } catch (error2) {
    session.stdinError = error2 instanceof Error ? error2 : new Error(String(error2));
    throw session.stdinError;
  }
  if (session.ffmpegProcess.stdin.writableLength >= session.maxQueuedWriteBytes) {
    try {
      await waitForNativeVideoExportDrain(session);
    } catch (error2) {
      session.stdinError = error2 instanceof Error ? error2 : new Error(String(error2));
      throw session.stdinError;
    }
  }
}
async function enqueueNativeVideoExportFrameWrite(session, frameData) {
  const writePromise = session.writeSequence.then(async () => {
    if (session.terminating) {
      throw new Error("Native video export session was cancelled");
    }
    await writeNativeVideoExportFrame(session, frameData);
  });
  session.writeSequence = writePromise.catch(() => void 0);
  await writePromise;
}
async function getAvailableNativeVideoEncoders(ffmpegPath) {
  const { stdout } = await execFileAsync$6(ffmpegPath, ["-hide_banner", "-encoders"], {
    timeout: 15e3,
    maxBuffer: 20 * 1024 * 1024
  });
  return parseAvailableFfmpegEncoders(stdout);
}
async function probeNativeVideoEncoder(ffmpegPath, encoderName, encodingMode) {
  const outputPath = path$m.join(
    require$$1.app.getPath("temp"),
    `recordly-export-probe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp4`
  );
  const args = buildNativeVideoExportArgs(
    encoderName,
    {
      width: 64,
      height: 64,
      frameRate: 1,
      bitrate: 15e5,
      encodingMode
    },
    outputPath
  );
  return new Promise((resolve) => {
    const process2 = node_child_process.spawn(ffmpegPath, args, {
      stdio: ["pipe", "ignore", "pipe"]
    });
    let stderrOutput = "";
    const timeout = setTimeout(() => {
      try {
        process2.kill("SIGKILL");
      } catch {
      }
      resolve(false);
    }, 15e3);
    process2.stderr.on("data", (chunk) => {
      stderrOutput += chunk.toString();
    });
    process2.on("close", (code) => {
      clearTimeout(timeout);
      void removeTemporaryExportFile(outputPath);
      if (code !== 0 && stderrOutput.trim().length > 0) {
        console.warn(
          `[native-export] Encoder probe failed for ${encoderName}:`,
          stderrOutput.trim()
        );
      }
      resolve(code === 0);
    });
    process2.stdin.end(Buffer.alloc(getNativeVideoInputByteSize(64, 64), 0));
  });
}
async function resolveNativeVideoEncoder(ffmpegPath, encodingMode) {
  if ((cachedNativeVideoEncoder == null ? void 0 : cachedNativeVideoEncoder.ffmpegPath) === ffmpegPath && (cachedNativeVideoEncoder == null ? void 0 : cachedNativeVideoEncoder.encodingMode) === encodingMode) {
    return cachedNativeVideoEncoder.encoderName;
  }
  const availableEncoders = await getAvailableNativeVideoEncoders(ffmpegPath);
  const candidates = [
    .../* @__PURE__ */ new Set([...getPreferredNativeVideoEncoders(process.platform), "libx264"])
  ];
  for (const encoderName of candidates) {
    if (!availableEncoders.has(encoderName)) {
      continue;
    }
    if (await probeNativeVideoEncoder(ffmpegPath, encoderName, encodingMode)) {
      setCachedNativeVideoEncoder({ ffmpegPath, encodingMode, encoderName });
      return encoderName;
    }
  }
  throw new Error("No usable FFmpeg encoder was available for native export");
}
async function muxNativeVideoExportAudio(videoPath, options) {
  const audioMode = options.audioMode ?? "none";
  if (audioMode === "none") {
    return {
      outputPath: videoPath,
      metrics: {}
    };
  }
  const ffmpegPath = getFfmpegBinaryPath();
  const metrics = {};
  const tempArtifacts = [];
  let audioInputPath = options.audioSourcePath ?? null;
  const useEditedTrackFiltergraph = audioMode === "edited-track" && options.editedTrackStrategy === "filtergraph-fast-path";
  if (audioMode === "edited-track" && !useEditedTrackFiltergraph) {
    if (!options.editedAudioData) {
      throw new Error("Edited audio data is missing for native export");
    }
    const extension = getEditedAudioExtension(options.editedAudioMimeType);
    audioInputPath = path$m.join(
      require$$1.app.getPath("temp"),
      `recordly-export-audio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`
    );
    const tempAudioWriteStartedAt = getNowMs();
    await fs$k.writeFile(audioInputPath, Buffer.from(options.editedAudioData));
    metrics.tempEditedAudioWriteMs = getNowMs() - tempAudioWriteStartedAt;
    metrics.tempEditedAudioBytes = options.editedAudioData.byteLength;
    tempArtifacts.push(audioInputPath);
  }
  if (!audioInputPath) {
    return {
      outputPath: videoPath,
      metrics
    };
  }
  const outputPath = path$m.join(
    path$m.dirname(videoPath),
    `${path$m.basename(videoPath, path$m.extname(videoPath))}-final.mp4`
  );
  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    videoPath,
    "-i",
    audioInputPath
  ];
  if (audioMode === "trim-source") {
    const filter = buildTrimmedSourceAudioFilter(options.trimSegments ?? []);
    if (filter) {
      args.push("-filter_complex", filter, "-map", "0:v:0", "-map", "[aout]");
    } else {
      args.push("-map", "0:v:0", "-map", "1:a:0");
    }
  } else if (useEditedTrackFiltergraph) {
    const filter = buildEditedTrackSourceAudioFilter(
      options.editedTrackSegments ?? [],
      options.audioSourceSampleRate ?? 0
    );
    if (!filter) {
      throw new Error("Edited-track filtergraph inputs are incomplete for native export");
    }
    args.push("-filter_complex", filter, "-map", "0:v:0", "-map", "[aout]");
  } else {
    args.push("-map", "0:v:0", "-map", "1:a:0");
  }
  args.push(
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    "-movflags",
    "+faststart",
    outputPath
  );
  try {
    const ffmpegExecStartedAt = getNowMs();
    await execFileAsync$6(ffmpegPath, args, {
      timeout: 15 * 60 * 1e3,
      maxBuffer: 20 * 1024 * 1024
    });
    metrics.ffmpegExecMs = getNowMs() - ffmpegExecStartedAt;
    await removeTemporaryExportFile(videoPath);
    return {
      outputPath,
      metrics
    };
  } finally {
    await Promise.allSettled(
      tempArtifacts.map((artifactPath) => removeTemporaryExportFile(artifactPath))
    );
  }
}
async function muxExportedVideoAudioBuffer(videoData, options) {
  const tempVideoPath = path$m.join(
    require$$1.app.getPath("temp"),
    `recordly-export-video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp4`
  );
  const metrics = {};
  let succeeded = false;
  let outputPath = tempVideoPath;
  try {
    const tempVideoWriteStartedAt = getNowMs();
    await fs$k.writeFile(tempVideoPath, Buffer.from(videoData));
    metrics.tempVideoWriteMs = getNowMs() - tempVideoWriteStartedAt;
    metrics.tempVideoBytes = videoData.byteLength;
    const finalized = await muxNativeVideoExportAudio(tempVideoPath, options);
    Object.assign(metrics, finalized.metrics);
    outputPath = finalized.outputPath;
    try {
      const stat2 = await fs$k.stat(outputPath);
      metrics.muxedVideoBytes = stat2.size;
    } catch {
    }
    succeeded = true;
    return {
      outputPath,
      metrics
    };
  } finally {
    const cleanupTargets = [];
    if (outputPath !== tempVideoPath) {
      cleanupTargets.push(tempVideoPath);
    }
    if (!succeeded) {
      cleanupTargets.push(outputPath);
    }
    if (cleanupTargets.length > 0) {
      await Promise.allSettled(
        cleanupTargets.map((target) => removeTemporaryExportFile(target))
      );
    }
  }
}
async function moveExportedTempFile(tempPath, destinationPath) {
  await fs$k.mkdir(path$m.dirname(destinationPath), { recursive: true });
  try {
    await fs$k.rename(tempPath, destinationPath);
    return;
  } catch (error2) {
    const code = error2.code;
    if (code !== "EXDEV" && code !== "EPERM" && code !== "ENOTEMPTY") {
      throw error2;
    }
  }
  await fs$k.copyFile(tempPath, destinationPath);
  try {
    await fs$k.rm(tempPath, { force: true });
  } catch (unlinkError) {
    console.warn(
      `[export] Failed to remove temp file after cross-volume copy (${tempPath}):`,
      unlinkError
    );
  }
}
function isTempPathSafe(tempPath) {
  const tempRoot = path$m.resolve(require$$1.app.getPath("temp"));
  const candidate = path$m.resolve(tempPath);
  if (candidate === tempRoot) {
    return false;
  }
  const withSep = tempRoot.endsWith(path$m.sep) ? tempRoot : tempRoot + path$m.sep;
  return candidate.startsWith(withSep);
}
function registerExportHandlers() {
  require$$1.ipcMain.handle(
    "native-video-export-start",
    async (event, options) => {
      try {
        if (options.width % 2 !== 0 || options.height % 2 !== 0) {
          throw new Error("Native export requires even output dimensions");
        }
        const ffmpegPath = getFfmpegBinaryPath();
        const inputMode = options.inputMode ?? "rawvideo";
        const sessionId = `recordly-export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const outputPath = path$m.join(require$$1.app.getPath("temp"), `${sessionId}.mp4`);
        let encoderName;
        let ffmpegArgs;
        if (inputMode === "h264-stream") {
          encoderName = "h264-stream-copy";
          ffmpegArgs = buildNativeH264StreamExportArgs({
            frameRate: options.frameRate,
            outputPath
          });
        } else {
          encoderName = await resolveNativeVideoEncoder(ffmpegPath, options.encodingMode);
          ffmpegArgs = buildNativeVideoExportArgs(encoderName, options, outputPath);
        }
        const ffmpegProcess = node_child_process.spawn(ffmpegPath, ffmpegArgs, {
          stdio: ["pipe", "ignore", "pipe"]
        });
        const inputByteSize = inputMode === "rawvideo" ? getNativeVideoInputByteSize(options.width, options.height) : 0;
        const session = {
          ffmpegProcess,
          outputPath,
          inputByteSize,
          inputMode,
          maxQueuedWriteBytes: inputMode === "h264-stream" ? 8 * 1024 * 1024 : getNativeVideoExportMaxQueuedWriteBytes(inputByteSize),
          stderrOutput: "",
          encoderName,
          processError: null,
          stdinError: null,
          terminating: false,
          writeSequence: Promise.resolve(),
          sender: event.sender,
          pendingWriteRequestIds: /* @__PURE__ */ new Set(),
          completionPromise: new Promise((resolve, reject) => {
            ffmpegProcess.once("error", (error2) => {
              const processError = error2 instanceof Error ? error2 : new Error(String(error2));
              if (session.terminating) {
                resolve();
                return;
              }
              session.processError = processError;
              reject(processError);
            });
            ffmpegProcess.stdin.once("error", (error2) => {
              const stdinError = error2 instanceof Error ? error2 : new Error(String(error2));
              if (session.terminating && isIgnorableNativeVideoExportStreamError(stdinError)) {
                return;
              }
              session.stdinError = stdinError;
            });
            ffmpegProcess.once("close", (code, signal) => {
              if (session.terminating) {
                resolve();
                return;
              }
              if (code === 0) {
                resolve();
                return;
              }
              reject(
                new Error(
                  getNativeVideoExportSessionError(
                    session,
                    `FFmpeg exited with code ${code ?? "unknown"}${signal ? ` (signal ${signal})` : ""}`
                  )
                )
              );
            });
          })
        };
        void session.completionPromise.catch(() => void 0);
        ffmpegProcess.stderr.on("data", (chunk) => {
          session.stderrOutput += chunk.toString();
        });
        nativeVideoExportSessions.set(sessionId, session);
        console.log(
          `[native-export] Started ${isHardwareAcceleratedVideoEncoder(encoderName) ? "hardware" : "software"} session ${sessionId} with ${encoderName}`
        );
        return {
          success: true,
          sessionId,
          encoderName
        };
      } catch (error2) {
        console.error(
          "[native-export] Failed to start native video export session:",
          error2
        );
        return {
          success: false,
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.on(
    "native-video-export-write-frame-async",
    (event, payload) => {
      const sessionId = payload == null ? void 0 : payload.sessionId;
      const requestId = payload == null ? void 0 : payload.requestId;
      const frameData = payload == null ? void 0 : payload.frameData;
      if (typeof sessionId !== "string" || typeof requestId !== "number" || !frameData) {
        return;
      }
      const session = nativeVideoExportSessions.get(sessionId);
      if (!session) {
        sendNativeVideoExportWriteFrameResult(event.sender, sessionId, requestId, {
          success: false,
          error: "Invalid native export session"
        });
        return;
      }
      session.sender = event.sender;
      session.pendingWriteRequestIds.add(requestId);
      if (session.terminating) {
        settleNativeVideoExportWriteFrameRequest(sessionId, session, requestId, {
          success: false,
          error: "Native video export session was cancelled"
        });
        return;
      }
      if (session.inputMode !== "h264-stream" && frameData.byteLength !== session.inputByteSize) {
        settleNativeVideoExportWriteFrameRequest(sessionId, session, requestId, {
          success: false,
          error: `Native video export expected ${session.inputByteSize} bytes per frame but received ${frameData.byteLength}`
        });
        return;
      }
      void enqueueNativeVideoExportFrameWrite(session, frameData).then(() => {
        settleNativeVideoExportWriteFrameRequest(sessionId, session, requestId, {
          success: true
        });
      }).catch((error2) => {
        session.stdinError = error2 instanceof Error ? error2 : new Error(String(error2));
        settleNativeVideoExportWriteFrameRequest(sessionId, session, requestId, {
          success: false,
          error: getNativeVideoExportSessionError(
            session,
            session.stdinError.message
          )
        });
      });
    }
  );
  require$$1.ipcMain.handle(
    "native-video-export-finish",
    async (_, sessionId, options) => {
      const session = nativeVideoExportSessions.get(sessionId);
      if (!session) {
        return { success: false, error: "Invalid native export session" };
      }
      try {
        await session.writeSequence;
        if (!session.ffmpegProcess.stdin.destroyed && !session.ffmpegProcess.stdin.writableEnded) {
          session.ffmpegProcess.stdin.end();
        }
        await session.completionPromise;
        const finalized = await muxNativeVideoExportAudio(
          session.outputPath,
          options ?? {}
        );
        nativeVideoExportSessions.delete(sessionId);
        registerOwnedExportPath(finalized.outputPath);
        if (finalized.outputPath !== session.outputPath) {
          releaseOwnedExportPath(session.outputPath);
        }
        return {
          success: true,
          tempPath: finalized.outputPath,
          encoderName: session.encoderName,
          metrics: finalized.metrics
        };
      } catch (error2) {
        flushNativeVideoExportPendingWriteRequests(sessionId, session, String(error2));
        nativeVideoExportSessions.delete(sessionId);
        await removeTemporaryExportFile(session.outputPath);
        const finalizedSuffix = session.outputPath.replace(/\.mp4$/, "-final.mp4");
        await removeTemporaryExportFile(finalizedSuffix);
        return {
          success: false,
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle(
    "mux-exported-video-audio-from-path",
    async (_, videoPath, options) => {
      if (typeof videoPath !== "string" || !isOwnedExportPath(videoPath)) {
        return {
          success: false,
          error: "Video path is not an app-managed export temp"
        };
      }
      try {
        const finalized = await muxNativeVideoExportAudio(videoPath, options ?? {});
        if (finalized.outputPath !== videoPath) {
          registerOwnedExportPath(finalized.outputPath);
          releaseOwnedExportPath(videoPath);
        }
        return {
          success: true,
          tempPath: finalized.outputPath,
          metrics: finalized.metrics
        };
      } catch (error2) {
        if (isOwnedExportPath(videoPath)) {
          await removeTemporaryExportFile(videoPath);
          releaseOwnedExportPath(videoPath);
        }
        return { success: false, error: String(error2) };
      }
    }
  );
  require$$1.ipcMain.handle(
    "mux-exported-video-audio",
    async (_, videoData, options) => {
      try {
        const result = await muxExportedVideoAudioBuffer(videoData, options ?? {});
        registerOwnedExportPath(result.outputPath);
        return {
          success: true,
          tempPath: result.outputPath,
          metrics: result.metrics
        };
      } catch (error2) {
        return {
          success: false,
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle("export-stream-open", async (_event, options) => {
    try {
      const result = await openExportStream(options);
      return { success: true, streamId: result.streamId, tempPath: result.tempPath };
    } catch (error2) {
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle(
    "export-stream-write",
    async (_event, streamId, position, chunk) => {
      try {
        await writeToExportStream(streamId, position, chunk);
        return { success: true };
      } catch (error2) {
        return { success: false, error: String(error2) };
      }
    }
  );
  require$$1.ipcMain.handle(
    "export-stream-close",
    async (_event, streamId, options) => {
      try {
        const result = await closeExportStream(streamId, options);
        return {
          success: true,
          tempPath: result.tempPath,
          bytesWritten: result.bytesWritten
        };
      } catch (error2) {
        return { success: false, error: String(error2) };
      }
    }
  );
  require$$1.ipcMain.handle("native-video-export-cancel", async (_, sessionId) => {
    const session = nativeVideoExportSessions.get(sessionId);
    if (!session) {
      return { success: true };
    }
    session.terminating = true;
    nativeVideoExportSessions.delete(sessionId);
    flushNativeVideoExportPendingWriteRequests(
      sessionId,
      session,
      "Native video export session was cancelled"
    );
    try {
      if (!session.ffmpegProcess.stdin.destroyed && !session.ffmpegProcess.stdin.writableEnded) {
        session.ffmpegProcess.stdin.destroy();
      }
    } catch {
    }
    try {
      session.ffmpegProcess.kill("SIGKILL");
    } catch {
    }
    await session.completionPromise.catch(() => void 0);
    await removeTemporaryExportFile(session.outputPath);
    return { success: true };
  });
  require$$1.ipcMain.handle(
    "save-exported-video",
    async (event, videoData, fileName) => {
      try {
        const isGif = fileName.toLowerCase().endsWith(".gif");
        const filters = isGif ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
        const parentWindow = require$$1.BrowserWindow.fromWebContents(event.sender);
        const saveDialogOptions = {
          title: isGif ? "Save Exported GIF" : "Save Exported Video",
          defaultPath: path$m.join(require$$1.app.getPath("downloads"), fileName),
          filters,
          properties: ["createDirectory", "showOverwriteConfirmation"]
        };
        const result = parentWindow ? await require$$1.dialog.showSaveDialog(parentWindow, saveDialogOptions) : await require$$1.dialog.showSaveDialog(saveDialogOptions);
        if (result.canceled || !result.filePath) {
          return {
            success: false,
            canceled: true,
            message: "Export canceled"
          };
        }
        await fs$k.writeFile(result.filePath, Buffer.from(videoData));
        approveUserPath(result.filePath);
        return {
          success: true,
          path: result.filePath,
          message: "Video exported successfully"
        };
      } catch (error2) {
        console.error("Failed to save exported video:", error2);
        return {
          success: false,
          message: "Failed to save exported video",
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle(
    "write-exported-video-to-path",
    async (_event, videoData, outputPath) => {
      try {
        const resolvedPath = path$m.resolve(outputPath);
        await fs$k.mkdir(path$m.dirname(resolvedPath), { recursive: true });
        await fs$k.writeFile(resolvedPath, Buffer.from(videoData));
        approveUserPath(resolvedPath);
        return {
          success: true,
          path: resolvedPath,
          message: "Video exported successfully",
          canceled: false
        };
      } catch (error2) {
        console.error("Failed to write exported video to path:", error2);
        return {
          success: false,
          message: "Failed to write exported video",
          canceled: false,
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle(
    "finalize-exported-video",
    async (event, payload) => {
      const tempPath = payload == null ? void 0 : payload.tempPath;
      const fileName = payload == null ? void 0 : payload.fileName;
      if (typeof tempPath !== "string" || typeof fileName !== "string") {
        return { success: false, error: "Invalid finalize-exported-video payload" };
      }
      if (!isTempPathSafe(tempPath) || !isOwnedExportPath(tempPath)) {
        return {
          success: false,
          error: "Temp path is not an app-managed export temp"
        };
      }
      try {
        await fs$k.access(tempPath);
      } catch {
        return {
          success: false,
          error: `Exported video temp file is missing: ${tempPath}`
        };
      }
      try {
        if (payload.outputPath) {
          const resolvedPath = path$m.resolve(payload.outputPath);
          await moveExportedTempFile(tempPath, resolvedPath);
          releaseOwnedExportPath(tempPath);
          approveUserPath(resolvedPath);
          return {
            success: true,
            path: resolvedPath,
            canceled: false,
            message: "Video exported successfully"
          };
        }
        const isGif = fileName.toLowerCase().endsWith(".gif");
        const filters = isGif ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
        const parentWindow = require$$1.BrowserWindow.fromWebContents(event.sender);
        const saveDialogOptions = {
          title: isGif ? "Save Exported GIF" : "Save Exported Video",
          defaultPath: path$m.join(require$$1.app.getPath("downloads"), fileName),
          filters,
          properties: ["createDirectory", "showOverwriteConfirmation"]
        };
        const result = parentWindow ? await require$$1.dialog.showSaveDialog(parentWindow, saveDialogOptions) : await require$$1.dialog.showSaveDialog(saveDialogOptions);
        if (result.canceled || !result.filePath) {
          return {
            success: false,
            canceled: true,
            message: "Export canceled"
          };
        }
        await moveExportedTempFile(tempPath, result.filePath);
        releaseOwnedExportPath(tempPath);
        approveUserPath(result.filePath);
        return {
          success: true,
          path: result.filePath,
          canceled: false,
          message: "Video exported successfully"
        };
      } catch (error2) {
        console.error("Failed to finalize exported video:", error2);
        return {
          success: false,
          canceled: false,
          message: "Failed to save exported video",
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle("discard-exported-temp", async (_event, tempPath) => {
    if (typeof tempPath !== "string" || tempPath.length === 0) {
      return { success: false, error: "Invalid temp path" };
    }
    if (!isTempPathSafe(tempPath) || !isOwnedExportPath(tempPath)) {
      return {
        success: false,
        error: "Temp path is not an app-managed export temp"
      };
    }
    try {
      await removeTemporaryExportFile(tempPath);
      releaseOwnedExportPath(tempPath);
      return { success: true };
    } catch (error2) {
      return { success: false, error: String(error2) };
    }
  });
}
function registerPermissionHandlers() {
  require$$1.ipcMain.handle("open-external-url", async (_, url) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return { success: false, error: `Blocked non-HTTP URL: ${parsed.protocol}` };
      }
      await require$$1.shell.openExternal(url);
      return { success: true };
    } catch (error2) {
      console.error("Failed to open URL:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-accessibility-permission-status", () => {
    if (process.platform !== "darwin") {
      return { success: true, trusted: true, prompted: false };
    }
    return {
      success: true,
      trusted: require$$1.systemPreferences.isTrustedAccessibilityClient(false),
      prompted: false
    };
  });
  require$$1.ipcMain.handle("request-accessibility-permission", () => {
    if (process.platform !== "darwin") {
      return { success: true, trusted: true, prompted: false };
    }
    return {
      success: true,
      trusted: require$$1.systemPreferences.isTrustedAccessibilityClient(true),
      prompted: true
    };
  });
  require$$1.ipcMain.handle("get-screen-recording-permission-status", () => {
    if (process.platform !== "darwin") {
      return { success: true, status: "granted" };
    }
    try {
      return {
        success: true,
        status: require$$1.systemPreferences.getMediaAccessStatus("screen")
      };
    } catch (error2) {
      console.error("Failed to get screen recording permission status:", error2);
      return { success: false, status: "unknown", error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("open-screen-recording-preferences", async () => {
    if (process.platform !== "darwin") {
      return { success: true };
    }
    try {
      await require$$1.shell.openExternal(getMacPrivacySettingsUrl("screen"));
      return { success: true };
    } catch (error2) {
      console.error("Failed to open Screen Recording preferences:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("open-accessibility-preferences", async () => {
    if (process.platform !== "darwin") {
      return { success: true };
    }
    try {
      await require$$1.shell.openExternal(getMacPrivacySettingsUrl("accessibility"));
      return { success: true };
    } catch (error2) {
      console.error("Failed to open Accessibility preferences:", error2);
      return { success: false, error: String(error2) };
    }
  });
}
let mediaServerBaseUrl = null;
let mediaServerStartPromise = null;
async function resolveRealPath(filePath) {
  try {
    return await fs$k.realpath(path$m.resolve(filePath));
  } catch {
    return null;
  }
}
function isAllowedMediaPath(realPath) {
  return approvedLocalReadPaths.has(realPath);
}
async function handleMediaRequest(request, response) {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/video") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }
    const rawPath = url.searchParams.get("path");
    if (!rawPath) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Missing path parameter");
      return;
    }
    const resolvedPath = await resolveRealPath(rawPath);
    if (!resolvedPath || !isAllowedMediaPath(resolvedPath)) {
      console.warn(`[media-server] Blocked access to unapproved path: ${rawPath}`);
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }
    const stat2 = await fs$k.stat(resolvedPath);
    if (!stat2.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }
    const contentType = getMediaContentType(resolvedPath);
    const fileSize = stat2.size;
    const rangeHeader = request.headers.range;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "false",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges"
    };
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range"
      });
      response.end();
      return;
    }
    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
      if (!match || !match[1] && !match[2]) {
        response.writeHead(416, { ...corsHeaders, "Content-Range": `bytes */${fileSize}` });
        response.end();
        return;
      }
      let start;
      let end;
      if (!match[1] && match[2]) {
        const suffixLength = Number.parseInt(match[2], 10);
        if (Number.isNaN(suffixLength) || suffixLength <= 0) {
          response.writeHead(416, { ...corsHeaders, "Content-Range": `bytes */${fileSize}` });
          response.end();
          return;
        }
        start = Math.max(0, fileSize - suffixLength);
        end = fileSize - 1;
      } else {
        start = Number.parseInt(match[1], 10);
        end = match[2] ? Number.parseInt(match[2], 10) : fileSize - 1;
      }
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileSize || end >= fileSize) {
        response.writeHead(416, { ...corsHeaders, "Content-Range": `bytes */${fileSize}` });
        response.end();
        return;
      }
      if (fileSize === 0) {
        response.writeHead(416, { ...corsHeaders, "Content-Range": `bytes */0` });
        response.end();
        return;
      }
      const chunkSize = end - start + 1;
      response.writeHead(206, {
        ...corsHeaders,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type": contentType,
        "Cache-Control": "no-cache"
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      const stream = fs$j.createReadStream(resolvedPath, { start, end });
      stream.pipe(response);
      stream.on("error", () => {
        if (!response.headersSent) {
          response.writeHead(500, { "Content-Type": "text/plain" });
        }
        response.end();
      });
    } else {
      response.writeHead(200, {
        ...corsHeaders,
        "Accept-Ranges": "bytes",
        "Content-Length": String(fileSize),
        "Content-Type": contentType,
        "Cache-Control": "no-cache"
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      const stream = fs$j.createReadStream(resolvedPath);
      stream.pipe(response);
      stream.on("error", () => {
        if (!response.headersSent) {
          response.writeHead(500, { "Content-Type": "text/plain" });
        }
        response.end();
      });
    }
  } catch (error2) {
    if ((error2 == null ? void 0 : error2.code) === "ENOENT") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }
    console.error("[media-server] Error handling request:", error2);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
}
function getMediaServerBaseUrl() {
  return mediaServerBaseUrl;
}
async function ensureMediaServer() {
  if (mediaServerBaseUrl) {
    return mediaServerBaseUrl;
  }
  if (mediaServerStartPromise) {
    return mediaServerStartPromise;
  }
  mediaServerStartPromise = new Promise((resolve, reject) => {
    const server = node_http.createServer((request, response) => {
      void handleMediaRequest(request, response);
    });
    server.once("error", (error2) => {
      reject(error2);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Media server did not expose a TCP address"));
        return;
      }
      mediaServerBaseUrl = `http://127.0.0.1:${address.port}`;
      console.log(`[media-server] Listening at ${mediaServerBaseUrl}`);
      resolve(mediaServerBaseUrl);
    });
  });
  return mediaServerStartPromise;
}
function buildMediaUrl(baseUrl, filePath) {
  const resolved = path$m.resolve(filePath);
  return `${baseUrl}/video?path=${encodeURIComponent(resolved)}`;
}
function normalizeRecordingTimeOffsetMs(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
}
function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
function normalizeProjectSaveName(projectName) {
  if (typeof projectName !== "string") {
    return null;
  }
  const trimmedName = projectName.trim();
  if (!trimmedName) {
    return null;
  }
  const withoutExtension = trimmedName.replace(
    new RegExp(`\\.${PROJECT_FILE_EXTENSION}$`, "i"),
    ""
  );
  const withoutInvalidFilesystemChars = withoutExtension.replace(/[<>:"/\\|?*]/g, "");
  const withoutControlChars = Array.from(withoutInvalidFilesystemChars).filter((character) => character.charCodeAt(0) > 31).join("");
  const sanitizedName = withoutControlChars.replace(/\s+/g, " ").replace(/[. ]+$/g, "").trim();
  return sanitizedName || null;
}
function getProjectVideoPath(projectData) {
  if (!projectData || typeof projectData !== "object") {
    return null;
  }
  const candidate = projectData;
  return typeof candidate.videoPath === "string" ? candidate.videoPath : null;
}
function getProjectId(projectData) {
  if (!projectData || typeof projectData !== "object") {
    return null;
  }
  const candidate = projectData;
  return typeof candidate.projectId === "string" && candidate.projectId.trim().length > 0 ? candidate.projectId : null;
}
function withProjectId(projectData, projectId) {
  if (!projectData || typeof projectData !== "object" || Array.isArray(projectData)) {
    return projectData;
  }
  return {
    ...projectData,
    projectId
  };
}
function ensureProjectDataHasProjectId(projectData) {
  const existingProjectId = getProjectId(projectData);
  if (existingProjectId) {
    return {
      projectId: existingProjectId,
      projectData
    };
  }
  const projectId = node_crypto.randomUUID();
  return {
    projectId,
    projectData: withProjectId(projectData, projectId)
  };
}
async function resolveComparablePath(filePath) {
  return fs$k.realpath(filePath).catch(() => path$m.resolve(filePath));
}
async function ensureNamedProjectSaveDoesNotOverwriteDifferentProject(targetProjectPath, projectData, activeProjectPath) {
  try {
    await fs$k.stat(targetProjectPath);
  } catch (error2) {
    if ((error2 == null ? void 0 : error2.code) === "ENOENT") {
      return { success: true };
    }
    throw error2;
  }
  const targetResolvedPath = await resolveComparablePath(targetProjectPath);
  if (activeProjectPath) {
    const activeResolvedPath = await resolveComparablePath(activeProjectPath);
    if (activeResolvedPath === targetResolvedPath) {
      return { success: true };
    }
  }
  const incomingProjectId = getProjectId(projectData);
  const incomingVideoPath = getProjectVideoPath(projectData);
  try {
    const existingProjectRaw = await fs$k.readFile(targetProjectPath, "utf-8");
    const existingProjectData = JSON.parse(existingProjectRaw);
    const existingProjectId = getProjectId(existingProjectData);
    const existingVideoPath = getProjectVideoPath(existingProjectData);
    if (existingProjectId && incomingProjectId) {
      if (existingProjectId === incomingProjectId) {
        return { success: true };
      }
      return {
        success: false,
        message: "A different project already uses this name"
      };
    }
    if (existingVideoPath && incomingVideoPath && existingVideoPath !== incomingVideoPath) {
      return {
        success: false,
        message: "A different project already uses this name"
      };
    }
    if (!existingProjectId && !incomingProjectId && existingVideoPath && incomingVideoPath) {
      return {
        success: false,
        message: "Unable to verify project identity for the chosen name"
      };
    }
    return {
      success: false,
      message: "Unable to verify project identity for the chosen name"
    };
  } catch (error2) {
    console.error("Failed to verify existing named project before overwrite:", error2);
    return {
      success: false,
      message: "Unable to verify project identity for the chosen name"
    };
  }
}
function registerProjectHandlers() {
  require$$1.ipcMain.handle("reveal-in-folder", async (_, filePath) => {
    try {
      require$$1.shell.showItemInFolder(filePath);
      return { success: true };
    } catch (error2) {
      console.error(`Error revealing item in folder: ${filePath}`, error2);
      try {
        const openPathResult = await require$$1.shell.openPath(path$m.dirname(filePath));
        if (openPathResult) {
          return { success: false, error: openPathResult };
        }
        return { success: true, message: "Could not reveal item, but opened directory." };
      } catch (openError) {
        console.error(`Error opening directory: ${path$m.dirname(filePath)}`, openError);
        return { success: false, error: String(error2) };
      }
    }
  });
  require$$1.ipcMain.handle("open-recordings-folder", async () => {
    try {
      const recordingsDir = await getRecordingsDir();
      const openPathResult = await require$$1.shell.openPath(recordingsDir);
      if (openPathResult) {
        return { success: false, error: openPathResult, message: "Failed to open recordings folder." };
      }
      return { success: true };
    } catch (error2) {
      console.error("Failed to open recordings folder:", error2);
      return { success: false, error: String(error2), message: "Failed to open recordings folder." };
    }
  });
  require$$1.ipcMain.handle("get-recordings-directory", async () => {
    try {
      const recordingsDir = await getRecordingsDir();
      return {
        success: true,
        path: recordingsDir,
        isDefault: recordingsDir === RECORDINGS_DIR
      };
    } catch (error2) {
      return {
        success: false,
        path: RECORDINGS_DIR,
        isDefault: true,
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("choose-recordings-directory", async () => {
    try {
      const current = await getRecordingsDir();
      const result = await require$$1.dialog.showOpenDialog({
        title: "Choose recordings folder",
        defaultPath: current,
        properties: ["openDirectory", "createDirectory", "promptToCreate"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true, path: current };
      }
      const selectedPath = path$m.resolve(result.filePaths[0]);
      await fs$k.mkdir(selectedPath, { recursive: true });
      await fs$k.access(selectedPath, fs$j.constants.W_OK);
      await persistRecordingsDirectorySetting(selectedPath);
      return { success: true, path: selectedPath, isDefault: selectedPath === RECORDINGS_DIR };
    } catch (error2) {
      return { success: false, error: String(error2), message: "Failed to set recordings folder" };
    }
  });
  require$$1.ipcMain.handle("save-project-file", async (_, projectData, suggestedName, existingProjectPath, thumbnailDataUrl) => {
    try {
      const projectsDir = await getProjectsDir();
      const preparedProject = ensureProjectDataHasProjectId(projectData);
      const trustedExistingProjectPath = isTrustedProjectPath(existingProjectPath) ? existingProjectPath : null;
      if (trustedExistingProjectPath) {
        await fs$k.writeFile(trustedExistingProjectPath, JSON.stringify(preparedProject.projectData, null, 2), "utf-8");
        setCurrentProjectPath(trustedExistingProjectPath);
        await saveProjectThumbnail(trustedExistingProjectPath, thumbnailDataUrl);
        await rememberRecentProject(trustedExistingProjectPath);
        return {
          success: true,
          path: trustedExistingProjectPath,
          projectId: preparedProject.projectId,
          message: "Project saved successfully"
        };
      }
      const safeName = normalizeProjectSaveName(suggestedName) || `project-${Date.now()}`;
      const defaultName = `${safeName}.${PROJECT_FILE_EXTENSION}`;
      const result = await require$$1.dialog.showSaveDialog({
        title: "Save Recordly Project",
        defaultPath: path$m.join(projectsDir, defaultName),
        filters: [
          { name: "Recordly Project", extensions: [PROJECT_FILE_EXTENSION] },
          { name: "JSON", extensions: ["json"] }
        ],
        properties: ["createDirectory", "showOverwriteConfirmation"]
      });
      if (result.canceled || !result.filePath) {
        return {
          success: false,
          canceled: true,
          message: "Save project canceled"
        };
      }
      await fs$k.writeFile(result.filePath, JSON.stringify(preparedProject.projectData, null, 2), "utf-8");
      setCurrentProjectPath(result.filePath);
      await saveProjectThumbnail(result.filePath, thumbnailDataUrl);
      await rememberRecentProject(result.filePath);
      return {
        success: true,
        path: result.filePath,
        projectId: preparedProject.projectId,
        message: "Project saved successfully"
      };
    } catch (error2) {
      console.error("Failed to save project file:", error2);
      return {
        success: false,
        message: "Failed to save project file",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("save-project-file-named", async (_, projectData, projectName, thumbnailDataUrl) => {
    try {
      const normalizedProjectName = normalizeProjectSaveName(projectName);
      if (!normalizedProjectName) {
        return {
          success: false,
          message: "Project name is required"
        };
      }
      const projectsDir = await getProjectsDir();
      const preparedProject = ensureProjectDataHasProjectId(projectData);
      const activeProjectPath = isTrustedProjectPath(currentProjectPath) ? currentProjectPath : null;
      const targetProjectPath = path$m.join(
        projectsDir,
        `${normalizedProjectName}.${PROJECT_FILE_EXTENSION}`
      );
      const overwriteCheck = await ensureNamedProjectSaveDoesNotOverwriteDifferentProject(
        targetProjectPath,
        preparedProject.projectData,
        activeProjectPath
      );
      if (!overwriteCheck.success) {
        return overwriteCheck;
      }
      await fs$k.writeFile(targetProjectPath, JSON.stringify(preparedProject.projectData, null, 2), "utf-8");
      await saveProjectThumbnail(targetProjectPath, thumbnailDataUrl);
      await rememberRecentProject(targetProjectPath);
      if (activeProjectPath) {
        const [activeResolvedPath, targetResolvedPath] = await Promise.all([
          resolveComparablePath(activeProjectPath),
          resolveComparablePath(targetProjectPath)
        ]);
        if (activeResolvedPath !== targetResolvedPath) {
          await fs$k.unlink(activeProjectPath).catch((unlinkError) => {
            if (unlinkError.code !== "ENOENT") {
              throw unlinkError;
            }
          });
          await fs$k.rm(getProjectThumbnailPath(activeProjectPath), { force: true }).catch(() => void 0);
          const recentProjectPaths = await loadRecentProjectPaths();
          const filteredRecentProjectPaths = [];
          for (const recentProjectPath of recentProjectPaths) {
            const recentResolvedPath = await resolveComparablePath(recentProjectPath);
            if (recentResolvedPath !== activeResolvedPath) {
              filteredRecentProjectPaths.push(recentProjectPath);
            }
          }
          await saveRecentProjectPaths(filteredRecentProjectPaths);
        }
      }
      setCurrentProjectPath(targetProjectPath);
      return {
        success: true,
        path: targetProjectPath,
        projectId: preparedProject.projectId,
        message: "Project saved successfully"
      };
    } catch (error2) {
      console.error("Failed to save named project file:", error2);
      return {
        success: false,
        message: "Failed to save project file",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("load-project-file", async () => {
    try {
      const projectsDir = await getProjectsDir();
      const result = await require$$1.dialog.showOpenDialog({
        title: "Open Recordly Project",
        defaultPath: projectsDir,
        filters: [
          { name: "Recordly Project", extensions: [PROJECT_FILE_EXTENSION, ...LEGACY_PROJECT_FILE_EXTENSIONS] },
          { name: "JSON", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true, message: "Open project canceled" };
      }
      return await loadProjectFromPath(result.filePaths[0]);
    } catch (error2) {
      console.error("Failed to load project file:", error2);
      return {
        success: false,
        message: "Failed to load project file",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("load-current-project-file", async () => {
    try {
      if (!currentProjectPath) {
        return { success: false, message: "No active project" };
      }
      return await loadProjectFromPath(currentProjectPath);
    } catch (error2) {
      console.error("Failed to load current project file:", error2);
      return {
        success: false,
        message: "Failed to load current project file",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("get-projects-directory", async () => {
    try {
      return {
        success: true,
        path: await getProjectsDir()
      };
    } catch (error2) {
      return {
        success: false,
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("list-project-files", async () => {
    try {
      const library = await listProjectLibraryEntries();
      return {
        success: true,
        projectsDir: library.projectsDir,
        entries: library.entries
      };
    } catch (error2) {
      return {
        success: false,
        projectsDir: null,
        entries: [],
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("open-project-file-at-path", async (_, filePath) => {
    try {
      return await loadProjectFromPath(filePath);
    } catch (error2) {
      console.error("Failed to open project file at path:", error2);
      return {
        success: false,
        message: "Failed to open project file",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("open-projects-directory", async () => {
    try {
      const projectsDir = await getProjectsDir();
      const openPathResult = await require$$1.shell.openPath(projectsDir);
      if (openPathResult) {
        return { success: false, error: openPathResult, message: "Failed to open projects folder." };
      }
      return { success: true, path: projectsDir };
    } catch (error2) {
      console.error("Failed to open projects folder:", error2);
      return { success: false, error: String(error2), message: "Failed to open projects folder." };
    }
  });
  require$$1.ipcMain.handle("set-current-video-path", async (_, path2, options) => {
    setCurrentVideoPath(normalizeVideoSourcePath(path2) ?? path2);
    approveUserPath(currentVideoPath);
    const resolvedSession = await resolveRecordingSession(currentVideoPath) ?? {
      videoPath: currentVideoPath,
      webcamPath: null,
      timeOffsetMs: 0
    };
    const nextSession = {
      ...resolvedSession,
      hideOverlayCursorByDefault: normalizeBoolean(options == null ? void 0 : options.hideOverlayCursorByDefault) || normalizeBoolean(resolvedSession.hideOverlayCursorByDefault)
    };
    setCurrentRecordingSession(nextSession);
    await replaceApprovedSessionLocalReadPaths([
      resolvedSession.videoPath,
      resolvedSession.webcamPath
    ]);
    if (nextSession.webcamPath) {
      await persistRecordingSessionManifest(nextSession);
    }
    if (!(options == null ? void 0 : options.preserveProjectPath)) {
      setCurrentProjectPath(null);
    }
    return { success: true, webcamPath: nextSession.webcamPath ?? null };
  });
  require$$1.ipcMain.handle("set-current-recording-session", async (_, session, options) => {
    const normalizedVideoPath = normalizeVideoSourcePath(session.videoPath) ?? session.videoPath;
    setCurrentVideoPath(normalizedVideoPath);
    setCurrentRecordingSession({
      videoPath: normalizedVideoPath,
      webcamPath: normalizeVideoSourcePath(session.webcamPath ?? null),
      timeOffsetMs: normalizeRecordingTimeOffsetMs(session.timeOffsetMs),
      hideOverlayCursorByDefault: normalizeBoolean(session.hideOverlayCursorByDefault)
    });
    await replaceApprovedSessionLocalReadPaths([
      currentRecordingSession.videoPath,
      currentRecordingSession.webcamPath
    ]);
    if (!(options == null ? void 0 : options.preserveProjectPath)) {
      setCurrentProjectPath(null);
    }
    await persistRecordingSessionManifest(currentRecordingSession);
    return { success: true };
  });
  require$$1.ipcMain.handle("get-current-recording-session", () => {
    if (!currentRecordingSession) {
      return { success: false };
    }
    return {
      success: true,
      session: currentRecordingSession
    };
  });
  require$$1.ipcMain.handle("get-current-video-path", () => {
    return currentVideoPath ? { success: true, path: currentVideoPath } : { success: false };
  });
  require$$1.ipcMain.handle("clear-current-video-path", () => {
    setCurrentVideoPath(null);
    setCurrentRecordingSession(null);
    return { success: true };
  });
  require$$1.ipcMain.handle("delete-recording-file", async (_, filePath) => {
    try {
      if (!filePath) {
        return { success: false, error: "Only auto-generated recordings can be deleted" };
      }
      const resolvedPath = await fs$k.realpath(filePath).catch(() => path$m.resolve(filePath));
      const recordingsDirRaw = await getRecordingsDir();
      const recordingsDir = await fs$k.realpath(recordingsDirRaw).catch(() => path$m.resolve(recordingsDirRaw));
      if (!isPathInsideDirectory(resolvedPath, recordingsDir) || !isAutoRecordingPath(resolvedPath)) {
        return { success: false, error: "Only auto-generated recordings can be deleted" };
      }
      await fs$k.unlink(resolvedPath);
      const telemetryPath = getTelemetryPathForVideo(resolvedPath);
      await fs$k.unlink(telemetryPath).catch(() => {
      });
      const currentResolved = currentVideoPath ? await fs$k.realpath(currentVideoPath).catch(() => currentVideoPath) : null;
      if (currentResolved === resolvedPath) {
        setCurrentVideoPath(null);
        setCurrentRecordingSession(null);
      }
      return { success: true };
    } catch (error2) {
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-local-media-url", async (_, filePath) => {
    const baseUrl = getMediaServerBaseUrl();
    if (!baseUrl || !filePath) {
      return { success: false };
    }
    const resolved = await resolveApprovedLocalMediaPath(filePath);
    if (!resolved) {
      const normalized = path$m.resolve(filePath);
      console.warn(`[get-local-media-url] Blocked disallowed path: ${normalized}`);
      return { success: false };
    }
    return { success: true, url: buildMediaUrl(baseUrl, resolved) };
  });
}
const execFileAsync$5 = node_util.promisify(node_child_process.execFile);
async function getNativeMacWindowSources(options) {
  if (process.platform !== "darwin") {
    return [];
  }
  const maxAgeMs = (options == null ? void 0 : options.maxAgeMs) ?? 5e3;
  const now = Date.now();
  if (cachedNativeMacWindowSources && now - cachedNativeMacWindowSourcesAtMs < maxAgeMs) {
    return cachedNativeMacWindowSources;
  }
  try {
    const binaryPath = await ensureNativeWindowListBinary();
    const { stdout } = await execFileAsync$5(binaryPath, [], {
      timeout: 3e4,
      maxBuffer: 10 * 1024 * 1024
    });
    const parsed = JSON.parse(stdout);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const entries = parsed.filter((entry) => {
      if (!entry || typeof entry !== "object") {
        return false;
      }
      const candidate = entry;
      return typeof candidate.id === "string" && typeof candidate.name === "string";
    });
    setCachedNativeMacWindowSources(entries);
    setCachedNativeMacWindowSourcesAtMs(now);
    return entries;
  } catch {
    return cachedNativeMacWindowSources ?? [];
  }
}
function getWindowBoundsFromNativeSource(source) {
  if (!source) {
    return null;
  }
  const { x, y, width, height } = source;
  if (typeof x !== "number" || !Number.isFinite(x) || typeof y !== "number" || !Number.isFinite(y) || typeof width !== "number" || !Number.isFinite(width) || typeof height !== "number" || !Number.isFinite(height)) {
    return null;
  }
  if (width <= 0 || height <= 0) {
    return null;
  }
  return { x, y, width, height };
}
async function resolveMacWindowBounds(source) {
  const windowId = parseWindowId(source.id);
  if (!windowId) {
    return null;
  }
  try {
    const nativeSources = await getNativeMacWindowSources({ maxAgeMs: 250 });
    const matchedSource = nativeSources.find((entry) => parseWindowId(entry.id) === windowId);
    return getWindowBoundsFromNativeSource(matchedSource);
  } catch {
    return null;
  }
}
function parseXwininfoBounds(stdout) {
  const absX = stdout.match(/Absolute upper-left X:\s+(-?\d+)/);
  const absY = stdout.match(/Absolute upper-left Y:\s+(-?\d+)/);
  const width = stdout.match(/Width:\s+(\d+)/);
  const height = stdout.match(/Height:\s+(\d+)/);
  if (!absX || !absY || !width || !height) {
    return null;
  }
  return {
    x: Number.parseInt(absX[1], 10),
    y: Number.parseInt(absY[1], 10),
    width: Number.parseInt(width[1], 10),
    height: Number.parseInt(height[1], 10)
  };
}
async function resolveLinuxWindowBounds(source) {
  const windowId = parseWindowId(source == null ? void 0 : source.id);
  if (windowId) {
    try {
      const { stdout } = await execFileAsync$5("xwininfo", ["-id", String(windowId)], {
        timeout: 1500
      });
      const bounds = parseXwininfoBounds(stdout);
      if (bounds && bounds.width > 0 && bounds.height > 0) {
        return bounds;
      }
    } catch {
    }
  }
  const windowTitle = typeof source.windowTitle === "string" ? source.windowTitle.trim() : source.name.trim();
  if (!windowTitle) {
    return null;
  }
  try {
    const { stdout } = await execFileAsync$5("xwininfo", ["-name", windowTitle], {
      timeout: 1500
    });
    const bounds = parseXwininfoBounds(stdout);
    return bounds && bounds.width > 0 && bounds.height > 0 ? bounds : null;
  } catch {
    return null;
  }
}
async function resolveWindowsWindowBounds(source) {
  const windowId = parseWindowId(source == null ? void 0 : source.id);
  const windowTitle = typeof source.windowTitle === "string" ? source.windowTitle.trim() : source.name.trim();
  if (!windowId && !windowTitle) {
    return null;
  }
  const script = [
    "param([string]$windowId, [string]$windowTitle)",
    'Add-Type -TypeDefinition @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public static class RecordlyWindowBounds {",
    "  [StructLayout(LayoutKind.Sequential)]",
    "  public struct RECT {",
    "    public int Left;",
    "    public int Top;",
    "    public int Right;",
    "    public int Bottom;",
    "  }",
    '  [DllImport("user32.dll")]',
    "  [return: MarshalAs(UnmanagedType.Bool)]",
    "  public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);",
    "}",
    '"@',
    "$handle = [Int64]0",
    "if ($windowId) {",
    "  $handle = [Int64]$windowId",
    "}",
    "$escapedWindowTitle = if ($windowTitle) { [WildcardPattern]::Escape($windowTitle) } else { $null }",
    "if ($handle -le 0 -and $windowTitle) {",
    '  $matchingProcess = Get-Process | Where-Object { $_.MainWindowTitle -eq $windowTitle -or ($escapedWindowTitle -and $_.MainWindowTitle -like "*$escapedWindowTitle*") } | Select-Object -First 1',
    "  if ($matchingProcess) {",
    "    $handle = $matchingProcess.MainWindowHandle.ToInt64()",
    "  }",
    "}",
    "if ($handle -le 0) {",
    "  exit 1",
    "}",
    "$rect = New-Object RecordlyWindowBounds+RECT",
    "if (-not [RecordlyWindowBounds]::GetWindowRect([IntPtr]$handle, [ref]$rect)) {",
    "  exit 1",
    "}",
    "@{ x = $rect.Left; y = $rect.Top; width = $rect.Right - $rect.Left; height = $rect.Bottom - $rect.Top } | ConvertTo-Json -Compress"
  ].join("\n");
  try {
    const { stdout } = await execFileAsync$5(
      "powershell.exe",
      ["-NoProfile", "-Command", script, String(windowId ?? ""), windowTitle],
      { timeout: 1500 }
    );
    const bounds = JSON.parse(stdout);
    return bounds && bounds.width > 0 && bounds.height > 0 ? bounds : null;
  } catch {
    return null;
  }
}
function stopWindowBoundsCapture() {
  if (windowBoundsCaptureInterval) {
    clearInterval(windowBoundsCaptureInterval);
    setWindowBoundsCaptureInterval(null);
  }
  setSelectedWindowBounds(null);
}
async function refreshSelectedWindowBounds() {
  var _a2;
  if (!((_a2 = selectedSource == null ? void 0 : selectedSource.id) == null ? void 0 : _a2.startsWith("window:"))) {
    setSelectedWindowBounds(null);
    return;
  }
  let bounds = null;
  if (process.platform === "darwin") {
    bounds = await resolveMacWindowBounds(selectedSource);
  } else if (process.platform === "win32") {
    bounds = await resolveWindowsWindowBounds(selectedSource);
  } else if (process.platform === "linux") {
    bounds = await resolveLinuxWindowBounds(selectedSource);
  }
  setSelectedWindowBounds(bounds);
}
function startWindowBoundsCapture() {
  var _a2;
  stopWindowBoundsCapture();
  if (!["darwin", "win32", "linux"].includes(process.platform) || !((_a2 = selectedSource == null ? void 0 : selectedSource.id) == null ? void 0 : _a2.startsWith("window:"))) {
    return;
  }
  void refreshSelectedWindowBounds();
  setWindowBoundsCaptureInterval(setInterval(() => {
    void refreshSelectedWindowBounds();
  }, 250));
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function normalizeCursorTelemetrySamples(rawSamples) {
  const samples = Array.isArray(rawSamples) ? rawSamples : Array.isArray(rawSamples == null ? void 0 : rawSamples.samples) ? rawSamples.samples ?? [] : [];
  const boundedSamples = samples.slice(0, MAX_CURSOR_SAMPLES);
  return boundedSamples.filter((sample) => Boolean(sample && typeof sample === "object")).map((sample) => {
    const point = sample;
    return {
      timeMs: typeof point.timeMs === "number" && Number.isFinite(point.timeMs) ? Math.max(0, point.timeMs) : 0,
      cx: typeof point.cx === "number" && Number.isFinite(point.cx) ? clamp(point.cx, 0, 1) : 0.5,
      cy: typeof point.cy === "number" && Number.isFinite(point.cy) ? clamp(point.cy, 0, 1) : 0.5,
      interactionType: point.interactionType === "click" || point.interactionType === "double-click" || point.interactionType === "right-click" || point.interactionType === "middle-click" || point.interactionType === "move" || point.interactionType === "mouseup" ? point.interactionType : void 0,
      cursorType: point.cursorType === "arrow" || point.cursorType === "text" || point.cursorType === "pointer" || point.cursorType === "crosshair" || point.cursorType === "open-hand" || point.cursorType === "closed-hand" || point.cursorType === "resize-ew" || point.cursorType === "resize-ns" || point.cursorType === "not-allowed" ? point.cursorType : void 0
    };
  }).sort((a, b) => a.timeMs - b.timeMs);
}
async function writeCursorTelemetry(videoPath, samples) {
  const telemetryPath = getTelemetryPathForVideo(videoPath);
  const normalizedSamples = normalizeCursorTelemetrySamples(samples);
  if (normalizedSamples.length === 0) {
    await fs$k.rm(telemetryPath, { force: true });
    return normalizedSamples;
  }
  await fs$k.writeFile(
    telemetryPath,
    JSON.stringify(
      { version: CURSOR_TELEMETRY_VERSION, samples: normalizedSamples },
      null,
      2
    ),
    "utf-8"
  );
  return normalizedSamples;
}
function stopCursorCapture() {
  if (cursorCaptureInterval) {
    clearTimeout(cursorCaptureInterval);
    setCursorCaptureInterval(null);
  }
}
function resetCursorCaptureClock() {
  setCursorCaptureAccumulatedPausedMs(0);
  setCursorCapturePauseStartedAtMs(null);
}
function isCursorCapturePaused() {
  return cursorCapturePauseStartedAtMs !== null;
}
function pauseCursorCapture(pausedAtMs) {
  if (cursorCapturePauseStartedAtMs !== null) {
    return;
  }
  setCursorCapturePauseStartedAtMs(pausedAtMs);
}
function resumeCursorCapture(resumedAtMs) {
  if (cursorCapturePauseStartedAtMs === null) {
    return;
  }
  const pauseDurationMs = Math.max(0, resumedAtMs - cursorCapturePauseStartedAtMs);
  setCursorCaptureAccumulatedPausedMs(
    cursorCaptureAccumulatedPausedMs + pauseDurationMs
  );
  setCursorCapturePauseStartedAtMs(null);
}
function getCursorCaptureElapsedMs(nowMs = Date.now()) {
  if (!Number.isFinite(cursorCaptureStartTimeMs) || cursorCaptureStartTimeMs <= 0) {
    return 0;
  }
  const safeNowMs = Math.max(cursorCaptureStartTimeMs, nowMs);
  const activePauseDurationMs = cursorCapturePauseStartedAtMs === null ? 0 : Math.max(0, safeNowMs - cursorCapturePauseStartedAtMs);
  return Math.max(
    0,
    safeNowMs - cursorCaptureStartTimeMs - Math.max(0, cursorCaptureAccumulatedPausedMs) - activePauseDurationMs
  );
}
function getNormalizedCursorPoint() {
  var _a2;
  const fallbackCursor = getScreen$1().getCursorScreenPoint();
  const linuxCursorCache = process.platform === "linux" ? linuxCursorScreenPoint : null;
  const isLinuxCacheFresh = !!linuxCursorCache && Date.now() - linuxCursorCache.updatedAt <= 1e3;
  const primarySf = process.platform !== "darwin" ? getScreen$1().getPrimaryDisplay().scaleFactor || 1 : 1;
  const cursor = isLinuxCacheFresh ? { x: linuxCursorCache.x / primarySf, y: linuxCursorCache.y / primarySf } : fallbackCursor;
  const windowBounds = ((_a2 = selectedSource == null ? void 0 : selectedSource.id) == null ? void 0 : _a2.startsWith("window:")) ? selectedWindowBounds : null;
  if (windowBounds) {
    const sf = process.platform !== "darwin" ? getScreen$1().getDisplayNearestPoint({
      x: windowBounds.x / primarySf,
      y: windowBounds.y / primarySf
    }).scaleFactor || 1 : 1;
    const width2 = Math.max(1, windowBounds.width / sf);
    const height2 = Math.max(1, windowBounds.height / sf);
    return {
      cx: clamp((cursor.x - windowBounds.x / sf) / width2, 0, 1),
      cy: clamp((cursor.y - windowBounds.y / sf) / height2, 0, 1)
    };
  }
  const sourceDisplayId = Number(selectedSource == null ? void 0 : selectedSource.display_id);
  const sourceDisplay = Number.isFinite(sourceDisplayId) ? getScreen$1().getAllDisplays().find((display2) => display2.id === sourceDisplayId) ?? null : null;
  const display = sourceDisplay ?? getScreen$1().getDisplayNearestPoint(cursor);
  const bounds = display.bounds;
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  const cx = clamp((cursor.x - bounds.x) / width, 0, 1);
  const cy = clamp((cursor.y - bounds.y) / height, 0, 1);
  return { cx, cy };
}
function getHookCursorScreenPoint(event) {
  var _a2, _b2, _c, _d;
  const rawX = (event == null ? void 0 : event.x) ?? ((_a2 = event == null ? void 0 : event.data) == null ? void 0 : _a2.x) ?? (event == null ? void 0 : event.screenX) ?? ((_b2 = event == null ? void 0 : event.data) == null ? void 0 : _b2.screenX);
  const rawY = (event == null ? void 0 : event.y) ?? ((_c = event == null ? void 0 : event.data) == null ? void 0 : _c.y) ?? (event == null ? void 0 : event.screenY) ?? ((_d = event == null ? void 0 : event.data) == null ? void 0 : _d.screenY);
  if (typeof rawX !== "number" || !Number.isFinite(rawX) || typeof rawY !== "number" || !Number.isFinite(rawY)) {
    return null;
  }
  return { x: rawX, y: rawY };
}
function pushCursorSample(cx, cy, timeMs, interactionType = "move", cursorType) {
  activeCursorSamples.push({
    timeMs: Math.max(0, timeMs),
    cx,
    cy,
    interactionType,
    cursorType: currentCursorVisualType
  });
  if (activeCursorSamples.length > MAX_CURSOR_SAMPLES) {
    activeCursorSamples.shift();
  }
}
function sampleCursorPoint() {
  const point = getNormalizedCursorPoint();
  pushCursorSample(point.cx, point.cy, getCursorCaptureElapsedMs(), "move");
}
async function persistPendingCursorTelemetry(videoPath) {
  const telemetryPath = getTelemetryPathForVideo(videoPath);
  if (pendingCursorSamples.length > 0) {
    await fs$k.writeFile(
      telemetryPath,
      JSON.stringify(
        { version: CURSOR_TELEMETRY_VERSION, samples: pendingCursorSamples },
        null,
        2
      ),
      "utf-8"
    );
  }
  setPendingCursorSamples([]);
}
function snapshotCursorTelemetryForPersistence() {
  var _a2;
  if (activeCursorSamples.length === 0) {
    return;
  }
  if (pendingCursorSamples.length === 0) {
    setPendingCursorSamples([...activeCursorSamples]);
    return;
  }
  const lastPendingTimeMs = ((_a2 = pendingCursorSamples[pendingCursorSamples.length - 1]) == null ? void 0 : _a2.timeMs) ?? -1;
  setPendingCursorSamples([
    ...pendingCursorSamples,
    ...activeCursorSamples.filter((sample) => sample.timeMs > lastPendingTimeMs)
  ]);
}
function startCursorSampling() {
  stopCursorCapture();
  let nextExpectedMs = Date.now() + CURSOR_SAMPLE_INTERVAL_MS;
  const tick = () => {
    if (isCursorCaptureActive && !isCursorCapturePaused()) {
      sampleCursorPoint();
    }
    const now = Date.now();
    const drift = now - nextExpectedMs;
    nextExpectedMs += CURSOR_SAMPLE_INTERVAL_MS;
    if (drift > CURSOR_SAMPLE_INTERVAL_MS) {
      nextExpectedMs = now + CURSOR_SAMPLE_INTERVAL_MS;
    }
    const delay = Math.max(1, nextExpectedMs - now);
    setCursorCaptureInterval(setTimeout(tick, delay));
  };
  setCursorCaptureInterval(setTimeout(tick, CURSOR_SAMPLE_INTERVAL_MS));
}
const nodeRequire$1 = node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href);
function normalizeHookMouseButton(rawButton) {
  if (typeof rawButton !== "number" || !Number.isFinite(rawButton)) {
    return 1;
  }
  if (rawButton === 2 || rawButton === 39) {
    return 2;
  }
  if (rawButton === 3 || rawButton === 38) {
    return 3;
  }
  return 1;
}
function getHookMouseButton(event) {
  var _a2, _b2;
  return normalizeHookMouseButton(
    (event == null ? void 0 : event.button) ?? (event == null ? void 0 : event.mouseButton) ?? ((_a2 = event == null ? void 0 : event.data) == null ? void 0 : _a2.button) ?? ((_b2 = event == null ? void 0 : event.data) == null ? void 0 : _b2.mouseButton)
  );
}
function stopInteractionCapture() {
  if (interactionCaptureCleanup) {
    interactionCaptureCleanup();
    setInteractionCaptureCleanup(null);
  }
}
function isUiohookLike(value) {
  const candidate = value;
  return typeof (candidate == null ? void 0 : candidate.on) === "function" && typeof (candidate == null ? void 0 : candidate.start) === "function";
}
function loadUiohookModule() {
  const moduleExports = nodeRequire$1("uiohook-napi");
  const defaultExport = moduleExports.default;
  if (moduleExports.uIOhook) {
    return moduleExports.uIOhook;
  }
  if (moduleExports.uiohook) {
    return moduleExports.uiohook;
  }
  if (moduleExports.Uiohook) {
    return moduleExports.Uiohook;
  }
  if (isUiohookLike(defaultExport)) {
    return defaultExport;
  }
  if (defaultExport == null ? void 0 : defaultExport.uIOhook) {
    return defaultExport.uIOhook;
  }
  if (defaultExport == null ? void 0 : defaultExport.uiohook) {
    return defaultExport.uiohook;
  }
  if (defaultExport == null ? void 0 : defaultExport.Uiohook) {
    return defaultExport.Uiohook;
  }
  return null;
}
async function startInteractionCapture() {
  if (!isCursorCaptureActive) {
    return;
  }
  if (!["darwin", "win32", "linux"].includes(process.platform)) {
    return;
  }
  stopInteractionCapture();
  try {
    const hook = loadUiohookModule();
    console.log(
      "[CursorTelemetry] hook loaded:",
      !!hook,
      "has.on:",
      typeof (hook == null ? void 0 : hook.on),
      "has.start:",
      typeof (hook == null ? void 0 : hook.start)
    );
    if (!isCursorCaptureActive) {
      return;
    }
    if (!hook || typeof hook.on !== "function" || typeof hook.start !== "function") {
      console.log("[CursorTelemetry] hook unusable — aborting interaction capture");
      return;
    }
    const onMouseDown = (event) => {
      if (!isCursorCaptureActive || isCursorCapturePaused()) {
        return;
      }
      const point = getNormalizedCursorPoint();
      if (!point) {
        return;
      }
      const timeMs = getCursorCaptureElapsedMs();
      const button = getHookMouseButton(event);
      let interactionType = "click";
      if (button === 2) {
        interactionType = "right-click";
      } else if (button === 3) {
        interactionType = "middle-click";
      } else {
        const thresholdMs = 350;
        const distance = lastLeftClick ? Math.hypot(point.cx - lastLeftClick.cx, point.cy - lastLeftClick.cy) : Number.POSITIVE_INFINITY;
        if (lastLeftClick && timeMs - lastLeftClick.timeMs <= thresholdMs && distance <= 0.04) {
          interactionType = "double-click";
        }
        setLastLeftClick({ timeMs, cx: point.cx, cy: point.cy });
      }
      pushCursorSample(point.cx, point.cy, timeMs, interactionType);
    };
    const onMouseUp = () => {
      if (!isCursorCaptureActive || isCursorCapturePaused()) {
        return;
      }
      const point = getNormalizedCursorPoint();
      if (!point) {
        return;
      }
      const timeMs = getCursorCaptureElapsedMs();
      pushCursorSample(point.cx, point.cy, timeMs, "mouseup");
    };
    const onMouseMove = (event) => {
      if (process.platform !== "linux" || !isCursorCaptureActive || isCursorCapturePaused()) {
        return;
      }
      const point = getHookCursorScreenPoint(event);
      if (!point) {
        return;
      }
      setLinuxCursorScreenPoint({ x: point.x, y: point.y, updatedAt: Date.now() });
    };
    hook.on("mousedown", onMouseDown);
    hook.on("mouseup", onMouseUp);
    if (process.platform === "linux") {
      hook.on("mousemove", onMouseMove);
    }
    setInteractionCaptureCleanup(() => {
      try {
        if (typeof hook.off === "function") {
          hook.off("mousedown", onMouseDown);
          hook.off("mouseup", onMouseUp);
          if (process.platform === "linux") {
            hook.off("mousemove", onMouseMove);
          }
        } else if (typeof hook.removeListener === "function") {
          hook.removeListener("mousedown", onMouseDown);
          hook.removeListener("mouseup", onMouseUp);
          if (process.platform === "linux") {
            hook.removeListener("mousemove", onMouseMove);
          }
        }
      } catch {
      }
      try {
        if (typeof hook.stop === "function") {
          hook.stop();
        }
      } catch {
      }
    });
    hook.start();
  } catch (error2) {
    if (!hasLoggedInteractionHookFailure) {
      setHasLoggedInteractionHookFailure(true);
      console.warn("[CursorTelemetry] Global interaction capture unavailable:", error2);
    }
  }
}
function emitCursorStateChanged(cursorType) {
  require$$1.BrowserWindow.getAllWindows().forEach((window2) => {
    if (!window2.isDestroyed()) {
      window2.webContents.send("cursor-state-changed", { cursorType });
    }
  });
}
function handleCursorMonitorStdout(chunk) {
  setNativeCursorMonitorOutputBuffer(nativeCursorMonitorOutputBuffer + chunk.toString());
  const lines = nativeCursorMonitorOutputBuffer.split(/\r?\n/);
  setNativeCursorMonitorOutputBuffer(lines.pop() ?? "");
  for (const line of lines) {
    const match = line.match(/^STATE:(.+)$/);
    if (!match) continue;
    const next = match[1].trim();
    if (next === "arrow" || next === "text" || next === "pointer" || next === "crosshair" || next === "open-hand" || next === "closed-hand" || next === "resize-ew" || next === "resize-ns" || next === "not-allowed") {
      if (currentCursorVisualType !== next) {
        setCurrentCursorVisualType(next);
        emitCursorStateChanged(next);
      }
    }
  }
}
function stopNativeCursorMonitor() {
  setCurrentCursorVisualType("arrow");
  if (!nativeCursorMonitorProcess) {
    return;
  }
  try {
    nativeCursorMonitorProcess.stdin.write("stop\n");
  } catch {
  }
  try {
    nativeCursorMonitorProcess.kill();
  } catch {
  }
  setNativeCursorMonitorProcess(null);
  setNativeCursorMonitorOutputBuffer("");
}
async function startNativeCursorMonitor() {
  stopNativeCursorMonitor();
  if (process.platform !== "darwin" && process.platform !== "win32") {
    setCurrentCursorVisualType("arrow");
    return;
  }
  try {
    let helperPath;
    if (process.platform === "win32") {
      helperPath = getCursorMonitorExePath();
      try {
        await fs$k.access(helperPath, fs$j.constants.F_OK);
      } catch {
        console.warn("Windows cursor monitor helper missing:", helperPath);
        setCurrentCursorVisualType("arrow");
        return;
      }
    } else {
      helperPath = await ensureNativeCursorMonitorBinary();
    }
    setNativeCursorMonitorOutputBuffer("");
    setCurrentCursorVisualType("arrow");
    let proc;
    try {
      proc = node_child_process.spawn(helperPath, [], {
        stdio: ["pipe", "pipe", "pipe"]
      });
    } catch (spawnError) {
      console.warn("Failed to spawn cursor monitor:", spawnError);
      setNativeCursorMonitorProcess(null);
      setCurrentCursorVisualType("arrow");
      return;
    }
    setNativeCursorMonitorProcess(proc);
    const spawned = proc;
    if (!spawned) {
      setNativeCursorMonitorProcess(null);
      setCurrentCursorVisualType("arrow");
      return;
    }
    spawned.once("error", (error2) => {
      console.warn("Native cursor monitor process error:", error2);
      if (nativeCursorMonitorProcess === spawned) {
        setNativeCursorMonitorProcess(null);
        setNativeCursorMonitorOutputBuffer("");
        setCurrentCursorVisualType("arrow");
      }
    });
    if (spawned.stdout) spawned.stdout.on("data", handleCursorMonitorStdout);
    if (spawned.stderr) {
      spawned.stderr.on("data", () => {
      });
    }
    spawned.once("close", () => {
      if (nativeCursorMonitorProcess === spawned) {
        setNativeCursorMonitorProcess(null);
        setNativeCursorMonitorOutputBuffer("");
        setCurrentCursorVisualType("arrow");
      }
    });
  } catch (error2) {
    console.warn("Failed to start native cursor monitor:", error2);
    setNativeCursorMonitorProcess(null);
    setNativeCursorMonitorOutputBuffer("");
    setCurrentCursorVisualType("arrow");
  }
}
const execFileAsync$4 = node_util.promisify(node_child_process.execFile);
const MIN_VALID_RECORDED_VIDEO_BYTES = 1024;
function recordNativeCaptureDiagnostics(diagnostics) {
  setLastNativeCaptureDiagnostics({
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ...diagnostics
  });
  return lastNativeCaptureDiagnostics;
}
async function getFileSizeIfPresent(filePath) {
  if (!filePath) {
    return null;
  }
  try {
    const stat2 = await fs$k.stat(filePath);
    return stat2.size;
  } catch {
    return null;
  }
}
function parseFfmpegDurationSeconds(stderr) {
  const match = stderr.match(/Duration:\s+(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  if (![hours, minutes, seconds].every(Number.isFinite)) {
    return null;
  }
  return hours * 3600 + minutes * 60 + seconds;
}
async function probeMediaDurationSeconds(filePath) {
  const ffmpegPath = getFfmpegBinaryPath();
  try {
    await execFileAsync$4(ffmpegPath, ["-i", filePath, "-hide_banner"], { timeout: 5e3 });
  } catch (error2) {
    const stderr = (error2 == null ? void 0 : error2.stderr) ?? "";
    const duration = parseFfmpegDurationSeconds(stderr);
    if (duration !== null) {
      return duration;
    }
  }
  return 0;
}
async function getUsableCompanionAudioCandidates(videoPath) {
  const basePath = videoPath.replace(/\.[^.]+$/u, "");
  const candidates = [];
  for (const layout of COMPANION_AUDIO_LAYOUTS) {
    const systemPath = `${basePath}${layout.systemSuffix}`;
    const micPath = `${basePath}${layout.micSuffix}`;
    const usablePaths = [];
    for (const companionPath of [systemPath, micPath]) {
      try {
        const stat2 = await fs$k.stat(companionPath);
        if (stat2.size > 0) {
          usablePaths.push(companionPath);
        }
      } catch {
      }
    }
    if (usablePaths.length > 0) {
      candidates.push({
        platform: layout.platform,
        systemPath,
        micPath,
        usablePaths
      });
    }
  }
  return candidates;
}
async function readCompanionAudioTimingMetadata(companionPath) {
  try {
    const raw = await fs$k.readFile(`${companionPath}.json`, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
async function getCompanionAudioStartDelayMs(companionPath) {
  const metadata = await readCompanionAudioTimingMetadata(companionPath);
  const startDelayMs = metadata == null ? void 0 : metadata.startDelayMs;
  if (!Number.isFinite(startDelayMs) || (startDelayMs ?? 0) < 0) {
    return null;
  }
  return Math.round(startDelayMs ?? 0);
}
async function hasEmbeddedAudioStream(videoPath) {
  const ffmpegPath = getFfmpegBinaryPath();
  let stderr = "";
  try {
    const result = await execFileAsync$4(
      ffmpegPath,
      ["-hide_banner", "-i", videoPath, "-map", "0:a:0", "-frames:a", "1", "-f", "null", "-"],
      { timeout: 2e4, maxBuffer: 10 * 1024 * 1024 }
    );
    stderr = result.stderr;
  } catch (error2) {
    stderr = error2.stderr ?? "";
  }
  return /Stream #.*Audio:/i.test(stderr);
}
async function getCompanionAudioFallbackInfo(videoPath) {
  const companionCandidates = await getUsableCompanionAudioCandidates(videoPath);
  if (companionCandidates.length === 0) {
    return { paths: [], startDelayMsByPath: {} };
  }
  let paths;
  if (await hasEmbeddedAudioStream(videoPath)) {
    const microphoneCompanionPaths = Array.from(
      new Set(
        companionCandidates.flatMap(
          (candidate) => candidate.usablePaths.filter(
            (companionPath) => companionPath === candidate.micPath
          )
        )
      )
    );
    if (microphoneCompanionPaths.length === 0) {
      return { paths: [], startDelayMsByPath: {} };
    }
    paths = [videoPath, ...microphoneCompanionPaths];
  } else {
    paths = Array.from(
      new Set(companionCandidates.flatMap((candidate) => candidate.usablePaths))
    );
  }
  const metadataEntries = await Promise.all(
    paths.map(async (audioPath) => {
      const startDelayMs = await getCompanionAudioStartDelayMs(audioPath);
      if (!Number.isFinite(startDelayMs)) {
        return null;
      }
      return [audioPath, startDelayMs];
    })
  );
  return {
    paths,
    startDelayMsByPath: Object.fromEntries(
      metadataEntries.filter((entry) => entry !== null)
    )
  };
}
async function validateRecordedVideo(videoPath) {
  var _a2;
  const stat2 = await fs$k.stat(videoPath);
  if (!stat2.isFile()) {
    throw new Error(`Recorded output is not a file: ${videoPath}`);
  }
  if (stat2.size <= 0) {
    throw new Error(`Recorded output is empty: ${videoPath}`);
  }
  if (stat2.size < MIN_VALID_RECORDED_VIDEO_BYTES) {
    throw new Error(
      `Recorded output is too small to contain playable video (${stat2.size} bytes): ${videoPath}`
    );
  }
  const ffmpegPath = getFfmpegBinaryPath();
  let stderr = "";
  try {
    const result = await execFileAsync$4(
      ffmpegPath,
      ["-hide_banner", "-i", videoPath, "-map", "0:v:0", "-frames:v", "1", "-f", "null", "-"],
      { timeout: 2e4, maxBuffer: 10 * 1024 * 1024 }
    );
    stderr = result.stderr;
  } catch (error2) {
    const execError = error2;
    const output = (_a2 = execError.stderr) == null ? void 0 : _a2.trim();
    throw new Error(output || `Recorded output could not be decoded: ${videoPath}`);
  }
  if (!/Stream #.*Video:/i.test(stderr)) {
    throw new Error(`Recorded output does not contain a readable video stream: ${videoPath}`);
  }
  const durationSeconds = parseFfmpegDurationSeconds(stderr);
  if (durationSeconds === null || durationSeconds <= 0) {
    throw new Error(`Recorded output has an invalid duration: ${videoPath}`);
  }
  return {
    fileSizeBytes: stat2.size,
    durationSeconds
  };
}
function resolveWindowsCaptureDisplay(source, allDisplays, primaryDisplay) {
  const requestedDisplayId = Number(source == null ? void 0 : source.display_id);
  const primaryDisplayId = Number(primaryDisplay.id);
  const requestedOrPrimaryDisplayId = Number.isFinite(requestedDisplayId) && requestedDisplayId > 0 ? requestedDisplayId : primaryDisplayId;
  const matchedDisplay = allDisplays.find((display) => String(display.id) === String(requestedOrPrimaryDisplayId)) ?? primaryDisplay;
  return {
    displayId: requestedOrPrimaryDisplayId,
    bounds: matchedDisplay.bounds
  };
}
function getDisplayBoundsForSource(source) {
  return resolveWindowsCaptureDisplay(
    source,
    getScreen$1().getAllDisplays(),
    getScreen$1().getPrimaryDisplay()
  ).bounds;
}
function getDisplayWorkAreaForSource(source) {
  const allDisplays = getScreen$1().getAllDisplays();
  const primaryDisplay = getScreen$1().getPrimaryDisplay();
  const { displayId } = resolveWindowsCaptureDisplay(source, allDisplays, primaryDisplay);
  const matched = allDisplays.find((d) => d.id === displayId) ?? primaryDisplay;
  return matched.workArea;
}
async function buildFfmpegCaptureArgs(source, outputPath) {
  var _a2, _b2;
  const commonOutputArgs = [
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath
  ];
  if (process.platform === "win32") {
    if ((_a2 = source == null ? void 0 : source.id) == null ? void 0 : _a2.startsWith("window:")) {
      const windowId = parseWindowId(source.id);
      const windowTitle = typeof source.windowTitle === "string" ? source.windowTitle.trim() : source.name.trim();
      if (!windowId && !windowTitle) {
        throw new Error("Missing window identifier for FFmpeg window capture");
      }
      return [
        "-y",
        "-f",
        "gdigrab",
        "-framerate",
        "60",
        "-draw_mouse",
        "0",
        "-i",
        windowId ? `hwnd=${windowId}` : `title=${windowTitle}`,
        ...commonOutputArgs
      ];
    }
    return [
      "-y",
      "-f",
      "gdigrab",
      "-framerate",
      "60",
      "-draw_mouse",
      "0",
      "-i",
      "desktop",
      ...commonOutputArgs
    ];
  }
  if (process.platform === "linux") {
    const displayEnv = process.env.DISPLAY || ":0.0";
    if ((_b2 = source == null ? void 0 : source.id) == null ? void 0 : _b2.startsWith("window:")) {
      const bounds2 = await resolveLinuxWindowBounds(source);
      if (!bounds2) {
        throw new Error("Unable to resolve Linux window bounds for FFmpeg capture");
      }
      return [
        "-y",
        "-f",
        "x11grab",
        "-framerate",
        "60",
        "-draw_mouse",
        "0",
        "-video_size",
        `${Math.max(2, bounds2.width)}x${Math.max(2, bounds2.height)}`,
        "-i",
        `${displayEnv}+${Math.round(bounds2.x)},${Math.round(bounds2.y)}`,
        ...commonOutputArgs
      ];
    }
    const bounds = getDisplayBoundsForSource(source);
    return [
      "-y",
      "-f",
      "x11grab",
      "-framerate",
      "60",
      "-draw_mouse",
      "0",
      "-video_size",
      `${Math.max(2, bounds.width)}x${Math.max(2, bounds.height)}`,
      "-i",
      `${displayEnv}+${Math.round(bounds.x)},${Math.round(bounds.y)}`,
      ...commonOutputArgs
    ];
  }
  if (process.platform === "darwin") {
    return [
      "-y",
      "-f",
      "avfoundation",
      "-capture_cursor",
      "0",
      "-framerate",
      "60",
      "-i",
      "1:none",
      ...commonOutputArgs
    ];
  }
  throw new Error(`FFmpeg capture is not supported on ${process.platform}`);
}
function waitForFfmpegCaptureStart(process2) {
  return new Promise((resolve, reject) => {
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const onExit = (code) => {
      cleanup();
      reject(
        new Error(
          ffmpegCaptureOutputBuffer.trim() || `FFmpeg exited before recording started (code ${code ?? "unknown"})`
        )
      );
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, 900);
    const cleanup = () => {
      clearTimeout(timer);
      process2.off("error", onError);
      process2.off("exit", onExit);
    };
    process2.once("error", onError);
    process2.once("exit", onExit);
  });
}
function waitForFfmpegCaptureStop(process2, outputPath) {
  return new Promise((resolve, reject) => {
    const onClose = async (code) => {
      cleanup();
      try {
        await fs$k.access(outputPath);
        if (code === 0 || code === null) {
          resolve(outputPath);
          return;
        }
        if (ffmpegCaptureOutputBuffer.includes("Exiting normally")) {
          resolve(outputPath);
          return;
        }
      } catch {
      }
      reject(
        new Error(
          ffmpegCaptureOutputBuffer.trim() || `FFmpeg exited with code ${code ?? "unknown"}`
        )
      );
    };
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const cleanup = () => {
      process2.off("close", onClose);
      process2.off("error", onError);
    };
    process2.once("close", onClose);
    process2.once("error", onError);
  });
}
function emitRecordingInterrupted(reason, message) {
  require$$1.BrowserWindow.getAllWindows().forEach((window2) => {
    if (!window2.isDestroyed()) {
      window2.webContents.send("recording-interrupted", { reason, message });
    }
  });
}
async function hasSiblingProjectFile(videoPath) {
  const baseName = path$m.basename(videoPath, path$m.extname(videoPath));
  const candidateExtensions = [PROJECT_FILE_EXTENSION, ...LEGACY_PROJECT_FILE_EXTENSIONS];
  for (const extension of candidateExtensions) {
    const projectPath = path$m.join(path$m.dirname(videoPath), `${baseName}.${extension}`);
    try {
      await fs$k.access(projectPath);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}
async function loadSavedProjectMediaPaths() {
  const recordingsDir = await getRecordingsDir();
  const projectsDir = path$m.join(recordingsDir, PROJECTS_DIRECTORY_NAME);
  const protectedPaths = /* @__PURE__ */ new Set();
  const candidateExtensions = /* @__PURE__ */ new Set([
    PROJECT_FILE_EXTENSION,
    ...LEGACY_PROJECT_FILE_EXTENSIONS
  ]);
  let projectEntries;
  try {
    projectEntries = await fs$k.readdir(projectsDir, { withFileTypes: true });
  } catch (error2) {
    const code = typeof error2 === "object" && error2 !== null && "code" in error2 ? error2.code : void 0;
    if (code === "ENOENT") {
      return protectedPaths;
    }
    throw error2;
  }
  await Promise.all(
    projectEntries.filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }
      const extension = path$m.extname(entry.name).replace(/^\./, "").toLowerCase();
      return candidateExtensions.has(extension);
    }).map(async (entry) => {
      var _a2, _b2;
      const projectPath = path$m.join(projectsDir, entry.name);
      const rawProject = JSON.parse(await fs$k.readFile(projectPath, "utf-8"));
      const candidatePaths = [
        rawProject.videoPath,
        (_b2 = (_a2 = rawProject.editor) == null ? void 0 : _a2.webcam) == null ? void 0 : _b2.sourcePath
      ];
      for (const candidatePath of candidatePaths) {
        if (typeof candidatePath !== "string" || candidatePath.trim().length === 0) {
          continue;
        }
        const normalizedCandidatePath = normalizePath(
          normalizeVideoSourcePath(candidatePath) ?? candidatePath
        );
        protectedPaths.add(normalizedCandidatePath);
        try {
          protectedPaths.add(await fs$k.realpath(normalizedCandidatePath));
        } catch {
        }
      }
    })
  );
  return protectedPaths;
}
async function pruneAutoRecordings(exemptPaths = []) {
  const recordingsDir = await getRecordingsDir();
  await fs$k.mkdir(recordingsDir, { recursive: true });
  const protectedProjectMediaPaths = await loadSavedProjectMediaPaths();
  const exempt = new Set(
    [currentVideoPath, ...exemptPaths].filter((value) => Boolean(value)).map((value) => normalizePath(value))
  );
  const entries = await fs$k.readdir(recordingsDir, { withFileTypes: true });
  const autoRecordingStats = await Promise.all(
    entries.filter((entry) => entry.isFile() && /^recording-.*\.(mp4|mov|webm)$/i.test(entry.name)).map(async (entry) => {
      const filePath = path$m.join(recordingsDir, entry.name);
      const stats = await fs$k.stat(filePath);
      return { filePath, stats };
    })
  );
  const sorted = autoRecordingStats.sort(
    (left, right) => right.stats.mtimeMs - left.stats.mtimeMs
  );
  const now = Date.now();
  for (const [index, entry] of sorted.entries()) {
    const normalizedFilePath = normalizePath(entry.filePath);
    if (exempt.has(normalizedFilePath)) {
      continue;
    }
    if (await hasSiblingProjectFile(entry.filePath)) {
      continue;
    }
    const resolvedFilePath = await fs$k.realpath(entry.filePath).catch(() => normalizedFilePath);
    if (protectedProjectMediaPaths.has(normalizedFilePath) || protectedProjectMediaPaths.has(resolvedFilePath)) {
      continue;
    }
    const tooOld = now - entry.stats.mtimeMs > AUTO_RECORDING_MAX_AGE_MS;
    const overLimit = index >= AUTO_RECORDING_RETENTION_COUNT;
    if (!tooOld && !overLimit) {
      continue;
    }
    try {
      await fs$k.rm(entry.filePath, { force: true });
      await fs$k.rm(getTelemetryPathForVideo(entry.filePath), { force: true });
      const base = entry.filePath.replace(/\.(mp4|mov|webm)$/i, "");
      const companionSuffixes = Array.from(
        new Set(
          COMPANION_AUDIO_LAYOUTS.flatMap((layout) => [
            layout.systemSuffix,
            layout.micSuffix
          ])
        )
      );
      for (const suffix of companionSuffixes) {
        await fs$k.rm(base + suffix, { force: true }).catch(() => void 0);
      }
    } catch (error2) {
      console.warn("Failed to prune old auto recording:", entry.filePath, error2);
    }
  }
}
const execFileAsync$3 = node_util.promisify(node_child_process.execFile);
const WINDOWS_NATIVE_MIC_PRE_FILTERS = ["loudnorm=I=-16:TP=-1.5:LRA=11"];
async function isNativeWindowsCaptureAvailable() {
  if (process.platform !== "win32") return false;
  const os2 = await import("node:os");
  const [major2, , build] = os2.release().split(".").map(Number);
  const supported = major2 >= 10 && build >= 19041;
  if (!supported) return false;
  try {
    await fs$k.access(getWindowsCaptureExePath(), fs$j.constants.X_OK);
  } catch {
    return false;
  }
  return true;
}
function waitForWindowsCaptureStart(proc) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for native Windows capture to start"));
    }, 12e3);
    let stdoutBuffer = "";
    const onStdout = (chunk) => {
      stdoutBuffer += chunk.toString();
      if (stdoutBuffer.includes("Recording started")) {
        cleanup();
        resolve();
      }
    };
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const onExit = (code) => {
      cleanup();
      reject(
        new Error(
          windowsCaptureOutputBuffer.trim() || `Native Windows capture exited before recording started (code ${code ?? "unknown"})`
        )
      );
    };
    const cleanup = () => {
      clearTimeout(timer);
      proc.stdout.off("data", onStdout);
      proc.off("error", onError);
      proc.off("exit", onExit);
    };
    proc.stdout.on("data", onStdout);
    proc.once("error", onError);
    proc.once("exit", onExit);
  });
}
function waitForWindowsCaptureStop(proc) {
  return new Promise((resolve, reject) => {
    const onClose = (code) => {
      cleanup();
      const match = windowsCaptureOutputBuffer.match(/Recording stopped\. Output path: (.+)/);
      if (match == null ? void 0 : match[1]) {
        resolve(match[1].trim());
        return;
      }
      if (code === 0 && windowsCaptureTargetPath) {
        resolve(windowsCaptureTargetPath);
        return;
      }
      reject(
        new Error(
          windowsCaptureOutputBuffer.trim() || `Native Windows capture exited with code ${code ?? "unknown"}`
        )
      );
    };
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const cleanup = () => {
      proc.off("close", onClose);
      proc.off("error", onError);
    };
    proc.once("close", onClose);
    proc.once("error", onError);
  });
}
function attachWindowsCaptureLifecycle(proc) {
  proc.once("close", () => {
    const wasActive = windowsNativeCaptureActive;
    setWindowsCaptureProcess(null);
    if (!wasActive || windowsCaptureStopRequested) {
      return;
    }
    setWindowsNativeCaptureActive(false);
    setWindowsCaptureStopRequested(false);
    const sourceName = (selectedSource == null ? void 0 : selectedSource.name) ?? "Screen";
    require$$1.BrowserWindow.getAllWindows().forEach((window2) => {
      if (!window2.isDestroyed()) {
        window2.webContents.send("recording-state-changed", {
          recording: false,
          sourceName
        });
      }
    });
    emitRecordingInterrupted("capture-stopped", "Recording stopped unexpectedly.");
  });
}
async function muxNativeWindowsVideoWithAudio(videoPath, systemAudioPath, micAudioPath, pauseSegments = []) {
  const ffmpegPath = getFfmpegBinaryPath();
  const inputs = ["-i", videoPath];
  const audioInputs = [];
  const audioFilePaths = [];
  for (const [label, audioPath] of [
    ["system", systemAudioPath],
    ["mic", micAudioPath]
  ]) {
    if (!audioPath) continue;
    try {
      const stat2 = await fs$k.stat(audioPath);
      if (stat2.size <= 0) {
        console.warn(`[mux-win] Skipping ${label} audio: file is empty (${audioPath})`);
        await fs$k.rm(audioPath, { force: true }).catch(() => void 0);
        continue;
      }
      inputs.push("-i", audioPath);
      audioInputs.push(label);
      audioFilePaths.push(audioPath);
    } catch {
      console.warn(`[mux-win] Skipping ${label} audio: file not accessible (${audioPath})`);
    }
  }
  if (audioInputs.length === 0) return;
  const videoDuration = await probeMediaDurationSeconds(videoPath);
  const audioAdjustments = /* @__PURE__ */ new Map();
  if (videoDuration > 0) {
    for (let i = 0; i < audioFilePaths.length; i++) {
      const audioDuration = await probeMediaDurationSeconds(audioFilePaths[i]);
      const recordedStartDelayMs = await getCompanionAudioStartDelayMs(audioFilePaths[i]);
      const adjustment = applyRecordedAudioStartDelay(
        getAudioSyncAdjustment(videoDuration, audioDuration),
        recordedStartDelayMs
      );
      audioAdjustments.set(audioInputs[i], adjustment);
      if (Number.isFinite(recordedStartDelayMs) && adjustment.mode === "delay") {
        console.log(
          `[mux-win] ${audioInputs[i]} audio recorded a start delay of ${adjustment.delayMs}ms`
        );
      } else if (Number.isFinite(recordedStartDelayMs) && adjustment.mode === "pad") {
        console.log(
          `[mux-win] ${audioInputs[i]} audio started on time but ends ${adjustment.durationDeltaMs}ms early — padding trailing silence`
        );
      } else if (adjustment.mode === "tempo") {
        console.log(
          `[mux-win] ${audioInputs[i]} audio differs from video by ${adjustment.durationDeltaMs}ms — applying tempo ratio ${adjustment.tempoRatio.toFixed(6)}`
        );
      } else if (adjustment.mode === "delay" && adjustment.delayMs > 0) {
        console.log(
          `[mux-win] ${audioInputs[i]} audio appears to start late by ${adjustment.delayMs}ms — adding leading silence`
        );
      } else if (adjustment.mode === "pad" && adjustment.durationDeltaMs > 0) {
        console.log(
          `[mux-win] ${audioInputs[i]} audio is much shorter than video by ${adjustment.durationDeltaMs}ms — padding trailing silence`
        );
      }
    }
  }
  const mixedOutputPath = `${videoPath}.muxed.mp4`;
  const normalizedPauseSegments = normalizePauseSegments(pauseSegments);
  const systemAdjustment = audioAdjustments.get("system") ?? {
    mode: "none",
    delayMs: 0,
    tempoRatio: 1,
    durationDeltaMs: 0
  };
  const micAdjustment = audioAdjustments.get("mic") ?? {
    mode: "none",
    delayMs: 0,
    tempoRatio: 1,
    durationDeltaMs: 0
  };
  try {
    if (audioInputs.length === 2) {
      const filterParts = [];
      const systemPauseFilter = buildPausedAudioFilter(
        "1:a",
        "system_trimmed",
        normalizedPauseSegments
      );
      const micPauseFilter = buildPausedAudioFilter(
        "2:a",
        "mic_trimmed",
        normalizedPauseSegments
      );
      if (systemPauseFilter) {
        filterParts.push(systemPauseFilter);
      }
      if (micPauseFilter) {
        filterParts.push(micPauseFilter);
      }
      const systemLabel = systemPauseFilter ? "[system_trimmed]" : "[1:a]";
      const micLabel = micPauseFilter ? "[mic_trimmed]" : "[2:a]";
      appendSyncedAudioFilter(filterParts, systemLabel, "s", systemAdjustment);
      appendSyncedAudioFilter(filterParts, micLabel, "m", micAdjustment, {
        preFilters: WINDOWS_NATIVE_MIC_PRE_FILTERS
      });
      filterParts.push("[s][m]amix=inputs=2:duration=longest:normalize=0[aout]");
      await execFileAsync$3(
        ffmpegPath,
        [
          "-y",
          ...inputs,
          "-filter_complex",
          filterParts.join(";"),
          "-map",
          "0:v:0",
          "-map",
          "[aout]",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-shortest",
          mixedOutputPath
        ],
        { timeout: 12e4, maxBuffer: 10 * 1024 * 1024 }
      );
    } else {
      const pauseFilter = buildPausedAudioFilter(
        "1:a",
        "trimmed_audio",
        normalizedPauseSegments
      );
      const singleAdjustment = audioAdjustments.get(audioInputs[0]) ?? {
        mode: "none",
        delayMs: 0,
        tempoRatio: 1,
        durationDeltaMs: 0
      };
      const filterParts = [];
      if (pauseFilter) {
        filterParts.push(pauseFilter);
      }
      const srcLabel = pauseFilter ? "[trimmed_audio]" : "[1:a]";
      appendSyncedAudioFilter(
        filterParts,
        srcLabel,
        "aout",
        singleAdjustment,
        audioInputs[0] === "mic" ? { preFilters: WINDOWS_NATIVE_MIC_PRE_FILTERS } : 1
      );
      await execFileAsync$3(
        ffmpegPath,
        [
          "-y",
          ...inputs,
          "-filter_complex",
          filterParts.join(";"),
          "-map",
          "0:v:0",
          "-map",
          "[aout]",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-shortest",
          mixedOutputPath
        ],
        { timeout: 12e4, maxBuffer: 10 * 1024 * 1024 }
      );
    }
    await validateRecordedVideo(mixedOutputPath);
    await moveFileWithOverwrite(mixedOutputPath, videoPath);
  } catch (error2) {
    await fs$k.rm(mixedOutputPath, { force: true }).catch(() => void 0);
    throw error2;
  }
  for (const audioPath of [systemAudioPath, micAudioPath]) {
    if (audioPath) {
      await Promise.all([
        fs$k.rm(audioPath, { force: true }).catch(() => void 0),
        fs$k.rm(`${audioPath}.json`, { force: true }).catch(() => void 0)
      ]);
    }
  }
}
const execFileAsync$2 = node_util.promisify(node_child_process.execFile);
function waitForNativeCaptureStart(process2) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for ScreenCaptureKit recorder to start"));
    }, 12e3);
    let stdoutBuffer = "";
    const onStdout = (chunk) => {
      stdoutBuffer += chunk.toString();
      if (stdoutBuffer.includes("Recording started")) {
        cleanup();
        resolve();
      }
    };
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const onExit = (code) => {
      cleanup();
      reject(
        new Error(
          nativeCaptureOutputBuffer.trim() || `Native capture helper exited before recording started (code ${code ?? "unknown"})`
        )
      );
    };
    const cleanup = () => {
      clearTimeout(timer);
      process2.stdout.off("data", onStdout);
      process2.off("error", onError);
      process2.off("exit", onExit);
    };
    process2.stdout.on("data", onStdout);
    process2.once("error", onError);
    process2.once("exit", onExit);
  });
}
function waitForNativeCaptureStop(process2) {
  return new Promise((resolve, reject) => {
    const onClose = (code) => {
      cleanup();
      const match = nativeCaptureOutputBuffer.match(/Recording stopped\. Output path: (.+)/);
      if (match == null ? void 0 : match[1]) {
        resolve(match[1].trim());
        return;
      }
      if (code === 0 && nativeCaptureTargetPath) {
        resolve(nativeCaptureTargetPath);
        return;
      }
      reject(
        new Error(
          nativeCaptureOutputBuffer.trim() || `Native capture helper exited with code ${code ?? "unknown"}`
        )
      );
    };
    const onError = (error2) => {
      cleanup();
      reject(error2);
    };
    const cleanup = () => {
      process2.off("close", onClose);
      process2.off("error", onError);
    };
    process2.once("close", onClose);
    process2.once("error", onError);
  });
}
async function muxNativeMacRecordingWithAudio(videoPath, systemAudioPath, microphonePath) {
  const ffmpegPath = getFfmpegBinaryPath();
  const mixedOutputPath = `${videoPath}.mixed.mp4`;
  const inputs = ["-i", videoPath];
  const availableAudioInputs = [];
  const audioFilePaths = [];
  for (const [label, audioPath] of [
    ["system", systemAudioPath],
    ["microphone", microphonePath]
  ]) {
    if (!audioPath) continue;
    try {
      const stat2 = await fs$k.stat(audioPath);
      if (stat2.size <= 0) {
        console.warn(`[mux] Skipping ${label} audio: file is empty (${audioPath})`);
        await fs$k.rm(audioPath, { force: true }).catch(() => void 0);
        continue;
      }
      inputs.push("-i", audioPath);
      availableAudioInputs.push(label);
      audioFilePaths.push(audioPath);
    } catch {
      console.warn(`[mux] Skipping ${label} audio: file not accessible (${audioPath})`);
    }
  }
  if (availableAudioInputs.length === 0) {
    console.warn(
      `[mux] No valid audio files to mux — video will have no audio. system=${systemAudioPath ?? "none"} mic=${microphonePath ?? "none"}`
    );
    return;
  }
  const videoDuration = await probeMediaDurationSeconds(videoPath);
  const audioAdjustments = /* @__PURE__ */ new Map();
  if (videoDuration > 0) {
    for (let i = 0; i < audioFilePaths.length; i++) {
      const audioDuration = await probeMediaDurationSeconds(audioFilePaths[i]);
      const adjustment = getAudioSyncAdjustment(videoDuration, audioDuration);
      audioAdjustments.set(availableAudioInputs[i], adjustment);
      if (adjustment.mode === "tempo") {
        console.log(
          `[mux] ${availableAudioInputs[i]} audio differs from video by ${adjustment.durationDeltaMs}ms — applying tempo ratio ${adjustment.tempoRatio.toFixed(6)}`
        );
      } else if (adjustment.mode === "delay" && adjustment.delayMs > 0) {
        console.log(
          `[mux] ${availableAudioInputs[i]} audio appears to start late by ${adjustment.delayMs}ms — adding leading silence`
        );
      }
    }
  }
  const systemAdjustment = audioAdjustments.get("system") ?? {
    mode: "none",
    delayMs: 0,
    tempoRatio: 1,
    durationDeltaMs: 0
  };
  const micAdjustment = audioAdjustments.get("microphone") ?? {
    mode: "none",
    delayMs: 0,
    tempoRatio: 1,
    durationDeltaMs: 0
  };
  let args;
  if (availableAudioInputs.length === 2) {
    const filterParts = [];
    appendSyncedAudioFilter(filterParts, "[1:a]", "s", systemAdjustment);
    appendSyncedAudioFilter(filterParts, "[2:a]", "m", micAdjustment);
    filterParts.push("[s][m]amix=inputs=2:duration=longest:normalize=0[aout]");
    args = [
      "-y",
      ...inputs,
      "-filter_complex",
      filterParts.join(";"),
      "-map",
      "0:v:0",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      mixedOutputPath
    ];
  } else {
    const singleAdjustment = audioAdjustments.get(availableAudioInputs[0]) ?? {
      mode: "none",
      delayMs: 0,
      tempoRatio: 1,
      durationDeltaMs: 0
    };
    const filterParts = [];
    appendSyncedAudioFilter(filterParts, "[1:a]", "aout", singleAdjustment);
    args = [
      "-y",
      ...inputs,
      "-filter_complex",
      filterParts.join(";"),
      "-map",
      "0:v:0",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      mixedOutputPath
    ];
  }
  console.log("[mux] Running ffmpeg:", ffmpegPath, args.join(" "));
  try {
    await execFileAsync$2(ffmpegPath, args, { timeout: 12e4, maxBuffer: 10 * 1024 * 1024 });
    await validateRecordedVideo(mixedOutputPath);
  } catch (error2) {
    const execError = error2;
    console.error("[mux] failed:", execError.stderr || execError.message || String(error2));
    await fs$k.rm(mixedOutputPath, { force: true }).catch(() => void 0);
    throw error2;
  }
  await moveFileWithOverwrite(mixedOutputPath, videoPath);
  console.log("[mux] Successfully muxed audio into video:", videoPath);
  for (const audioPath of [systemAudioPath, microphonePath]) {
    if (audioPath) {
      await fs$k.rm(audioPath, { force: true }).catch(() => void 0);
    }
  }
}
function attachNativeCaptureLifecycle(process2) {
  process2.once("close", () => {
    const wasActive = nativeScreenRecordingActive;
    setNativeCaptureProcess(null);
    if (!wasActive || nativeCaptureStopRequested) {
      return;
    }
    setNativeScreenRecordingActive(false);
    setNativeCaptureTargetPath(null);
    setNativeCaptureStopRequested(false);
    setNativeCaptureSystemAudioPath(null);
    setNativeCaptureMicrophonePath(null);
    const sourceName = (selectedSource == null ? void 0 : selectedSource.name) ?? "Screen";
    require$$1.BrowserWindow.getAllWindows().forEach((window2) => {
      if (!window2.isDestroyed()) {
        window2.webContents.send("recording-state-changed", {
          recording: false,
          sourceName
        });
      }
    });
    const reason = nativeCaptureOutputBuffer.includes("WINDOW_UNAVAILABLE") ? "window-unavailable" : "capture-stopped";
    const message = reason === "window-unavailable" ? "The selected window is no longer capturable. Please reselect a window." : "Recording stopped unexpectedly.";
    emitRecordingInterrupted(reason, message);
  });
}
async function finalizeStoredVideo(videoPath) {
  if (videoPath.endsWith(".mp4")) {
    const companionCandidates = await getUsableCompanionAudioCandidates(videoPath);
    for (const { systemPath, micPath, platform: platform2 } of companionCandidates) {
      if (platform2 === "mac" || platform2 === "win") {
        console.log(
          `[finalize] Detected un-muxed ${platform2} audio files alongside video — attempting safety-net mux`
        );
        try {
          if (platform2 === "win") {
            await muxNativeWindowsVideoWithAudio(videoPath, systemPath, micPath);
          } else {
            await muxNativeMacRecordingWithAudio(videoPath, systemPath, micPath);
          }
          console.log("[finalize] Safety-net mux completed successfully");
        } catch (error2) {
          console.warn("[finalize] Safety-net mux failed:", error2);
        }
        break;
      }
    }
  }
  let validation;
  try {
    validation = await validateRecordedVideo(videoPath);
  } catch (error2) {
    if ((lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.backend) === "mac-screencapturekit" || (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.backend) === "windows-wgc") {
      recordNativeCaptureDiagnostics({
        backend: lastNativeCaptureDiagnostics.backend,
        phase: lastNativeCaptureDiagnostics.phase === "mux" ? "mux" : "stop",
        sourceId: lastNativeCaptureDiagnostics.sourceId ?? null,
        sourceType: lastNativeCaptureDiagnostics.sourceType ?? "unknown",
        displayId: lastNativeCaptureDiagnostics.displayId ?? null,
        displayBounds: lastNativeCaptureDiagnostics.displayBounds ?? null,
        windowHandle: lastNativeCaptureDiagnostics.windowHandle ?? null,
        helperPath: lastNativeCaptureDiagnostics.helperPath ?? null,
        outputPath: videoPath,
        systemAudioPath: lastNativeCaptureDiagnostics.systemAudioPath ?? null,
        microphonePath: lastNativeCaptureDiagnostics.microphonePath ?? null,
        osRelease: lastNativeCaptureDiagnostics.osRelease,
        supported: lastNativeCaptureDiagnostics.supported,
        helperExists: lastNativeCaptureDiagnostics.helperExists,
        processOutput: lastNativeCaptureDiagnostics.processOutput,
        fileSizeBytes: await getFileSizeIfPresent(videoPath),
        error: error2 instanceof Error ? error2.message : String(error2)
      });
    }
    throw error2;
  }
  snapshotCursorTelemetryForPersistence();
  setCurrentVideoPath(videoPath);
  setCurrentProjectPath(null);
  await persistPendingCursorTelemetry(videoPath);
  if (isAutoRecordingPath(videoPath)) {
    await pruneAutoRecordings([videoPath]);
  }
  if ((lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.backend) === "mac-screencapturekit" || (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.backend) === "windows-wgc") {
    recordNativeCaptureDiagnostics({
      backend: lastNativeCaptureDiagnostics.backend,
      phase: lastNativeCaptureDiagnostics.phase === "mux" ? "mux" : "stop",
      sourceId: lastNativeCaptureDiagnostics.sourceId ?? null,
      sourceType: lastNativeCaptureDiagnostics.sourceType ?? "unknown",
      displayId: lastNativeCaptureDiagnostics.displayId ?? null,
      displayBounds: lastNativeCaptureDiagnostics.displayBounds ?? null,
      windowHandle: lastNativeCaptureDiagnostics.windowHandle ?? null,
      helperPath: lastNativeCaptureDiagnostics.helperPath ?? null,
      outputPath: videoPath,
      systemAudioPath: lastNativeCaptureDiagnostics.systemAudioPath ?? null,
      microphonePath: lastNativeCaptureDiagnostics.microphonePath ?? null,
      osRelease: lastNativeCaptureDiagnostics.osRelease,
      supported: lastNativeCaptureDiagnostics.supported,
      helperExists: lastNativeCaptureDiagnostics.helperExists,
      processOutput: lastNativeCaptureDiagnostics.processOutput,
      fileSizeBytes: validation.fileSizeBytes
    });
  }
  return {
    success: true,
    path: videoPath,
    message: validation.durationSeconds !== null ? `Video stored successfully (${validation.fileSizeBytes} bytes, ${validation.durationSeconds.toFixed(2)}s)` : `Video stored successfully`
  };
}
async function recoverNativeMacCaptureOutput() {
  const macDiagnostics = (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.backend) === "mac-screencapturekit" ? lastNativeCaptureDiagnostics : null;
  const diagnosticsPath = (macDiagnostics == null ? void 0 : macDiagnostics.outputPath) ?? null;
  const candidatePath = nativeCaptureTargetPath ?? diagnosticsPath;
  const systemAudioPath = nativeCaptureSystemAudioPath ?? (macDiagnostics == null ? void 0 : macDiagnostics.systemAudioPath) ?? null;
  const microphonePath = nativeCaptureMicrophonePath ?? (macDiagnostics == null ? void 0 : macDiagnostics.microphonePath) ?? null;
  if (!candidatePath) {
    return null;
  }
  try {
    if (systemAudioPath || microphonePath) {
      try {
        await muxNativeMacRecordingWithAudio(
          candidatePath,
          systemAudioPath,
          microphonePath
        );
      } catch (muxError) {
        console.warn("Failed to mux audio during recovery:", muxError);
      }
    }
    return await finalizeStoredVideo(candidatePath);
  } catch (error2) {
    recordNativeCaptureDiagnostics({
      backend: "mac-screencapturekit",
      phase: "stop",
      outputPath: candidatePath,
      systemAudioPath,
      microphonePath,
      processOutput: nativeCaptureOutputBuffer.trim() || void 0,
      fileSizeBytes: await getFileSizeIfPresent(candidatePath),
      error: String(error2)
    });
    return null;
  }
}
const WINDOWS_MIC_CAPTURE_INIT_WARNING = "WARNING: Failed to initialize WASAPI mic capture";
function shouldUseWindowsBrowserMicrophoneFallback(captureOutput, options) {
  return Boolean(options == null ? void 0 : options.capturesMicrophone) && captureOutput.includes(WINDOWS_MIC_CAPTURE_INIT_WARNING);
}
const execFileAsync$1 = node_util.promisify(node_child_process.execFile);
async function getSystemCursorAssets() {
  if (process.platform !== "darwin") {
    setCachedSystemCursorAssets({});
    setCachedSystemCursorAssetsSourceMtimeMs(null);
    return cachedSystemCursorAssets ?? {};
  }
  const sourcePath = getSystemCursorHelperSourcePath();
  const sourceStat = await fs$k.stat(sourcePath);
  if (cachedSystemCursorAssets && cachedSystemCursorAssetsSourceMtimeMs === sourceStat.mtimeMs) {
    return cachedSystemCursorAssets;
  }
  const binaryPath = await ensureSwiftHelperBinary(
    sourcePath,
    getSystemCursorHelperBinaryPath(),
    "system cursor helper",
    "recordly-system-cursors"
  );
  const { stdout } = await execFileAsync$1(binaryPath, [], {
    timeout: 15e3,
    maxBuffer: 20 * 1024 * 1024
  });
  const parsed = JSON.parse(stdout);
  const result = Object.fromEntries(
    Object.entries(parsed).filter(
      ([, asset]) => typeof (asset == null ? void 0 : asset.dataUrl) === "string" && typeof (asset == null ? void 0 : asset.hotspotX) === "number" && typeof (asset == null ? void 0 : asset.hotspotY) === "number" && typeof (asset == null ? void 0 : asset.width) === "number" && typeof (asset == null ? void 0 : asset.height) === "number"
    )
  );
  setCachedSystemCursorAssets(result);
  setCachedSystemCursorAssetsSourceMtimeMs(sourceStat.mtimeMs);
  return result;
}
function normalizeDesktopSourceName$1(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
async function cleanupWindowsOrphanedMicAudioPath(filePath) {
  if (!filePath) {
    return;
  }
  await fs$k.rm(filePath, { force: true }).catch(() => void 0);
}
function registerRecordingHandlers(onRecordingStateChange) {
  require$$1.ipcMain.handle(
    "start-native-screen-recording",
    async (_, source, options) => {
      var _a2, _b2;
      if (process.platform === "win32") {
        const windowsCaptureAvailable = await isNativeWindowsCaptureAvailable();
        if (!windowsCaptureAvailable) {
          return {
            success: false,
            message: "Native Windows capture is not available on this system."
          };
        }
        if (windowsCaptureProcess && !windowsNativeCaptureActive) {
          try {
            windowsCaptureProcess.kill();
          } catch {
          }
          setWindowsCaptureProcess(null);
          setWindowsCaptureTargetPath(null);
          setWindowsCaptureStopRequested(false);
        }
        if (windowsCaptureProcess) {
          return {
            success: false,
            message: "A native Windows screen recording is already active."
          };
        }
        let wcProc = null;
        try {
          const exePath = getWindowsCaptureExePath();
          const recordingsDir = await getRecordingsDir();
          const timestamp2 = Date.now();
          const outputPath = path$m.join(recordingsDir, `recording-${timestamp2}.mp4`);
          let captureOutput = "";
          let systemAudioPath = null;
          let microphonePath = null;
          let orphanedMicAudioPath = null;
          const resolvedDisplay = resolveWindowsCaptureDisplay(
            source,
            getScreen$1().getAllDisplays(),
            getScreen$1().getPrimaryDisplay()
          );
          const displayBounds = resolvedDisplay.bounds;
          setWindowsOrphanedMicAudioPath(null);
          const config = {
            outputPath,
            fps: 60,
            displayId: resolvedDisplay.displayId,
            displayX: Math.round(resolvedDisplay.bounds.x),
            displayY: Math.round(resolvedDisplay.bounds.y),
            displayW: Math.round(resolvedDisplay.bounds.width),
            displayH: Math.round(resolvedDisplay.bounds.height)
          };
          if (options == null ? void 0 : options.capturesSystemAudio) {
            systemAudioPath = path$m.join(
              recordingsDir,
              `recording-${timestamp2}.system.wav`
            );
            config.captureSystemAudio = true;
            config.audioOutputPath = systemAudioPath;
            setWindowsSystemAudioPath(systemAudioPath);
          }
          if (options == null ? void 0 : options.capturesMicrophone) {
            microphonePath = path$m.join(recordingsDir, `recording-${timestamp2}.mic.wav`);
            config.captureMic = true;
            config.micOutputPath = microphonePath;
            if (options.microphoneLabel) {
              config.micDeviceName = options.microphoneLabel;
            }
            setWindowsMicAudioPath(microphonePath);
          }
          recordNativeCaptureDiagnostics({
            backend: "windows-wgc",
            phase: "start",
            sourceId: (source == null ? void 0 : source.id) ?? null,
            sourceType: (source == null ? void 0 : source.sourceType) ?? "unknown",
            displayId: typeof config.displayId === "number" ? config.displayId : null,
            displayBounds,
            windowHandle: typeof config.windowHandle === "number" ? config.windowHandle : null,
            helperPath: exePath,
            outputPath,
            systemAudioPath,
            microphonePath
          });
          setWindowsCaptureOutputBuffer("");
          setWindowsCaptureTargetPath(outputPath);
          setWindowsCaptureStopRequested(false);
          setWindowsCapturePaused(false);
          wcProc = node_child_process.spawn(exePath, [JSON.stringify(config)], {
            cwd: recordingsDir,
            stdio: ["pipe", "pipe", "pipe"]
          });
          setWindowsCaptureProcess(wcProc);
          attachWindowsCaptureLifecycle(wcProc);
          wcProc.stdout.on("data", (chunk) => {
            captureOutput += chunk.toString();
            setWindowsCaptureOutputBuffer(captureOutput);
          });
          wcProc.stderr.on("data", (chunk) => {
            captureOutput += chunk.toString();
            setWindowsCaptureOutputBuffer(captureOutput);
          });
          await waitForWindowsCaptureStart(wcProc);
          const microphoneFallbackRequired = shouldUseWindowsBrowserMicrophoneFallback(
            captureOutput,
            options
          );
          if (microphoneFallbackRequired) {
            orphanedMicAudioPath = microphonePath;
            setWindowsOrphanedMicAudioPath(orphanedMicAudioPath);
            microphonePath = null;
            setWindowsMicAudioPath(null);
          }
          setWindowsNativeCaptureActive(true);
          setNativeScreenRecordingActive(true);
          recordNativeCaptureDiagnostics({
            backend: "windows-wgc",
            phase: "start",
            sourceId: (source == null ? void 0 : source.id) ?? null,
            sourceType: (source == null ? void 0 : source.sourceType) ?? "unknown",
            displayId: typeof config.displayId === "number" ? config.displayId : null,
            displayBounds,
            windowHandle: typeof config.windowHandle === "number" ? config.windowHandle : null,
            helperPath: exePath,
            outputPath,
            systemAudioPath,
            microphonePath,
            processOutput: captureOutput.trim() || void 0
          });
          return { success: true, microphoneFallbackRequired };
        } catch (error2) {
          recordNativeCaptureDiagnostics({
            backend: "windows-wgc",
            phase: "start",
            sourceId: (source == null ? void 0 : source.id) ?? null,
            sourceType: (source == null ? void 0 : source.sourceType) ?? "unknown",
            helperPath: windowsCaptureTargetPath ? getWindowsCaptureExePath() : null,
            outputPath: windowsCaptureTargetPath,
            systemAudioPath: windowsSystemAudioPath,
            microphonePath: windowsMicAudioPath,
            processOutput: windowsCaptureOutputBuffer.trim() || void 0,
            error: String(error2)
          });
          console.error("Failed to start native Windows capture:", error2);
          try {
            if (wcProc) wcProc.kill();
          } catch {
          }
          setWindowsNativeCaptureActive(false);
          setNativeScreenRecordingActive(false);
          setWindowsCaptureProcess(null);
          setWindowsCaptureTargetPath(null);
          setWindowsCaptureStopRequested(false);
          setWindowsCapturePaused(false);
          return {
            success: false,
            message: "Failed to start native Windows capture",
            error: String(error2)
          };
        }
      }
      if (process.platform !== "darwin") {
        return {
          success: false,
          message: "Native screen recording is only available on macOS."
        };
      }
      if (nativeCaptureProcess && !nativeScreenRecordingActive) {
        try {
          nativeCaptureProcess.kill();
        } catch {
        }
        setNativeCaptureProcess(null);
        setNativeCaptureTargetPath(null);
        setNativeCaptureStopRequested(false);
      }
      if (nativeCaptureProcess) {
        return { success: false, message: "A native screen recording is already active." };
      }
      let captProc = null;
      try {
        const recordingsDir = await getRecordingsDir();
        try {
          await require$$1.desktopCapturer.getSources({
            types: ["screen"],
            thumbnailSize: { width: 1, height: 1 }
          });
        } catch {
        }
        if (options == null ? void 0 : options.capturesMicrophone) {
          const micStatus = require$$1.systemPreferences.getMediaAccessStatus("microphone");
          if (micStatus !== "granted") {
            await require$$1.systemPreferences.askForMediaAccess("microphone");
          }
        }
        const appName = normalizeDesktopSourceName$1(String((source == null ? void 0 : source.appName) ?? ""));
        const ownAppName = normalizeDesktopSourceName$1(require$$1.app.getName());
        if (!ALLOW_RECORDLY_WINDOW_CAPTURE && ((_a2 = source == null ? void 0 : source.id) == null ? void 0 : _a2.startsWith("window:")) && appName && (appName === ownAppName || appName === "recordly")) {
          return {
            success: false,
            message: "Cannot record Recordly windows. Please select another app window."
          };
        }
        const helperPath = await ensureNativeCaptureHelperBinary();
        const timestamp2 = Date.now();
        const outputPath = path$m.join(recordingsDir, `recording-${timestamp2}.mp4`);
        const capturesSystemAudio = Boolean(options == null ? void 0 : options.capturesSystemAudio);
        const capturesMicrophone = Boolean(options == null ? void 0 : options.capturesMicrophone);
        const systemAudioOutputPath = capturesSystemAudio ? path$m.join(recordingsDir, `recording-${timestamp2}.system.m4a`) : null;
        const microphoneOutputPath = capturesMicrophone ? path$m.join(recordingsDir, `recording-${timestamp2}.mic.m4a`) : null;
        const config = {
          fps: 60,
          outputPath,
          capturesSystemAudio,
          capturesMicrophone
        };
        if (options == null ? void 0 : options.microphoneDeviceId) {
          config.microphoneDeviceId = options.microphoneDeviceId;
        }
        if (options == null ? void 0 : options.microphoneLabel) {
          config.microphoneLabel = options.microphoneLabel;
        }
        if (systemAudioOutputPath) {
          config.systemAudioOutputPath = systemAudioOutputPath;
        }
        if (microphoneOutputPath) {
          config.microphoneOutputPath = microphoneOutputPath;
        }
        const windowId = parseWindowId(source == null ? void 0 : source.id);
        const screenId = Number(source == null ? void 0 : source.display_id);
        if (Number.isFinite(windowId) && windowId && ((_b2 = source == null ? void 0 : source.id) == null ? void 0 : _b2.startsWith("window:"))) {
          config.windowId = windowId;
        } else if (Number.isFinite(screenId) && screenId > 0) {
          config.displayId = screenId;
        } else {
          config.displayId = Number(getScreen$1().getPrimaryDisplay().id);
        }
        setNativeCaptureOutputBuffer("");
        setNativeCaptureTargetPath(outputPath);
        setNativeCaptureSystemAudioPath(systemAudioOutputPath);
        setNativeCaptureMicrophonePath(microphoneOutputPath);
        setNativeCaptureStopRequested(false);
        setNativeCapturePaused(false);
        captProc = node_child_process.spawn(helperPath, [JSON.stringify(config)], {
          cwd: recordingsDir,
          stdio: ["pipe", "pipe", "pipe"]
        });
        setNativeCaptureProcess(captProc);
        attachNativeCaptureLifecycle(captProc);
        captProc.stdout.on("data", (chunk) => {
          setNativeCaptureOutputBuffer(nativeCaptureOutputBuffer + chunk.toString());
        });
        captProc.stderr.on("data", (chunk) => {
          setNativeCaptureOutputBuffer(nativeCaptureOutputBuffer + chunk.toString());
        });
        await waitForNativeCaptureStart(captProc);
        setNativeScreenRecordingActive(true);
        const micUnavailableNatively = nativeCaptureOutputBuffer.includes(
          "MICROPHONE_CAPTURE_UNAVAILABLE"
        );
        if (micUnavailableNatively) {
          setNativeCaptureMicrophonePath(null);
        }
        recordNativeCaptureDiagnostics({
          backend: "mac-screencapturekit",
          phase: "start",
          sourceId: (source == null ? void 0 : source.id) ?? null,
          sourceType: (source == null ? void 0 : source.sourceType) ?? "unknown",
          displayId: typeof config.displayId === "number" ? config.displayId : null,
          helperPath,
          outputPath,
          systemAudioPath: systemAudioOutputPath,
          microphonePath: nativeCaptureMicrophonePath,
          processOutput: nativeCaptureOutputBuffer.trim() || void 0
        });
        return { success: true, microphoneFallbackRequired: micUnavailableNatively };
      } catch (error2) {
        console.error("Failed to start native ScreenCaptureKit recording:", error2);
        const errorStr = String(error2);
        if (errorStr.includes("declined TCC") || errorStr.includes("declined TCCs") || errorStr.includes("SCREEN_RECORDING_PERMISSION_DENIED")) {
          const { response } = await require$$1.dialog.showMessageBox({
            type: "warning",
            title: "Screen Recording Permission Required",
            message: "Recordly needs screen recording permission to capture your screen.",
            detail: "Please open System Settings > Privacy & Security > Screen Recording, make sure Recordly is toggled ON, then try recording again.",
            buttons: ["Open System Settings", "Cancel"],
            defaultId: 0,
            cancelId: 1
          });
          if (response === 0) {
            await require$$1.shell.openExternal(getMacPrivacySettingsUrl("screen"));
          }
          try {
            if (captProc) captProc.kill();
          } catch {
          }
          setNativeScreenRecordingActive(false);
          setNativeCaptureProcess(null);
          setNativeCaptureTargetPath(null);
          setNativeCaptureSystemAudioPath(null);
          setNativeCaptureMicrophonePath(null);
          setNativeCaptureStopRequested(false);
          setNativeCapturePaused(false);
          return {
            success: false,
            message: "Screen recording permission not granted. Please allow access in System Settings and restart the app.",
            userNotified: true
          };
        }
        if (errorStr.includes("MICROPHONE_PERMISSION_DENIED")) {
          const { response } = await require$$1.dialog.showMessageBox({
            type: "warning",
            title: "Microphone Permission Required",
            message: "Recordly needs microphone permission to record audio.",
            detail: "Please open System Settings > Privacy & Security > Microphone, make sure Recordly is toggled ON, then try recording again.",
            buttons: ["Open System Settings", "Cancel"],
            defaultId: 0,
            cancelId: 1
          });
          if (response === 0) {
            await require$$1.shell.openExternal(getMacPrivacySettingsUrl("microphone"));
          }
          try {
            if (captProc) captProc.kill();
          } catch {
          }
          setNativeScreenRecordingActive(false);
          setNativeCaptureProcess(null);
          setNativeCaptureTargetPath(null);
          setNativeCaptureSystemAudioPath(null);
          setNativeCaptureMicrophonePath(null);
          setNativeCaptureStopRequested(false);
          setNativeCapturePaused(false);
          return {
            success: false,
            message: "Microphone permission not granted. Please allow access in System Settings.",
            userNotified: true
          };
        }
        recordNativeCaptureDiagnostics({
          backend: "mac-screencapturekit",
          phase: "start",
          sourceId: (source == null ? void 0 : source.id) ?? null,
          sourceType: (source == null ? void 0 : source.sourceType) ?? "unknown",
          helperPath: getNativeCaptureHelperBinaryPath(),
          outputPath: nativeCaptureTargetPath,
          systemAudioPath: nativeCaptureSystemAudioPath,
          microphonePath: nativeCaptureMicrophonePath,
          processOutput: nativeCaptureOutputBuffer.trim() || void 0,
          fileSizeBytes: await getFileSizeIfPresent(nativeCaptureTargetPath),
          error: String(error2)
        });
        try {
          if (captProc) captProc.kill();
        } catch {
        }
        setNativeScreenRecordingActive(false);
        setNativeCaptureProcess(null);
        setNativeCaptureTargetPath(null);
        setNativeCaptureSystemAudioPath(null);
        setNativeCaptureMicrophonePath(null);
        setNativeCaptureStopRequested(false);
        setNativeCapturePaused(false);
        return {
          success: false,
          message: "Failed to start native ScreenCaptureKit recording",
          error: String(error2)
        };
      }
    }
  );
  require$$1.ipcMain.handle("stop-native-screen-recording", async () => {
    if (process.platform === "win32" && windowsNativeCaptureActive) {
      try {
        if (!windowsCaptureProcess) {
          throw new Error("Native Windows capture process is not running");
        }
        const proc = windowsCaptureProcess;
        const preferredVideoPath = windowsCaptureTargetPath;
        const preferredOrphanedMicAudioPath = windowsOrphanedMicAudioPath;
        setWindowsCaptureStopRequested(true);
        proc.stdin.write("stop\n");
        const tempVideoPath = await waitForWindowsCaptureStop(proc);
        const finalVideoPath = preferredVideoPath ?? tempVideoPath;
        if (tempVideoPath !== finalVideoPath) {
          await moveFileWithOverwrite(tempVideoPath, finalVideoPath);
        }
        const validation = await validateRecordedVideo(finalVideoPath);
        setWindowsCaptureProcess(null);
        setWindowsNativeCaptureActive(false);
        setNativeScreenRecordingActive(false);
        setWindowsCaptureTargetPath(null);
        setWindowsCaptureStopRequested(false);
        setWindowsCapturePaused(false);
        setWindowsOrphanedMicAudioPath(null);
        await cleanupWindowsOrphanedMicAudioPath(preferredOrphanedMicAudioPath);
        setWindowsPendingVideoPath(finalVideoPath);
        recordNativeCaptureDiagnostics({
          backend: "windows-wgc",
          phase: "stop",
          outputPath: finalVideoPath,
          systemAudioPath: windowsSystemAudioPath,
          microphonePath: windowsMicAudioPath,
          processOutput: windowsCaptureOutputBuffer.trim() || void 0,
          fileSizeBytes: validation.fileSizeBytes
        });
        return { success: true, path: finalVideoPath };
      } catch (error2) {
        console.error("Failed to stop native Windows capture:", error2);
        const fallbackPath = windowsCaptureTargetPath;
        const fallbackOrphanedMicAudioPath = windowsOrphanedMicAudioPath;
        setWindowsNativeCaptureActive(false);
        setNativeScreenRecordingActive(false);
        setWindowsCaptureProcess(null);
        setWindowsCaptureTargetPath(null);
        setWindowsCaptureStopRequested(false);
        setWindowsCapturePaused(false);
        setWindowsSystemAudioPath(null);
        setWindowsMicAudioPath(null);
        setWindowsOrphanedMicAudioPath(null);
        setWindowsPendingVideoPath(null);
        await cleanupWindowsOrphanedMicAudioPath(fallbackOrphanedMicAudioPath);
        if (fallbackPath) {
          try {
            await fs$k.access(fallbackPath);
            const validation = await validateRecordedVideo(fallbackPath);
            setWindowsPendingVideoPath(fallbackPath);
            recordNativeCaptureDiagnostics({
              backend: "windows-wgc",
              phase: "stop",
              outputPath: fallbackPath,
              systemAudioPath: windowsSystemAudioPath,
              microphonePath: windowsMicAudioPath,
              processOutput: windowsCaptureOutputBuffer.trim() || void 0,
              fileSizeBytes: validation.fileSizeBytes,
              error: String(error2)
            });
            return { success: true, path: fallbackPath };
          } catch {
          }
        }
        recordNativeCaptureDiagnostics({
          backend: "windows-wgc",
          phase: "stop",
          outputPath: fallbackPath,
          systemAudioPath: windowsSystemAudioPath,
          microphonePath: windowsMicAudioPath,
          processOutput: windowsCaptureOutputBuffer.trim() || void 0,
          fileSizeBytes: await getFileSizeIfPresent(fallbackPath),
          error: String(error2)
        });
        return {
          success: false,
          message: "Failed to stop native Windows capture",
          error: String(error2)
        };
      }
    }
    if (process.platform !== "darwin") {
      return {
        success: false,
        message: "Native screen recording is only available on macOS."
      };
    }
    if (!nativeScreenRecordingActive) {
      const recovered = await recoverNativeMacCaptureOutput();
      if (recovered) {
        return recovered;
      }
      return { success: false, message: "No native screen recording is active." };
    }
    try {
      if (!nativeCaptureProcess) {
        throw new Error("Native capture helper process is not running");
      }
      const process2 = nativeCaptureProcess;
      const preferredVideoPath = nativeCaptureTargetPath;
      const preferredSystemAudioPath = nativeCaptureSystemAudioPath;
      const preferredMicrophonePath = nativeCaptureMicrophonePath;
      console.log(
        "[stop-native] Audio paths — system:",
        preferredSystemAudioPath,
        "mic:",
        preferredMicrophonePath
      );
      setNativeCaptureStopRequested(true);
      process2.stdin.write("stop\n");
      const tempVideoPath = await waitForNativeCaptureStop(process2);
      console.log("[stop-native] Helper stopped, tempVideoPath:", tempVideoPath);
      setNativeCaptureProcess(null);
      setNativeScreenRecordingActive(false);
      setNativeCaptureTargetPath(null);
      setNativeCaptureSystemAudioPath(null);
      setNativeCaptureMicrophonePath(null);
      setNativeCaptureStopRequested(false);
      setNativeCapturePaused(false);
      const finalVideoPath = preferredVideoPath ?? tempVideoPath;
      if (tempVideoPath !== finalVideoPath) {
        await moveFileWithOverwrite(tempVideoPath, finalVideoPath);
      }
      if (preferredSystemAudioPath || preferredMicrophonePath) {
        console.log(
          "[stop-native] Attempting audio mux (merging separate tracks) into:",
          finalVideoPath
        );
        try {
          await muxNativeMacRecordingWithAudio(
            finalVideoPath,
            preferredSystemAudioPath,
            preferredMicrophonePath
          );
          console.log("[stop-native] Audio mux completed successfully");
        } catch (error2) {
          console.warn(
            "[stop-native] Audio mux failed (video still has inline audio):",
            error2
          );
        }
      } else {
        console.log("[stop-native] No separate audio tracks to mux");
      }
      return await finalizeStoredVideo(finalVideoPath);
    } catch (error2) {
      console.error("Failed to stop native ScreenCaptureKit recording:", error2);
      const fallbackPath = nativeCaptureTargetPath;
      const fallbackSystemAudioPath = nativeCaptureSystemAudioPath;
      const fallbackMicrophonePath = nativeCaptureMicrophonePath;
      const fallbackFileSizeBytes = await getFileSizeIfPresent(fallbackPath);
      setNativeScreenRecordingActive(false);
      setNativeCaptureProcess(null);
      setNativeCaptureTargetPath(null);
      setNativeCaptureSystemAudioPath(null);
      setNativeCaptureMicrophonePath(null);
      setNativeCaptureStopRequested(false);
      setNativeCapturePaused(false);
      recordNativeCaptureDiagnostics({
        backend: "mac-screencapturekit",
        phase: "stop",
        sourceId: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.sourceId) ?? null,
        sourceType: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.sourceType) ?? "unknown",
        displayId: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.displayId) ?? null,
        displayBounds: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.displayBounds) ?? null,
        windowHandle: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.windowHandle) ?? null,
        helperPath: (lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.helperPath) ?? null,
        outputPath: fallbackPath,
        systemAudioPath: fallbackSystemAudioPath,
        microphonePath: fallbackMicrophonePath,
        osRelease: lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.osRelease,
        supported: lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.supported,
        helperExists: lastNativeCaptureDiagnostics == null ? void 0 : lastNativeCaptureDiagnostics.helperExists,
        processOutput: nativeCaptureOutputBuffer.trim() || void 0,
        fileSizeBytes: fallbackFileSizeBytes,
        error: String(error2)
      });
      if (fallbackPath) {
        try {
          await fs$k.access(fallbackPath);
          console.log(
            "[stop-native-screen-recording] Recovering with fallback path:",
            fallbackPath
          );
          if (fallbackSystemAudioPath || fallbackMicrophonePath) {
            try {
              await muxNativeMacRecordingWithAudio(
                fallbackPath,
                fallbackSystemAudioPath,
                fallbackMicrophonePath
              );
            } catch (muxError) {
              console.warn(
                "Failed to mux recovered native macOS audio into capture:",
                muxError
              );
            }
          }
          return await finalizeStoredVideo(fallbackPath);
        } catch {
        }
      }
      const recovered = await recoverNativeMacCaptureOutput();
      if (recovered) {
        return recovered;
      }
      return {
        success: false,
        message: "Failed to stop native ScreenCaptureKit recording",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("recover-native-screen-recording", async () => {
    if (process.platform !== "darwin") {
      return {
        success: false,
        message: "Native screen recording recovery is only available on macOS."
      };
    }
    const recovered = await recoverNativeMacCaptureOutput();
    if (recovered) {
      return recovered;
    }
    return {
      success: false,
      message: "No recoverable native macOS recording output was found."
    };
  });
  require$$1.ipcMain.handle("pause-native-screen-recording", async () => {
    if (process.platform === "win32") {
      if (!windowsNativeCaptureActive || !windowsCaptureProcess) {
        return { success: false, message: "No native Windows screen recording is active." };
      }
      if (windowsCapturePaused) {
        return { success: true };
      }
      try {
        windowsCaptureProcess.stdin.write("pause\n");
        setWindowsCapturePaused(true);
        return { success: true };
      } catch (error2) {
        return {
          success: false,
          message: "Failed to pause native Windows capture",
          error: String(error2)
        };
      }
    }
    if (process.platform !== "darwin") {
      return {
        success: false,
        message: "Native screen recording is only available on macOS."
      };
    }
    if (!nativeScreenRecordingActive || !nativeCaptureProcess) {
      return { success: false, message: "No native screen recording is active." };
    }
    if (nativeCapturePaused) {
      return { success: true };
    }
    try {
      nativeCaptureProcess.stdin.write("pause\n");
      setNativeCapturePaused(true);
      return { success: true };
    } catch (error2) {
      return {
        success: false,
        message: "Failed to pause native screen recording",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("resume-native-screen-recording", async () => {
    if (process.platform === "win32") {
      if (!windowsNativeCaptureActive || !windowsCaptureProcess) {
        return { success: false, message: "No native Windows screen recording is active." };
      }
      if (!windowsCapturePaused) {
        return { success: true };
      }
      try {
        windowsCaptureProcess.stdin.write("resume\n");
        setWindowsCapturePaused(false);
        return { success: true };
      } catch (error2) {
        return {
          success: false,
          message: "Failed to resume native Windows capture",
          error: String(error2)
        };
      }
    }
    if (process.platform !== "darwin") {
      return {
        success: false,
        message: "Native screen recording is only available on macOS."
      };
    }
    if (!nativeScreenRecordingActive || !nativeCaptureProcess) {
      return { success: false, message: "No native screen recording is active." };
    }
    if (!nativeCapturePaused) {
      return { success: true };
    }
    try {
      nativeCaptureProcess.stdin.write("resume\n");
      setNativeCapturePaused(false);
      return { success: true };
    } catch (error2) {
      return {
        success: false,
        message: "Failed to resume native screen recording",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("get-system-cursor-assets", async () => {
    try {
      return { success: true, cursors: await getSystemCursorAssets() };
    } catch (error2) {
      console.error("Failed to load system cursor assets:", error2);
      return { success: false, cursors: {}, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("is-native-windows-capture-available", async () => {
    return { available: await isNativeWindowsCaptureAvailable() };
  });
  require$$1.ipcMain.handle("get-last-native-capture-diagnostics", async () => {
    return { success: true, diagnostics: lastNativeCaptureDiagnostics };
  });
  require$$1.ipcMain.handle("get-video-audio-fallback-paths", async (_event, videoPath) => {
    if (!videoPath) {
      return { success: true, paths: [], startDelayMsByPath: {} };
    }
    try {
      const { paths, startDelayMsByPath } = await getCompanionAudioFallbackInfo(videoPath);
      await Promise.all([
        rememberApprovedLocalReadPath(videoPath),
        ...paths.map((fallbackPath) => rememberApprovedLocalReadPath(fallbackPath))
      ]);
      return { success: true, paths, startDelayMsByPath };
    } catch (error2) {
      console.error("Failed to resolve companion audio fallback paths:", error2);
      return { success: false, paths: [], startDelayMsByPath: {}, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle(
    "mux-native-windows-recording",
    async (_event, pauseSegments) => {
      const videoPath = windowsPendingVideoPath;
      const orphanedMicAudioPath = windowsOrphanedMicAudioPath;
      setWindowsPendingVideoPath(null);
      setWindowsOrphanedMicAudioPath(null);
      if (!videoPath) {
        return { success: false, message: "No native Windows video pending for mux" };
      }
      try {
        if (windowsSystemAudioPath || windowsMicAudioPath) {
          await muxNativeWindowsVideoWithAudio(
            videoPath,
            windowsSystemAudioPath,
            windowsMicAudioPath,
            pauseSegments ?? []
          );
          setWindowsSystemAudioPath(null);
          setWindowsMicAudioPath(null);
        }
        recordNativeCaptureDiagnostics({
          backend: "windows-wgc",
          phase: "mux",
          outputPath: videoPath,
          fileSizeBytes: await getFileSizeIfPresent(videoPath)
        });
        await cleanupWindowsOrphanedMicAudioPath(orphanedMicAudioPath);
        return await finalizeStoredVideo(videoPath);
      } catch (error2) {
        console.error("Failed to mux native Windows recording:", error2);
        recordNativeCaptureDiagnostics({
          backend: "windows-wgc",
          phase: "mux",
          outputPath: videoPath,
          systemAudioPath: windowsSystemAudioPath,
          microphonePath: windowsMicAudioPath,
          fileSizeBytes: await getFileSizeIfPresent(videoPath),
          error: String(error2)
        });
        setWindowsSystemAudioPath(null);
        setWindowsMicAudioPath(null);
        await cleanupWindowsOrphanedMicAudioPath(orphanedMicAudioPath);
        try {
          return await finalizeStoredVideo(videoPath);
        } catch {
          return {
            success: false,
            message: "Failed to mux native Windows recording",
            error: String(error2)
          };
        }
      }
    }
  );
  require$$1.ipcMain.handle("start-ffmpeg-recording", async (_, source) => {
    if (ffmpegCaptureProcess) {
      return { success: false, message: "An FFmpeg recording is already active." };
    }
    try {
      const recordingsDir = await getRecordingsDir();
      const ffmpegPath = getFfmpegBinaryPath();
      const outputPath = path$m.join(recordingsDir, `recording-${Date.now()}.mp4`);
      const args = await buildFfmpegCaptureArgs(source, outputPath);
      setFfmpegCaptureOutputBuffer("");
      setFfmpegCaptureTargetPath(outputPath);
      const ffProc = node_child_process.spawn(ffmpegPath, args, {
        cwd: recordingsDir,
        stdio: ["pipe", "pipe", "pipe"]
      });
      setFfmpegCaptureProcess(ffProc);
      ffProc.stdout.on("data", (chunk) => {
        setFfmpegCaptureOutputBuffer(ffmpegCaptureOutputBuffer + chunk.toString());
      });
      ffProc.stderr.on("data", (chunk) => {
        setFfmpegCaptureOutputBuffer(ffmpegCaptureOutputBuffer + chunk.toString());
      });
      await waitForFfmpegCaptureStart(ffProc);
      setFfmpegScreenRecordingActive(true);
      return { success: true };
    } catch (error2) {
      console.error("Failed to start FFmpeg recording:", error2);
      setFfmpegScreenRecordingActive(false);
      setFfmpegCaptureProcess(null);
      setFfmpegCaptureTargetPath(null);
      return {
        success: false,
        message: "Failed to start FFmpeg recording",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("stop-ffmpeg-recording", async () => {
    if (!ffmpegScreenRecordingActive) {
      return { success: false, message: "No FFmpeg recording is active." };
    }
    try {
      if (!ffmpegCaptureProcess || !ffmpegCaptureTargetPath) {
        throw new Error("FFmpeg process is not running");
      }
      const process2 = ffmpegCaptureProcess;
      const outputPath = ffmpegCaptureTargetPath;
      process2.stdin.write("q\n");
      const finalVideoPath = await waitForFfmpegCaptureStop(process2, outputPath);
      setFfmpegCaptureProcess(null);
      setFfmpegCaptureTargetPath(null);
      setFfmpegScreenRecordingActive(false);
      return await finalizeStoredVideo(finalVideoPath);
    } catch (error2) {
      console.error("Failed to stop FFmpeg recording:", error2);
      try {
        ffmpegCaptureProcess == null ? void 0 : ffmpegCaptureProcess.kill();
      } catch {
      }
      setFfmpegCaptureProcess(null);
      setFfmpegCaptureTargetPath(null);
      setFfmpegScreenRecordingActive(false);
      return {
        success: false,
        message: "Failed to stop FFmpeg recording",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle(
    "store-microphone-sidecar",
    async (_, audioData, videoPath, options) => {
      try {
        const baseName = videoPath.replace(/\.[^.]+$/, "");
        const sidecarPath = `${baseName}.mic.webm`;
        await fs$k.writeFile(sidecarPath, Buffer.from(audioData));
        const startDelayMs = options == null ? void 0 : options.startDelayMs;
        if (Number.isFinite(startDelayMs) && (startDelayMs ?? 0) >= 0) {
          try {
            await fs$k.writeFile(
              `${sidecarPath}.json`,
              JSON.stringify({ startDelayMs: Math.round(startDelayMs ?? 0) })
            );
          } catch (metadataError) {
            console.warn(
              "Failed to store microphone sidecar timing metadata:",
              metadataError
            );
          }
        }
        return { success: true, path: sidecarPath };
      } catch (error2) {
        console.error("Failed to store microphone sidecar:", error2);
        return { success: false, error: String(error2) };
      }
    }
  );
  require$$1.ipcMain.handle("store-recorded-video", async (_, videoData, fileName) => {
    try {
      const recordingsDir = await getRecordingsDir();
      const videoPath = path$m.join(recordingsDir, fileName);
      await fs$k.writeFile(videoPath, Buffer.from(videoData));
      return await finalizeStoredVideo(videoPath);
    } catch (error2) {
      console.error("Failed to store video:", error2);
      return {
        success: false,
        message: "Failed to store video",
        error: String(error2)
      };
    }
  });
  require$$1.ipcMain.handle("get-recorded-video-path", async () => {
    try {
      const recordingsDir = await getRecordingsDir();
      const entries = await fs$k.readdir(recordingsDir, { withFileTypes: true });
      const candidates = await Promise.all(
        entries.filter(
          (entry) => entry.isFile() && /^recording-\d+\.(webm|mov|mp4)$/i.test(entry.name)
        ).map(async (entry) => {
          const fullPath = path$m.join(recordingsDir, entry.name);
          const stat2 = await fs$k.stat(fullPath).catch(() => null);
          return stat2 ? { path: fullPath, mtimeMs: stat2.mtimeMs } : null;
        })
      );
      const sortedCandidates = candidates.filter(
        (candidate) => candidate !== null
      ).sort((left, right) => right.mtimeMs - left.mtimeMs);
      for (const candidate of sortedCandidates) {
        try {
          await validateRecordedVideo(candidate.path);
          return { success: true, path: candidate.path };
        } catch (error2) {
          console.warn(
            "Skipping unusable recovered recording candidate:",
            candidate.path,
            error2
          );
        }
      }
      if (sortedCandidates.length === 0) {
        return { success: false, message: "No recorded video found" };
      }
      return { success: false, message: "No usable recorded video found" };
    } catch (error2) {
      console.error("Failed to get video path:", error2);
      return { success: false, message: "Failed to get video path", error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("set-recording-state", (_, recording) => {
    if (recording) {
      stopCursorCapture();
      stopInteractionCapture();
      startWindowBoundsCapture();
      void startNativeCursorMonitor();
      setIsCursorCaptureActive(true);
      setActiveCursorSamples([]);
      setPendingCursorSamples([]);
      setCursorCaptureStartTimeMs(Date.now());
      resetCursorCaptureClock();
      setLinuxCursorScreenPoint(null);
      setLastLeftClick(null);
      sampleCursorPoint();
      startCursorSampling();
      void startInteractionCapture();
    } else {
      setIsCursorCaptureActive(false);
      stopCursorCapture();
      stopInteractionCapture();
      stopWindowBoundsCapture();
      stopNativeCursorMonitor();
      showCursor();
      setLinuxCursorScreenPoint(null);
      resetCursorCaptureClock();
      snapshotCursorTelemetryForPersistence();
      setActiveCursorSamples([]);
    }
    const source = selectedSource || { name: "Screen" };
    require$$1.BrowserWindow.getAllWindows().forEach((window2) => {
      if (!window2.isDestroyed()) {
        window2.webContents.send("recording-state-changed", {
          recording,
          sourceName: source.name
        });
      }
    });
    if (onRecordingStateChange) {
      onRecordingStateChange(recording, source.name);
    }
  });
  require$$1.ipcMain.handle("pause-cursor-capture", () => {
    sampleCursorPoint();
    pauseCursorCapture(Date.now());
    return { success: true };
  });
  require$$1.ipcMain.handle("resume-cursor-capture", () => {
    resumeCursorCapture(Date.now());
    sampleCursorPoint();
    return { success: true };
  });
  require$$1.ipcMain.handle("get-cursor-telemetry", async (_, videoPath) => {
    const targetVideoPath = normalizeVideoSourcePath(videoPath ?? currentVideoPath);
    if (!targetVideoPath) {
      return { success: true, samples: [] };
    }
    const telemetryPath = getTelemetryPathForVideo(targetVideoPath);
    try {
      const content = await fs$k.readFile(telemetryPath, "utf-8");
      const parsed = JSON.parse(content);
      const samples = normalizeCursorTelemetrySamples(parsed);
      return { success: true, samples };
    } catch (error2) {
      const nodeError = error2;
      if (nodeError.code === "ENOENT") {
        return { success: true, samples: [] };
      }
      console.error("Failed to load cursor telemetry:", error2);
      return {
        success: false,
        message: "Failed to load cursor telemetry",
        error: String(error2),
        samples: []
      };
    }
  });
  require$$1.ipcMain.handle(
    "set-cursor-telemetry",
    async (_, videoPath, samples) => {
      const targetVideoPath = normalizeVideoSourcePath(videoPath ?? currentVideoPath);
      if (!targetVideoPath) {
        return {
          success: false,
          samples: [],
          message: "No video path available for cursor telemetry",
          error: "Missing video path"
        };
      }
      try {
        const normalizedSamples = await writeCursorTelemetry(targetVideoPath, samples);
        return { success: true, samples: normalizedSamples };
      } catch (error2) {
        console.error("Failed to save cursor telemetry:", error2);
        return {
          success: false,
          samples: [],
          message: "Failed to save cursor telemetry",
          error: String(error2)
        };
      }
    }
  );
}
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};
let packagedRendererBaseUrl = null;
let packagedRendererServerStartPromise = null;
function getContentType(filePath) {
  return MIME_TYPES[path$m.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function resolveRequestedFilePath(rootDir, requestPathname) {
  const trimmedPathname = requestPathname === "/" ? "/index.html" : requestPathname;
  const normalizedPosix = path$m.posix.normalize(decodeURIComponent(trimmedPathname));
  const relativePath = normalizedPosix.replace(/^\/+/, "");
  if (!relativePath) {
    return null;
  }
  const resolvedRootDir = path$m.resolve(rootDir);
  const resolvedFilePath = path$m.resolve(resolvedRootDir, relativePath);
  if (resolvedFilePath !== resolvedRootDir && !resolvedFilePath.startsWith(`${resolvedRootDir}${path$m.sep}`)) {
    return null;
  }
  return resolvedFilePath;
}
async function servePackagedRendererRequest(rootDir, request, response) {
  try {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const resolvedFilePath = resolveRequestedFilePath(rootDir, requestUrl.pathname);
    if (!resolvedFilePath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }
    const filePath = resolvedFilePath;
    const fileContents = await fs$k.readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": getContentType(filePath)
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    response.end(fileContents);
  } catch (error2) {
    if ((error2 == null ? void 0 : error2.code) === "ENOENT") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
}
function getPackagedRendererBaseUrl() {
  return packagedRendererBaseUrl;
}
async function ensurePackagedRendererServer(rootDir) {
  if (packagedRendererBaseUrl) {
    return packagedRendererBaseUrl;
  }
  if (packagedRendererServerStartPromise) {
    return packagedRendererServerStartPromise;
  }
  packagedRendererServerStartPromise = new Promise((resolve, reject) => {
    const server = node_http.createServer((request, response) => {
      void servePackagedRendererRequest(rootDir, request, response);
    });
    server.once("error", (error2) => {
      reject(error2);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Renderer server did not expose a TCP address"));
        return;
      }
      packagedRendererBaseUrl = `http://127.0.0.1:${address.port}`;
      resolve(packagedRendererBaseUrl);
    });
  });
  try {
    return await packagedRendererServerStartPromise;
  } finally {
    packagedRendererServerStartPromise = null;
  }
}
const __dirname$2 = path$m.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href));
const nodeRequire = node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href);
const APP_ROOT = path$m.join(__dirname$2, "..");
const VITE_DEV_SERVER_URL$1 = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST$1 = path$m.join(APP_ROOT, "dist");
const WINDOW_ICON_PATH = path$m.join(
  process.env.VITE_PUBLIC || RENDERER_DIST$1,
  "app-icons",
  "recordly-512.png"
);
let hudOverlayWindow = null;
let hudOverlayHiddenFromCapture = true;
let hudOverlayCaptureProtectionLoaded = false;
let countdownWindow = null;
let updateToastWindow = null;
const HUD_OVERLAY_SETTINGS_FILE = path$m.join(USER_DATA_PATH, "hud-overlay-settings.json");
const HUD_BOTTOM_CLEARANCE_CM = 3.5;
const DIP_PER_INCH = 96;
const CM_PER_INCH = 2.54;
const HUD_EDGE_MARGIN_DIP = 16;
const HUD_SHADOW_BLEED_DIP = 36;
const HUD_MIN_WINDOW_WIDTH = 560;
const HUD_COMPACT_HEIGHT = 96;
const HUD_MIN_EXPANDED_HEIGHT = 520 + HUD_SHADOW_BLEED_DIP;
const UPDATE_TOAST_WIDTH = 456;
const UPDATE_TOAST_HEIGHT = 252;
const UPDATE_TOAST_GAP_DIP = 18;
let hudOverlayExpanded = false;
let hudOverlayCompactWidth = HUD_MIN_WINDOW_WIDTH;
let hudOverlayCompactHeight = HUD_COMPACT_HEIGHT;
let hudOverlayExpandedHeight = HUD_MIN_EXPANDED_HEIGHT;
function getEditorWindowQuery() {
  const query = {
    windowType: "editor"
  };
  if (process.env.RECORDLY_SMOKE_EXPORT === "1") {
    query.smokeExport = "1";
    if (process.env.RECORDLY_SMOKE_EXPORT_INPUT) {
      query.smokeInput = process.env.RECORDLY_SMOKE_EXPORT_INPUT;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_OUTPUT) {
      query.smokeOutput = process.env.RECORDLY_SMOKE_EXPORT_OUTPUT;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_USE_NATIVE === "1") {
      query.smokeUseNativeExport = "1";
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_ENCODING_MODE) {
      query.smokeEncodingMode = process.env.RECORDLY_SMOKE_EXPORT_ENCODING_MODE;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_SHADOW_INTENSITY) {
      query.smokeShadowIntensity = process.env.RECORDLY_SMOKE_EXPORT_SHADOW_INTENSITY;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_INPUT) {
      query.smokeWebcamInput = process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_INPUT;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_SHADOW) {
      query.smokeWebcamShadow = process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_SHADOW;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_SIZE) {
      query.smokeWebcamSize = process.env.RECORDLY_SMOKE_EXPORT_WEBCAM_SIZE;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_PIPELINE) {
      query.smokePipelineModel = process.env.RECORDLY_SMOKE_EXPORT_PIPELINE;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_BACKEND) {
      query.smokeBackendPreference = process.env.RECORDLY_SMOKE_EXPORT_BACKEND;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_MAX_ENCODE_QUEUE) {
      query.smokeMaxEncodeQueue = process.env.RECORDLY_SMOKE_EXPORT_MAX_ENCODE_QUEUE;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_MAX_DECODE_QUEUE) {
      query.smokeMaxDecodeQueue = process.env.RECORDLY_SMOKE_EXPORT_MAX_DECODE_QUEUE;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_MAX_PENDING_FRAMES) {
      query.smokeMaxPendingFrames = process.env.RECORDLY_SMOKE_EXPORT_MAX_PENDING_FRAMES;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_PROJECT) {
      query.smokeProject = process.env.RECORDLY_SMOKE_EXPORT_PROJECT;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_QUALITY) {
      query.smokeQuality = process.env.RECORDLY_SMOKE_EXPORT_QUALITY;
    }
    if (process.env.RECORDLY_SMOKE_EXPORT_FPS) {
      query.smokeFps = process.env.RECORDLY_SMOKE_EXPORT_FPS;
    }
  }
  return query;
}
function isHudOverlayCaptureProtectionSupported() {
  return process.platform !== "linux";
}
function getWindowsBuildNumber() {
  if (process.platform !== "win32") {
    return null;
  }
  const build = Number.parseInt(os$1.release().split(".")[2] ?? "", 10);
  return Number.isFinite(build) ? build : null;
}
function isHudOverlayMousePassthroughSupported() {
  if (process.platform === "linux") {
    return false;
  }
  const build = getWindowsBuildNumber();
  if (build !== null && build < 22e3) {
    return false;
  }
  return true;
}
function loadHudOverlayCaptureProtectionSetting() {
  if (hudOverlayCaptureProtectionLoaded) {
    return hudOverlayHiddenFromCapture;
  }
  hudOverlayCaptureProtectionLoaded = true;
  try {
    if (!fs$j.existsSync(HUD_OVERLAY_SETTINGS_FILE)) {
      return hudOverlayHiddenFromCapture;
    }
    const raw = fs$j.readFileSync(HUD_OVERLAY_SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.hiddenFromCapture === "boolean") {
      hudOverlayHiddenFromCapture = parsed.hiddenFromCapture;
    }
  } catch {
  }
  return hudOverlayHiddenFromCapture;
}
function persistHudOverlayCaptureProtectionSetting(enabled) {
  try {
    fs$j.writeFileSync(
      HUD_OVERLAY_SETTINGS_FILE,
      JSON.stringify({ hiddenFromCapture: enabled }, null, 2),
      "utf-8"
    );
  } catch {
  }
}
function getScreen() {
  if (!require$$1.app.isReady()) {
    throw new Error(
      "getScreen() called before app is ready. Ensure all screen access happens after app.whenReady()."
    );
  }
  return nodeRequire("electron").screen;
}
function getHudOverlayDisplay() {
  const hudWindow = getHudOverlayWindow();
  if (hudWindow) {
    return getScreen().getDisplayMatching(hudWindow.getBounds());
  }
  return getScreen().getPrimaryDisplay();
}
function getHudOverlayBounds(expanded) {
  const { bounds, workArea } = getHudOverlayDisplay();
  const maxWindowWidth = Math.max(HUD_MIN_WINDOW_WIDTH, workArea.width - HUD_EDGE_MARGIN_DIP * 2);
  const windowWidth = Math.min(
    maxWindowWidth,
    Math.max(HUD_MIN_WINDOW_WIDTH, Math.round(hudOverlayCompactWidth))
  );
  const maxWindowHeight = Math.max(HUD_COMPACT_HEIGHT, workArea.height - HUD_EDGE_MARGIN_DIP * 2);
  const desiredHeight = expanded ? Math.max(HUD_MIN_EXPANDED_HEIGHT, Math.round(hudOverlayExpandedHeight)) : Math.max(HUD_COMPACT_HEIGHT, Math.round(hudOverlayCompactHeight));
  const windowHeight = Math.min(maxWindowHeight, desiredHeight);
  const bottomClearanceDip = Math.round(HUD_BOTTOM_CLEARANCE_CM / CM_PER_INCH * DIP_PER_INCH);
  const screenBottom = bounds.y + bounds.height;
  const workAreaBottom = workArea.y + workArea.height;
  const preferredBottom = screenBottom - bottomClearanceDip;
  const maximumSafeBottom = workAreaBottom - HUD_EDGE_MARGIN_DIP;
  const windowBottom = Math.min(preferredBottom, maximumSafeBottom);
  const x = Math.floor(workArea.x + (workArea.width - windowWidth) / 2);
  const y = Math.max(workArea.y + HUD_EDGE_MARGIN_DIP, Math.floor(windowBottom - windowHeight));
  return {
    x,
    y,
    width: windowWidth,
    height: windowHeight
  };
}
function applyHudOverlayBounds(expanded) {
  if (!hudOverlayWindow || hudOverlayWindow.isDestroyed()) {
    return;
  }
  hudOverlayExpanded = expanded;
  const computed = getHudOverlayBounds(expanded);
  if (hudUserPosition) {
    const { workArea } = getHudOverlayDisplay();
    const x = Math.max(
      workArea.x,
      Math.min(hudUserPosition.x, workArea.x + workArea.width - computed.width)
    );
    const y = Math.max(
      workArea.y,
      Math.min(hudUserPosition.y, workArea.y + workArea.height - computed.height)
    );
    hudOverlayWindow.setBounds({ x, y, width: computed.width, height: computed.height }, false);
  } else {
    hudOverlayWindow.setBounds(computed, false);
  }
  positionUpdateToastWindow();
  if (!hudOverlayWindow.isVisible()) {
    return;
  }
  hudOverlayWindow.moveTop();
}
function getUpdateToastBounds() {
  const hudWindow = getHudOverlayWindow();
  if (hudWindow) {
    const hudBounds = hudWindow.getBounds();
    const display = getScreen().getDisplayMatching(hudBounds);
    const x = Math.round(hudBounds.x + (hudBounds.width - UPDATE_TOAST_WIDTH) / 2);
    const y = Math.max(
      display.workArea.y + HUD_EDGE_MARGIN_DIP,
      hudBounds.y - UPDATE_TOAST_HEIGHT - UPDATE_TOAST_GAP_DIP
    );
    return {
      x,
      y,
      width: UPDATE_TOAST_WIDTH,
      height: UPDATE_TOAST_HEIGHT
    };
  }
  const primaryDisplay = getScreen().getPrimaryDisplay();
  const { workArea } = primaryDisplay;
  return {
    x: Math.round(workArea.x + (workArea.width - UPDATE_TOAST_WIDTH) / 2),
    y: workArea.y + HUD_EDGE_MARGIN_DIP,
    width: UPDATE_TOAST_WIDTH,
    height: UPDATE_TOAST_HEIGHT
  };
}
function positionUpdateToastWindow() {
  if (!updateToastWindow || updateToastWindow.isDestroyed()) {
    return;
  }
  updateToastWindow.setBounds(getUpdateToastBounds(), false);
  updateToastWindow.moveTop();
}
require$$1.ipcMain.on("hud-overlay-set-ignore-mouse", (_event, ignore) => {
  if (hudOverlayWindow && !hudOverlayWindow.isDestroyed()) {
    if (!isHudOverlayMousePassthroughSupported()) {
      hudOverlayWindow.setIgnoreMouseEvents(false);
      return;
    }
    if (ignore) {
      hudOverlayWindow.setIgnoreMouseEvents(true, { forward: true });
      return;
    }
    hudOverlayWindow.setIgnoreMouseEvents(false);
  }
});
let hudUserPosition = null;
let hudDragOffset = null;
let hudDragLastCursor = null;
let hudDragFixedSize = null;
require$$1.ipcMain.on("hud-overlay-drag", (_event, phase, screenX, screenY) => {
  if (!hudOverlayWindow || hudOverlayWindow.isDestroyed()) return;
  if (process.platform === "linux") {
    return;
  }
  if (phase === "start") {
    const bounds = hudOverlayWindow.getBounds();
    hudDragOffset = { x: screenX - bounds.x, y: screenY - bounds.y };
    hudDragLastCursor = { x: screenX, y: screenY };
    hudDragFixedSize = { width: bounds.width, height: bounds.height };
  } else if (phase === "move" && hudDragOffset) {
    if (hudDragLastCursor && hudDragLastCursor.x === screenX && hudDragLastCursor.y === screenY) {
      return;
    }
    hudDragLastCursor = { x: screenX, y: screenY };
    const targetX = Math.round(screenX - hudDragOffset.x);
    const targetY = Math.round(screenY - hudDragOffset.y);
    const fixedWidth = (hudDragFixedSize == null ? void 0 : hudDragFixedSize.width) ?? hudOverlayWindow.getBounds().width;
    const fixedHeight = (hudDragFixedSize == null ? void 0 : hudDragFixedSize.height) ?? hudOverlayWindow.getBounds().height;
    hudOverlayWindow.setBounds(
      {
        x: targetX,
        y: targetY,
        width: fixedWidth,
        height: fixedHeight
      },
      false
    );
  } else if (phase === "end") {
    const finalBounds = hudOverlayWindow.getBounds();
    hudUserPosition = { x: finalBounds.x, y: finalBounds.y };
    hudDragOffset = null;
    hudDragLastCursor = null;
    hudDragFixedSize = null;
  }
});
require$$1.ipcMain.on("hud-overlay-hide", () => {
  if (hudOverlayWindow && !hudOverlayWindow.isDestroyed()) {
    hudOverlayWindow.minimize();
  }
});
require$$1.ipcMain.on("set-hud-overlay-expanded", (_event, expanded) => {
  applyHudOverlayBounds(Boolean(expanded));
});
require$$1.ipcMain.on("set-hud-overlay-compact-width", (_event, width) => {
  if (!Number.isFinite(width)) {
    return;
  }
  const maxWindowWidth = Math.max(
    HUD_MIN_WINDOW_WIDTH,
    getHudOverlayDisplay().workArea.width - HUD_EDGE_MARGIN_DIP * 2
  );
  const nextWidth = Math.min(maxWindowWidth, Math.max(HUD_MIN_WINDOW_WIDTH, Math.round(width)));
  if (nextWidth === hudOverlayCompactWidth) {
    return;
  }
  hudOverlayCompactWidth = nextWidth;
  applyHudOverlayBounds(hudOverlayExpanded);
});
require$$1.ipcMain.on("set-hud-overlay-measured-height", (_event, height, expanded) => {
  if (!Number.isFinite(height)) {
    return;
  }
  const maxWindowHeight = Math.max(
    HUD_COMPACT_HEIGHT,
    getHudOverlayDisplay().workArea.height - HUD_EDGE_MARGIN_DIP * 2
  );
  const nextHeight = Math.min(maxWindowHeight, Math.max(HUD_COMPACT_HEIGHT, Math.round(height)));
  if (expanded) {
    if (nextHeight === hudOverlayExpandedHeight) {
      return;
    }
    hudOverlayExpandedHeight = Math.max(HUD_MIN_EXPANDED_HEIGHT, nextHeight);
  } else {
    if (nextHeight === hudOverlayCompactHeight) {
      return;
    }
    hudOverlayCompactHeight = nextHeight;
  }
  applyHudOverlayBounds(hudOverlayExpanded);
});
require$$1.ipcMain.handle("get-hud-overlay-capture-protection", () => {
  const enabled = loadHudOverlayCaptureProtectionSetting();
  return {
    success: true,
    enabled
  };
});
require$$1.ipcMain.handle("get-hud-overlay-mouse-passthrough-supported", () => {
  return {
    success: true,
    supported: isHudOverlayMousePassthroughSupported()
  };
});
require$$1.ipcMain.handle("set-hud-overlay-capture-protection", (_event, enabled) => {
  loadHudOverlayCaptureProtectionSetting();
  hudOverlayHiddenFromCapture = Boolean(enabled);
  persistHudOverlayCaptureProtectionSetting(hudOverlayHiddenFromCapture);
  if (isHudOverlayCaptureProtectionSupported() && hudOverlayWindow && !hudOverlayWindow.isDestroyed()) {
    hudOverlayWindow.setContentProtection(hudOverlayHiddenFromCapture);
  }
  return {
    success: true,
    enabled: hudOverlayHiddenFromCapture
  };
});
function createHudOverlayWindow() {
  loadHudOverlayCaptureProtectionSetting();
  const initialBounds = getHudOverlayBounds(false);
  const win = new require$$1.BrowserWindow({
    width: initialBounds.width,
    height: initialBounds.height,
    minWidth: HUD_MIN_WINDOW_WIDTH,
    minHeight: HUD_COMPACT_HEIGHT,
    maxHeight: Math.max(
      HUD_COMPACT_HEIGHT,
      getHudOverlayDisplay().workArea.height - HUD_EDGE_MARGIN_DIP * 2
    ),
    x: initialBounds.x,
    y: initialBounds.y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path$m.join(__dirname$2, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      backgroundThrottling: false
    }
  });
  if (isHudOverlayCaptureProtectionSupported()) {
    win.setContentProtection(hudOverlayHiddenFromCapture);
  }
  if (isHudOverlayMousePassthroughSupported()) {
    win.setIgnoreMouseEvents(true, { forward: true });
  }
  if (process.platform === "win32" && isHudOverlayMousePassthroughSupported()) {
    win.on("focus", () => {
      if (!win.isDestroyed()) {
        win.setIgnoreMouseEvents(false);
        setTimeout(() => {
          if (!win.isDestroyed()) {
            win.setIgnoreMouseEvents(true, { forward: true });
          }
        }, 50);
      }
    });
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.show();
        win.moveTop();
        if (process.platform === "win32" && isHudOverlayMousePassthroughSupported()) {
          win.setIgnoreMouseEvents(false);
          setTimeout(() => {
            if (!win.isDestroyed()) {
              win.setIgnoreMouseEvents(true, { forward: true });
            }
          }, 50);
        }
      }
    }, 100);
  });
  win.once("ready-to-show", () => {
    setTimeout(() => {
      if (!win.isDestroyed() && !win.isVisible()) {
        win.show();
        win.moveTop();
      }
    }, 500);
  });
  hudOverlayWindow = win;
  if (process.platform === "linux") {
    win.on("moved", () => {
      if (win.isDestroyed()) return;
      const { x, y } = win.getBounds();
      hudUserPosition = { x, y };
    });
  }
  const screen = getScreen();
  const handleDisplayRemoved = () => {
    hudUserPosition = null;
  };
  const handleDisplayMetricsChanged = () => {
    if (hudUserPosition) {
      const displays = screen.getAllDisplays();
      const onScreen = displays.some(
        (d) => hudUserPosition.x >= d.workArea.x && hudUserPosition.x < d.workArea.x + d.workArea.width && hudUserPosition.y >= d.workArea.y && hudUserPosition.y < d.workArea.y + d.workArea.height
      );
      if (!onScreen) {
        hudUserPosition = null;
      }
    }
    applyHudOverlayBounds(hudOverlayExpanded);
  };
  screen.on("display-removed", handleDisplayRemoved);
  screen.on("display-metrics-changed", handleDisplayMetricsChanged);
  win.on("closed", () => {
    screen.removeListener("display-removed", handleDisplayRemoved);
    screen.removeListener("display-metrics-changed", handleDisplayMetricsChanged);
    if (hudOverlayWindow === win) {
      hudOverlayWindow = null;
    }
  });
  if (VITE_DEV_SERVER_URL$1) {
    win.loadURL(VITE_DEV_SERVER_URL$1 + "?windowType=hud-overlay");
  } else {
    win.loadFile(path$m.join(RENDERER_DIST$1, "index.html"), {
      query: { windowType: "hud-overlay" }
    });
  }
  return win;
}
function getHudOverlayWindow() {
  return hudOverlayWindow && !hudOverlayWindow.isDestroyed() ? hudOverlayWindow : null;
}
function createUpdateToastWindow() {
  const initialBounds = getUpdateToastBounds();
  const parentWindow = process.platform === "darwin" && hudOverlayWindow && !hudOverlayWindow.isDestroyed() ? hudOverlayWindow : void 0;
  const useTransparentToastWindow = process.platform !== "win32";
  const win = new require$$1.BrowserWindow({
    width: initialBounds.width,
    height: initialBounds.height,
    x: initialBounds.x,
    y: initialBounds.y,
    frame: false,
    transparent: useTransparentToastWindow,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    focusable: true,
    ...parentWindow ? { parent: parentWindow } : {},
    backgroundColor: useTransparentToastWindow ? "#00000000" : "#101418",
    webPreferences: {
      preload: path$m.join(__dirname$2, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  });
  if (process.platform === "darwin") {
    win.setAlwaysOnTop(true, "status");
  }
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  updateToastWindow = win;
  win.on("closed", () => {
    if (updateToastWindow === win) {
      updateToastWindow = null;
    }
  });
  if (VITE_DEV_SERVER_URL$1) {
    win.loadURL(VITE_DEV_SERVER_URL$1 + "?windowType=update-toast");
  } else {
    win.loadFile(path$m.join(RENDERER_DIST$1, "index.html"), {
      query: { windowType: "update-toast" }
    });
  }
  return win;
}
function getUpdateToastWindow() {
  return updateToastWindow && !updateToastWindow.isDestroyed() ? updateToastWindow : null;
}
function showUpdateToastWindow() {
  const win = getUpdateToastWindow() ?? createUpdateToastWindow();
  positionUpdateToastWindow();
  if (!win.isVisible()) {
    if (process.platform === "win32") {
      win.show();
      win.moveTop();
    } else {
      win.showInactive();
    }
  } else {
    win.moveTop();
  }
  return win;
}
function hideUpdateToastWindow() {
  if (!updateToastWindow || updateToastWindow.isDestroyed()) {
    return;
  }
  updateToastWindow.hide();
}
function loadPackagedEditorWindow(win) {
  const query = getEditorWindowQuery();
  const queryString = new URLSearchParams(query).toString();
  const indexHtmlPath = path$m.join(RENDERER_DIST$1, "index.html");
  const packagedRendererBaseUrl2 = getPackagedRendererBaseUrl();
  const webContents = win.webContents;
  const loadFromFile = () => {
    if (win.isDestroyed()) {
      return;
    }
    console.log("[editor-window] load-file", indexHtmlPath);
    void win.loadFile(indexHtmlPath, { query });
  };
  if (!packagedRendererBaseUrl2) {
    loadFromFile();
    return;
  }
  const targetUrl = `${packagedRendererBaseUrl2}/?${queryString}`;
  let settled = false;
  let timeoutId = setTimeout(() => {
    fallbackToFile("load-timeout");
  }, 5e3);
  const clearTimeoutIfNeeded = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const detachLoadListeners = () => {
    clearTimeoutIfNeeded();
    if (webContents.isDestroyed()) {
      return;
    }
    webContents.removeListener("did-fail-load", handleDidFailLoad);
    webContents.removeListener("did-finish-load", handleDidFinishLoad);
  };
  const fallbackToFile = (reason, details) => {
    if (settled || win.isDestroyed()) {
      return;
    }
    settled = true;
    detachLoadListeners();
    console.warn("[editor-window] packaged renderer URL failed, falling back to file", {
      reason,
      targetUrl,
      ...details
    });
    loadFromFile();
  };
  const handleDidFailLoad = (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame || validatedURL !== targetUrl) {
      return;
    }
    fallbackToFile("did-fail-load", {
      errorCode,
      errorDescription,
      validatedURL
    });
  };
  const handleDidFinishLoad = () => {
    if (webContents.getURL() !== targetUrl) {
      return;
    }
    settled = true;
    detachLoadListeners();
  };
  webContents.on("did-fail-load", handleDidFailLoad);
  webContents.on("did-finish-load", handleDidFinishLoad);
  win.once("closed", clearTimeoutIfNeeded);
  console.log("[editor-window] load-url", targetUrl);
  void win.loadURL(targetUrl).catch((error2) => {
    fallbackToFile("load-url-rejected", {
      error: error2 instanceof Error ? error2.message : String(error2)
    });
  });
}
function createEditorWindow() {
  const isMac = process.platform === "darwin";
  const { workArea, workAreaSize } = getScreen().getPrimaryDisplay();
  const initialWidth = isMac ? Math.round(workAreaSize.width * 0.85) : workArea.width;
  const initialHeight = isMac ? Math.round(workAreaSize.height * 0.85) : workArea.height;
  const win = new require$$1.BrowserWindow({
    width: initialWidth,
    height: initialHeight,
    ...!isMac && {
      x: workArea.x,
      y: workArea.y
    },
    minWidth: 800,
    minHeight: 600,
    ...process.platform !== "darwin" && {
      icon: WINDOW_ICON_PATH
    },
    ...isMac && {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 12, y: 12 }
    },
    autoHideMenuBar: !isMac,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    title: "Recordly",
    show: false,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path$m.join(__dirname$2, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      backgroundThrottling: false
    }
  });
  win.once("ready-to-show", () => {
    console.log("[editor-window] ready-to-show");
    win.show();
  });
  win.webContents.on("did-finish-load", () => {
    console.log("[editor-window] did-finish-load", win.webContents.getURL());
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    if (!win.isDestroyed() && !win.isVisible()) {
      console.log("[editor-window] forcing show after did-finish-load");
      win.show();
    }
  });
  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error("[editor-window] did-fail-load", {
      errorCode,
      errorDescription,
      validatedURL
    });
  });
  win.webContents.on("render-process-gone", (_event, details) => {
    console.error("[editor-window] render-process-gone", details);
  });
  win.on("show", () => {
    console.log("[editor-window] show");
  });
  win.on("focus", () => {
    console.log("[editor-window] focus");
  });
  if (VITE_DEV_SERVER_URL$1) {
    const query = new URLSearchParams(getEditorWindowQuery());
    win.loadURL(`${VITE_DEV_SERVER_URL$1}?${query.toString()}`);
  } else {
    loadPackagedEditorWindow(win);
  }
  return win;
}
function createSourceSelectorWindow() {
  const { width, height } = getScreen().getPrimaryDisplay().workAreaSize;
  const win = new require$$1.BrowserWindow({
    width: 620,
    height: 420,
    minHeight: 350,
    maxHeight: 500,
    x: Math.round((width - 620) / 2),
    y: Math.round((height - 420) / 2),
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
    show: false,
    ...process.platform !== "darwin" && {
      icon: WINDOW_ICON_PATH
    },
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path$m.join(__dirname$2, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.show();
      }
    }, 100);
  });
  if (VITE_DEV_SERVER_URL$1) {
    win.loadURL(VITE_DEV_SERVER_URL$1 + "?windowType=source-selector");
  } else {
    win.loadFile(path$m.join(RENDERER_DIST$1, "index.html"), {
      query: { windowType: "source-selector" }
    });
  }
  return win;
}
function createCountdownWindow() {
  const primaryDisplay = getScreen().getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowSize = 200;
  const x = Math.floor((width - windowSize) / 2);
  const y = Math.floor((height - windowSize) / 2);
  const win = new require$$1.BrowserWindow({
    width: windowSize,
    height: windowSize,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: true,
    show: false,
    webPreferences: {
      preload: path$m.join(__dirname$2, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  countdownWindow = win;
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.webContents.on("did-finish-load", () => {
    if (!win.isDestroyed()) {
      if (process.platform === "win32") {
        win.showInactive();
        win.moveTop();
      } else {
        win.show();
      }
    }
  });
  win.on("closed", () => {
    if (countdownWindow === win) {
      countdownWindow = null;
    }
  });
  if (VITE_DEV_SERVER_URL$1) {
    win.loadURL(VITE_DEV_SERVER_URL$1 + "?windowType=countdown");
  } else {
    win.loadFile(path$m.join(RENDERER_DIST$1, "index.html"), {
      query: { windowType: "countdown" }
    });
  }
  return win;
}
function getCountdownWindow() {
  return countdownWindow;
}
function closeCountdownWindow() {
  if (countdownWindow && !countdownWindow.isDestroyed()) {
    countdownWindow.close();
    countdownWindow = null;
  }
}
function registerSettingsHandlers() {
  require$$1.ipcMain.handle("app:getVersion", () => {
    return require$$1.app.getVersion();
  });
  require$$1.ipcMain.handle("get-platform", () => {
    return process.platform;
  });
  require$$1.ipcMain.handle("hide-cursor", () => {
    if (process.platform !== "win32") {
      return { success: true };
    }
    return { success: hideCursor() };
  });
  require$$1.ipcMain.handle("get-shortcuts", async () => {
    try {
      const data = await fs$k.readFile(SHORTCUTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  });
  require$$1.ipcMain.handle("save-shortcuts", async (_, shortcuts) => {
    try {
      await fs$k.writeFile(SHORTCUTS_FILE, JSON.stringify(shortcuts, null, 2), "utf-8");
      return { success: true };
    } catch (error2) {
      console.error("Failed to save shortcuts:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-recording-preferences", async () => {
    try {
      const content = await fs$k.readFile(RECORDINGS_SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        success: true,
        microphoneEnabled: parsed.microphoneEnabled === true,
        microphoneDeviceId: typeof parsed.microphoneDeviceId === "string" ? parsed.microphoneDeviceId : void 0,
        systemAudioEnabled: parsed.systemAudioEnabled !== false
      };
    } catch {
      return { success: true, microphoneEnabled: false, microphoneDeviceId: void 0, systemAudioEnabled: true };
    }
  });
  require$$1.ipcMain.handle("set-recording-preferences", async (_, prefs) => {
    try {
      let existing = {};
      try {
        const content = await fs$k.readFile(RECORDINGS_SETTINGS_FILE, "utf-8");
        existing = JSON.parse(content);
      } catch {
      }
      const merged = { ...existing, ...prefs };
      await fs$k.writeFile(RECORDINGS_SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
      return { success: true };
    } catch (error2) {
      console.error("Failed to save recording preferences:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("get-countdown-delay", async () => {
    try {
      const content = await fs$k.readFile(COUNTDOWN_SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { success: true, delay: parsed.delay ?? 3 };
    } catch {
      return { success: true, delay: 3 };
    }
  });
  require$$1.ipcMain.handle("set-countdown-delay", async (_, delay) => {
    try {
      await fs$k.writeFile(COUNTDOWN_SETTINGS_FILE, JSON.stringify({ delay }, null, 2), "utf-8");
      return { success: true };
    } catch (error2) {
      console.error("Failed to save countdown delay:", error2);
      return { success: false, error: String(error2) };
    }
  });
  require$$1.ipcMain.handle("start-countdown", async (_, seconds) => {
    if (countdownInProgress) {
      return { success: false, error: "Countdown already in progress" };
    }
    setCountdownInProgress(true);
    setCountdownCancelled(false);
    setCountdownRemaining(seconds);
    const countdownWin = createCountdownWindow();
    if (countdownWin.webContents.isLoadingMainFrame()) {
      await new Promise((resolve) => {
        countdownWin.webContents.once("did-finish-load", () => {
          resolve();
        });
      });
    }
    return new Promise((resolve) => {
      let remaining = seconds;
      setCountdownRemaining(remaining);
      countdownWin.webContents.send("countdown-tick", remaining);
      setCountdownTimer(setInterval(() => {
        if (countdownCancelled) {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            setCountdownTimer(null);
          }
          closeCountdownWindow();
          setCountdownInProgress(false);
          setCountdownRemaining(null);
          resolve({ success: false, cancelled: true });
          return;
        }
        remaining--;
        setCountdownRemaining(remaining);
        if (remaining <= 0) {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            setCountdownTimer(null);
          }
          closeCountdownWindow();
          setCountdownInProgress(false);
          setCountdownRemaining(null);
          resolve({ success: true });
        } else {
          const win = getCountdownWindow();
          if (win && !win.isDestroyed()) {
            win.webContents.send("countdown-tick", remaining);
          }
        }
      }, 1e3));
    });
  });
  require$$1.ipcMain.handle("cancel-countdown", () => {
    setCountdownCancelled(true);
    setCountdownInProgress(false);
    setCountdownRemaining(null);
    if (countdownTimer) {
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }
    closeCountdownWindow();
    return { success: true };
  });
  require$$1.ipcMain.handle("get-active-countdown", () => {
    return {
      success: true,
      seconds: countdownInProgress ? countdownRemaining : null
    };
  });
}
const execFileAsync = node_util.promisify(node_child_process.execFile);
function normalizeDesktopSourceName(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
function hasUsableSourceThumbnail(thumbnail) {
  if (!thumbnail || thumbnail.isEmpty()) return false;
  const size = thumbnail.getSize();
  return size.width > 1 && size.height > 1;
}
function broadcastSelectedSourceChange() {
  for (const window2 of require$$1.BrowserWindow.getAllWindows()) {
    if (!window2.isDestroyed()) {
      window2.webContents.send("selected-source-changed", selectedSource);
    }
  }
}
function registerSourceHandlers({
  createEditorWindow: createEditorWindow2,
  createSourceSelectorWindow: createSourceSelectorWindow2,
  getSourceSelectorWindow
}) {
  require$$1.ipcMain.handle("get-sources", async (_, opts) => {
    const includeScreens = Array.isArray(opts == null ? void 0 : opts.types) ? opts.types.includes("screen") : true;
    const includeWindows = Array.isArray(opts == null ? void 0 : opts.types) ? opts.types.includes("window") : true;
    const electronTypes = [
      ...includeScreens ? ["screen"] : [],
      ...includeWindows ? ["window"] : []
    ];
    const electronSources = electronTypes.length > 0 ? await require$$1.desktopCapturer.getSources({
      ...opts,
      types: electronTypes
    }).catch((error2) => {
      console.warn(
        "desktopCapturer.getSources failed (screen recording permission may be missing):",
        error2
      );
      return [];
    }) : [];
    const ownWindowNames = new Set(
      [
        require$$1.app.getName(),
        "Recordly",
        ...require$$1.BrowserWindow.getAllWindows().flatMap((win) => {
          const title = win.getTitle().trim();
          return title ? [title] : [];
        })
      ].map((name) => normalizeDesktopSourceName(name)).filter(Boolean)
    );
    const ownAppName = normalizeDesktopSourceName(require$$1.app.getName());
    const displays = includeScreens ? [...getScreen$1().getAllDisplays()].sort(
      (left, right) => left.bounds.x - right.bounds.x || left.bounds.y - right.bounds.y || left.id - right.id
    ) : [];
    const primaryDisplayId = includeScreens ? String(getScreen$1().getPrimaryDisplay().id) : "";
    const electronScreenSourcesByDisplayId = new Map(
      electronSources.filter((source) => source.id.startsWith("screen:")).map((source) => [String(source.display_id ?? ""), source])
    );
    const electronScreenSourcesByIndex = electronSources.filter(
      (source) => source.id.startsWith("screen:")
    );
    const screenSources = displays.map((display, index) => {
      const displayId = String(display.id);
      const matchedSource = electronScreenSourcesByDisplayId.get(displayId) ?? (electronScreenSourcesByIndex.length === displays.length ? electronScreenSourcesByIndex[index] : void 0);
      const displayName = displayId === primaryDisplayId ? `Screen ${index + 1} (Primary)` : `Screen ${index + 1}`;
      return {
        id: (matchedSource == null ? void 0 : matchedSource.id) ?? `screen:fallback:${displayId}`,
        name: displayName,
        originalName: (matchedSource == null ? void 0 : matchedSource.name) ?? displayName,
        display_id: displayId,
        thumbnail: (matchedSource == null ? void 0 : matchedSource.thumbnail) ? matchedSource.thumbnail.toDataURL() : null,
        appIcon: (matchedSource == null ? void 0 : matchedSource.appIcon) ? matchedSource.appIcon.toDataURL() : null,
        sourceType: "screen"
      };
    });
    if (process.platform !== "darwin" || !includeWindows) {
      const windowSources = electronSources.filter((source) => source.id.startsWith("window:")).filter((source) => hasUsableSourceThumbnail(source.thumbnail)).filter((source) => {
        const normalizedName = normalizeDesktopSourceName(source.name);
        if (!normalizedName) {
          return true;
        }
        if (ALLOW_RECORDLY_WINDOW_CAPTURE && normalizedName.includes("recordly")) {
          return true;
        }
        for (const ownName of ownWindowNames) {
          if (!ownName) continue;
          if (normalizedName === ownName) {
            return false;
          }
        }
        return true;
      }).map((source) => ({
        id: source.id,
        name: source.name,
        originalName: source.name,
        display_id: source.display_id,
        thumbnail: source.thumbnail ? source.thumbnail.toDataURL() : null,
        appIcon: source.appIcon ? source.appIcon.toDataURL() : null,
        sourceType: "window"
      }));
      return [...screenSources, ...windowSources];
    }
    try {
      const nativeWindowSources = await getNativeMacWindowSources();
      const electronWindowSourceMap = new Map(
        electronSources.filter((source) => source.id.startsWith("window:")).map((source) => [source.id, source])
      );
      const mergedWindowSources = nativeWindowSources.filter((source) => {
        const normalizedWindowName = normalizeDesktopSourceName(
          source.windowTitle ?? source.name
        );
        const normalizedAppName = normalizeDesktopSourceName(source.appName ?? "");
        if (!ALLOW_RECORDLY_WINDOW_CAPTURE && normalizedAppName && normalizedAppName === ownAppName) {
          return false;
        }
        if (ALLOW_RECORDLY_WINDOW_CAPTURE && (normalizedAppName === "recordly" || (normalizedWindowName == null ? void 0 : normalizedWindowName.includes("recordly")))) {
          return true;
        }
        if (!normalizedWindowName) {
          return true;
        }
        for (const ownName of ownWindowNames) {
          if (!ownName) continue;
          if (normalizedWindowName === ownName) {
            return false;
          }
        }
        return true;
      }).map((source) => {
        const electronWindowSource = electronWindowSourceMap.get(source.id);
        return {
          id: source.id,
          name: source.name,
          originalName: source.name,
          display_id: source.display_id ?? (electronWindowSource == null ? void 0 : electronWindowSource.display_id) ?? "",
          thumbnail: (electronWindowSource == null ? void 0 : electronWindowSource.thumbnail) ? electronWindowSource.thumbnail.toDataURL() : null,
          appIcon: source.appIcon ?? ((electronWindowSource == null ? void 0 : electronWindowSource.appIcon) ? electronWindowSource.appIcon.toDataURL() : null),
          appName: source.appName,
          windowTitle: source.windowTitle,
          sourceType: "window"
        };
      });
      return [...screenSources, ...mergedWindowSources];
    } catch (error2) {
      console.warn("Falling back to Electron window enumeration on macOS:", error2);
      const windowSources = electronSources.filter((source) => source.id.startsWith("window:")).filter((source) => {
        const normalizedName = normalizeDesktopSourceName(source.name);
        if (!normalizedName) {
          return true;
        }
        if (ALLOW_RECORDLY_WINDOW_CAPTURE && normalizedName.includes("recordly")) {
          return true;
        }
        for (const ownName of ownWindowNames) {
          if (!ownName) continue;
          if (normalizedName === ownName || normalizedName.includes(ownName) || ownName.includes(normalizedName)) {
            return false;
          }
        }
        return true;
      }).map((source) => ({
        id: source.id,
        name: source.name,
        originalName: source.name,
        display_id: source.display_id,
        thumbnail: source.thumbnail ? source.thumbnail.toDataURL() : null,
        appIcon: source.appIcon ? source.appIcon.toDataURL() : null,
        sourceType: "window"
      }));
      return [...screenSources, ...windowSources];
    }
  });
  require$$1.ipcMain.handle("select-source", (_, source) => {
    setSelectedSource(source);
    broadcastSelectedSourceChange();
    stopWindowBoundsCapture();
    const sourceSelectorWin = getSourceSelectorWindow();
    if (sourceSelectorWin) {
      sourceSelectorWin.close();
    }
    return selectedSource;
  });
  require$$1.ipcMain.handle("show-source-highlight", async (_, source) => {
    var _a2, _b2, _c, _d, _e;
    try {
      const isWindow = (_a2 = source.id) == null ? void 0 : _a2.startsWith("window:");
      const windowId = isWindow ? parseWindowId(source.id) : null;
      if (isWindow && process.platform === "darwin") {
        const rawAppName = source.appName || ((_c = (_b2 = source.name) == null ? void 0 : _b2.split(" — ")[0]) == null ? void 0 : _c.trim());
        const appName = rawAppName && /^[\w .&()+'-]{1,64}$/.test(rawAppName) ? rawAppName : null;
        if (appName) {
          try {
            await execFileAsync(
              "osascript",
              [
                "-e",
                "on run argv",
                "-e",
                "tell application (item 1 of argv) to activate",
                "-e",
                "end run",
                "--",
                appName
              ],
              { timeout: 2e3 }
            );
            await new Promise((resolve) => setTimeout(resolve, 350));
          } catch {
          }
        }
      } else if (windowId && process.platform === "linux") {
        try {
          await execFileAsync("wmctrl", ["-i", "-a", `0x${windowId.toString(16)}`], {
            timeout: 1500
          });
        } catch {
          try {
            await execFileAsync("xdotool", ["windowactivate", String(windowId)], {
              timeout: 1500
            });
          } catch {
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      let bounds = null;
      if ((_d = source.id) == null ? void 0 : _d.startsWith("screen:")) {
        bounds = process.platform === "darwin" ? getDisplayWorkAreaForSource(source) : getDisplayBoundsForSource(source);
      } else if (isWindow) {
        if (process.platform === "darwin") {
          bounds = await resolveMacWindowBounds(source);
        } else if (process.platform === "win32") {
          bounds = await resolveWindowsWindowBounds(source);
        } else if (process.platform === "linux") {
          bounds = await resolveLinuxWindowBounds(source);
        }
      }
      if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
        bounds = getDisplayBoundsForSource(source);
      }
      if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
        const primaryBounds = getScreen$1().getPrimaryDisplay().bounds;
        if (primaryBounds.width <= 0 || primaryBounds.height <= 0) {
          return { success: false };
        }
        bounds = primaryBounds;
      }
      const resolvedBounds = bounds;
      const isScreen = (_e = source.id) == null ? void 0 : _e.startsWith("screen:");
      const isMacScreen = isScreen && process.platform === "darwin";
      const pad = isMacScreen ? 0 : 6;
      const highlightWin = new require$$1.BrowserWindow({
        x: resolvedBounds.x - pad,
        y: resolvedBounds.y - pad,
        width: resolvedBounds.width + pad * 2,
        height: resolvedBounds.height + pad * 2,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
        resizable: false,
        focusable: false,
        webPreferences: { nodeIntegration: false, contextIsolation: true }
      });
      highlightWin.setIgnoreMouseEvents(true);
      const borderRadius = isMacScreen ? 0 : 10;
      const glowInset = isMacScreen ? 0 : -4;
      const glowRadius = isMacScreen ? 0 : 14;
      const glowPad = isMacScreen ? 3 : 6;
      const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:transparent;overflow:hidden;width:100vw;height:100vh}

.border-wrap{
  position:fixed;inset:0;border-radius:${borderRadius}px;padding:3px;
  background:conic-gradient(from var(--angle,0deg),
    transparent 0%,
    transparent 60%,
    rgba(99,96,245,.15) 70%,
    rgba(99,96,245,.9) 80%,
    rgba(123,120,255,1) 85%,
    rgba(99,96,245,.9) 90%,
    rgba(99,96,245,.15) 95%,
    transparent 100%
  );
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;
  mask-composite:exclude;
  animation:spin 1.2s linear forwards, fadeAll 1.6s ease-out forwards;
}

.glow-wrap{
  position:fixed;inset:${glowInset}px;border-radius:${glowRadius}px;padding:${glowPad}px;
  background:conic-gradient(from var(--angle,0deg),
    transparent 0%,
    transparent 65%,
    rgba(99,96,245,.3) 78%,
    rgba(123,120,255,.5) 85%,
    rgba(99,96,245,.3) 92%,
    transparent 100%
  );
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;
  mask-composite:exclude;
  filter:blur(8px);
  animation:spin 1.2s linear forwards, fadeAll 1.6s ease-out forwards;
}

@property --angle{
  syntax:'<angle>';
  initial-value:0deg;
  inherits:false;
}

@keyframes spin{
  0%{--angle:0deg}
  100%{--angle:360deg}
}

@keyframes fadeAll{
  0%,60%{opacity:1}
  100%{opacity:0}
}
</style></head><body>
<div class="glow-wrap"></div>
<div class="border-wrap"></div>
</body></html>`;
      try {
        await highlightWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
      } catch (loadError) {
        if (!highlightWin.isDestroyed()) {
          highlightWin.close();
        }
        throw loadError;
      }
      setTimeout(() => {
        if (!highlightWin.isDestroyed()) highlightWin.close();
      }, 1700);
      return { success: true };
    } catch (error2) {
      console.error("Failed to show source highlight:", error2);
      return { success: false };
    }
  });
  require$$1.ipcMain.handle("get-selected-source", () => {
    return selectedSource;
  });
  require$$1.ipcMain.handle("open-source-selector", () => {
    const sourceSelectorWin = getSourceSelectorWindow();
    if (sourceSelectorWin) {
      sourceSelectorWin.focus();
      return;
    }
    createSourceSelectorWindow2();
  });
  require$$1.ipcMain.handle("switch-to-editor", () => {
    console.log("[switch-to-editor] Opening editor window");
    const sourceSelectorWin = getSourceSelectorWindow();
    if (sourceSelectorWin && !sourceSelectorWin.isDestroyed()) {
      sourceSelectorWin.close();
    }
    createEditorWindow2();
  });
}
function getSelectedSourceId() {
  return (selectedSource == null ? void 0 : selectedSource.id) ?? null;
}
function killWindowsCaptureProcess() {
  if (windowsCaptureProcess) {
    try {
      windowsCaptureProcess.kill();
    } catch {
    }
    setWindowsCaptureProcess(null);
    setWindowsCaptureTargetPath(null);
    setWindowsNativeCaptureActive(false);
    setNativeScreenRecordingActive(false);
    setWindowsCaptureStopRequested(false);
    setWindowsCapturePaused(false);
    setWindowsSystemAudioPath(null);
    setWindowsMicAudioPath(null);
    setWindowsOrphanedMicAudioPath(null);
    setWindowsPendingVideoPath(null);
  }
}
function registerIpcHandlers(createEditorWindow2, createSourceSelectorWindow2, _getMainWindow, getSourceSelectorWindow, onRecordingStateChange) {
  registerSourceHandlers({
    createEditorWindow: createEditorWindow2,
    createSourceSelectorWindow: createSourceSelectorWindow2,
    getSourceSelectorWindow
  });
  registerRecordingHandlers(onRecordingStateChange);
  registerPermissionHandlers();
  registerAssetHandlers();
  registerExportHandlers();
  registerCaptionHandlers();
  registerProjectHandlers();
  registerSettingsHandlers();
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var main$1 = {};
var fs$i = {};
var universalify$1 = {};
universalify$1.fromCallback = function(fn) {
  return Object.defineProperty(function(...args) {
    if (typeof args[args.length - 1] === "function") fn.apply(this, args);
    else {
      return new Promise((resolve, reject) => {
        args.push((err, res) => err != null ? reject(err) : resolve(res));
        fn.apply(this, args);
      });
    }
  }, "name", { value: fn.name });
};
universalify$1.fromPromise = function(fn) {
  return Object.defineProperty(function(...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== "function") return fn.apply(this, args);
    else {
      args.pop();
      fn.apply(this, args).then((r) => cb(null, r), cb);
    }
  }, "name", { value: fn.name });
};
var constants$2 = require$$0;
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd;
};
try {
  process.cwd();
} catch (er) {
}
if (typeof process.chdir === "function") {
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$3;
function patch$3(fs2) {
  if (constants$2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs2);
  }
  if (!fs2.lutimes) {
    patchLutimes(fs2);
  }
  fs2.chown = chownFix(fs2.chown);
  fs2.fchown = chownFix(fs2.fchown);
  fs2.lchown = chownFix(fs2.lchown);
  fs2.chmod = chmodFix(fs2.chmod);
  fs2.fchmod = chmodFix(fs2.fchmod);
  fs2.lchmod = chmodFix(fs2.lchmod);
  fs2.chownSync = chownFixSync(fs2.chownSync);
  fs2.fchownSync = chownFixSync(fs2.fchownSync);
  fs2.lchownSync = chownFixSync(fs2.lchownSync);
  fs2.chmodSync = chmodFixSync(fs2.chmodSync);
  fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
  fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
  fs2.stat = statFix(fs2.stat);
  fs2.fstat = statFix(fs2.fstat);
  fs2.lstat = statFix(fs2.lstat);
  fs2.statSync = statFixSync(fs2.statSync);
  fs2.fstatSync = statFixSync(fs2.fstatSync);
  fs2.lstatSync = statFixSync(fs2.lstatSync);
  if (fs2.chmod && !fs2.lchmod) {
    fs2.lchmod = function(path2, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchmodSync = function() {
    };
  }
  if (fs2.chown && !fs2.lchown) {
    fs2.lchown = function(path2, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchownSync = function() {
    };
  }
  if (platform === "win32") {
    fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
      function rename2(from, to, cb) {
        var start = Date.now();
        var backoff = 0;
        fs$rename(from, to, function CB(er) {
          if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
            setTimeout(function() {
              fs2.stat(to, function(stater, st) {
                if (stater && stater.code === "ENOENT")
                  fs$rename(from, to, CB);
                else
                  cb(er);
              });
            }, backoff);
            if (backoff < 100)
              backoff += 10;
            return;
          }
          if (cb) cb(er);
        });
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(rename2, fs$rename);
      return rename2;
    }(fs2.rename);
  }
  fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
    function read(fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === "function") {
        var eagCounter = 0;
        callback = function(er, _, __) {
          if (er && er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
    }
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
    return read;
  }(fs2.read);
  fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : /* @__PURE__ */ function(fs$readSync) {
    return function(fd, buffer, offset, length, position) {
      var eagCounter = 0;
      while (true) {
        try {
          return fs$readSync.call(fs2, fd, buffer, offset, length, position);
        } catch (er) {
          if (er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            continue;
          }
          throw er;
        }
      }
    };
  }(fs2.readSync);
  function patchLchmod(fs22) {
    fs22.lchmod = function(path2, mode, callback) {
      fs22.open(
        path2,
        constants$2.O_WRONLY | constants$2.O_SYMLINK,
        mode,
        function(err, fd) {
          if (err) {
            if (callback) callback(err);
            return;
          }
          fs22.fchmod(fd, mode, function(err2) {
            fs22.close(fd, function(err22) {
              if (callback) callback(err2 || err22);
            });
          });
        }
      );
    };
    fs22.lchmodSync = function(path2, mode) {
      var fd = fs22.openSync(path2, constants$2.O_WRONLY | constants$2.O_SYMLINK, mode);
      var threw = true;
      var ret;
      try {
        ret = fs22.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs22.closeSync(fd);
          } catch (er) {
          }
        } else {
          fs22.closeSync(fd);
        }
      }
      return ret;
    };
  }
  function patchLutimes(fs22) {
    if (constants$2.hasOwnProperty("O_SYMLINK") && fs22.futimes) {
      fs22.lutimes = function(path2, at, mt, cb) {
        fs22.open(path2, constants$2.O_SYMLINK, function(er, fd) {
          if (er) {
            if (cb) cb(er);
            return;
          }
          fs22.futimes(fd, at, mt, function(er2) {
            fs22.close(fd, function(er22) {
              if (cb) cb(er2 || er22);
            });
          });
        });
      };
      fs22.lutimesSync = function(path2, at, mt) {
        var fd = fs22.openSync(path2, constants$2.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs22.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs22.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs22.closeSync(fd);
          }
        }
        return ret;
      };
    } else if (fs22.futimes) {
      fs22.lutimes = function(_a2, _b2, _c, cb) {
        if (cb) process.nextTick(cb);
      };
      fs22.lutimesSync = function() {
      };
    }
  }
  function chmodFix(orig) {
    if (!orig) return orig;
    return function(target, mode, cb) {
      return orig.call(fs2, target, mode, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chmodFixSync(orig) {
    if (!orig) return orig;
    return function(target, mode) {
      try {
        return orig.call(fs2, target, mode);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function chownFix(orig) {
    if (!orig) return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs2, target, uid, gid, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig) return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs2, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function statFix(orig) {
    if (!orig) return orig;
    return function(target, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 4294967296;
          if (stats.gid < 0) stats.gid += 4294967296;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
    };
  }
  function statFixSync(orig) {
    if (!orig) return orig;
    return function(target, options) {
      var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
      if (stats) {
        if (stats.uid < 0) stats.uid += 4294967296;
        if (stats.gid < 0) stats.gid += 4294967296;
      }
      return stats;
    };
  }
  function chownErOk(er) {
    if (!er)
      return true;
    if (er.code === "ENOSYS")
      return true;
    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true;
    }
    return false;
  }
}
var Stream = require$$0$1.Stream;
var legacyStreams = legacy$1;
function legacy$1(fs2) {
  return {
    ReadStream,
    WriteStream
  };
  function ReadStream(path2, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path2, options);
    Stream.call(this);
    var self2 = this;
    this.path = path2;
    this.fd = null;
    this.readable = true;
    this.paused = false;
    this.flags = "r";
    this.mode = 438;
    this.bufferSize = 64 * 1024;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.encoding) this.setEncoding(this.encoding);
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.end === void 0) {
        this.end = Infinity;
      } else if ("number" !== typeof this.end) {
        throw TypeError("end must be a Number");
      }
      if (this.start > this.end) {
        throw new Error("start must be <= end");
      }
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        self2._read();
      });
      return;
    }
    fs2.open(this.path, this.flags, this.mode, function(err, fd) {
      if (err) {
        self2.emit("error", err);
        self2.readable = false;
        return;
      }
      self2.fd = fd;
      self2.emit("open", fd);
      self2._read();
    });
  }
  function WriteStream(path2, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path2, options);
    Stream.call(this);
    this.path = path2;
    this.fd = null;
    this.writable = true;
    this.flags = "w";
    this.encoding = "binary";
    this.mode = 438;
    this.bytesWritten = 0;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.start < 0) {
        throw new Error("start must be >= zero");
      }
      this.pos = this.start;
    }
    this.busy = false;
    this._queue = [];
    if (this.fd === null) {
      this._open = fs2.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
      this.flush();
    }
  }
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};
function clone$1(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Object)
    var copy2 = { __proto__: getPrototypeOf(obj) };
  else
    var copy2 = /* @__PURE__ */ Object.create(null);
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
  });
  return copy2;
}
var fs$h = require$$1$1;
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$2 = require$$4;
var gracefulQueue;
var previousSymbol;
if (typeof Symbol === "function" && typeof Symbol.for === "function") {
  gracefulQueue = Symbol.for("graceful-fs.queue");
  previousSymbol = Symbol.for("graceful-fs.previous");
} else {
  gracefulQueue = "___graceful-fs.queue";
  previousSymbol = "___graceful-fs.previous";
}
function noop() {
}
function publishQueue(context, queue2) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue2;
    }
  });
}
var debug$3 = noop;
if (util$2.debuglog)
  debug$3 = util$2.debuglog("gfs4");
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
  debug$3 = function() {
    var m = util$2.format.apply(util$2, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
    console.error(m);
  };
if (!fs$h[gracefulQueue]) {
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs$h, queue);
  fs$h.close = function(fs$close) {
    function close(fd, cb) {
      return fs$close.call(fs$h, fd, function(err) {
        if (!err) {
          resetQueue();
        }
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    }
    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close;
  }(fs$h.close);
  fs$h.closeSync = function(fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs$h, arguments);
      resetQueue();
    }
    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync;
  }(fs$h.closeSync);
  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug$3(fs$h[gracefulQueue]);
      require$$5.equal(fs$h[gracefulQueue].length, 0);
    });
  }
}
if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs$h[gracefulQueue]);
}
var gracefulFs = patch$2(clone(fs$h));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$h.__patched) {
  gracefulFs = patch$2(fs$h);
  fs$h.__patched = true;
}
function patch$2(fs2) {
  polyfills(fs2);
  fs2.gracefulify = patch$2;
  fs2.createReadStream = createReadStream;
  fs2.createWriteStream = createWriteStream;
  var fs$readFile = fs2.readFile;
  fs2.readFile = readFile2;
  function readFile2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$readFile(path2, options, cb);
    function go$readFile(path22, options2, cb2, startTime) {
      return fs$readFile(path22, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readFile, [path22, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$writeFile = fs2.writeFile;
  fs2.writeFile = writeFile2;
  function writeFile2(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$writeFile(path2, data, options, cb);
    function go$writeFile(path22, data2, options2, cb2, startTime) {
      return fs$writeFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$writeFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$appendFile = fs2.appendFile;
  if (fs$appendFile)
    fs2.appendFile = appendFile;
  function appendFile(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$appendFile(path2, data, options, cb);
    function go$appendFile(path22, data2, options2, cb2, startTime) {
      return fs$appendFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$appendFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$copyFile = fs2.copyFile;
  if (fs$copyFile)
    fs2.copyFile = copyFile2;
  function copyFile2(src2, dest, flags, cb) {
    if (typeof flags === "function") {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src2, dest, flags, cb);
    function go$copyFile(src22, dest2, flags2, cb2, startTime) {
      return fs$copyFile(src22, dest2, flags2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$copyFile, [src22, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$readdir = fs2.readdir;
  fs2.readdir = readdir;
  var noReaddirOptionVersions = /^v[0-5]\./;
  function readdir(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    } : function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, options2, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    };
    return go$readdir(path2, options, cb);
    function fs$readdirCallback(path22, options2, cb2, startTime) {
      return function(err, files) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([
            go$readdir,
            [path22, options2, cb2],
            err,
            startTime || Date.now(),
            Date.now()
          ]);
        else {
          if (files && files.sort)
            files.sort();
          if (typeof cb2 === "function")
            cb2.call(this, err, files);
        }
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var legStreams = legacy(fs2);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }
  var fs$ReadStream = fs2.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }
  var fs$WriteStream = fs2.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }
  Object.defineProperty(fs2, "ReadStream", {
    get: function() {
      return ReadStream;
    },
    set: function(val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs2, "WriteStream", {
    get: function() {
      return WriteStream;
    },
    set: function(val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileReadStream = ReadStream;
  Object.defineProperty(fs2, "FileReadStream", {
    get: function() {
      return FileReadStream;
    },
    set: function(val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs2, "FileWriteStream", {
    get: function() {
      return FileWriteStream;
    },
    set: function(val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  function ReadStream(path2, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this;
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
  }
  function ReadStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
        that.read();
      }
    });
  }
  function WriteStream(path2, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this;
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
  }
  function WriteStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
      }
    });
  }
  function createReadStream(path2, options) {
    return new fs2.ReadStream(path2, options);
  }
  function createWriteStream(path2, options) {
    return new fs2.WriteStream(path2, options);
  }
  var fs$open = fs2.open;
  fs2.open = open;
  function open(path2, flags, mode, cb) {
    if (typeof mode === "function")
      cb = mode, mode = null;
    return go$open(path2, flags, mode, cb);
    function go$open(path22, flags2, mode2, cb2, startTime) {
      return fs$open(path22, flags2, mode2, function(err, fd) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$open, [path22, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  return fs2;
}
function enqueue(elem) {
  debug$3("ENQUEUE", elem[0].name, elem[1]);
  fs$h[gracefulQueue].push(elem);
  retry$2();
}
var retryTimer;
function resetQueue() {
  var now = Date.now();
  for (var i = 0; i < fs$h[gracefulQueue].length; ++i) {
    if (fs$h[gracefulQueue][i].length > 2) {
      fs$h[gracefulQueue][i][3] = now;
      fs$h[gracefulQueue][i][4] = now;
    }
  }
  retry$2();
}
function retry$2() {
  clearTimeout(retryTimer);
  retryTimer = void 0;
  if (fs$h[gracefulQueue].length === 0)
    return;
  var elem = fs$h[gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];
  if (startTime === void 0) {
    debug$3("RETRY", fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 6e4) {
    debug$3("TIMEOUT", fn.name, args);
    var cb = args.pop();
    if (typeof cb === "function")
      cb.call(null, err);
  } else {
    var sinceAttempt = Date.now() - lastTime;
    var sinceStart = Math.max(lastTime - startTime, 1);
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    if (sinceAttempt >= desiredDelay) {
      debug$3("RETRY", fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      fs$h[gracefulQueue].push(elem);
    }
  }
  if (retryTimer === void 0) {
    retryTimer = setTimeout(retry$2, 0);
  }
}
(function(exports2) {
  const u2 = universalify$1.fromCallback;
  const fs2 = gracefulFs;
  const api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.assign(exports2, fs2);
  api.forEach((method) => {
    exports2[method] = u2(fs2[method]);
  });
  exports2.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve) => {
      return fs2.exists(filename, resolve);
    });
  };
  exports2.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise((resolve, reject) => {
      fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports2.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  if (typeof fs2.writev === "function") {
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
  }
  if (typeof fs2.realpath.native === "function") {
    exports2.realpath.native = u2(fs2.realpath.native);
  } else {
    process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }
})(fs$i);
var makeDir$1 = {};
var utils$1 = {};
const path$l = require$$1$2;
utils$1.checkPath = function checkPath(pth) {
  if (process.platform === "win32") {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path$l.parse(pth).root, ""));
    if (pathHasInvalidWinCharacters) {
      const error2 = new Error(`Path contains invalid characters: ${pth}`);
      error2.code = "EINVAL";
      throw error2;
    }
  }
};
const fs$g = fs$i;
const { checkPath: checkPath2 } = utils$1;
const getMode = (options) => {
  const defaults2 = { mode: 511 };
  if (typeof options === "number") return options;
  return { ...defaults2, ...options }.mode;
};
makeDir$1.makeDir = async (dir, options) => {
  checkPath2(dir);
  return fs$g.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  });
};
makeDir$1.makeDirSync = (dir, options) => {
  checkPath2(dir);
  return fs$g.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  });
};
const u$a = universalify$1.fromPromise;
const { makeDir: _makeDir, makeDirSync } = makeDir$1;
const makeDir = u$a(_makeDir);
var mkdirs$2 = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
};
const u$9 = universalify$1.fromPromise;
const fs$f = fs$i;
function pathExists$6(path2) {
  return fs$f.access(path2).then(() => true).catch(() => false);
}
var pathExists_1 = {
  pathExists: u$9(pathExists$6),
  pathExistsSync: fs$f.existsSync
};
const fs$e = gracefulFs;
function utimesMillis$1(path2, atime, mtime, callback) {
  fs$e.open(path2, "r+", (err, fd) => {
    if (err) return callback(err);
    fs$e.futimes(fd, atime, mtime, (futimesErr) => {
      fs$e.close(fd, (closeErr) => {
        if (callback) callback(futimesErr || closeErr);
      });
    });
  });
}
function utimesMillisSync$1(path2, atime, mtime) {
  const fd = fs$e.openSync(path2, "r+");
  fs$e.futimesSync(fd, atime, mtime);
  return fs$e.closeSync(fd);
}
var utimes = {
  utimesMillis: utimesMillis$1,
  utimesMillisSync: utimesMillisSync$1
};
const fs$d = fs$i;
const path$k = require$$1$2;
const util$1 = require$$4;
function getStats$2(src2, dest, opts) {
  const statFunc = opts.dereference ? (file2) => fs$d.stat(file2, { bigint: true }) : (file2) => fs$d.lstat(file2, { bigint: true });
  return Promise.all([
    statFunc(src2),
    statFunc(dest).catch((err) => {
      if (err.code === "ENOENT") return null;
      throw err;
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
}
function getStatsSync(src2, dest, opts) {
  let destStat;
  const statFunc = opts.dereference ? (file2) => fs$d.statSync(file2, { bigint: true }) : (file2) => fs$d.lstatSync(file2, { bigint: true });
  const srcStat = statFunc(src2);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === "ENOENT") return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
}
function checkPaths(src2, dest, funcName, opts, cb) {
  util$1.callbackify(getStats$2)(src2, dest, opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, destStat } = stats;
    if (destStat) {
      if (areIdentical$2(srcStat, destStat)) {
        const srcBaseName = path$k.basename(src2);
        const destBaseName = path$k.basename(dest);
        if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
          return cb(null, { srcStat, destStat, isChangingCase: true });
        }
        return cb(new Error("Source and destination must not be the same."));
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`));
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`));
      }
    }
    if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
      return cb(new Error(errMsg(src2, dest, funcName)));
    }
    return cb(null, { srcStat, destStat });
  });
}
function checkPathsSync(src2, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src2, dest, opts);
  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path$k.basename(src2);
      const destBaseName = path$k.basename(dest);
      if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
    }
  }
  if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
    throw new Error(errMsg(src2, dest, funcName));
  }
  return { srcStat, destStat };
}
function checkParentPaths(src2, srcStat, dest, funcName, cb) {
  const srcParent = path$k.resolve(path$k.dirname(src2));
  const destParent = path$k.resolve(path$k.dirname(dest));
  if (destParent === srcParent || destParent === path$k.parse(destParent).root) return cb();
  fs$d.stat(destParent, { bigint: true }, (err, destStat) => {
    if (err) {
      if (err.code === "ENOENT") return cb();
      return cb(err);
    }
    if (areIdentical$2(srcStat, destStat)) {
      return cb(new Error(errMsg(src2, dest, funcName)));
    }
    return checkParentPaths(src2, srcStat, destParent, funcName, cb);
  });
}
function checkParentPathsSync(src2, srcStat, dest, funcName) {
  const srcParent = path$k.resolve(path$k.dirname(src2));
  const destParent = path$k.resolve(path$k.dirname(dest));
  if (destParent === srcParent || destParent === path$k.parse(destParent).root) return;
  let destStat;
  try {
    destStat = fs$d.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src2, dest, funcName));
  }
  return checkParentPathsSync(src2, srcStat, destParent, funcName);
}
function areIdentical$2(srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
function isSrcSubdir(src2, dest) {
  const srcArr = path$k.resolve(src2).split(path$k.sep).filter((i) => i);
  const destArr = path$k.resolve(dest).split(path$k.sep).filter((i) => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
}
function errMsg(src2, dest, funcName) {
  return `Cannot ${funcName} '${src2}' to a subdirectory of itself, '${dest}'.`;
}
var stat$4 = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir,
  areIdentical: areIdentical$2
};
const fs$c = gracefulFs;
const path$j = require$$1$2;
const mkdirs$1 = mkdirs$2.mkdirs;
const pathExists$5 = pathExists_1.pathExists;
const utimesMillis = utimes.utimesMillis;
const stat$3 = stat$4;
function copy$2(src2, dest, opts, cb) {
  if (typeof opts === "function" && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === "function") {
    opts = { filter: opts };
  }
  cb = cb || function() {
  };
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0001"
    );
  }
  stat$3.checkPaths(src2, dest, "copy", opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, destStat } = stats;
    stat$3.checkParentPaths(src2, srcStat, dest, "copy", (err2) => {
      if (err2) return cb(err2);
      if (opts.filter) return handleFilter(checkParentDir, destStat, src2, dest, opts, cb);
      return checkParentDir(destStat, src2, dest, opts, cb);
    });
  });
}
function checkParentDir(destStat, src2, dest, opts, cb) {
  const destParent = path$j.dirname(dest);
  pathExists$5(destParent, (err, dirExists) => {
    if (err) return cb(err);
    if (dirExists) return getStats$1(destStat, src2, dest, opts, cb);
    mkdirs$1(destParent, (err2) => {
      if (err2) return cb(err2);
      return getStats$1(destStat, src2, dest, opts, cb);
    });
  });
}
function handleFilter(onInclude, destStat, src2, dest, opts, cb) {
  Promise.resolve(opts.filter(src2, dest)).then((include) => {
    if (include) return onInclude(destStat, src2, dest, opts, cb);
    return cb();
  }, (error2) => cb(error2));
}
function startCopy$1(destStat, src2, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats$1, destStat, src2, dest, opts, cb);
  return getStats$1(destStat, src2, dest, opts, cb);
}
function getStats$1(destStat, src2, dest, opts, cb) {
  const stat2 = opts.dereference ? fs$c.stat : fs$c.lstat;
  stat2(src2, (err, srcStat) => {
    if (err) return cb(err);
    if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src2, dest, opts, cb);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src2, dest, opts, cb);
    else if (srcStat.isSymbolicLink()) return onLink$1(destStat, src2, dest, opts, cb);
    else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src2}`));
    else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src2}`));
    return cb(new Error(`Unknown file: ${src2}`));
  });
}
function onFile$1(srcStat, destStat, src2, dest, opts, cb) {
  if (!destStat) return copyFile$1(srcStat, src2, dest, opts, cb);
  return mayCopyFile$1(srcStat, src2, dest, opts, cb);
}
function mayCopyFile$1(srcStat, src2, dest, opts, cb) {
  if (opts.overwrite) {
    fs$c.unlink(dest, (err) => {
      if (err) return cb(err);
      return copyFile$1(srcStat, src2, dest, opts, cb);
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`));
  } else return cb();
}
function copyFile$1(srcStat, src2, dest, opts, cb) {
  fs$c.copyFile(src2, dest, (err) => {
    if (err) return cb(err);
    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src2, dest, cb);
    return setDestMode$1(dest, srcStat.mode, cb);
  });
}
function handleTimestampsAndMode(srcMode, src2, dest, cb) {
  if (fileIsNotWritable$1(srcMode)) {
    return makeFileWritable$1(dest, srcMode, (err) => {
      if (err) return cb(err);
      return setDestTimestampsAndMode(srcMode, src2, dest, cb);
    });
  }
  return setDestTimestampsAndMode(srcMode, src2, dest, cb);
}
function fileIsNotWritable$1(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable$1(dest, srcMode, cb) {
  return setDestMode$1(dest, srcMode | 128, cb);
}
function setDestTimestampsAndMode(srcMode, src2, dest, cb) {
  setDestTimestamps$1(src2, dest, (err) => {
    if (err) return cb(err);
    return setDestMode$1(dest, srcMode, cb);
  });
}
function setDestMode$1(dest, srcMode, cb) {
  return fs$c.chmod(dest, srcMode, cb);
}
function setDestTimestamps$1(src2, dest, cb) {
  fs$c.stat(src2, (err, updatedSrcStat) => {
    if (err) return cb(err);
    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
  });
}
function onDir$1(srcStat, destStat, src2, dest, opts, cb) {
  if (!destStat) return mkDirAndCopy$1(srcStat.mode, src2, dest, opts, cb);
  return copyDir$1(src2, dest, opts, cb);
}
function mkDirAndCopy$1(srcMode, src2, dest, opts, cb) {
  fs$c.mkdir(dest, (err) => {
    if (err) return cb(err);
    copyDir$1(src2, dest, opts, (err2) => {
      if (err2) return cb(err2);
      return setDestMode$1(dest, srcMode, cb);
    });
  });
}
function copyDir$1(src2, dest, opts, cb) {
  fs$c.readdir(src2, (err, items) => {
    if (err) return cb(err);
    return copyDirItems(items, src2, dest, opts, cb);
  });
}
function copyDirItems(items, src2, dest, opts, cb) {
  const item = items.pop();
  if (!item) return cb();
  return copyDirItem$1(items, item, src2, dest, opts, cb);
}
function copyDirItem$1(items, item, src2, dest, opts, cb) {
  const srcItem = path$j.join(src2, item);
  const destItem = path$j.join(dest, item);
  stat$3.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
    if (err) return cb(err);
    const { destStat } = stats;
    startCopy$1(destStat, srcItem, destItem, opts, (err2) => {
      if (err2) return cb(err2);
      return copyDirItems(items, src2, dest, opts, cb);
    });
  });
}
function onLink$1(destStat, src2, dest, opts, cb) {
  fs$c.readlink(src2, (err, resolvedSrc) => {
    if (err) return cb(err);
    if (opts.dereference) {
      resolvedSrc = path$j.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
      return fs$c.symlink(resolvedSrc, dest, cb);
    } else {
      fs$c.readlink(dest, (err2, resolvedDest) => {
        if (err2) {
          if (err2.code === "EINVAL" || err2.code === "UNKNOWN") return fs$c.symlink(resolvedSrc, dest, cb);
          return cb(err2);
        }
        if (opts.dereference) {
          resolvedDest = path$j.resolve(process.cwd(), resolvedDest);
        }
        if (stat$3.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
        }
        if (destStat.isDirectory() && stat$3.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
        }
        return copyLink$1(resolvedSrc, dest, cb);
      });
    }
  });
}
function copyLink$1(resolvedSrc, dest, cb) {
  fs$c.unlink(dest, (err) => {
    if (err) return cb(err);
    return fs$c.symlink(resolvedSrc, dest, cb);
  });
}
var copy_1 = copy$2;
const fs$b = gracefulFs;
const path$i = require$$1$2;
const mkdirsSync$1 = mkdirs$2.mkdirsSync;
const utimesMillisSync = utimes.utimesMillisSync;
const stat$2 = stat$4;
function copySync$1(src2, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0002"
    );
  }
  const { srcStat, destStat } = stat$2.checkPathsSync(src2, dest, "copy", opts);
  stat$2.checkParentPathsSync(src2, srcStat, dest, "copy");
  return handleFilterAndCopy(destStat, src2, dest, opts);
}
function handleFilterAndCopy(destStat, src2, dest, opts) {
  if (opts.filter && !opts.filter(src2, dest)) return;
  const destParent = path$i.dirname(dest);
  if (!fs$b.existsSync(destParent)) mkdirsSync$1(destParent);
  return getStats(destStat, src2, dest, opts);
}
function startCopy(destStat, src2, dest, opts) {
  if (opts.filter && !opts.filter(src2, dest)) return;
  return getStats(destStat, src2, dest, opts);
}
function getStats(destStat, src2, dest, opts) {
  const statSync = opts.dereference ? fs$b.statSync : fs$b.lstatSync;
  const srcStat = statSync(src2);
  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts);
  else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts);
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts);
  else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
  else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
  throw new Error(`Unknown file: ${src2}`);
}
function onFile(srcStat, destStat, src2, dest, opts) {
  if (!destStat) return copyFile(srcStat, src2, dest, opts);
  return mayCopyFile(srcStat, src2, dest, opts);
}
function mayCopyFile(srcStat, src2, dest, opts) {
  if (opts.overwrite) {
    fs$b.unlinkSync(dest);
    return copyFile(srcStat, src2, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
function copyFile(srcStat, src2, dest, opts) {
  fs$b.copyFileSync(src2, dest);
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src2, dest);
  return setDestMode(dest, srcStat.mode);
}
function handleTimestamps(srcMode, src2, dest) {
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
  return setDestTimestamps(src2, dest);
}
function fileIsNotWritable(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable(dest, srcMode) {
  return setDestMode(dest, srcMode | 128);
}
function setDestMode(dest, srcMode) {
  return fs$b.chmodSync(dest, srcMode);
}
function setDestTimestamps(src2, dest) {
  const updatedSrcStat = fs$b.statSync(src2);
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function onDir(srcStat, destStat, src2, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src2, dest, opts);
  return copyDir(src2, dest, opts);
}
function mkDirAndCopy(srcMode, src2, dest, opts) {
  fs$b.mkdirSync(dest);
  copyDir(src2, dest, opts);
  return setDestMode(dest, srcMode);
}
function copyDir(src2, dest, opts) {
  fs$b.readdirSync(src2).forEach((item) => copyDirItem(item, src2, dest, opts));
}
function copyDirItem(item, src2, dest, opts) {
  const srcItem = path$i.join(src2, item);
  const destItem = path$i.join(dest, item);
  const { destStat } = stat$2.checkPathsSync(srcItem, destItem, "copy", opts);
  return startCopy(destStat, srcItem, destItem, opts);
}
function onLink(destStat, src2, dest, opts) {
  let resolvedSrc = fs$b.readlinkSync(src2);
  if (opts.dereference) {
    resolvedSrc = path$i.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$b.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs$b.readlinkSync(dest);
    } catch (err) {
      if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs$b.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path$i.resolve(process.cwd(), resolvedDest);
    }
    if (stat$2.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    }
    if (fs$b.statSync(dest).isDirectory() && stat$2.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }
    return copyLink(resolvedSrc, dest);
  }
}
function copyLink(resolvedSrc, dest) {
  fs$b.unlinkSync(dest);
  return fs$b.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$1;
const u$8 = universalify$1.fromCallback;
var copy$1 = {
  copy: u$8(copy_1),
  copySync: copySync_1
};
const fs$a = gracefulFs;
const path$h = require$$1$2;
const assert = require$$5;
const isWindows = process.platform === "win32";
function defaults(options) {
  const methods = [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ];
  methods.forEach((m) => {
    options[m] = options[m] || fs$a[m];
    m = m + "Sync";
    options[m] = options[m] || fs$a[m];
  });
  options.maxBusyTries = options.maxBusyTries || 3;
}
function rimraf$1(p, options, cb) {
  let busyTries = 0;
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
  assert(options, "rimraf: invalid options argument provided");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  defaults(options);
  rimraf_(p, options, function CB(er) {
    if (er) {
      if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        return setTimeout(() => rimraf_(p, options, CB), time);
      }
      if (er.code === "ENOENT") er = null;
    }
    cb(er);
  });
}
function rimraf_(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT") {
      return cb(null);
    }
    if (er && er.code === "EPERM" && isWindows) {
      return fixWinEPERM(p, options, er, cb);
    }
    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb);
    }
    options.unlink(p, (er2) => {
      if (er2) {
        if (er2.code === "ENOENT") {
          return cb(null);
        }
        if (er2.code === "EPERM") {
          return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
        }
        if (er2.code === "EISDIR") {
          return rmdir(p, options, er2, cb);
        }
      }
      return cb(er2);
    });
  });
}
function fixWinEPERM(p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.chmod(p, 438, (er2) => {
    if (er2) {
      cb(er2.code === "ENOENT" ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === "ENOENT" ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}
function fixWinEPERMSync(p, options, er) {
  let stats;
  assert(p);
  assert(options);
  try {
    options.chmodSync(p, 438);
  } catch (er2) {
    if (er2.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}
function rmdir(p, options, originalEr, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.rmdir(p, (er) => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
      rmkids(p, options, cb);
    } else if (er && er.code === "ENOTDIR") {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}
function rmkids(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.readdir(p, (er, files) => {
    if (er) return cb(er);
    let n = files.length;
    let errState;
    if (n === 0) return options.rmdir(p, cb);
    files.forEach((f) => {
      rimraf$1(path$h.join(p, f), options, (er2) => {
        if (errState) {
          return;
        }
        if (er2) return cb(errState = er2);
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}
function rimrafSync(p, options) {
  let st;
  options = options || {};
  defaults(options);
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert(options, "rimraf: missing options");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    }
    if (er.code === "EPERM" && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }
  try {
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    } else if (er.code === "EPERM") {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
    } else if (er.code !== "EISDIR") {
      throw er;
    }
    rmdirSync(p, options, er);
  }
}
function rmdirSync(p, options, originalEr) {
  assert(p);
  assert(options);
  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === "ENOTDIR") {
      throw originalEr;
    } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
      rmkidsSync(p, options);
    } else if (er.code !== "ENOENT") {
      throw er;
    }
  }
}
function rmkidsSync(p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach((f) => rimrafSync(path$h.join(p, f), options));
  if (isWindows) {
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret;
      } catch {
      }
    } while (Date.now() - startTime < 500);
  } else {
    const ret = options.rmdirSync(p, options);
    return ret;
  }
}
var rimraf_1 = rimraf$1;
rimraf$1.sync = rimrafSync;
const fs$9 = gracefulFs;
const u$7 = universalify$1.fromCallback;
const rimraf = rimraf_1;
function remove$2(path2, callback) {
  if (fs$9.rm) return fs$9.rm(path2, { recursive: true, force: true }, callback);
  rimraf(path2, callback);
}
function removeSync$1(path2) {
  if (fs$9.rmSync) return fs$9.rmSync(path2, { recursive: true, force: true });
  rimraf.sync(path2);
}
var remove_1 = {
  remove: u$7(remove$2),
  removeSync: removeSync$1
};
const u$6 = universalify$1.fromPromise;
const fs$8 = fs$i;
const path$g = require$$1$2;
const mkdir$3 = mkdirs$2;
const remove$1 = remove_1;
const emptyDir = u$6(async function emptyDir2(dir) {
  let items;
  try {
    items = await fs$8.readdir(dir);
  } catch {
    return mkdir$3.mkdirs(dir);
  }
  return Promise.all(items.map((item) => remove$1.remove(path$g.join(dir, item))));
});
function emptyDirSync(dir) {
  let items;
  try {
    items = fs$8.readdirSync(dir);
  } catch {
    return mkdir$3.mkdirsSync(dir);
  }
  items.forEach((item) => {
    item = path$g.join(dir, item);
    remove$1.removeSync(item);
  });
}
var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
const u$5 = universalify$1.fromCallback;
const path$f = require$$1$2;
const fs$7 = gracefulFs;
const mkdir$2 = mkdirs$2;
function createFile$1(file2, callback) {
  function makeFile() {
    fs$7.writeFile(file2, "", (err) => {
      if (err) return callback(err);
      callback();
    });
  }
  fs$7.stat(file2, (err, stats) => {
    if (!err && stats.isFile()) return callback();
    const dir = path$f.dirname(file2);
    fs$7.stat(dir, (err2, stats2) => {
      if (err2) {
        if (err2.code === "ENOENT") {
          return mkdir$2.mkdirs(dir, (err3) => {
            if (err3) return callback(err3);
            makeFile();
          });
        }
        return callback(err2);
      }
      if (stats2.isDirectory()) makeFile();
      else {
        fs$7.readdir(dir, (err3) => {
          if (err3) return callback(err3);
        });
      }
    });
  });
}
function createFileSync$1(file2) {
  let stats;
  try {
    stats = fs$7.statSync(file2);
  } catch {
  }
  if (stats && stats.isFile()) return;
  const dir = path$f.dirname(file2);
  try {
    if (!fs$7.statSync(dir).isDirectory()) {
      fs$7.readdirSync(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") mkdir$2.mkdirsSync(dir);
    else throw err;
  }
  fs$7.writeFileSync(file2, "");
}
var file = {
  createFile: u$5(createFile$1),
  createFileSync: createFileSync$1
};
const u$4 = universalify$1.fromCallback;
const path$e = require$$1$2;
const fs$6 = gracefulFs;
const mkdir$1 = mkdirs$2;
const pathExists$4 = pathExists_1.pathExists;
const { areIdentical: areIdentical$1 } = stat$4;
function createLink$1(srcpath, dstpath, callback) {
  function makeLink(srcpath2, dstpath2) {
    fs$6.link(srcpath2, dstpath2, (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
  fs$6.lstat(dstpath, (_, dstStat) => {
    fs$6.lstat(srcpath, (err, srcStat) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        return callback(err);
      }
      if (dstStat && areIdentical$1(srcStat, dstStat)) return callback(null);
      const dir = path$e.dirname(dstpath);
      pathExists$4(dir, (err2, dirExists) => {
        if (err2) return callback(err2);
        if (dirExists) return makeLink(srcpath, dstpath);
        mkdir$1.mkdirs(dir, (err3) => {
          if (err3) return callback(err3);
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}
function createLinkSync$1(srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = fs$6.lstatSync(dstpath);
  } catch {
  }
  try {
    const srcStat = fs$6.lstatSync(srcpath);
    if (dstStat && areIdentical$1(srcStat, dstStat)) return;
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  const dir = path$e.dirname(dstpath);
  const dirExists = fs$6.existsSync(dir);
  if (dirExists) return fs$6.linkSync(srcpath, dstpath);
  mkdir$1.mkdirsSync(dir);
  return fs$6.linkSync(srcpath, dstpath);
}
var link = {
  createLink: u$4(createLink$1),
  createLinkSync: createLinkSync$1
};
const path$d = require$$1$2;
const fs$5 = gracefulFs;
const pathExists$3 = pathExists_1.pathExists;
function symlinkPaths$1(srcpath, dstpath, callback) {
  if (path$d.isAbsolute(srcpath)) {
    return fs$5.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        return callback(err);
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      });
    });
  } else {
    const dstdir = path$d.dirname(dstpath);
    const relativeToDst = path$d.join(dstdir, srcpath);
    return pathExists$3(relativeToDst, (err, exists) => {
      if (err) return callback(err);
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        });
      } else {
        return fs$5.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureSymlink");
            return callback(err2);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path$d.relative(dstdir, srcpath)
          });
        });
      }
    });
  }
}
function symlinkPathsSync$1(srcpath, dstpath) {
  let exists;
  if (path$d.isAbsolute(srcpath)) {
    exists = fs$5.existsSync(srcpath);
    if (!exists) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: srcpath,
      toDst: srcpath
    };
  } else {
    const dstdir = path$d.dirname(dstpath);
    const relativeToDst = path$d.join(dstdir, srcpath);
    exists = fs$5.existsSync(relativeToDst);
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      };
    } else {
      exists = fs$5.existsSync(srcpath);
      if (!exists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path$d.relative(dstdir, srcpath)
      };
    }
  }
}
var symlinkPaths_1 = {
  symlinkPaths: symlinkPaths$1,
  symlinkPathsSync: symlinkPathsSync$1
};
const fs$4 = gracefulFs;
function symlinkType$1(srcpath, type2, callback) {
  callback = typeof type2 === "function" ? type2 : callback;
  type2 = typeof type2 === "function" ? false : type2;
  if (type2) return callback(null, type2);
  fs$4.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, "file");
    type2 = stats && stats.isDirectory() ? "dir" : "file";
    callback(null, type2);
  });
}
function symlinkTypeSync$1(srcpath, type2) {
  let stats;
  if (type2) return type2;
  try {
    stats = fs$4.lstatSync(srcpath);
  } catch {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
var symlinkType_1 = {
  symlinkType: symlinkType$1,
  symlinkTypeSync: symlinkTypeSync$1
};
const u$3 = universalify$1.fromCallback;
const path$c = require$$1$2;
const fs$3 = fs$i;
const _mkdirs = mkdirs$2;
const mkdirs = _mkdirs.mkdirs;
const mkdirsSync = _mkdirs.mkdirsSync;
const _symlinkPaths = symlinkPaths_1;
const symlinkPaths = _symlinkPaths.symlinkPaths;
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
const _symlinkType = symlinkType_1;
const symlinkType = _symlinkType.symlinkType;
const symlinkTypeSync = _symlinkType.symlinkTypeSync;
const pathExists$2 = pathExists_1.pathExists;
const { areIdentical } = stat$4;
function createSymlink$1(srcpath, dstpath, type2, callback) {
  callback = typeof type2 === "function" ? type2 : callback;
  type2 = typeof type2 === "function" ? false : type2;
  fs$3.lstat(dstpath, (err, stats) => {
    if (!err && stats.isSymbolicLink()) {
      Promise.all([
        fs$3.stat(srcpath),
        fs$3.stat(dstpath)
      ]).then(([srcStat, dstStat]) => {
        if (areIdentical(srcStat, dstStat)) return callback(null);
        _createSymlink(srcpath, dstpath, type2, callback);
      });
    } else _createSymlink(srcpath, dstpath, type2, callback);
  });
}
function _createSymlink(srcpath, dstpath, type2, callback) {
  symlinkPaths(srcpath, dstpath, (err, relative) => {
    if (err) return callback(err);
    srcpath = relative.toDst;
    symlinkType(relative.toCwd, type2, (err2, type3) => {
      if (err2) return callback(err2);
      const dir = path$c.dirname(dstpath);
      pathExists$2(dir, (err3, dirExists) => {
        if (err3) return callback(err3);
        if (dirExists) return fs$3.symlink(srcpath, dstpath, type3, callback);
        mkdirs(dir, (err4) => {
          if (err4) return callback(err4);
          fs$3.symlink(srcpath, dstpath, type3, callback);
        });
      });
    });
  });
}
function createSymlinkSync$1(srcpath, dstpath, type2) {
  let stats;
  try {
    stats = fs$3.lstatSync(dstpath);
  } catch {
  }
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs$3.statSync(srcpath);
    const dstStat = fs$3.statSync(dstpath);
    if (areIdentical(srcStat, dstStat)) return;
  }
  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type2 = symlinkTypeSync(relative.toCwd, type2);
  const dir = path$c.dirname(dstpath);
  const exists = fs$3.existsSync(dir);
  if (exists) return fs$3.symlinkSync(srcpath, dstpath, type2);
  mkdirsSync(dir);
  return fs$3.symlinkSync(srcpath, dstpath, type2);
}
var symlink = {
  createSymlink: u$3(createSymlink$1),
  createSymlinkSync: createSymlinkSync$1
};
const { createFile, createFileSync } = file;
const { createLink, createLinkSync } = link;
const { createSymlink, createSymlinkSync } = symlink;
var ensure = {
  // file
  createFile,
  createFileSync,
  ensureFile: createFile,
  ensureFileSync: createFileSync,
  // link
  createLink,
  createLinkSync,
  ensureLink: createLink,
  ensureLinkSync: createLinkSync,
  // symlink
  createSymlink,
  createSymlinkSync,
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
};
function stringify$4(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : "";
  const str2 = JSON.stringify(obj, replacer, spaces);
  return str2.replace(/\n/g, EOL) + EOF;
}
function stripBom$1(content) {
  if (Buffer.isBuffer(content)) content = content.toString("utf8");
  return content.replace(/^\uFEFF/, "");
}
var utils = { stringify: stringify$4, stripBom: stripBom$1 };
let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = require$$1$1;
}
const universalify = universalify$1;
const { stringify: stringify$3, stripBom } = utils;
async function _readFile(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  let data = await universalify.fromCallback(fs2.readFile)(file2, options);
  data = stripBom(data);
  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
  return obj;
}
const readFile = universalify.fromPromise(_readFile);
function readFileSync(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  try {
    let content = fs2.readFileSync(file2, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
}
async function _writeFile(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str2 = stringify$3(obj, options);
  await universalify.fromCallback(fs2.writeFile)(file2, str2, options);
}
const writeFile = universalify.fromPromise(_writeFile);
function writeFileSync(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str2 = stringify$3(obj, options);
  return fs2.writeFileSync(file2, str2, options);
}
var jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};
const jsonFile$1 = jsonfile$1;
var jsonfile = {
  // jsonfile exports
  readJson: jsonFile$1.readFile,
  readJsonSync: jsonFile$1.readFileSync,
  writeJson: jsonFile$1.writeFile,
  writeJsonSync: jsonFile$1.writeFileSync
};
const u$2 = universalify$1.fromCallback;
const fs$2 = gracefulFs;
const path$b = require$$1$2;
const mkdir = mkdirs$2;
const pathExists$1 = pathExists_1.pathExists;
function outputFile$1(file2, data, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = "utf8";
  }
  const dir = path$b.dirname(file2);
  pathExists$1(dir, (err, itDoes) => {
    if (err) return callback(err);
    if (itDoes) return fs$2.writeFile(file2, data, encoding, callback);
    mkdir.mkdirs(dir, (err2) => {
      if (err2) return callback(err2);
      fs$2.writeFile(file2, data, encoding, callback);
    });
  });
}
function outputFileSync$1(file2, ...args) {
  const dir = path$b.dirname(file2);
  if (fs$2.existsSync(dir)) {
    return fs$2.writeFileSync(file2, ...args);
  }
  mkdir.mkdirsSync(dir);
  fs$2.writeFileSync(file2, ...args);
}
var outputFile_1 = {
  outputFile: u$2(outputFile$1),
  outputFileSync: outputFileSync$1
};
const { stringify: stringify$2 } = utils;
const { outputFile } = outputFile_1;
async function outputJson(file2, data, options = {}) {
  const str2 = stringify$2(data, options);
  await outputFile(file2, str2, options);
}
var outputJson_1 = outputJson;
const { stringify: stringify$1 } = utils;
const { outputFileSync } = outputFile_1;
function outputJsonSync(file2, data, options) {
  const str2 = stringify$1(data, options);
  outputFileSync(file2, str2, options);
}
var outputJsonSync_1 = outputJsonSync;
const u$1 = universalify$1.fromPromise;
const jsonFile = jsonfile;
jsonFile.outputJson = u$1(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json$1 = jsonFile;
const fs$1 = gracefulFs;
const path$a = require$$1$2;
const copy = copy$1.copy;
const remove = remove_1.remove;
const mkdirp = mkdirs$2.mkdirp;
const pathExists = pathExists_1.pathExists;
const stat$1 = stat$4;
function move$1(src2, dest, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  stat$1.checkPaths(src2, dest, "move", opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, isChangingCase = false } = stats;
    stat$1.checkParentPaths(src2, srcStat, dest, "move", (err2) => {
      if (err2) return cb(err2);
      if (isParentRoot$1(dest)) return doRename$1(src2, dest, overwrite, isChangingCase, cb);
      mkdirp(path$a.dirname(dest), (err3) => {
        if (err3) return cb(err3);
        return doRename$1(src2, dest, overwrite, isChangingCase, cb);
      });
    });
  });
}
function isParentRoot$1(dest) {
  const parent = path$a.dirname(dest);
  const parsedPath = path$a.parse(parent);
  return parsedPath.root === parent;
}
function doRename$1(src2, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase) return rename$1(src2, dest, overwrite, cb);
  if (overwrite) {
    return remove(dest, (err) => {
      if (err) return cb(err);
      return rename$1(src2, dest, overwrite, cb);
    });
  }
  pathExists(dest, (err, destExists) => {
    if (err) return cb(err);
    if (destExists) return cb(new Error("dest already exists."));
    return rename$1(src2, dest, overwrite, cb);
  });
}
function rename$1(src2, dest, overwrite, cb) {
  fs$1.rename(src2, dest, (err) => {
    if (!err) return cb();
    if (err.code !== "EXDEV") return cb(err);
    return moveAcrossDevice$1(src2, dest, overwrite, cb);
  });
}
function moveAcrossDevice$1(src2, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy(src2, dest, opts, (err) => {
    if (err) return cb(err);
    return remove(src2, cb);
  });
}
var move_1 = move$1;
const fs = gracefulFs;
const path$9 = require$$1$2;
const copySync = copy$1.copySync;
const removeSync = remove_1.removeSync;
const mkdirpSync = mkdirs$2.mkdirpSync;
const stat = stat$4;
function moveSync(src2, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src2, dest, "move", opts);
  stat.checkParentPathsSync(src2, srcStat, dest, "move");
  if (!isParentRoot(dest)) mkdirpSync(path$9.dirname(dest));
  return doRename(src2, dest, overwrite, isChangingCase);
}
function isParentRoot(dest) {
  const parent = path$9.dirname(dest);
  const parsedPath = path$9.parse(parent);
  return parsedPath.root === parent;
}
function doRename(src2, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src2, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src2, dest, overwrite);
  }
  if (fs.existsSync(dest)) throw new Error("dest already exists.");
  return rename(src2, dest, overwrite);
}
function rename(src2, dest, overwrite) {
  try {
    fs.renameSync(src2, dest);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    return moveAcrossDevice(src2, dest, overwrite);
  }
}
function moveAcrossDevice(src2, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync(src2, dest, opts);
  return removeSync(src2);
}
var moveSync_1 = moveSync;
const u = universalify$1.fromCallback;
var move = {
  move: u(move_1),
  moveSync: moveSync_1
};
var lib = {
  // Export promiseified graceful-fs:
  ...fs$i,
  // Export extra methods:
  ...copy$1,
  ...empty,
  ...ensure,
  ...json$1,
  ...mkdirs$2,
  ...move,
  ...outputFile_1,
  ...pathExists_1,
  ...remove_1
};
var BaseUpdater$1 = {};
var AppUpdater$1 = {};
var out = {};
var CancellationToken$1 = {};
Object.defineProperty(CancellationToken$1, "__esModule", { value: true });
CancellationToken$1.CancellationError = CancellationToken$1.CancellationToken = void 0;
const events_1$1 = require$$0$2;
class CancellationToken extends events_1$1.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(value) {
    this.removeParentCancelHandler();
    this._parent = value;
    this.parentCancelHandler = () => this.cancel();
    this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(parent) {
    super();
    this.parentCancelHandler = null;
    this._parent = null;
    this._cancelled = false;
    if (parent != null) {
      this.parent = parent;
    }
  }
  cancel() {
    this._cancelled = true;
    this.emit("cancel");
  }
  onCancel(handler) {
    if (this.cancelled) {
      handler();
    } else {
      this.once("cancel", handler);
    }
  }
  createPromise(callback) {
    if (this.cancelled) {
      return Promise.reject(new CancellationError());
    }
    const finallyHandler = () => {
      if (cancelHandler != null) {
        try {
          this.removeListener("cancel", cancelHandler);
          cancelHandler = null;
        } catch (_ignore) {
        }
      }
    };
    let cancelHandler = null;
    return new Promise((resolve, reject) => {
      let addedCancelHandler = null;
      cancelHandler = () => {
        try {
          if (addedCancelHandler != null) {
            addedCancelHandler();
            addedCancelHandler = null;
          }
        } finally {
          reject(new CancellationError());
        }
      };
      if (this.cancelled) {
        cancelHandler();
        return;
      }
      this.onCancel(cancelHandler);
      callback(resolve, reject, (callback2) => {
        addedCancelHandler = callback2;
      });
    }).then((it) => {
      finallyHandler();
      return it;
    }).catch((e) => {
      finallyHandler();
      throw e;
    });
  }
  removeParentCancelHandler() {
    const parent = this._parent;
    if (parent != null && this.parentCancelHandler != null) {
      parent.removeListener("cancel", this.parentCancelHandler);
      this.parentCancelHandler = null;
    }
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners();
      this._parent = null;
    }
  }
}
CancellationToken$1.CancellationToken = CancellationToken;
class CancellationError extends Error {
  constructor() {
    super("cancelled");
  }
}
CancellationToken$1.CancellationError = CancellationError;
var error = {};
Object.defineProperty(error, "__esModule", { value: true });
error.newError = newError;
function newError(message, code) {
  const error2 = new Error(message);
  error2.code = code;
  return error2;
}
var httpExecutor = {};
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse2(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse2(str2) {
    str2 = String(str2);
    if (str2.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str2
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common$6;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common$6;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce2;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self2 = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend3;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend3(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce2(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common$6 = setup;
  return common$6;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module2, exports2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load2;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error2) {
      }
    }
    function load2() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error2) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error2) {
      }
    }
    module2.exports = requireCommon()(exports2);
    const { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error2) {
        return "[UnexpectedJSONParseError]: " + error2.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os2 = require$$2;
  const tty = require$$1$3;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os2.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module2, exports2) {
    const tty = require$$1$3;
    const util2 = require$$4;
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load2;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error2) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = requireCommon()(exports2);
    const { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str2) => str2.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src.exports = requireBrowser();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
var ProgressCallbackTransform$1 = {};
Object.defineProperty(ProgressCallbackTransform$1, "__esModule", { value: true });
ProgressCallbackTransform$1.ProgressCallbackTransform = void 0;
const stream_1$3 = require$$0$1;
class ProgressCallbackTransform extends stream_1$3.Transform {
  constructor(total, cancellationToken, onProgress) {
    super();
    this.total = total;
    this.cancellationToken = cancellationToken;
    this.onProgress = onProgress;
    this.start = Date.now();
    this.transferred = 0;
    this.delta = 0;
    this.nextUpdate = this.start + 1e3;
  }
  _transform(chunk, encoding, callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"), null);
      return;
    }
    this.transferred += chunk.length;
    this.delta += chunk.length;
    const now = Date.now();
    if (now >= this.nextUpdate && this.transferred !== this.total) {
      this.nextUpdate = now + 1e3;
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((now - this.start) / 1e3))
      });
      this.delta = 0;
    }
    callback(null, chunk);
  }
  _flush(callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
    this.delta = 0;
    callback(null);
  }
}
ProgressCallbackTransform$1.ProgressCallbackTransform = ProgressCallbackTransform;
Object.defineProperty(httpExecutor, "__esModule", { value: true });
httpExecutor.DigestTransform = httpExecutor.HttpExecutor = httpExecutor.HttpError = void 0;
httpExecutor.createHttpError = createHttpError;
httpExecutor.parseJson = parseJson;
httpExecutor.configureRequestOptionsFromUrl = configureRequestOptionsFromUrl;
httpExecutor.configureRequestUrl = configureRequestUrl;
httpExecutor.safeGetHeader = safeGetHeader;
httpExecutor.configureRequestOptions = configureRequestOptions;
httpExecutor.safeStringifyJson = safeStringifyJson;
const crypto_1$4 = require$$0$3;
const debug_1$1 = srcExports;
const fs_1$5 = require$$1$1;
const stream_1$2 = require$$0$1;
const url_1$7 = require$$2$1;
const CancellationToken_1$1 = CancellationToken$1;
const error_1$2 = error;
const ProgressCallbackTransform_1 = ProgressCallbackTransform$1;
const debug$2 = (0, debug_1$1.default)("electron-builder");
function createHttpError(response, description = null) {
  return new HttpError(response.statusCode || -1, `${response.statusCode} ${response.statusMessage}` + (description == null ? "" : "\n" + JSON.stringify(description, null, "  ")) + "\nHeaders: " + safeStringifyJson(response.headers), description);
}
const HTTP_STATUS_CODES = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class HttpError extends Error {
  constructor(statusCode, message = `HTTP error: ${HTTP_STATUS_CODES.get(statusCode) || statusCode}`, description = null) {
    super(message);
    this.statusCode = statusCode;
    this.description = description;
    this.name = "HttpError";
    this.code = `HTTP_ERROR_${statusCode}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
httpExecutor.HttpError = HttpError;
function parseJson(result) {
  return result.then((it) => it == null || it.length === 0 ? null : JSON.parse(it));
}
class HttpExecutor {
  constructor() {
    this.maxRedirects = 10;
  }
  request(options, cancellationToken = new CancellationToken_1$1.CancellationToken(), data) {
    configureRequestOptions(options);
    const json2 = data == null ? void 0 : JSON.stringify(data);
    const encodedData = json2 ? Buffer.from(json2) : void 0;
    if (encodedData != null) {
      debug$2(json2);
      const { headers, ...opts } = options;
      options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": encodedData.length,
          ...headers
        },
        ...opts
      };
    }
    return this.doApiRequest(options, cancellationToken, (it) => it.end(encodedData));
  }
  doApiRequest(options, cancellationToken, requestProcessor, redirectCount = 0) {
    if (debug$2.enabled) {
      debug$2(`Request: ${safeStringifyJson(options)}`);
    }
    return cancellationToken.createPromise((resolve, reject, onCancel) => {
      const request = this.createRequest(options, (response) => {
        try {
          this.handleResponse(response, options, cancellationToken, resolve, reject, redirectCount, requestProcessor);
        } catch (e) {
          reject(e);
        }
      });
      this.addErrorAndTimeoutHandlers(request, reject, options.timeout);
      this.addRedirectHandlers(request, options, reject, redirectCount, (options2) => {
        this.doApiRequest(options2, cancellationToken, requestProcessor, redirectCount).then(resolve).catch(reject);
      });
      requestProcessor(request, reject);
      onCancel(() => request.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(request, options, reject, redirectCount, handler) {
  }
  addErrorAndTimeoutHandlers(request, reject, timeout = 60 * 1e3) {
    this.addTimeOutHandler(request, reject, timeout);
    request.on("error", reject);
    request.on("aborted", () => {
      reject(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(response, options, cancellationToken, resolve, reject, redirectCount, requestProcessor) {
    var _a2;
    if (debug$2.enabled) {
      debug$2(`Response: ${response.statusCode} ${response.statusMessage}, request options: ${safeStringifyJson(options)}`);
    }
    if (response.statusCode === 404) {
      reject(createHttpError(response, `method: ${options.method || "GET"} url: ${options.protocol || "https:"}//${options.hostname}${options.port ? `:${options.port}` : ""}${options.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (response.statusCode === 204) {
      resolve();
      return;
    }
    const code = (_a2 = response.statusCode) !== null && _a2 !== void 0 ? _a2 : 0;
    const shouldRedirect = code >= 300 && code < 400;
    const redirectUrl = safeGetHeader(response, "location");
    if (shouldRedirect && redirectUrl != null) {
      if (redirectCount > this.maxRedirects) {
        reject(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options), cancellationToken, requestProcessor, redirectCount).then(resolve).catch(reject);
      return;
    }
    response.setEncoding("utf8");
    let data = "";
    response.on("error", reject);
    response.on("data", (chunk) => data += chunk);
    response.on("end", () => {
      try {
        if (response.statusCode != null && response.statusCode >= 400) {
          const contentType = safeGetHeader(response, "content-type");
          const isJson = contentType != null && (Array.isArray(contentType) ? contentType.find((it) => it.includes("json")) != null : contentType.includes("json"));
          reject(createHttpError(response, `method: ${options.method || "GET"} url: ${options.protocol || "https:"}//${options.hostname}${options.port ? `:${options.port}` : ""}${options.path}

          Data:
          ${isJson ? JSON.stringify(JSON.parse(data)) : data}
          `));
        } else {
          resolve(data.length === 0 ? null : data);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  async downloadToBuffer(url, options) {
    return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
      const responseChunks = [];
      const requestOptions = {
        headers: options.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      configureRequestUrl(url, requestOptions);
      configureRequestOptions(requestOptions);
      this.doDownload(requestOptions, {
        destination: null,
        options,
        onCancel,
        callback: (error2) => {
          if (error2 == null) {
            resolve(Buffer.concat(responseChunks));
          } else {
            reject(error2);
          }
        },
        responseHandler: (response, callback) => {
          let receivedLength = 0;
          response.on("data", (chunk) => {
            receivedLength += chunk.length;
            if (receivedLength > 524288e3) {
              callback(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            responseChunks.push(chunk);
          });
          response.on("end", () => {
            callback(null);
          });
        }
      }, 0);
    });
  }
  doDownload(requestOptions, options, redirectCount) {
    const request = this.createRequest(requestOptions, (response) => {
      if (response.statusCode >= 400) {
        options.callback(new Error(`Cannot download "${requestOptions.protocol || "https:"}//${requestOptions.hostname}${requestOptions.path}", status ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      response.on("error", options.callback);
      const redirectUrl = safeGetHeader(response, "location");
      if (redirectUrl != null) {
        if (redirectCount < this.maxRedirects) {
          this.doDownload(HttpExecutor.prepareRedirectUrlOptions(redirectUrl, requestOptions), options, redirectCount++);
        } else {
          options.callback(this.createMaxRedirectError());
        }
        return;
      }
      if (options.responseHandler == null) {
        configurePipes(options, response);
      } else {
        options.responseHandler(response, options.callback);
      }
    });
    this.addErrorAndTimeoutHandlers(request, options.callback, requestOptions.timeout);
    this.addRedirectHandlers(request, requestOptions, options.callback, redirectCount, (requestOptions2) => {
      this.doDownload(requestOptions2, options, redirectCount++);
    });
    request.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(request, callback, timeout) {
    request.on("socket", (socket) => {
      socket.setTimeout(timeout, () => {
        request.abort();
        callback(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(redirectUrl, options) {
    const newOptions = configureRequestOptionsFromUrl(redirectUrl, { ...options });
    const headers = newOptions.headers;
    if (headers === null || headers === void 0 ? void 0 : headers.authorization) {
      const originalUrl = HttpExecutor.reconstructOriginalUrl(options);
      const parsedRedirectUrl = parseUrl(redirectUrl, options);
      if (HttpExecutor.isCrossOriginRedirect(originalUrl, parsedRedirectUrl)) {
        if (debug$2.enabled) {
          debug$2(`Given the cross-origin redirect (from ${originalUrl.host} to ${parsedRedirectUrl.host}), the Authorization header will be stripped out.`);
        }
        delete headers.authorization;
      }
    }
    return newOptions;
  }
  static reconstructOriginalUrl(options) {
    const protocol = options.protocol || "https:";
    if (!options.hostname) {
      throw new Error("Missing hostname in request options");
    }
    const hostname = options.hostname;
    const port = options.port ? `:${options.port}` : "";
    const path2 = options.path || "/";
    return new url_1$7.URL(`${protocol}//${hostname}${port}${path2}`);
  }
  static isCrossOriginRedirect(originalUrl, redirectUrl) {
    if (originalUrl.hostname.toLowerCase() !== redirectUrl.hostname.toLowerCase()) {
      return true;
    }
    if (originalUrl.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(originalUrl.port) && redirectUrl.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(redirectUrl.port)) {
      return false;
    }
    if (originalUrl.protocol !== redirectUrl.protocol) {
      return true;
    }
    const originalPort = originalUrl.port;
    const redirectPort = redirectUrl.port;
    return originalPort !== redirectPort;
  }
  static retryOnServerError(task, maxRetries = 3) {
    for (let attemptNumber = 0; ; attemptNumber++) {
      try {
        return task();
      } catch (e) {
        if (attemptNumber < maxRetries && (e instanceof HttpError && e.isServerError() || e.code === "EPIPE")) {
          continue;
        }
        throw e;
      }
    }
  }
}
httpExecutor.HttpExecutor = HttpExecutor;
function parseUrl(url, options) {
  try {
    return new url_1$7.URL(url);
  } catch {
    const hostname = options.hostname;
    const protocol = options.protocol || "https:";
    const port = options.port ? `:${options.port}` : "";
    const baseUrl = `${protocol}//${hostname}${port}`;
    return new url_1$7.URL(url, baseUrl);
  }
}
function configureRequestOptionsFromUrl(url, options) {
  const result = configureRequestOptions(options);
  const parsedUrl = parseUrl(url, options);
  configureRequestUrl(parsedUrl, result);
  return result;
}
function configureRequestUrl(url, options) {
  options.protocol = url.protocol;
  options.hostname = url.hostname;
  if (url.port) {
    options.port = url.port;
  } else if (options.port) {
    delete options.port;
  }
  options.path = url.pathname + url.search;
}
class DigestTransform extends stream_1$2.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(expected, algorithm = "sha512", encoding = "base64") {
    super();
    this.expected = expected;
    this.algorithm = algorithm;
    this.encoding = encoding;
    this._actual = null;
    this.isValidateOnEnd = true;
    this.digester = (0, crypto_1$4.createHash)(algorithm);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(chunk, encoding, callback) {
    this.digester.update(chunk);
    callback(null, chunk);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(callback) {
    this._actual = this.digester.digest(this.encoding);
    if (this.isValidateOnEnd) {
      try {
        this.validate();
      } catch (e) {
        callback(e);
        return;
      }
    }
    callback(null);
  }
  validate() {
    if (this._actual == null) {
      throw (0, error_1$2.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    }
    if (this._actual !== this.expected) {
      throw (0, error_1$2.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    }
    return null;
  }
}
httpExecutor.DigestTransform = DigestTransform;
function checkSha2(sha2Header, sha2, callback) {
  if (sha2Header != null && sha2 != null && sha2Header !== sha2) {
    callback(new Error(`checksum mismatch: expected ${sha2} but got ${sha2Header} (X-Checksum-Sha2 header)`));
    return false;
  }
  return true;
}
function safeGetHeader(response, headerKey) {
  const value = response.headers[headerKey];
  if (value == null) {
    return null;
  } else if (Array.isArray(value)) {
    return value.length === 0 ? null : value[value.length - 1];
  } else {
    return value;
  }
}
function configurePipes(options, response) {
  if (!checkSha2(safeGetHeader(response, "X-Checksum-Sha2"), options.options.sha2, options.callback)) {
    return;
  }
  const streams = [];
  if (options.options.onProgress != null) {
    const contentLength = safeGetHeader(response, "content-length");
    if (contentLength != null) {
      streams.push(new ProgressCallbackTransform_1.ProgressCallbackTransform(parseInt(contentLength, 10), options.options.cancellationToken, options.options.onProgress));
    }
  }
  const sha512 = options.options.sha512;
  if (sha512 != null) {
    streams.push(new DigestTransform(sha512, "sha512", sha512.length === 128 && !sha512.includes("+") && !sha512.includes("Z") && !sha512.includes("=") ? "hex" : "base64"));
  } else if (options.options.sha2 != null) {
    streams.push(new DigestTransform(options.options.sha2, "sha256", "hex"));
  }
  const fileOut = (0, fs_1$5.createWriteStream)(options.destination);
  streams.push(fileOut);
  let lastStream = response;
  for (const stream of streams) {
    stream.on("error", (error2) => {
      fileOut.close();
      if (!options.options.cancellationToken.cancelled) {
        options.callback(error2);
      }
    });
    lastStream = lastStream.pipe(stream);
  }
  fileOut.on("finish", () => {
    fileOut.close(options.callback);
  });
}
function configureRequestOptions(options, token, method) {
  if (method != null) {
    options.method = method;
  }
  options.headers = { ...options.headers };
  const headers = options.headers;
  if (token != null) {
    headers.authorization = token.startsWith("Basic") || token.startsWith("Bearer") ? token : `token ${token}`;
  }
  if (headers["User-Agent"] == null) {
    headers["User-Agent"] = "electron-builder";
  }
  if (method == null || method === "GET" || headers["Cache-Control"] == null) {
    headers["Cache-Control"] = "no-cache";
  }
  if (options.protocol == null && process.versions.electron != null) {
    options.protocol = "https:";
  }
  return options;
}
function safeStringifyJson(data, skippedNames) {
  return JSON.stringify(data, (name, value) => {
    if (name.endsWith("Authorization") || name.endsWith("authorization") || name.endsWith("Password") || name.endsWith("PASSWORD") || name.endsWith("Token") || name.includes("password") || name.includes("token") || skippedNames != null && skippedNames.has(name)) {
      return "<stripped sensitive data>";
    }
    return value;
  }, 2);
}
var MemoLazy$1 = {};
Object.defineProperty(MemoLazy$1, "__esModule", { value: true });
MemoLazy$1.MemoLazy = void 0;
class MemoLazy {
  constructor(selector, creator) {
    this.selector = selector;
    this.creator = creator;
    this.selected = void 0;
    this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const selected = this.selector();
    if (this._value !== void 0 && equals(this.selected, selected)) {
      return this._value;
    }
    this.selected = selected;
    const result = this.creator(selected);
    this.value = result;
    return result;
  }
  set value(value) {
    this._value = value;
  }
}
MemoLazy$1.MemoLazy = MemoLazy;
function equals(firstValue, secondValue) {
  const isFirstObject = typeof firstValue === "object" && firstValue !== null;
  const isSecondObject = typeof secondValue === "object" && secondValue !== null;
  if (isFirstObject && isSecondObject) {
    const keys1 = Object.keys(firstValue);
    const keys2 = Object.keys(secondValue);
    return keys1.length === keys2.length && keys1.every((key) => equals(firstValue[key], secondValue[key]));
  }
  return firstValue === secondValue;
}
var publishOptions = {};
Object.defineProperty(publishOptions, "__esModule", { value: true });
publishOptions.githubUrl = githubUrl;
publishOptions.githubTagPrefix = githubTagPrefix;
publishOptions.getS3LikeProviderBaseUrl = getS3LikeProviderBaseUrl;
function githubUrl(options, defaultHost = "github.com") {
  return `${options.protocol || "https"}://${options.host || defaultHost}`;
}
function githubTagPrefix(options) {
  var _a2;
  if (options.tagNamePrefix) {
    return options.tagNamePrefix;
  }
  if ((_a2 = options.vPrefixedTagName) !== null && _a2 !== void 0 ? _a2 : true) {
    return "v";
  }
  return "";
}
function getS3LikeProviderBaseUrl(configuration) {
  const provider = configuration.provider;
  if (provider === "s3") {
    return s3Url(configuration);
  }
  if (provider === "spaces") {
    return spacesUrl(configuration);
  }
  throw new Error(`Not supported provider: ${provider}`);
}
function s3Url(options) {
  let url;
  if (options.accelerate == true) {
    url = `https://${options.bucket}.s3-accelerate.amazonaws.com`;
  } else if (options.endpoint != null) {
    url = `${options.endpoint}/${options.bucket}`;
  } else if (options.bucket.includes(".")) {
    if (options.region == null) {
      throw new Error(`Bucket name "${options.bucket}" includes a dot, but S3 region is missing`);
    }
    if (options.region === "us-east-1") {
      url = `https://s3.amazonaws.com/${options.bucket}`;
    } else {
      url = `https://s3-${options.region}.amazonaws.com/${options.bucket}`;
    }
  } else if (options.region === "cn-north-1") {
    url = `https://${options.bucket}.s3.${options.region}.amazonaws.com.cn`;
  } else {
    url = `https://${options.bucket}.s3.amazonaws.com`;
  }
  return appendPath(url, options.path);
}
function appendPath(url, p) {
  if (p != null && p.length > 0) {
    if (!p.startsWith("/")) {
      url += "/";
    }
    url += p;
  }
  return url;
}
function spacesUrl(options) {
  if (options.name == null) {
    throw new Error(`name is missing`);
  }
  if (options.region == null) {
    throw new Error(`region is missing`);
  }
  return appendPath(`https://${options.name}.${options.region}.digitaloceanspaces.com`, options.path);
}
var retry$1 = {};
Object.defineProperty(retry$1, "__esModule", { value: true });
retry$1.retry = retry;
const CancellationToken_1 = CancellationToken$1;
async function retry(task, options) {
  var _a2;
  const { retries: retryCount, interval, backoff = 0, attempt = 0, shouldRetry, cancellationToken = new CancellationToken_1.CancellationToken() } = options;
  try {
    return await task();
  } catch (error2) {
    if (await Promise.resolve((_a2 = shouldRetry === null || shouldRetry === void 0 ? void 0 : shouldRetry(error2)) !== null && _a2 !== void 0 ? _a2 : true) && retryCount > 0 && !cancellationToken.cancelled) {
      await new Promise((resolve) => setTimeout(resolve, interval + backoff * attempt));
      return await retry(task, { ...options, retries: retryCount - 1, attempt: attempt + 1 });
    } else {
      throw error2;
    }
  }
}
var rfc2253Parser = {};
Object.defineProperty(rfc2253Parser, "__esModule", { value: true });
rfc2253Parser.parseDn = parseDn;
function parseDn(seq2) {
  let quoted = false;
  let key = null;
  let token = "";
  let nextNonSpace = 0;
  seq2 = seq2.trim();
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i <= seq2.length; i++) {
    if (i === seq2.length) {
      if (key !== null) {
        result.set(key, token);
      }
      break;
    }
    const ch = seq2[i];
    if (quoted) {
      if (ch === '"') {
        quoted = false;
        continue;
      }
    } else {
      if (ch === '"') {
        quoted = true;
        continue;
      }
      if (ch === "\\") {
        i++;
        const ord = parseInt(seq2.slice(i, i + 2), 16);
        if (Number.isNaN(ord)) {
          token += seq2[i];
        } else {
          i++;
          token += String.fromCharCode(ord);
        }
        continue;
      }
      if (key === null && ch === "=") {
        key = token;
        token = "";
        continue;
      }
      if (ch === "," || ch === ";" || ch === "+") {
        if (key !== null) {
          result.set(key, token);
        }
        key = null;
        token = "";
        continue;
      }
    }
    if (ch === " " && !quoted) {
      if (token.length === 0) {
        continue;
      }
      if (i > nextNonSpace) {
        let j = i;
        while (seq2[j] === " ") {
          j++;
        }
        nextNonSpace = j;
      }
      if (nextNonSpace >= seq2.length || seq2[nextNonSpace] === "," || seq2[nextNonSpace] === ";" || key === null && seq2[nextNonSpace] === "=" || key !== null && seq2[nextNonSpace] === "+") {
        i = nextNonSpace - 1;
        continue;
      }
    }
    token += ch;
  }
  return result;
}
var uuid = {};
Object.defineProperty(uuid, "__esModule", { value: true });
uuid.nil = uuid.UUID = void 0;
const crypto_1$3 = require$$0$3;
const error_1$1 = error;
const invalidName = "options.name must be either a string or a Buffer";
const randomHost = (0, crypto_1$3.randomBytes)(16);
randomHost[0] = randomHost[0] | 1;
const hex2byte = {};
const byte2hex = [];
for (let i = 0; i < 256; i++) {
  const hex = (i + 256).toString(16).substr(1);
  hex2byte[hex] = i;
  byte2hex[i] = hex;
}
class UUID {
  constructor(uuid2) {
    this.ascii = null;
    this.binary = null;
    const check = UUID.check(uuid2);
    if (!check) {
      throw new Error("not a UUID");
    }
    this.version = check.version;
    if (check.format === "ascii") {
      this.ascii = uuid2;
    } else {
      this.binary = uuid2;
    }
  }
  static v5(name, namespace) {
    return uuidNamed(name, "sha1", 80, namespace);
  }
  toString() {
    if (this.ascii == null) {
      this.ascii = stringify(this.binary);
    }
    return this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(uuid2, offset = 0) {
    if (typeof uuid2 === "string") {
      uuid2 = uuid2.toLowerCase();
      if (!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(uuid2)) {
        return false;
      }
      if (uuid2 === "00000000-0000-0000-0000-000000000000") {
        return { version: void 0, variant: "nil", format: "ascii" };
      }
      return {
        version: (hex2byte[uuid2[14] + uuid2[15]] & 240) >> 4,
        variant: getVariant((hex2byte[uuid2[19] + uuid2[20]] & 224) >> 5),
        format: "ascii"
      };
    }
    if (Buffer.isBuffer(uuid2)) {
      if (uuid2.length < offset + 16) {
        return false;
      }
      let i = 0;
      for (; i < 16; i++) {
        if (uuid2[offset + i] !== 0) {
          break;
        }
      }
      if (i === 16) {
        return { version: void 0, variant: "nil", format: "binary" };
      }
      return {
        version: (uuid2[offset + 6] & 240) >> 4,
        variant: getVariant((uuid2[offset + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, error_1$1.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(input) {
    const buffer = Buffer.allocUnsafe(16);
    let j = 0;
    for (let i = 0; i < 16; i++) {
      buffer[i] = hex2byte[input[j++] + input[j++]];
      if (i === 3 || i === 5 || i === 7 || i === 9) {
        j += 1;
      }
    }
    return buffer;
  }
}
uuid.UUID = UUID;
UUID.OID = UUID.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function getVariant(bits) {
  switch (bits) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var UuidEncoding;
(function(UuidEncoding2) {
  UuidEncoding2[UuidEncoding2["ASCII"] = 0] = "ASCII";
  UuidEncoding2[UuidEncoding2["BINARY"] = 1] = "BINARY";
  UuidEncoding2[UuidEncoding2["OBJECT"] = 2] = "OBJECT";
})(UuidEncoding || (UuidEncoding = {}));
function uuidNamed(name, hashMethod, version, namespace, encoding = UuidEncoding.ASCII) {
  const hash = (0, crypto_1$3.createHash)(hashMethod);
  const nameIsNotAString = typeof name !== "string";
  if (nameIsNotAString && !Buffer.isBuffer(name)) {
    throw (0, error_1$1.newError)(invalidName, "ERR_INVALID_UUID_NAME");
  }
  hash.update(namespace);
  hash.update(name);
  const buffer = hash.digest();
  let result;
  switch (encoding) {
    case UuidEncoding.BINARY:
      buffer[6] = buffer[6] & 15 | version;
      buffer[8] = buffer[8] & 63 | 128;
      result = buffer;
      break;
    case UuidEncoding.OBJECT:
      buffer[6] = buffer[6] & 15 | version;
      buffer[8] = buffer[8] & 63 | 128;
      result = new UUID(buffer);
      break;
    default:
      result = byte2hex[buffer[0]] + byte2hex[buffer[1]] + byte2hex[buffer[2]] + byte2hex[buffer[3]] + "-" + byte2hex[buffer[4]] + byte2hex[buffer[5]] + "-" + byte2hex[buffer[6] & 15 | version] + byte2hex[buffer[7]] + "-" + byte2hex[buffer[8] & 63 | 128] + byte2hex[buffer[9]] + "-" + byte2hex[buffer[10]] + byte2hex[buffer[11]] + byte2hex[buffer[12]] + byte2hex[buffer[13]] + byte2hex[buffer[14]] + byte2hex[buffer[15]];
      break;
  }
  return result;
}
function stringify(buffer) {
  return byte2hex[buffer[0]] + byte2hex[buffer[1]] + byte2hex[buffer[2]] + byte2hex[buffer[3]] + "-" + byte2hex[buffer[4]] + byte2hex[buffer[5]] + "-" + byte2hex[buffer[6]] + byte2hex[buffer[7]] + "-" + byte2hex[buffer[8]] + byte2hex[buffer[9]] + "-" + byte2hex[buffer[10]] + byte2hex[buffer[11]] + byte2hex[buffer[12]] + byte2hex[buffer[13]] + byte2hex[buffer[14]] + byte2hex[buffer[15]];
}
uuid.nil = new UUID("00000000-0000-0000-0000-000000000000");
var xml = {};
var sax$1 = {};
(function(exports2) {
  (function(sax2) {
    sax2.parser = function(strict, opt) {
      return new SAXParser(strict, opt);
    };
    sax2.SAXParser = SAXParser;
    sax2.SAXStream = SAXStream;
    sax2.createStream = createStream;
    sax2.MAX_BUFFER_LENGTH = 64 * 1024;
    var buffers = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    sax2.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function SAXParser(strict, opt) {
      if (!(this instanceof SAXParser)) {
        return new SAXParser(strict, opt);
      }
      var parser = this;
      clearBuffers(parser);
      parser.q = parser.c = "";
      parser.bufferCheckPosition = sax2.MAX_BUFFER_LENGTH;
      parser.opt = opt || {};
      parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
      parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
      parser.tags = [];
      parser.closed = parser.closedRoot = parser.sawRoot = false;
      parser.tag = parser.error = null;
      parser.strict = !!strict;
      parser.noscript = !!(strict || parser.opt.noscript);
      parser.state = S.BEGIN;
      parser.strictEntities = parser.opt.strictEntities;
      parser.ENTITIES = parser.strictEntities ? Object.create(sax2.XML_ENTITIES) : Object.create(sax2.ENTITIES);
      parser.attribList = [];
      if (parser.opt.xmlns) {
        parser.ns = Object.create(rootNS);
      }
      if (parser.opt.unquotedAttributeValues === void 0) {
        parser.opt.unquotedAttributeValues = !strict;
      }
      parser.trackPosition = parser.opt.position !== false;
      if (parser.trackPosition) {
        parser.position = parser.line = parser.column = 0;
      }
      emit(parser, "onready");
    }
    if (!Object.create) {
      Object.create = function(o) {
        function F() {
        }
        F.prototype = o;
        var newf = new F();
        return newf;
      };
    }
    if (!Object.keys) {
      Object.keys = function(o) {
        var a = [];
        for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
        return a;
      };
    }
    function checkBufferLength(parser) {
      var maxAllowed = Math.max(sax2.MAX_BUFFER_LENGTH, 10);
      var maxActual = 0;
      for (var i = 0, l = buffers.length; i < l; i++) {
        var len = parser[buffers[i]].length;
        if (len > maxAllowed) {
          switch (buffers[i]) {
            case "textNode":
              closeText(parser);
              break;
            case "cdata":
              emitNode(parser, "oncdata", parser.cdata);
              parser.cdata = "";
              break;
            case "script":
              emitNode(parser, "onscript", parser.script);
              parser.script = "";
              break;
            default:
              error2(parser, "Max buffer length exceeded: " + buffers[i]);
          }
        }
        maxActual = Math.max(maxActual, len);
      }
      var m = sax2.MAX_BUFFER_LENGTH - maxActual;
      parser.bufferCheckPosition = m + parser.position;
    }
    function clearBuffers(parser) {
      for (var i = 0, l = buffers.length; i < l; i++) {
        parser[buffers[i]] = "";
      }
    }
    function flushBuffers(parser) {
      closeText(parser);
      if (parser.cdata !== "") {
        emitNode(parser, "oncdata", parser.cdata);
        parser.cdata = "";
      }
      if (parser.script !== "") {
        emitNode(parser, "onscript", parser.script);
        parser.script = "";
      }
    }
    SAXParser.prototype = {
      end: function() {
        end(this);
      },
      write,
      resume: function() {
        this.error = null;
        return this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        flushBuffers(this);
      }
    };
    var Stream2;
    try {
      Stream2 = require("stream").Stream;
    } catch (ex) {
      Stream2 = function() {
      };
    }
    if (!Stream2) Stream2 = function() {
    };
    var streamWraps = sax2.EVENTS.filter(function(ev) {
      return ev !== "error" && ev !== "end";
    });
    function createStream(strict, opt) {
      return new SAXStream(strict, opt);
    }
    function SAXStream(strict, opt) {
      if (!(this instanceof SAXStream)) {
        return new SAXStream(strict, opt);
      }
      Stream2.apply(this);
      this._parser = new SAXParser(strict, opt);
      this.writable = true;
      this.readable = true;
      var me = this;
      this._parser.onend = function() {
        me.emit("end");
      };
      this._parser.onerror = function(er) {
        me.emit("error", er);
        me._parser.error = null;
      };
      this._decoder = null;
      streamWraps.forEach(function(ev) {
        Object.defineProperty(me, "on" + ev, {
          get: function() {
            return me._parser["on" + ev];
          },
          set: function(h) {
            if (!h) {
              me.removeAllListeners(ev);
              me._parser["on" + ev] = h;
              return h;
            }
            me.on(ev, h);
          },
          enumerable: true,
          configurable: false
        });
      });
    }
    SAXStream.prototype = Object.create(Stream2.prototype, {
      constructor: {
        value: SAXStream
      }
    });
    SAXStream.prototype.write = function(data) {
      if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
        if (!this._decoder) {
          var SD = require$$1$4.StringDecoder;
          this._decoder = new SD("utf8");
        }
        data = this._decoder.write(data);
      }
      this._parser.write(data.toString());
      this.emit("data", data);
      return true;
    };
    SAXStream.prototype.end = function(chunk) {
      if (chunk && chunk.length) {
        this.write(chunk);
      }
      this._parser.end();
      return true;
    };
    SAXStream.prototype.on = function(ev, handler) {
      var me = this;
      if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
        me._parser["on" + ev] = function() {
          var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          args.splice(0, 0, ev);
          me.emit.apply(me, args);
        };
      }
      return Stream2.prototype.on.call(me, ev, handler);
    };
    var CDATA = "[CDATA[";
    var DOCTYPE = "DOCTYPE";
    var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
    var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
    var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function isWhitespace2(c) {
      return c === " " || c === "\n" || c === "\r" || c === "	";
    }
    function isQuote(c) {
      return c === '"' || c === "'";
    }
    function isAttribEnd(c) {
      return c === ">" || isWhitespace2(c);
    }
    function isMatch(regex, c) {
      return regex.test(c);
    }
    function notMatch(regex, c) {
      return !isMatch(regex, c);
    }
    var S = 0;
    sax2.STATE = {
      BEGIN: S++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: S++,
      // leading whitespace
      TEXT: S++,
      // general stuff
      TEXT_ENTITY: S++,
      // &amp and such.
      OPEN_WAKA: S++,
      // <
      SGML_DECL: S++,
      // <!BLARG
      SGML_DECL_QUOTED: S++,
      // <!BLARG foo "bar
      DOCTYPE: S++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: S++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: S++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: S++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: S++,
      // <!-
      COMMENT: S++,
      // <!--
      COMMENT_ENDING: S++,
      // <!-- blah -
      COMMENT_ENDED: S++,
      // <!-- blah --
      CDATA: S++,
      // <![CDATA[ something
      CDATA_ENDING: S++,
      // ]
      CDATA_ENDING_2: S++,
      // ]]
      PROC_INST: S++,
      // <?hi
      PROC_INST_BODY: S++,
      // <?hi there
      PROC_INST_ENDING: S++,
      // <?hi "there" ?
      OPEN_TAG: S++,
      // <strong
      OPEN_TAG_SLASH: S++,
      // <strong /
      ATTRIB: S++,
      // <a
      ATTRIB_NAME: S++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: S++,
      // <a foo _
      ATTRIB_VALUE: S++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: S++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: S++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: S++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: S++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: S++,
      // <foo bar=&quot
      CLOSE_TAG: S++,
      // </a
      CLOSE_TAG_SAW_WHITE: S++,
      // </a   >
      SCRIPT: S++,
      // <script> ...
      SCRIPT_ENDING: S++
      // <script> ... <
    };
    sax2.XML_ENTITIES = {
      "amp": "&",
      "gt": ">",
      "lt": "<",
      "quot": '"',
      "apos": "'"
    };
    sax2.ENTITIES = {
      "amp": "&",
      "gt": ">",
      "lt": "<",
      "quot": '"',
      "apos": "'",
      "AElig": 198,
      "Aacute": 193,
      "Acirc": 194,
      "Agrave": 192,
      "Aring": 197,
      "Atilde": 195,
      "Auml": 196,
      "Ccedil": 199,
      "ETH": 208,
      "Eacute": 201,
      "Ecirc": 202,
      "Egrave": 200,
      "Euml": 203,
      "Iacute": 205,
      "Icirc": 206,
      "Igrave": 204,
      "Iuml": 207,
      "Ntilde": 209,
      "Oacute": 211,
      "Ocirc": 212,
      "Ograve": 210,
      "Oslash": 216,
      "Otilde": 213,
      "Ouml": 214,
      "THORN": 222,
      "Uacute": 218,
      "Ucirc": 219,
      "Ugrave": 217,
      "Uuml": 220,
      "Yacute": 221,
      "aacute": 225,
      "acirc": 226,
      "aelig": 230,
      "agrave": 224,
      "aring": 229,
      "atilde": 227,
      "auml": 228,
      "ccedil": 231,
      "eacute": 233,
      "ecirc": 234,
      "egrave": 232,
      "eth": 240,
      "euml": 235,
      "iacute": 237,
      "icirc": 238,
      "igrave": 236,
      "iuml": 239,
      "ntilde": 241,
      "oacute": 243,
      "ocirc": 244,
      "ograve": 242,
      "oslash": 248,
      "otilde": 245,
      "ouml": 246,
      "szlig": 223,
      "thorn": 254,
      "uacute": 250,
      "ucirc": 251,
      "ugrave": 249,
      "uuml": 252,
      "yacute": 253,
      "yuml": 255,
      "copy": 169,
      "reg": 174,
      "nbsp": 160,
      "iexcl": 161,
      "cent": 162,
      "pound": 163,
      "curren": 164,
      "yen": 165,
      "brvbar": 166,
      "sect": 167,
      "uml": 168,
      "ordf": 170,
      "laquo": 171,
      "not": 172,
      "shy": 173,
      "macr": 175,
      "deg": 176,
      "plusmn": 177,
      "sup1": 185,
      "sup2": 178,
      "sup3": 179,
      "acute": 180,
      "micro": 181,
      "para": 182,
      "middot": 183,
      "cedil": 184,
      "ordm": 186,
      "raquo": 187,
      "frac14": 188,
      "frac12": 189,
      "frac34": 190,
      "iquest": 191,
      "times": 215,
      "divide": 247,
      "OElig": 338,
      "oelig": 339,
      "Scaron": 352,
      "scaron": 353,
      "Yuml": 376,
      "fnof": 402,
      "circ": 710,
      "tilde": 732,
      "Alpha": 913,
      "Beta": 914,
      "Gamma": 915,
      "Delta": 916,
      "Epsilon": 917,
      "Zeta": 918,
      "Eta": 919,
      "Theta": 920,
      "Iota": 921,
      "Kappa": 922,
      "Lambda": 923,
      "Mu": 924,
      "Nu": 925,
      "Xi": 926,
      "Omicron": 927,
      "Pi": 928,
      "Rho": 929,
      "Sigma": 931,
      "Tau": 932,
      "Upsilon": 933,
      "Phi": 934,
      "Chi": 935,
      "Psi": 936,
      "Omega": 937,
      "alpha": 945,
      "beta": 946,
      "gamma": 947,
      "delta": 948,
      "epsilon": 949,
      "zeta": 950,
      "eta": 951,
      "theta": 952,
      "iota": 953,
      "kappa": 954,
      "lambda": 955,
      "mu": 956,
      "nu": 957,
      "xi": 958,
      "omicron": 959,
      "pi": 960,
      "rho": 961,
      "sigmaf": 962,
      "sigma": 963,
      "tau": 964,
      "upsilon": 965,
      "phi": 966,
      "chi": 967,
      "psi": 968,
      "omega": 969,
      "thetasym": 977,
      "upsih": 978,
      "piv": 982,
      "ensp": 8194,
      "emsp": 8195,
      "thinsp": 8201,
      "zwnj": 8204,
      "zwj": 8205,
      "lrm": 8206,
      "rlm": 8207,
      "ndash": 8211,
      "mdash": 8212,
      "lsquo": 8216,
      "rsquo": 8217,
      "sbquo": 8218,
      "ldquo": 8220,
      "rdquo": 8221,
      "bdquo": 8222,
      "dagger": 8224,
      "Dagger": 8225,
      "bull": 8226,
      "hellip": 8230,
      "permil": 8240,
      "prime": 8242,
      "Prime": 8243,
      "lsaquo": 8249,
      "rsaquo": 8250,
      "oline": 8254,
      "frasl": 8260,
      "euro": 8364,
      "image": 8465,
      "weierp": 8472,
      "real": 8476,
      "trade": 8482,
      "alefsym": 8501,
      "larr": 8592,
      "uarr": 8593,
      "rarr": 8594,
      "darr": 8595,
      "harr": 8596,
      "crarr": 8629,
      "lArr": 8656,
      "uArr": 8657,
      "rArr": 8658,
      "dArr": 8659,
      "hArr": 8660,
      "forall": 8704,
      "part": 8706,
      "exist": 8707,
      "empty": 8709,
      "nabla": 8711,
      "isin": 8712,
      "notin": 8713,
      "ni": 8715,
      "prod": 8719,
      "sum": 8721,
      "minus": 8722,
      "lowast": 8727,
      "radic": 8730,
      "prop": 8733,
      "infin": 8734,
      "ang": 8736,
      "and": 8743,
      "or": 8744,
      "cap": 8745,
      "cup": 8746,
      "int": 8747,
      "there4": 8756,
      "sim": 8764,
      "cong": 8773,
      "asymp": 8776,
      "ne": 8800,
      "equiv": 8801,
      "le": 8804,
      "ge": 8805,
      "sub": 8834,
      "sup": 8835,
      "nsub": 8836,
      "sube": 8838,
      "supe": 8839,
      "oplus": 8853,
      "otimes": 8855,
      "perp": 8869,
      "sdot": 8901,
      "lceil": 8968,
      "rceil": 8969,
      "lfloor": 8970,
      "rfloor": 8971,
      "lang": 9001,
      "rang": 9002,
      "loz": 9674,
      "spades": 9824,
      "clubs": 9827,
      "hearts": 9829,
      "diams": 9830
    };
    Object.keys(sax2.ENTITIES).forEach(function(key) {
      var e = sax2.ENTITIES[key];
      var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
      sax2.ENTITIES[key] = s2;
    });
    for (var s in sax2.STATE) {
      sax2.STATE[sax2.STATE[s]] = s;
    }
    S = sax2.STATE;
    function emit(parser, event, data) {
      parser[event] && parser[event](data);
    }
    function emitNode(parser, nodeType, data) {
      if (parser.textNode) closeText(parser);
      emit(parser, nodeType, data);
    }
    function closeText(parser) {
      parser.textNode = textopts(parser.opt, parser.textNode);
      if (parser.textNode) emit(parser, "ontext", parser.textNode);
      parser.textNode = "";
    }
    function textopts(opt, text) {
      if (opt.trim) text = text.trim();
      if (opt.normalize) text = text.replace(/\s+/g, " ");
      return text;
    }
    function error2(parser, er) {
      closeText(parser);
      if (parser.trackPosition) {
        er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
      }
      er = new Error(er);
      parser.error = er;
      emit(parser, "onerror", er);
      return parser;
    }
    function end(parser) {
      if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
      if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
        error2(parser, "Unexpected end");
      }
      closeText(parser);
      parser.c = "";
      parser.closed = true;
      emit(parser, "onend");
      SAXParser.call(parser, parser.strict, parser.opt);
      return parser;
    }
    function strictFail(parser, message) {
      if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
        throw new Error("bad call to strictFail");
      }
      if (parser.strict) {
        error2(parser, message);
      }
    }
    function newTag(parser) {
      if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
      var parent = parser.tags[parser.tags.length - 1] || parser;
      var tag = parser.tag = { name: parser.tagName, attributes: {} };
      if (parser.opt.xmlns) {
        tag.ns = parent.ns;
      }
      parser.attribList.length = 0;
      emitNode(parser, "onopentagstart", tag);
    }
    function qname(name, attribute) {
      var i = name.indexOf(":");
      var qualName = i < 0 ? ["", name] : name.split(":");
      var prefix = qualName[0];
      var local = qualName[1];
      if (attribute && name === "xmlns") {
        prefix = "xmlns";
        local = "";
      }
      return { prefix, local };
    }
    function attrib(parser) {
      if (!parser.strict) {
        parser.attribName = parser.attribName[parser.looseCase]();
      }
      if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
        parser.attribName = parser.attribValue = "";
        return;
      }
      if (parser.opt.xmlns) {
        var qn = qname(parser.attribName, true);
        var prefix = qn.prefix;
        var local = qn.local;
        if (prefix === "xmlns") {
          if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
            strictFail(
              parser,
              "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
            );
          } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
            strictFail(
              parser,
              "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
            );
          } else {
            var tag = parser.tag;
            var parent = parser.tags[parser.tags.length - 1] || parser;
            if (tag.ns === parent.ns) {
              tag.ns = Object.create(parent.ns);
            }
            tag.ns[local] = parser.attribValue;
          }
        }
        parser.attribList.push([parser.attribName, parser.attribValue]);
      } else {
        parser.tag.attributes[parser.attribName] = parser.attribValue;
        emitNode(parser, "onattribute", {
          name: parser.attribName,
          value: parser.attribValue
        });
      }
      parser.attribName = parser.attribValue = "";
    }
    function openTag(parser, selfClosing) {
      if (parser.opt.xmlns) {
        var tag = parser.tag;
        var qn = qname(parser.tagName);
        tag.prefix = qn.prefix;
        tag.local = qn.local;
        tag.uri = tag.ns[qn.prefix] || "";
        if (tag.prefix && !tag.uri) {
          strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
          tag.uri = qn.prefix;
        }
        var parent = parser.tags[parser.tags.length - 1] || parser;
        if (tag.ns && parent.ns !== tag.ns) {
          Object.keys(tag.ns).forEach(function(p) {
            emitNode(parser, "onopennamespace", {
              prefix: p,
              uri: tag.ns[p]
            });
          });
        }
        for (var i = 0, l = parser.attribList.length; i < l; i++) {
          var nv = parser.attribList[i];
          var name = nv[0];
          var value = nv[1];
          var qualName = qname(name, true);
          var prefix = qualName.prefix;
          var local = qualName.local;
          var uri = prefix === "" ? "" : tag.ns[prefix] || "";
          var a = {
            name,
            value,
            prefix,
            local,
            uri
          };
          if (prefix && prefix !== "xmlns" && !uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
            a.uri = prefix;
          }
          parser.tag.attributes[name] = a;
          emitNode(parser, "onattribute", a);
        }
        parser.attribList.length = 0;
      }
      parser.tag.isSelfClosing = !!selfClosing;
      parser.sawRoot = true;
      parser.tags.push(parser.tag);
      emitNode(parser, "onopentag", parser.tag);
      if (!selfClosing) {
        if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
          parser.state = S.SCRIPT;
        } else {
          parser.state = S.TEXT;
        }
        parser.tag = null;
        parser.tagName = "";
      }
      parser.attribName = parser.attribValue = "";
      parser.attribList.length = 0;
    }
    function closeTag(parser) {
      if (!parser.tagName) {
        strictFail(parser, "Weird empty close tag.");
        parser.textNode += "</>";
        parser.state = S.TEXT;
        return;
      }
      if (parser.script) {
        if (parser.tagName !== "script") {
          parser.script += "</" + parser.tagName + ">";
          parser.tagName = "";
          parser.state = S.SCRIPT;
          return;
        }
        emitNode(parser, "onscript", parser.script);
        parser.script = "";
      }
      var t2 = parser.tags.length;
      var tagName = parser.tagName;
      if (!parser.strict) {
        tagName = tagName[parser.looseCase]();
      }
      var closeTo = tagName;
      while (t2--) {
        var close = parser.tags[t2];
        if (close.name !== closeTo) {
          strictFail(parser, "Unexpected close tag");
        } else {
          break;
        }
      }
      if (t2 < 0) {
        strictFail(parser, "Unmatched closing tag: " + parser.tagName);
        parser.textNode += "</" + parser.tagName + ">";
        parser.state = S.TEXT;
        return;
      }
      parser.tagName = tagName;
      var s2 = parser.tags.length;
      while (s2-- > t2) {
        var tag = parser.tag = parser.tags.pop();
        parser.tagName = parser.tag.name;
        emitNode(parser, "onclosetag", parser.tagName);
        var x = {};
        for (var i in tag.ns) {
          x[i] = tag.ns[i];
        }
        var parent = parser.tags[parser.tags.length - 1] || parser;
        if (parser.opt.xmlns && tag.ns !== parent.ns) {
          Object.keys(tag.ns).forEach(function(p) {
            var n = tag.ns[p];
            emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
          });
        }
      }
      if (t2 === 0) parser.closedRoot = true;
      parser.tagName = parser.attribValue = parser.attribName = "";
      parser.attribList.length = 0;
      parser.state = S.TEXT;
    }
    function parseEntity(parser) {
      var entity = parser.entity;
      var entityLC = entity.toLowerCase();
      var num;
      var numStr = "";
      if (parser.ENTITIES[entity]) {
        return parser.ENTITIES[entity];
      }
      if (parser.ENTITIES[entityLC]) {
        return parser.ENTITIES[entityLC];
      }
      entity = entityLC;
      if (entity.charAt(0) === "#") {
        if (entity.charAt(1) === "x") {
          entity = entity.slice(2);
          num = parseInt(entity, 16);
          numStr = num.toString(16);
        } else {
          entity = entity.slice(1);
          num = parseInt(entity, 10);
          numStr = num.toString(10);
        }
      }
      entity = entity.replace(/^0+/, "");
      if (isNaN(num) || numStr.toLowerCase() !== entity) {
        strictFail(parser, "Invalid character entity");
        return "&" + parser.entity + ";";
      }
      return String.fromCodePoint(num);
    }
    function beginWhiteSpace(parser, c) {
      if (c === "<") {
        parser.state = S.OPEN_WAKA;
        parser.startTagPosition = parser.position;
      } else if (!isWhitespace2(c)) {
        strictFail(parser, "Non-whitespace before first tag.");
        parser.textNode = c;
        parser.state = S.TEXT;
      }
    }
    function charAt(chunk, i) {
      var result = "";
      if (i < chunk.length) {
        result = chunk.charAt(i);
      }
      return result;
    }
    function write(chunk) {
      var parser = this;
      if (this.error) {
        throw this.error;
      }
      if (parser.closed) {
        return error2(
          parser,
          "Cannot write after close. Assign an onready handler."
        );
      }
      if (chunk === null) {
        return end(parser);
      }
      if (typeof chunk === "object") {
        chunk = chunk.toString();
      }
      var i = 0;
      var c = "";
      while (true) {
        c = charAt(chunk, i++);
        parser.c = c;
        if (!c) {
          break;
        }
        if (parser.trackPosition) {
          parser.position++;
          if (c === "\n") {
            parser.line++;
            parser.column = 0;
          } else {
            parser.column++;
          }
        }
        switch (parser.state) {
          case S.BEGIN:
            parser.state = S.BEGIN_WHITESPACE;
            if (c === "\uFEFF") {
              continue;
            }
            beginWhiteSpace(parser, c);
            continue;
          case S.BEGIN_WHITESPACE:
            beginWhiteSpace(parser, c);
            continue;
          case S.TEXT:
            if (parser.sawRoot && !parser.closedRoot) {
              var starti = i - 1;
              while (c && c !== "<" && c !== "&") {
                c = charAt(chunk, i++);
                if (c && parser.trackPosition) {
                  parser.position++;
                  if (c === "\n") {
                    parser.line++;
                    parser.column = 0;
                  } else {
                    parser.column++;
                  }
                }
              }
              parser.textNode += chunk.substring(starti, i - 1);
            }
            if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
              parser.state = S.OPEN_WAKA;
              parser.startTagPosition = parser.position;
            } else {
              if (!isWhitespace2(c) && (!parser.sawRoot || parser.closedRoot)) {
                strictFail(parser, "Text data outside of root node.");
              }
              if (c === "&") {
                parser.state = S.TEXT_ENTITY;
              } else {
                parser.textNode += c;
              }
            }
            continue;
          case S.SCRIPT:
            if (c === "<") {
              parser.state = S.SCRIPT_ENDING;
            } else {
              parser.script += c;
            }
            continue;
          case S.SCRIPT_ENDING:
            if (c === "/") {
              parser.state = S.CLOSE_TAG;
            } else {
              parser.script += "<" + c;
              parser.state = S.SCRIPT;
            }
            continue;
          case S.OPEN_WAKA:
            if (c === "!") {
              parser.state = S.SGML_DECL;
              parser.sgmlDecl = "";
            } else if (isWhitespace2(c)) ;
            else if (isMatch(nameStart, c)) {
              parser.state = S.OPEN_TAG;
              parser.tagName = c;
            } else if (c === "/") {
              parser.state = S.CLOSE_TAG;
              parser.tagName = "";
            } else if (c === "?") {
              parser.state = S.PROC_INST;
              parser.procInstName = parser.procInstBody = "";
            } else {
              strictFail(parser, "Unencoded <");
              if (parser.startTagPosition + 1 < parser.position) {
                var pad = parser.position - parser.startTagPosition;
                c = new Array(pad).join(" ") + c;
              }
              parser.textNode += "<" + c;
              parser.state = S.TEXT;
            }
            continue;
          case S.SGML_DECL:
            if (parser.sgmlDecl + c === "--") {
              parser.state = S.COMMENT;
              parser.comment = "";
              parser.sgmlDecl = "";
              continue;
            }
            if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
              parser.state = S.DOCTYPE_DTD;
              parser.doctype += "<!" + parser.sgmlDecl + c;
              parser.sgmlDecl = "";
            } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
              emitNode(parser, "onopencdata");
              parser.state = S.CDATA;
              parser.sgmlDecl = "";
              parser.cdata = "";
            } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
              parser.state = S.DOCTYPE;
              if (parser.doctype || parser.sawRoot) {
                strictFail(
                  parser,
                  "Inappropriately located doctype declaration"
                );
              }
              parser.doctype = "";
              parser.sgmlDecl = "";
            } else if (c === ">") {
              emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
              parser.sgmlDecl = "";
              parser.state = S.TEXT;
            } else if (isQuote(c)) {
              parser.state = S.SGML_DECL_QUOTED;
              parser.sgmlDecl += c;
            } else {
              parser.sgmlDecl += c;
            }
            continue;
          case S.SGML_DECL_QUOTED:
            if (c === parser.q) {
              parser.state = S.SGML_DECL;
              parser.q = "";
            }
            parser.sgmlDecl += c;
            continue;
          case S.DOCTYPE:
            if (c === ">") {
              parser.state = S.TEXT;
              emitNode(parser, "ondoctype", parser.doctype);
              parser.doctype = true;
            } else {
              parser.doctype += c;
              if (c === "[") {
                parser.state = S.DOCTYPE_DTD;
              } else if (isQuote(c)) {
                parser.state = S.DOCTYPE_QUOTED;
                parser.q = c;
              }
            }
            continue;
          case S.DOCTYPE_QUOTED:
            parser.doctype += c;
            if (c === parser.q) {
              parser.q = "";
              parser.state = S.DOCTYPE;
            }
            continue;
          case S.DOCTYPE_DTD:
            if (c === "]") {
              parser.doctype += c;
              parser.state = S.DOCTYPE;
            } else if (c === "<") {
              parser.state = S.OPEN_WAKA;
              parser.startTagPosition = parser.position;
            } else if (isQuote(c)) {
              parser.doctype += c;
              parser.state = S.DOCTYPE_DTD_QUOTED;
              parser.q = c;
            } else {
              parser.doctype += c;
            }
            continue;
          case S.DOCTYPE_DTD_QUOTED:
            parser.doctype += c;
            if (c === parser.q) {
              parser.state = S.DOCTYPE_DTD;
              parser.q = "";
            }
            continue;
          case S.COMMENT:
            if (c === "-") {
              parser.state = S.COMMENT_ENDING;
            } else {
              parser.comment += c;
            }
            continue;
          case S.COMMENT_ENDING:
            if (c === "-") {
              parser.state = S.COMMENT_ENDED;
              parser.comment = textopts(parser.opt, parser.comment);
              if (parser.comment) {
                emitNode(parser, "oncomment", parser.comment);
              }
              parser.comment = "";
            } else {
              parser.comment += "-" + c;
              parser.state = S.COMMENT;
            }
            continue;
          case S.COMMENT_ENDED:
            if (c !== ">") {
              strictFail(parser, "Malformed comment");
              parser.comment += "--" + c;
              parser.state = S.COMMENT;
            } else if (parser.doctype && parser.doctype !== true) {
              parser.state = S.DOCTYPE_DTD;
            } else {
              parser.state = S.TEXT;
            }
            continue;
          case S.CDATA:
            if (c === "]") {
              parser.state = S.CDATA_ENDING;
            } else {
              parser.cdata += c;
            }
            continue;
          case S.CDATA_ENDING:
            if (c === "]") {
              parser.state = S.CDATA_ENDING_2;
            } else {
              parser.cdata += "]" + c;
              parser.state = S.CDATA;
            }
            continue;
          case S.CDATA_ENDING_2:
            if (c === ">") {
              if (parser.cdata) {
                emitNode(parser, "oncdata", parser.cdata);
              }
              emitNode(parser, "onclosecdata");
              parser.cdata = "";
              parser.state = S.TEXT;
            } else if (c === "]") {
              parser.cdata += "]";
            } else {
              parser.cdata += "]]" + c;
              parser.state = S.CDATA;
            }
            continue;
          case S.PROC_INST:
            if (c === "?") {
              parser.state = S.PROC_INST_ENDING;
            } else if (isWhitespace2(c)) {
              parser.state = S.PROC_INST_BODY;
            } else {
              parser.procInstName += c;
            }
            continue;
          case S.PROC_INST_BODY:
            if (!parser.procInstBody && isWhitespace2(c)) {
              continue;
            } else if (c === "?") {
              parser.state = S.PROC_INST_ENDING;
            } else {
              parser.procInstBody += c;
            }
            continue;
          case S.PROC_INST_ENDING:
            if (c === ">") {
              emitNode(parser, "onprocessinginstruction", {
                name: parser.procInstName,
                body: parser.procInstBody
              });
              parser.procInstName = parser.procInstBody = "";
              parser.state = S.TEXT;
            } else {
              parser.procInstBody += "?" + c;
              parser.state = S.PROC_INST_BODY;
            }
            continue;
          case S.OPEN_TAG:
            if (isMatch(nameBody, c)) {
              parser.tagName += c;
            } else {
              newTag(parser);
              if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else {
                if (!isWhitespace2(c)) {
                  strictFail(parser, "Invalid character in tag name");
                }
                parser.state = S.ATTRIB;
              }
            }
            continue;
          case S.OPEN_TAG_SLASH:
            if (c === ">") {
              openTag(parser, true);
              closeTag(parser);
            } else {
              strictFail(parser, "Forward-slash in opening tag not followed by >");
              parser.state = S.ATTRIB;
            }
            continue;
          case S.ATTRIB:
            if (isWhitespace2(c)) {
              continue;
            } else if (c === ">") {
              openTag(parser);
            } else if (c === "/") {
              parser.state = S.OPEN_TAG_SLASH;
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c;
              parser.attribValue = "";
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_NAME:
            if (c === "=") {
              parser.state = S.ATTRIB_VALUE;
            } else if (c === ">") {
              strictFail(parser, "Attribute without value");
              parser.attribValue = parser.attribName;
              attrib(parser);
              openTag(parser);
            } else if (isWhitespace2(c)) {
              parser.state = S.ATTRIB_NAME_SAW_WHITE;
            } else if (isMatch(nameBody, c)) {
              parser.attribName += c;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_NAME_SAW_WHITE:
            if (c === "=") {
              parser.state = S.ATTRIB_VALUE;
            } else if (isWhitespace2(c)) {
              continue;
            } else {
              strictFail(parser, "Attribute without value");
              parser.tag.attributes[parser.attribName] = "";
              parser.attribValue = "";
              emitNode(parser, "onattribute", {
                name: parser.attribName,
                value: ""
              });
              parser.attribName = "";
              if (c === ">") {
                openTag(parser);
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
                parser.state = S.ATTRIB;
              }
            }
            continue;
          case S.ATTRIB_VALUE:
            if (isWhitespace2(c)) {
              continue;
            } else if (isQuote(c)) {
              parser.q = c;
              parser.state = S.ATTRIB_VALUE_QUOTED;
            } else {
              if (!parser.opt.unquotedAttributeValues) {
                error2(parser, "Unquoted attribute value");
              }
              parser.state = S.ATTRIB_VALUE_UNQUOTED;
              parser.attribValue = c;
            }
            continue;
          case S.ATTRIB_VALUE_QUOTED:
            if (c !== parser.q) {
              if (c === "&") {
                parser.state = S.ATTRIB_VALUE_ENTITY_Q;
              } else {
                parser.attribValue += c;
              }
              continue;
            }
            attrib(parser);
            parser.q = "";
            parser.state = S.ATTRIB_VALUE_CLOSED;
            continue;
          case S.ATTRIB_VALUE_CLOSED:
            if (isWhitespace2(c)) {
              parser.state = S.ATTRIB;
            } else if (c === ">") {
              openTag(parser);
            } else if (c === "/") {
              parser.state = S.OPEN_TAG_SLASH;
            } else if (isMatch(nameStart, c)) {
              strictFail(parser, "No whitespace between attributes");
              parser.attribName = c;
              parser.attribValue = "";
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_VALUE_UNQUOTED:
            if (!isAttribEnd(c)) {
              if (c === "&") {
                parser.state = S.ATTRIB_VALUE_ENTITY_U;
              } else {
                parser.attribValue += c;
              }
              continue;
            }
            attrib(parser);
            if (c === ">") {
              openTag(parser);
            } else {
              parser.state = S.ATTRIB;
            }
            continue;
          case S.CLOSE_TAG:
            if (!parser.tagName) {
              if (isWhitespace2(c)) {
                continue;
              } else if (notMatch(nameStart, c)) {
                if (parser.script) {
                  parser.script += "</" + c;
                  parser.state = S.SCRIPT;
                } else {
                  strictFail(parser, "Invalid tagname in closing tag.");
                }
              } else {
                parser.tagName = c;
              }
            } else if (c === ">") {
              closeTag(parser);
            } else if (isMatch(nameBody, c)) {
              parser.tagName += c;
            } else if (parser.script) {
              parser.script += "</" + parser.tagName;
              parser.tagName = "";
              parser.state = S.SCRIPT;
            } else {
              if (!isWhitespace2(c)) {
                strictFail(parser, "Invalid tagname in closing tag");
              }
              parser.state = S.CLOSE_TAG_SAW_WHITE;
            }
            continue;
          case S.CLOSE_TAG_SAW_WHITE:
            if (isWhitespace2(c)) {
              continue;
            }
            if (c === ">") {
              closeTag(parser);
            } else {
              strictFail(parser, "Invalid characters in closing tag");
            }
            continue;
          case S.TEXT_ENTITY:
          case S.ATTRIB_VALUE_ENTITY_Q:
          case S.ATTRIB_VALUE_ENTITY_U:
            var returnState;
            var buffer;
            switch (parser.state) {
              case S.TEXT_ENTITY:
                returnState = S.TEXT;
                buffer = "textNode";
                break;
              case S.ATTRIB_VALUE_ENTITY_Q:
                returnState = S.ATTRIB_VALUE_QUOTED;
                buffer = "attribValue";
                break;
              case S.ATTRIB_VALUE_ENTITY_U:
                returnState = S.ATTRIB_VALUE_UNQUOTED;
                buffer = "attribValue";
                break;
            }
            if (c === ";") {
              var parsedEntity = parseEntity(parser);
              if (parser.opt.unparsedEntities && !Object.values(sax2.XML_ENTITIES).includes(parsedEntity)) {
                parser.entity = "";
                parser.state = returnState;
                parser.write(parsedEntity);
              } else {
                parser[buffer] += parsedEntity;
                parser.entity = "";
                parser.state = returnState;
              }
            } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
              parser.entity += c;
            } else {
              strictFail(parser, "Invalid character in entity name");
              parser[buffer] += "&" + parser.entity + c;
              parser.entity = "";
              parser.state = returnState;
            }
            continue;
          default: {
            throw new Error(parser, "Unknown state: " + parser.state);
          }
        }
      }
      if (parser.position >= parser.bufferCheckPosition) {
        checkBufferLength(parser);
      }
      return parser;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    if (!String.fromCodePoint) {
      (function() {
        var stringFromCharCode = String.fromCharCode;
        var floor = Math.floor;
        var fromCodePoint = function() {
          var MAX_SIZE = 16384;
          var codeUnits = [];
          var highSurrogate;
          var lowSurrogate;
          var index = -1;
          var length = arguments.length;
          if (!length) {
            return "";
          }
          var result = "";
          while (++index < length) {
            var codePoint = Number(arguments[index]);
            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 1114111 || // not a valid Unicode code point
            floor(codePoint) !== codePoint) {
              throw RangeError("Invalid code point: " + codePoint);
            }
            if (codePoint <= 65535) {
              codeUnits.push(codePoint);
            } else {
              codePoint -= 65536;
              highSurrogate = (codePoint >> 10) + 55296;
              lowSurrogate = codePoint % 1024 + 56320;
              codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
              result += stringFromCharCode.apply(null, codeUnits);
              codeUnits.length = 0;
            }
          }
          return result;
        };
        if (Object.defineProperty) {
          Object.defineProperty(String, "fromCodePoint", {
            value: fromCodePoint,
            configurable: true,
            writable: true
          });
        } else {
          String.fromCodePoint = fromCodePoint;
        }
      })();
    }
  })(exports2);
})(sax$1);
Object.defineProperty(xml, "__esModule", { value: true });
xml.XElement = void 0;
xml.parseXml = parseXml;
const sax = sax$1;
const error_1 = error;
class XElement {
  constructor(name) {
    this.name = name;
    this.value = "";
    this.attributes = null;
    this.isCData = false;
    this.elements = null;
    if (!name) {
      throw (0, error_1.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    }
    if (!isValidName(name)) {
      throw (0, error_1.newError)(`Invalid element name: ${name}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
  }
  attribute(name) {
    const result = this.attributes === null ? null : this.attributes[name];
    if (result == null) {
      throw (0, error_1.newError)(`No attribute "${name}"`, "ERR_XML_MISSED_ATTRIBUTE");
    }
    return result;
  }
  removeAttribute(name) {
    if (this.attributes !== null) {
      delete this.attributes[name];
    }
  }
  element(name, ignoreCase = false, errorIfMissed = null) {
    const result = this.elementOrNull(name, ignoreCase);
    if (result === null) {
      throw (0, error_1.newError)(errorIfMissed || `No element "${name}"`, "ERR_XML_MISSED_ELEMENT");
    }
    return result;
  }
  elementOrNull(name, ignoreCase = false) {
    if (this.elements === null) {
      return null;
    }
    for (const element of this.elements) {
      if (isNameEquals(element, name, ignoreCase)) {
        return element;
      }
    }
    return null;
  }
  getElements(name, ignoreCase = false) {
    if (this.elements === null) {
      return [];
    }
    return this.elements.filter((it) => isNameEquals(it, name, ignoreCase));
  }
  elementValueOrEmpty(name, ignoreCase = false) {
    const element = this.elementOrNull(name, ignoreCase);
    return element === null ? "" : element.value;
  }
}
xml.XElement = XElement;
const NAME_REG_EXP = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function isValidName(name) {
  return NAME_REG_EXP.test(name);
}
function isNameEquals(element, name, ignoreCase) {
  const elementName = element.name;
  return elementName === name || ignoreCase === true && elementName.length === name.length && elementName.toLowerCase() === name.toLowerCase();
}
function parseXml(data) {
  let rootElement = null;
  const parser = sax.parser(true, {});
  const elements = [];
  parser.onopentag = (saxElement) => {
    const element = new XElement(saxElement.name);
    element.attributes = saxElement.attributes;
    if (rootElement === null) {
      rootElement = element;
    } else {
      const parent = elements[elements.length - 1];
      if (parent.elements == null) {
        parent.elements = [];
      }
      parent.elements.push(element);
    }
    elements.push(element);
  };
  parser.onclosetag = () => {
    elements.pop();
  };
  parser.ontext = (text) => {
    if (elements.length > 0) {
      elements[elements.length - 1].value = text;
    }
  };
  parser.oncdata = (cdata) => {
    const element = elements[elements.length - 1];
    element.value = cdata;
    element.isCData = true;
  };
  parser.onerror = (err) => {
    throw err;
  };
  parser.write(data);
  return rootElement;
}
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.CURRENT_APP_PACKAGE_FILE_NAME = exports2.CURRENT_APP_INSTALLER_FILE_NAME = exports2.XElement = exports2.parseXml = exports2.UUID = exports2.parseDn = exports2.retry = exports2.githubTagPrefix = exports2.githubUrl = exports2.getS3LikeProviderBaseUrl = exports2.ProgressCallbackTransform = exports2.MemoLazy = exports2.safeStringifyJson = exports2.safeGetHeader = exports2.parseJson = exports2.HttpExecutor = exports2.HttpError = exports2.DigestTransform = exports2.createHttpError = exports2.configureRequestUrl = exports2.configureRequestOptionsFromUrl = exports2.configureRequestOptions = exports2.newError = exports2.CancellationToken = exports2.CancellationError = void 0;
  exports2.asArray = asArray;
  var CancellationToken_12 = CancellationToken$1;
  Object.defineProperty(exports2, "CancellationError", { enumerable: true, get: function() {
    return CancellationToken_12.CancellationError;
  } });
  Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
    return CancellationToken_12.CancellationToken;
  } });
  var error_12 = error;
  Object.defineProperty(exports2, "newError", { enumerable: true, get: function() {
    return error_12.newError;
  } });
  var httpExecutor_1 = httpExecutor;
  Object.defineProperty(exports2, "configureRequestOptions", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestOptions;
  } });
  Object.defineProperty(exports2, "configureRequestOptionsFromUrl", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestOptionsFromUrl;
  } });
  Object.defineProperty(exports2, "configureRequestUrl", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestUrl;
  } });
  Object.defineProperty(exports2, "createHttpError", { enumerable: true, get: function() {
    return httpExecutor_1.createHttpError;
  } });
  Object.defineProperty(exports2, "DigestTransform", { enumerable: true, get: function() {
    return httpExecutor_1.DigestTransform;
  } });
  Object.defineProperty(exports2, "HttpError", { enumerable: true, get: function() {
    return httpExecutor_1.HttpError;
  } });
  Object.defineProperty(exports2, "HttpExecutor", { enumerable: true, get: function() {
    return httpExecutor_1.HttpExecutor;
  } });
  Object.defineProperty(exports2, "parseJson", { enumerable: true, get: function() {
    return httpExecutor_1.parseJson;
  } });
  Object.defineProperty(exports2, "safeGetHeader", { enumerable: true, get: function() {
    return httpExecutor_1.safeGetHeader;
  } });
  Object.defineProperty(exports2, "safeStringifyJson", { enumerable: true, get: function() {
    return httpExecutor_1.safeStringifyJson;
  } });
  var MemoLazy_1 = MemoLazy$1;
  Object.defineProperty(exports2, "MemoLazy", { enumerable: true, get: function() {
    return MemoLazy_1.MemoLazy;
  } });
  var ProgressCallbackTransform_12 = ProgressCallbackTransform$1;
  Object.defineProperty(exports2, "ProgressCallbackTransform", { enumerable: true, get: function() {
    return ProgressCallbackTransform_12.ProgressCallbackTransform;
  } });
  var publishOptions_1 = publishOptions;
  Object.defineProperty(exports2, "getS3LikeProviderBaseUrl", { enumerable: true, get: function() {
    return publishOptions_1.getS3LikeProviderBaseUrl;
  } });
  Object.defineProperty(exports2, "githubUrl", { enumerable: true, get: function() {
    return publishOptions_1.githubUrl;
  } });
  Object.defineProperty(exports2, "githubTagPrefix", { enumerable: true, get: function() {
    return publishOptions_1.githubTagPrefix;
  } });
  var retry_1 = retry$1;
  Object.defineProperty(exports2, "retry", { enumerable: true, get: function() {
    return retry_1.retry;
  } });
  var rfc2253Parser_1 = rfc2253Parser;
  Object.defineProperty(exports2, "parseDn", { enumerable: true, get: function() {
    return rfc2253Parser_1.parseDn;
  } });
  var uuid_1 = uuid;
  Object.defineProperty(exports2, "UUID", { enumerable: true, get: function() {
    return uuid_1.UUID;
  } });
  var xml_1 = xml;
  Object.defineProperty(exports2, "parseXml", { enumerable: true, get: function() {
    return xml_1.parseXml;
  } });
  Object.defineProperty(exports2, "XElement", { enumerable: true, get: function() {
    return xml_1.XElement;
  } });
  exports2.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe";
  exports2.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function asArray(v) {
    if (v == null) {
      return [];
    } else if (Array.isArray(v)) {
      return v;
    } else {
      return [v];
    }
  }
})(out);
var jsYaml = {};
var loader$1 = {};
var common$5 = {};
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
common$5.isNothing = isNothing;
common$5.isObject = isObject;
common$5.toArray = toArray;
common$5.repeat = repeat;
common$5.isNegativeZero = isNegativeZero;
common$5.extend = extend;
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$4(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$4.prototype = Object.create(Error.prototype);
YAMLException$4.prototype.constructor = YAMLException$4;
YAMLException$4.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$4;
var common$4 = common$5;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common$4.repeat(" ", max - string.length) + string;
}
function makeSnippet$1(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re2 = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re2.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common$4.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common$4.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common$4.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common$4.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet$1;
var YAMLException$3 = exception;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$e(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException$3('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException$3('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$e;
var YAMLException$2 = exception;
var Type$d = type;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof Type$d) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new YAMLException$2("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type2) {
    if (!(type2 instanceof Type$d)) {
      throw new YAMLException$2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type2.loadKind && type2.loadKind !== "scalar") {
      throw new YAMLException$2("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type2.multi) {
      throw new YAMLException$2("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type2) {
    if (!(type2 instanceof Type$d)) {
      throw new YAMLException$2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var Type$c = type;
var str = new Type$c("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var Type$b = type;
var seq = new Type$b("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var Type$a = type;
var map = new Type$a("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var Schema = schema;
var failsafe = new Schema({
  explicit: [
    str,
    seq,
    map
  ]
});
var Type$9 = type;
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new Type$9("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
var Type$8 = type;
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new Type$8("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
var common$3 = common$5;
var Type$7 = type;
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common$3.isNegativeZero(object));
}
var int = new Type$7("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var common$2 = common$5;
var Type$6 = type;
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common$2.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common$2.isNegativeZero(object));
}
var float = new Type$6("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var Type$5 = type;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new Type$5("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
var Type$4 = type;
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new Type$4("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var Type$3 = type;
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new Type$3("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var Type$2 = type;
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new Type$2("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var Type$1 = type;
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new Type$1("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var Type = type;
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new Type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var common$1 = common$5;
var YAMLException$1 = exception;
var makeSnippet = snippet;
var DEFAULT_SCHEMA$1 = _default;
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "" : c === 95 ? " " : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || DEFAULT_SCHEMA$1;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = makeSnippet(mark);
  return new YAMLException$1(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major2, minor2;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major2 = parseInt(match[1], 10);
    minor2 = parseInt(match[2], 10);
    if (major2 !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor2 < 2;
    if (minor2 !== 1 && minor2 !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common$1.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common$1.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common$1.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common$1.repeat("\n", emptyLines);
      }
    } else {
      state.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException$1("expected a single document in the stream, but found more");
}
loader$1.loadAll = loadAll;
loader$1.load = load;
var dumper$1 = {};
var common = common$5;
var YAMLException = exception;
var DEFAULT_SCHEMA = _default;
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1, QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || DEFAULT_SCHEMA;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new YAMLException("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new YAMLException("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new YAMLException("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
dumper$1.dump = dump;
var loader = loader$1;
var dumper = dumper$1;
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
jsYaml.Type = type;
jsYaml.Schema = schema;
jsYaml.FAILSAFE_SCHEMA = failsafe;
jsYaml.JSON_SCHEMA = json;
jsYaml.CORE_SCHEMA = core;
jsYaml.DEFAULT_SCHEMA = _default;
jsYaml.load = loader.load;
jsYaml.loadAll = loader.loadAll;
jsYaml.dump = dumper.dump;
jsYaml.YAMLException = exception;
jsYaml.types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
jsYaml.safeLoad = renamed("safeLoad", "load");
jsYaml.safeLoadAll = renamed("safeLoadAll", "loadAll");
jsYaml.safeDump = renamed("safeDump", "dump");
var main = {};
Object.defineProperty(main, "__esModule", { value: true });
main.Lazy = void 0;
class Lazy {
  constructor(creator) {
    this._value = null;
    this.creator = creator;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null) {
      return this._value;
    }
    const result = this.creator();
    this.value = result;
    return result;
  }
  set value(value) {
    this._value = value;
    this.creator = null;
  }
}
main.Lazy = Lazy;
var re$2 = { exports: {} };
const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;
const RELEASE_TYPES = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var constants$1 = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const debug$1 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};
var debug_1 = debug$1;
(function(module2, exports2) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH2,
    MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH2,
    MAX_LENGTH: MAX_LENGTH2
  } = constants$1;
  const debug2 = debug_1;
  exports2 = module2.exports = {};
  const re2 = exports2.re = [];
  const safeRe = exports2.safeRe = [];
  const src2 = exports2.src = [];
  const safeSrc = exports2.safeSrc = [];
  const t2 = exports2.t = {};
  let R = 0;
  const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  const safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH2],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH2]
  ];
  const makeSafeRegex = (value) => {
    for (const [token, max] of safeRegexReplacements) {
      value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
  };
  const createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R++;
    debug2(name, index, value);
    t2[name] = index;
    src2[index] = value;
    safeSrc[index] = safe;
    re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
  createToken("MAINVERSION", `(${src2[t2.NUMERICIDENTIFIER]})\\.(${src2[t2.NUMERICIDENTIFIER]})\\.(${src2[t2.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${src2[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${src2[t2.NONNUMERICIDENTIFIER]}|${src2[t2.NUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src2[t2.NONNUMERICIDENTIFIER]}|${src2[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASE", `(?:-(${src2[t2.PRERELEASEIDENTIFIER]}(?:\\.${src2[t2.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${src2[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src2[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
  createToken("BUILD", `(?:\\+(${src2[t2.BUILDIDENTIFIER]}(?:\\.${src2[t2.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${src2[t2.MAINVERSION]}${src2[t2.PRERELEASE]}?${src2[t2.BUILD]}?`);
  createToken("FULL", `^${src2[t2.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${src2[t2.MAINVERSIONLOOSE]}${src2[t2.PRERELEASELOOSE]}?${src2[t2.BUILD]}?`);
  createToken("LOOSE", `^${src2[t2.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${src2[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${src2[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${src2[t2.XRANGEIDENTIFIER]})(?:\\.(${src2[t2.XRANGEIDENTIFIER]})(?:\\.(${src2[t2.XRANGEIDENTIFIER]})(?:${src2[t2.PRERELEASE]})?${src2[t2.BUILD]}?)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:${src2[t2.PRERELEASELOOSE]})?${src2[t2.BUILD]}?)?)?`);
  createToken("XRANGE", `^${src2[t2.GTLT]}\\s*${src2[t2.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${src2[t2.GTLT]}\\s*${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH2}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?`);
  createToken("COERCE", `${src2[t2.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", src2[t2.COERCEPLAIN] + `(?:${src2[t2.PRERELEASE]})?(?:${src2[t2.BUILD]})?(?:$|[^\\d])`);
  createToken("COERCERTL", src2[t2.COERCE], true);
  createToken("COERCERTLFULL", src2[t2.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${src2[t2.LONETILDE]}\\s+`, true);
  exports2.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${src2[t2.LONETILDE]}${src2[t2.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${src2[t2.LONETILDE]}${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${src2[t2.LONECARET]}\\s+`, true);
  exports2.caretTrimReplace = "$1^";
  createToken("CARET", `^${src2[t2.LONECARET]}${src2[t2.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${src2[t2.LONECARET]}${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${src2[t2.GTLT]}\\s*(${src2[t2.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${src2[t2.GTLT]}\\s*(${src2[t2.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${src2[t2.GTLT]}\\s*(${src2[t2.LOOSEPLAIN]}|${src2[t2.XRANGEPLAIN]})`, true);
  exports2.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${src2[t2.XRANGEPLAIN]})\\s+-\\s+(${src2[t2.XRANGEPLAIN]})\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${src2[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src2[t2.XRANGEPLAINLOOSE]})\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(re$2, re$2.exports);
var reExports = re$2.exports;
const looseOption = Object.freeze({ loose: true });
const emptyOpts = Object.freeze({});
const parseOptions$1 = (options) => {
  if (!options) {
    return emptyOpts;
  }
  if (typeof options !== "object") {
    return looseOption;
  }
  return options;
};
var parseOptions_1 = parseOptions$1;
const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  if (typeof a === "number" && typeof b === "number") {
    return a === b ? 0 : a < b ? -1 : 1;
  }
  const anum = numeric.test(a);
  const bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);
var identifiers$1 = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers
};
const debug = debug_1;
const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants$1;
const { safeRe: re$1, t: t$1 } = reExports;
const parseOptions = parseOptions_1;
const { compareIdentifiers } = identifiers$1;
let SemVer$d = class SemVer {
  constructor(version, options) {
    options = parseOptions(options);
    if (version instanceof SemVer) {
      if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== "string") {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
    }
    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      );
    }
    debug("SemVer", version, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    const m = version.trim().match(options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL]);
    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`);
    }
    this.raw = version;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }
  toString() {
    return this.version;
  }
  compare(other) {
    debug("SemVer.compare", this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }
    if (other.version === this.version) {
      return 0;
    }
    return this.compareMain(other) || this.comparePre(other);
  }
  compareMain(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.major < other.major) {
      return -1;
    }
    if (this.major > other.major) {
      return 1;
    }
    if (this.minor < other.minor) {
      return -1;
    }
    if (this.minor > other.minor) {
      return 1;
    }
    if (this.patch < other.patch) {
      return -1;
    }
    if (this.patch > other.patch) {
      return 1;
    }
    return 0;
  }
  comparePre(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug("prerelease compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  compareBuild(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug("build compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(release, identifier, identifierBase) {
    if (release.startsWith("pre")) {
      if (!identifier && identifierBase === false) {
        throw new Error("invalid increment argument: identifier is empty");
      }
      if (identifier) {
        const match = `-${identifier}`.match(this.options.loose ? re$1[t$1.PRERELEASELOOSE] : re$1[t$1.PRERELEASE]);
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`);
        }
      }
    }
    switch (release) {
      case "premajor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "preminor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "prepatch":
        this.prerelease.length = 0;
        this.inc("patch", identifier, identifierBase);
        this.inc("pre", identifier, identifierBase);
        break;
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier, identifierBase);
        }
        this.inc("pre", identifier, identifierBase);
        break;
      case "release":
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`);
        }
        this.prerelease.length = 0;
        break;
      case "major":
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break;
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break;
      case "pre": {
        const base = Number(identifierBase) ? 1 : 0;
        if (this.prerelease.length === 0) {
          this.prerelease = [base];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === "number") {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            if (identifier === this.prerelease.join(".") && identifierBase === false) {
              throw new Error("invalid increment argument: identifier already exists");
            }
            this.prerelease.push(base);
          }
        }
        if (identifier) {
          let prerelease2 = [identifier, base];
          if (identifierBase === false) {
            prerelease2 = [identifier];
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease2;
            }
          } else {
            this.prerelease = prerelease2;
          }
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${release}`);
    }
    this.raw = this.format();
    if (this.build.length) {
      this.raw += `+${this.build.join(".")}`;
    }
    return this;
  }
};
var semver$2 = SemVer$d;
const SemVer$c = semver$2;
const parse$6 = (version, options, throwErrors = false) => {
  if (version instanceof SemVer$c) {
    return version;
  }
  try {
    return new SemVer$c(version, options);
  } catch (er) {
    if (!throwErrors) {
      return null;
    }
    throw er;
  }
};
var parse_1 = parse$6;
const parse$5 = parse_1;
const valid$2 = (version, options) => {
  const v = parse$5(version, options);
  return v ? v.version : null;
};
var valid_1 = valid$2;
const parse$4 = parse_1;
const clean$1 = (version, options) => {
  const s = parse$4(version.trim().replace(/^[=v]+/, ""), options);
  return s ? s.version : null;
};
var clean_1 = clean$1;
const SemVer$b = semver$2;
const inc$1 = (version, release, options, identifier, identifierBase) => {
  if (typeof options === "string") {
    identifierBase = identifier;
    identifier = options;
    options = void 0;
  }
  try {
    return new SemVer$b(
      version instanceof SemVer$b ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version;
  } catch (er) {
    return null;
  }
};
var inc_1 = inc$1;
const parse$3 = parse_1;
const diff$1 = (version1, version2) => {
  const v1 = parse$3(version1, null, true);
  const v2 = parse$3(version2, null, true);
  const comparison = v1.compare(v2);
  if (comparison === 0) {
    return null;
  }
  const v1Higher = comparison > 0;
  const highVersion = v1Higher ? v1 : v2;
  const lowVersion = v1Higher ? v2 : v1;
  const highHasPre = !!highVersion.prerelease.length;
  const lowHasPre = !!lowVersion.prerelease.length;
  if (lowHasPre && !highHasPre) {
    if (!lowVersion.patch && !lowVersion.minor) {
      return "major";
    }
    if (lowVersion.compareMain(highVersion) === 0) {
      if (lowVersion.minor && !lowVersion.patch) {
        return "minor";
      }
      return "patch";
    }
  }
  const prefix = highHasPre ? "pre" : "";
  if (v1.major !== v2.major) {
    return prefix + "major";
  }
  if (v1.minor !== v2.minor) {
    return prefix + "minor";
  }
  if (v1.patch !== v2.patch) {
    return prefix + "patch";
  }
  return "prerelease";
};
var diff_1 = diff$1;
const SemVer$a = semver$2;
const major$1 = (a, loose) => new SemVer$a(a, loose).major;
var major_1 = major$1;
const SemVer$9 = semver$2;
const minor$1 = (a, loose) => new SemVer$9(a, loose).minor;
var minor_1 = minor$1;
const SemVer$8 = semver$2;
const patch$1 = (a, loose) => new SemVer$8(a, loose).patch;
var patch_1 = patch$1;
const parse$2 = parse_1;
const prerelease$1 = (version, options) => {
  const parsed = parse$2(version, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
var prerelease_1 = prerelease$1;
const SemVer$7 = semver$2;
const compare$b = (a, b, loose) => new SemVer$7(a, loose).compare(new SemVer$7(b, loose));
var compare_1 = compare$b;
const compare$a = compare_1;
const rcompare$1 = (a, b, loose) => compare$a(b, a, loose);
var rcompare_1 = rcompare$1;
const compare$9 = compare_1;
const compareLoose$1 = (a, b) => compare$9(a, b, true);
var compareLoose_1 = compareLoose$1;
const SemVer$6 = semver$2;
const compareBuild$3 = (a, b, loose) => {
  const versionA = new SemVer$6(a, loose);
  const versionB = new SemVer$6(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
var compareBuild_1 = compareBuild$3;
const compareBuild$2 = compareBuild_1;
const sort$1 = (list, loose) => list.sort((a, b) => compareBuild$2(a, b, loose));
var sort_1 = sort$1;
const compareBuild$1 = compareBuild_1;
const rsort$1 = (list, loose) => list.sort((a, b) => compareBuild$1(b, a, loose));
var rsort_1 = rsort$1;
const compare$8 = compare_1;
const gt$4 = (a, b, loose) => compare$8(a, b, loose) > 0;
var gt_1 = gt$4;
const compare$7 = compare_1;
const lt$3 = (a, b, loose) => compare$7(a, b, loose) < 0;
var lt_1 = lt$3;
const compare$6 = compare_1;
const eq$2 = (a, b, loose) => compare$6(a, b, loose) === 0;
var eq_1 = eq$2;
const compare$5 = compare_1;
const neq$2 = (a, b, loose) => compare$5(a, b, loose) !== 0;
var neq_1 = neq$2;
const compare$4 = compare_1;
const gte$3 = (a, b, loose) => compare$4(a, b, loose) >= 0;
var gte_1 = gte$3;
const compare$3 = compare_1;
const lte$3 = (a, b, loose) => compare$3(a, b, loose) <= 0;
var lte_1 = lte$3;
const eq$1 = eq_1;
const neq$1 = neq_1;
const gt$3 = gt_1;
const gte$2 = gte_1;
const lt$2 = lt_1;
const lte$2 = lte_1;
const cmp$1 = (a, op, b, loose) => {
  switch (op) {
    case "===":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a === b;
    case "!==":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a !== b;
    case "":
    case "=":
    case "==":
      return eq$1(a, b, loose);
    case "!=":
      return neq$1(a, b, loose);
    case ">":
      return gt$3(a, b, loose);
    case ">=":
      return gte$2(a, b, loose);
    case "<":
      return lt$2(a, b, loose);
    case "<=":
      return lte$2(a, b, loose);
    default:
      throw new TypeError(`Invalid operator: ${op}`);
  }
};
var cmp_1 = cmp$1;
const SemVer$5 = semver$2;
const parse$1 = parse_1;
const { safeRe: re, t } = reExports;
const coerce$1 = (version, options) => {
  if (version instanceof SemVer$5) {
    return version;
  }
  if (typeof version === "number") {
    version = String(version);
  }
  if (typeof version !== "string") {
    return null;
  }
  options = options || {};
  let match = null;
  if (!options.rtl) {
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
  } else {
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
    let next;
    while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
      if (!match || next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
    }
    coerceRtlRegex.lastIndex = -1;
  }
  if (match === null) {
    return null;
  }
  const major2 = match[2];
  const minor2 = match[3] || "0";
  const patch2 = match[4] || "0";
  const prerelease2 = options.includePrerelease && match[5] ? `-${match[5]}` : "";
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
  return parse$1(`${major2}.${minor2}.${patch2}${prerelease2}${build}`, options);
};
var coerce_1 = coerce$1;
class LRUCache {
  constructor() {
    this.max = 1e3;
    this.map = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.map.get(key);
    if (value === void 0) {
      return void 0;
    } else {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
  }
  delete(key) {
    return this.map.delete(key);
  }
  set(key, value) {
    const deleted = this.delete(key);
    if (!deleted && value !== void 0) {
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value;
        this.delete(firstKey);
      }
      this.map.set(key, value);
    }
    return this;
  }
}
var lrucache = LRUCache;
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range2 {
    constructor(range2, options) {
      options = parseOptions2(options);
      if (range2 instanceof Range2) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range2(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator2) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t2.HYPHENRANGELOOSE] : re2[t2.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug2("hyphen replace", range2);
      range2 = range2.replace(re2[t2.COMPARATORTRIM], comparatorTrimReplace);
      debug2("comparator trim", range2);
      range2 = range2.replace(re2[t2.TILDETRIM], tildeTrimReplace);
      debug2("tilde trim", range2);
      range2 = range2.replace(re2[t2.CARETTRIM], caretTrimReplace);
      debug2("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug2("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t2.COMPARATORLOOSE]);
        });
      }
      debug2("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator2(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range2)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range2;
  const LRU = lrucache;
  const cache = new LRU();
  const parseOptions2 = parseOptions_1;
  const Comparator2 = requireComparator();
  const debug2 = debug_1;
  const SemVer3 = semver$2;
  const {
    safeRe: re2,
    t: t2,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = reExports;
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = constants$1;
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    comp = comp.replace(re2[t2.BUILD], "");
    debug2("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug2("caret", comp);
    comp = replaceTildes(comp, options);
    debug2("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug2("xrange", comp);
    comp = replaceStars(comp, options);
    debug2("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t2.TILDELOOSE] : re2[t2.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug2("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug2("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug2("caret", comp, options);
    const r = options.loose ? re2[t2.CARETLOOSE] : re2[t2.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug2("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug2("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug2("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug2("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t2.XRANGELOOSE] : re2[t2.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug2("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug2("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug2("replaceStars", comp, options);
    return comp.trim().replace(re2[t2.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug2("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set2, version, options) => {
    for (let i = 0; i < set2.length; i++) {
      if (!set2[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set2.length; i++) {
        debug2(set2[i].semver);
        if (set2[i].semver === Comparator2.ANY) {
          continue;
        }
        if (set2[i].semver.prerelease.length > 0) {
          const allowed = set2[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY2 = Symbol("SemVer ANY");
  class Comparator2 {
    static get ANY() {
      return ANY2;
    }
    constructor(comp, options) {
      options = parseOptions2(options);
      if (comp instanceof Comparator2) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug2("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY2) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug2("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t2.COMPARATORLOOSE] : re2[t2.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY2;
      } else {
        this.semver = new SemVer3(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      debug2("Comparator.test", version, this.options.loose);
      if (this.semver === ANY2 || version === ANY2) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp2(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator2)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range2(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range2(this.value, options).test(comp.semver);
      }
      options = parseOptions2(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp2(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp2(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator2;
  const parseOptions2 = parseOptions_1;
  const { safeRe: re2, t: t2 } = reExports;
  const cmp2 = cmp_1;
  const debug2 = debug_1;
  const SemVer3 = semver$2;
  const Range2 = requireRange();
  return comparator;
}
const Range$9 = requireRange();
const satisfies$4 = (version, range2, options) => {
  try {
    range2 = new Range$9(range2, options);
  } catch (er) {
    return false;
  }
  return range2.test(version);
};
var satisfies_1 = satisfies$4;
const Range$8 = requireRange();
const toComparators$1 = (range2, options) => new Range$8(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
var toComparators_1 = toComparators$1;
const SemVer$4 = semver$2;
const Range$7 = requireRange();
const maxSatisfying$1 = (versions, range2, options) => {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$7(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!max || maxSV.compare(v) === -1) {
        max = v;
        maxSV = new SemVer$4(max, options);
      }
    }
  });
  return max;
};
var maxSatisfying_1 = maxSatisfying$1;
const SemVer$3 = semver$2;
const Range$6 = requireRange();
const minSatisfying$1 = (versions, range2, options) => {
  let min = null;
  let minSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$6(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!min || minSV.compare(v) === 1) {
        min = v;
        minSV = new SemVer$3(min, options);
      }
    }
  });
  return min;
};
var minSatisfying_1 = minSatisfying$1;
const SemVer$2 = semver$2;
const Range$5 = requireRange();
const gt$2 = gt_1;
const minVersion$1 = (range2, loose) => {
  range2 = new Range$5(range2, loose);
  let minver = new SemVer$2("0.0.0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = new SemVer$2("0.0.0-0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = null;
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let setMin = null;
    comparators.forEach((comparator2) => {
      const compver = new SemVer$2(comparator2.semver.version);
      switch (comparator2.operator) {
        case ">":
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
        case "":
        case ">=":
          if (!setMin || gt$2(compver, setMin)) {
            setMin = compver;
          }
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${comparator2.operator}`);
      }
    });
    if (setMin && (!minver || gt$2(minver, setMin))) {
      minver = setMin;
    }
  }
  if (minver && range2.test(minver)) {
    return minver;
  }
  return null;
};
var minVersion_1 = minVersion$1;
const Range$4 = requireRange();
const validRange$1 = (range2, options) => {
  try {
    return new Range$4(range2, options).range || "*";
  } catch (er) {
    return null;
  }
};
var valid$1 = validRange$1;
const SemVer$1 = semver$2;
const Comparator$2 = requireComparator();
const { ANY: ANY$1 } = Comparator$2;
const Range$3 = requireRange();
const satisfies$3 = satisfies_1;
const gt$1 = gt_1;
const lt$1 = lt_1;
const lte$1 = lte_1;
const gte$1 = gte_1;
const outside$3 = (version, range2, hilo, options) => {
  version = new SemVer$1(version, options);
  range2 = new Range$3(range2, options);
  let gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case ">":
      gtfn = gt$1;
      ltefn = lte$1;
      ltfn = lt$1;
      comp = ">";
      ecomp = ">=";
      break;
    case "<":
      gtfn = lt$1;
      ltefn = gte$1;
      ltfn = gt$1;
      comp = "<";
      ecomp = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (satisfies$3(version, range2, options)) {
    return false;
  }
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let high = null;
    let low = null;
    comparators.forEach((comparator2) => {
      if (comparator2.semver === ANY$1) {
        comparator2 = new Comparator$2(">=0.0.0");
      }
      high = high || comparator2;
      low = low || comparator2;
      if (gtfn(comparator2.semver, high.semver, options)) {
        high = comparator2;
      } else if (ltfn(comparator2.semver, low.semver, options)) {
        low = comparator2;
      }
    });
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }
    if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
};
var outside_1 = outside$3;
const outside$2 = outside_1;
const gtr$1 = (version, range2, options) => outside$2(version, range2, ">", options);
var gtr_1 = gtr$1;
const outside$1 = outside_1;
const ltr$1 = (version, range2, options) => outside$1(version, range2, "<", options);
var ltr_1 = ltr$1;
const Range$2 = requireRange();
const intersects$1 = (r1, r2, options) => {
  r1 = new Range$2(r1, options);
  r2 = new Range$2(r2, options);
  return r1.intersects(r2, options);
};
var intersects_1 = intersects$1;
const satisfies$2 = satisfies_1;
const compare$2 = compare_1;
var simplify = (versions, range2, options) => {
  const set2 = [];
  let first = null;
  let prev = null;
  const v = versions.sort((a, b) => compare$2(a, b, options));
  for (const version of v) {
    const included = satisfies$2(version, range2, options);
    if (included) {
      prev = version;
      if (!first) {
        first = version;
      }
    } else {
      if (prev) {
        set2.push([first, prev]);
      }
      prev = null;
      first = null;
    }
  }
  if (first) {
    set2.push([first, null]);
  }
  const ranges = [];
  for (const [min, max] of set2) {
    if (min === max) {
      ranges.push(min);
    } else if (!max && min === v[0]) {
      ranges.push("*");
    } else if (!max) {
      ranges.push(`>=${min}`);
    } else if (min === v[0]) {
      ranges.push(`<=${max}`);
    } else {
      ranges.push(`${min} - ${max}`);
    }
  }
  const simplified = ranges.join(" || ");
  const original = typeof range2.raw === "string" ? range2.raw : String(range2);
  return simplified.length < original.length ? simplified : range2;
};
const Range$1 = requireRange();
const Comparator$1 = requireComparator();
const { ANY } = Comparator$1;
const satisfies$1 = satisfies_1;
const compare$1 = compare_1;
const subset$1 = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true;
  }
  sub = new Range$1(sub, options);
  dom = new Range$1(dom, options);
  let sawNonNull = false;
  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options);
      sawNonNull = sawNonNull || isSub !== null;
      if (isSub) {
        continue OUTER;
      }
    }
    if (sawNonNull) {
      return false;
    }
  }
  return true;
};
const minimumVersionWithPreRelease = [new Comparator$1(">=0.0.0-0")];
const minimumVersion = [new Comparator$1(">=0.0.0")];
const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true;
  }
  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true;
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease;
    } else {
      sub = minimumVersion;
    }
  }
  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true;
    } else {
      dom = minimumVersion;
    }
  }
  const eqSet = /* @__PURE__ */ new Set();
  let gt2, lt2;
  for (const c of sub) {
    if (c.operator === ">" || c.operator === ">=") {
      gt2 = higherGT(gt2, c, options);
    } else if (c.operator === "<" || c.operator === "<=") {
      lt2 = lowerLT(lt2, c, options);
    } else {
      eqSet.add(c.semver);
    }
  }
  if (eqSet.size > 1) {
    return null;
  }
  let gtltComp;
  if (gt2 && lt2) {
    gtltComp = compare$1(gt2.semver, lt2.semver, options);
    if (gtltComp > 0) {
      return null;
    } else if (gtltComp === 0 && (gt2.operator !== ">=" || lt2.operator !== "<=")) {
      return null;
    }
  }
  for (const eq2 of eqSet) {
    if (gt2 && !satisfies$1(eq2, String(gt2), options)) {
      return null;
    }
    if (lt2 && !satisfies$1(eq2, String(lt2), options)) {
      return null;
    }
    for (const c of dom) {
      if (!satisfies$1(eq2, String(c), options)) {
        return false;
      }
    }
    return true;
  }
  let higher, lower;
  let hasDomLT, hasDomGT;
  let needDomLTPre = lt2 && !options.includePrerelease && lt2.semver.prerelease.length ? lt2.semver : false;
  let needDomGTPre = gt2 && !options.includePrerelease && gt2.semver.prerelease.length ? gt2.semver : false;
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt2.operator === "<" && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false;
  }
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
    hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
    if (gt2) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false;
        }
      }
      if (c.operator === ">" || c.operator === ">=") {
        higher = higherGT(gt2, c, options);
        if (higher === c && higher !== gt2) {
          return false;
        }
      } else if (gt2.operator === ">=" && !satisfies$1(gt2.semver, String(c), options)) {
        return false;
      }
    }
    if (lt2) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false;
        }
      }
      if (c.operator === "<" || c.operator === "<=") {
        lower = lowerLT(lt2, c, options);
        if (lower === c && lower !== lt2) {
          return false;
        }
      } else if (lt2.operator === "<=" && !satisfies$1(lt2.semver, String(c), options)) {
        return false;
      }
    }
    if (!c.operator && (lt2 || gt2) && gtltComp !== 0) {
      return false;
    }
  }
  if (gt2 && hasDomLT && !lt2 && gtltComp !== 0) {
    return false;
  }
  if (lt2 && hasDomGT && !gt2 && gtltComp !== 0) {
    return false;
  }
  if (needDomGTPre || needDomLTPre) {
    return false;
  }
  return true;
};
const higherGT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
};
const lowerLT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
};
var subset_1 = subset$1;
const internalRe = reExports;
const constants = constants$1;
const SemVer2 = semver$2;
const identifiers = identifiers$1;
const parse = parse_1;
const valid = valid_1;
const clean = clean_1;
const inc = inc_1;
const diff = diff_1;
const major = major_1;
const minor = minor_1;
const patch = patch_1;
const prerelease = prerelease_1;
const compare = compare_1;
const rcompare = rcompare_1;
const compareLoose = compareLoose_1;
const compareBuild = compareBuild_1;
const sort = sort_1;
const rsort = rsort_1;
const gt = gt_1;
const lt = lt_1;
const eq = eq_1;
const neq = neq_1;
const gte = gte_1;
const lte = lte_1;
const cmp = cmp_1;
const coerce = coerce_1;
const Comparator = requireComparator();
const Range = requireRange();
const satisfies = satisfies_1;
const toComparators = toComparators_1;
const maxSatisfying = maxSatisfying_1;
const minSatisfying = minSatisfying_1;
const minVersion = minVersion_1;
const validRange = valid$1;
const outside = outside_1;
const gtr = gtr_1;
const ltr = ltr_1;
const intersects = intersects_1;
const simplifyRange = simplify;
const subset = subset_1;
var semver$1 = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer: SemVer2,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers
};
var DownloadedUpdateHelper$1 = {};
var lodash_isequal = { exports: {} };
lodash_isequal.exports;
(function(module2, exports2) {
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag2 = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports = exports2 && !exports2.nodeType && exports2;
  var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function mapToArray(map2) {
    var index = -1, result = Array(map2.size);
    map2.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData = root2["__core-js_shared__"];
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto2.hasOwnProperty;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var nativeObjectToString = objectProto2.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer2 = moduleExports ? root2.Buffer : void 0, Symbol2 = root2.Symbol, Uint8Array2 = root2.Uint8Array, propertyIsEnumerable = objectProto2.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
  var DataView = getNative(root2, "DataView"), Map2 = getNative(root2, "Map"), Promise2 = getNative(root2, "Promise"), Set2 = getNative(root2, "Set"), WeakMap = getNative(root2, "WeakMap"), nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
  var symbolProto2 = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs2 = data.__data__;
      if (!Map2 || pairs2.length < LARGE_ARRAY_SIZE - 1) {
        pairs2.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs2);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if (hasOwnProperty.call(value, key) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq2(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString2(value);
  }
  function baseIsArguments(value) {
    return isObjectLike2(value) && baseGetTag(value) == argsTag;
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq2(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag2:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  function getMapData(map2, key) {
    var data = map2.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER2 : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable(value) {
    var type2 = typeof value;
    return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function objectToString2(value) {
    return nativeObjectToString.call(value);
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function eq2(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike2(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArray = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  var isBuffer = nativeIsBuffer || stubFalse;
  function isEqual2(value, other) {
    return baseIsEqual(value, other);
  }
  function isFunction(value) {
    if (!isObject2(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  function isObject2(value) {
    var type2 = typeof value;
    return value != null && (type2 == "object" || type2 == "function");
  }
  function isObjectLike2(value) {
    return value != null && typeof value == "object";
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function stubArray() {
    return [];
  }
  function stubFalse() {
    return false;
  }
  module2.exports = isEqual2;
})(lodash_isequal, lodash_isequal.exports);
var lodash_isequalExports = lodash_isequal.exports;
Object.defineProperty(DownloadedUpdateHelper$1, "__esModule", { value: true });
DownloadedUpdateHelper$1.DownloadedUpdateHelper = void 0;
DownloadedUpdateHelper$1.createTempUpdateFile = createTempUpdateFile;
const crypto_1$2 = require$$0$3;
const fs_1$4 = require$$1$1;
const isEqual = lodash_isequalExports;
const fs_extra_1$6 = lib;
const path$8 = require$$1$2;
class DownloadedUpdateHelper {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return path$8.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(updateFile, updateInfo, fileInfo, logger) {
    if (this.versionInfo != null && this.file === updateFile && this.fileInfo != null) {
      if (isEqual(this.versionInfo, updateInfo) && isEqual(this.fileInfo.info, fileInfo.info) && await (0, fs_extra_1$6.pathExists)(updateFile)) {
        return updateFile;
      } else {
        return null;
      }
    }
    const cachedUpdateFile = await this.getValidCachedUpdateFile(fileInfo, logger);
    if (cachedUpdateFile === null) {
      return null;
    }
    logger.info(`Update has already been downloaded to ${updateFile}).`);
    this._file = cachedUpdateFile;
    return cachedUpdateFile;
  }
  async setDownloadedFile(downloadedFile, packageFile, versionInfo, fileInfo, updateFileName, isSaveCache) {
    this._file = downloadedFile;
    this._packageFile = packageFile;
    this.versionInfo = versionInfo;
    this.fileInfo = fileInfo;
    this._downloadedFileInfo = {
      fileName: updateFileName,
      sha512: fileInfo.info.sha512,
      isAdminRightsRequired: fileInfo.info.isAdminRightsRequired === true
    };
    if (isSaveCache) {
      await (0, fs_extra_1$6.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
  }
  async clear() {
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, fs_extra_1$6.emptyDir)(this.cacheDirForPendingUpdate);
    } catch (_ignore) {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(fileInfo, logger) {
    const updateInfoFilePath = this.getUpdateInfoFile();
    const doesUpdateInfoFileExist = await (0, fs_extra_1$6.pathExists)(updateInfoFilePath);
    if (!doesUpdateInfoFileExist) {
      return null;
    }
    let cachedInfo;
    try {
      cachedInfo = await (0, fs_extra_1$6.readJson)(updateInfoFilePath);
    } catch (error2) {
      let message = `No cached update info available`;
      if (error2.code !== "ENOENT") {
        await this.cleanCacheDirForPendingUpdate();
        message += ` (error on read: ${error2.message})`;
      }
      logger.info(message);
      return null;
    }
    const isCachedInfoFileNameValid = (cachedInfo === null || cachedInfo === void 0 ? void 0 : cachedInfo.fileName) !== null;
    if (!isCachedInfoFileNameValid) {
      logger.warn(`Cached update info is corrupted: no fileName, directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    if (fileInfo.info.sha512 !== cachedInfo.sha512) {
      logger.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${cachedInfo.sha512}, expected: ${fileInfo.info.sha512}. Directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    const updateFile = path$8.join(this.cacheDirForPendingUpdate, cachedInfo.fileName);
    if (!await (0, fs_extra_1$6.pathExists)(updateFile)) {
      logger.info("Cached update file doesn't exist");
      return null;
    }
    const sha512 = await hashFile(updateFile);
    if (fileInfo.info.sha512 !== sha512) {
      logger.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${sha512}, expected: ${fileInfo.info.sha512}`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    this._downloadedFileInfo = cachedInfo;
    return updateFile;
  }
  getUpdateInfoFile() {
    return path$8.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
DownloadedUpdateHelper$1.DownloadedUpdateHelper = DownloadedUpdateHelper;
function hashFile(file2, algorithm = "sha512", encoding = "base64", options) {
  return new Promise((resolve, reject) => {
    const hash = (0, crypto_1$2.createHash)(algorithm);
    hash.on("error", reject).setEncoding(encoding);
    (0, fs_1$4.createReadStream)(file2, {
      ...options,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", reject).on("end", () => {
      hash.end();
      resolve(hash.read());
    }).pipe(hash, { end: false });
  });
}
async function createTempUpdateFile(name, cacheDir, log) {
  let nameCounter = 0;
  let result = path$8.join(cacheDir, name);
  for (let i = 0; i < 3; i++) {
    try {
      await (0, fs_extra_1$6.unlink)(result);
      return result;
    } catch (e) {
      if (e.code === "ENOENT") {
        return result;
      }
      log.warn(`Error on remove temp update file: ${e}`);
      result = path$8.join(cacheDir, `${nameCounter++}-${name}`);
    }
  }
  return result;
}
var ElectronAppAdapter$1 = {};
var AppAdapter = {};
Object.defineProperty(AppAdapter, "__esModule", { value: true });
AppAdapter.getAppCacheDir = getAppCacheDir;
const path$7 = require$$1$2;
const os_1$1 = require$$2;
function getAppCacheDir() {
  const homedir = (0, os_1$1.homedir)();
  let result;
  if (process.platform === "win32") {
    result = process.env["LOCALAPPDATA"] || path$7.join(homedir, "AppData", "Local");
  } else if (process.platform === "darwin") {
    result = path$7.join(homedir, "Library", "Caches");
  } else {
    result = process.env["XDG_CACHE_HOME"] || path$7.join(homedir, ".cache");
  }
  return result;
}
Object.defineProperty(ElectronAppAdapter$1, "__esModule", { value: true });
ElectronAppAdapter$1.ElectronAppAdapter = void 0;
const path$6 = require$$1$2;
const AppAdapter_1 = AppAdapter;
class ElectronAppAdapter {
  constructor(app = require$$1.app) {
    this.app = app;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === true;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? path$6.join(process.resourcesPath, "app-update.yml") : path$6.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, AppAdapter_1.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(handler) {
    this.app.once("quit", (_, exitCode) => handler(exitCode));
  }
}
ElectronAppAdapter$1.ElectronAppAdapter = ElectronAppAdapter;
var electronHttpExecutor = {};
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.ElectronHttpExecutor = exports2.NET_SESSION_NAME = void 0;
  exports2.getNetSession = getNetSession;
  const builder_util_runtime_12 = out;
  exports2.NET_SESSION_NAME = "electron-updater";
  function getNetSession() {
    return require$$1.session.fromPartition(exports2.NET_SESSION_NAME, {
      cache: false
    });
  }
  class ElectronHttpExecutor extends builder_util_runtime_12.HttpExecutor {
    constructor(proxyLoginCallback) {
      super();
      this.proxyLoginCallback = proxyLoginCallback;
      this.cachedSession = null;
    }
    async download(url, destination, options) {
      return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
        const requestOptions = {
          headers: options.headers || void 0,
          redirect: "manual"
        };
        (0, builder_util_runtime_12.configureRequestUrl)(url, requestOptions);
        (0, builder_util_runtime_12.configureRequestOptions)(requestOptions);
        this.doDownload(requestOptions, {
          destination,
          options,
          onCancel,
          callback: (error2) => {
            if (error2 == null) {
              resolve(destination);
            } else {
              reject(error2);
            }
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(options, callback) {
      if (options.headers && options.headers.Host) {
        options.host = options.headers.Host;
        delete options.headers.Host;
      }
      if (this.cachedSession == null) {
        this.cachedSession = getNetSession();
      }
      const request = require$$1.net.request({
        ...options,
        session: this.cachedSession
      });
      request.on("response", callback);
      if (this.proxyLoginCallback != null) {
        request.on("login", this.proxyLoginCallback);
      }
      return request;
    }
    addRedirectHandlers(request, options, reject, redirectCount, handler) {
      request.on("redirect", (statusCode, method, redirectUrl) => {
        request.abort();
        if (redirectCount > this.maxRedirects) {
          reject(this.createMaxRedirectError());
        } else {
          handler(builder_util_runtime_12.HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options));
        }
      });
    }
  }
  exports2.ElectronHttpExecutor = ElectronHttpExecutor;
})(electronHttpExecutor);
var GenericProvider$1 = {};
var util = {};
Object.defineProperty(util, "__esModule", { value: true });
util.newBaseUrl = newBaseUrl;
util.newUrlFromBase = newUrlFromBase;
util.getChannelFilename = getChannelFilename;
const url_1$6 = require$$2$1;
function newBaseUrl(url) {
  const result = new url_1$6.URL(url);
  if (!result.pathname.endsWith("/")) {
    result.pathname += "/";
  }
  return result;
}
function newUrlFromBase(pathname, baseUrl, addRandomQueryToAvoidCaching = false) {
  const result = new url_1$6.URL(pathname, baseUrl);
  const search = baseUrl.search;
  if (search != null && search.length !== 0) {
    result.search = search;
  } else if (addRandomQueryToAvoidCaching) {
    result.search = `noCache=${Date.now().toString(32)}`;
  }
  return result;
}
function getChannelFilename(channel) {
  return `${channel}.yml`;
}
var Provider$1 = {};
var symbolTag = "[object Symbol]";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var Symbol$1 = root.Symbol;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toString2(value) {
  return value == null ? "" : baseToString(value);
}
function escapeRegExp$2(string) {
  string = toString2(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
}
var lodash_escaperegexp = escapeRegExp$2;
Object.defineProperty(Provider$1, "__esModule", { value: true });
Provider$1.Provider = void 0;
Provider$1.findFile = findFile;
Provider$1.parseUpdateInfo = parseUpdateInfo;
Provider$1.getFileList = getFileList;
Provider$1.resolveFiles = resolveFiles;
const builder_util_runtime_1$f = out;
const js_yaml_1$2 = jsYaml;
const url_1$5 = require$$2$1;
const util_1$6 = util;
const escapeRegExp$1 = lodash_escaperegexp;
class Provider {
  constructor(runtimeOptions) {
    this.runtimeOptions = runtimeOptions;
    this.requestHeaders = null;
    this.executor = runtimeOptions.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(baseUrl, oldVersion, newVersion, oldBlockMapFileBaseUrl = null) {
    const newBlockMapUrl = (0, util_1$6.newUrlFromBase)(`${baseUrl.pathname}.blockmap`, baseUrl);
    const oldBlockMapUrl = (0, util_1$6.newUrlFromBase)(`${baseUrl.pathname.replace(new RegExp(escapeRegExp$1(newVersion), "g"), oldVersion)}.blockmap`, oldBlockMapFileBaseUrl ? new url_1$5.URL(oldBlockMapFileBaseUrl) : baseUrl);
    return [oldBlockMapUrl, newBlockMapUrl];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== false;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const arch = process.env["TEST_UPDATER_ARCH"] || process.arch;
      const archSuffix = arch === "x64" ? "" : `-${arch}`;
      return "-linux" + archSuffix;
    } else {
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(channel) {
    return `${channel}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(value) {
    this.requestHeaders = value;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(url, headers, cancellationToken) {
    return this.executor.request(this.createRequestOptions(url, headers), cancellationToken);
  }
  createRequestOptions(url, headers) {
    const result = {};
    if (this.requestHeaders == null) {
      if (headers != null) {
        result.headers = headers;
      }
    } else {
      result.headers = headers == null ? this.requestHeaders : { ...this.requestHeaders, ...headers };
    }
    (0, builder_util_runtime_1$f.configureRequestUrl)(url, result);
    return result;
  }
}
Provider$1.Provider = Provider;
function findFile(files, extension, not) {
  var _a2;
  if (files.length === 0) {
    throw (0, builder_util_runtime_1$f.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  const filteredFiles = files.filter((it) => it.url.pathname.toLowerCase().endsWith(`.${extension.toLowerCase()}`));
  const result = (_a2 = filteredFiles.find((it) => [it.url.pathname, it.info.url].some((n) => n.includes(process.arch)))) !== null && _a2 !== void 0 ? _a2 : filteredFiles.shift();
  if (result) {
    return result;
  } else if (not == null) {
    return files[0];
  } else {
    return files.find((fileInfo) => !not.some((ext) => fileInfo.url.pathname.toLowerCase().endsWith(`.${ext.toLowerCase()}`)));
  }
}
function parseUpdateInfo(rawData, channelFile, channelFileUrl) {
  if (rawData == null) {
    throw (0, builder_util_runtime_1$f.newError)(`Cannot parse update info from ${channelFile} in the latest release artifacts (${channelFileUrl}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  let result;
  try {
    result = (0, js_yaml_1$2.load)(rawData);
  } catch (e) {
    throw (0, builder_util_runtime_1$f.newError)(`Cannot parse update info from ${channelFile} in the latest release artifacts (${channelFileUrl}): ${e.stack || e.message}, rawData: ${rawData}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return result;
}
function getFileList(updateInfo) {
  const files = updateInfo.files;
  if (files != null && files.length > 0) {
    return files;
  }
  if (updateInfo.path != null) {
    return [
      {
        url: updateInfo.path,
        sha2: updateInfo.sha2,
        sha512: updateInfo.sha512
      }
    ];
  } else {
    throw (0, builder_util_runtime_1$f.newError)(`No files provided: ${(0, builder_util_runtime_1$f.safeStringifyJson)(updateInfo)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
}
function resolveFiles(updateInfo, baseUrl, pathTransformer = (p) => p) {
  const files = getFileList(updateInfo);
  const result = files.map((fileInfo) => {
    if (fileInfo.sha2 == null && fileInfo.sha512 == null) {
      throw (0, builder_util_runtime_1$f.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, builder_util_runtime_1$f.safeStringifyJson)(fileInfo)}`, "ERR_UPDATER_NO_CHECKSUM");
    }
    return {
      url: (0, util_1$6.newUrlFromBase)(pathTransformer(fileInfo.url), baseUrl),
      info: fileInfo
    };
  });
  const packages = updateInfo.packages;
  const packageInfo = packages == null ? null : packages[process.arch] || packages.ia32;
  if (packageInfo != null) {
    result[0].packageInfo = {
      ...packageInfo,
      path: (0, util_1$6.newUrlFromBase)(pathTransformer(packageInfo.path), baseUrl).href
    };
  }
  return result;
}
Object.defineProperty(GenericProvider$1, "__esModule", { value: true });
GenericProvider$1.GenericProvider = void 0;
const builder_util_runtime_1$e = out;
const util_1$5 = util;
const Provider_1$b = Provider$1;
class GenericProvider extends Provider_1$b.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super(runtimeOptions);
    this.configuration = configuration;
    this.updater = updater;
    this.baseUrl = (0, util_1$5.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const result = this.updater.channel || this.configuration.channel;
    return result == null ? this.getDefaultChannelName() : this.getCustomChannelName(result);
  }
  async getLatestVersion() {
    const channelFile = (0, util_1$5.getChannelFilename)(this.channel);
    const channelUrl = (0, util_1$5.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let attemptNumber = 0; ; attemptNumber++) {
      try {
        return (0, Provider_1$b.parseUpdateInfo)(await this.httpRequest(channelUrl), channelFile, channelUrl);
      } catch (e) {
        if (e instanceof builder_util_runtime_1$e.HttpError && e.statusCode === 404) {
          throw (0, builder_util_runtime_1$e.newError)(`Cannot find channel "${channelFile}" update info: ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        } else if (e.code === "ECONNREFUSED") {
          if (attemptNumber < 3) {
            await new Promise((resolve, reject) => {
              try {
                setTimeout(resolve, 1e3 * attemptNumber);
              } catch (e2) {
                reject(e2);
              }
            });
            continue;
          }
        }
        throw e;
      }
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$b.resolveFiles)(updateInfo, this.baseUrl);
  }
}
GenericProvider$1.GenericProvider = GenericProvider;
var providerFactory = {};
var BitbucketProvider$1 = {};
Object.defineProperty(BitbucketProvider$1, "__esModule", { value: true });
BitbucketProvider$1.BitbucketProvider = void 0;
const builder_util_runtime_1$d = out;
const util_1$4 = util;
const Provider_1$a = Provider$1;
class BitbucketProvider extends Provider_1$a.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super({
      ...runtimeOptions,
      isUseMultipleRangeRequest: false
    });
    this.configuration = configuration;
    this.updater = updater;
    const { owner, slug } = configuration;
    this.baseUrl = (0, util_1$4.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${owner}/${slug}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$d.CancellationToken();
    const channelFile = (0, util_1$4.getChannelFilename)(this.getCustomChannelName(this.channel));
    const channelUrl = (0, util_1$4.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const updateInfo = await this.httpRequest(channelUrl, void 0, cancellationToken);
      return (0, Provider_1$a.parseUpdateInfo)(updateInfo, channelFile, channelUrl);
    } catch (e) {
      throw (0, builder_util_runtime_1$d.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$a.resolveFiles)(updateInfo, this.baseUrl);
  }
  toString() {
    const { owner, slug } = this.configuration;
    return `Bitbucket (owner: ${owner}, slug: ${slug}, channel: ${this.channel})`;
  }
}
BitbucketProvider$1.BitbucketProvider = BitbucketProvider;
var GitHubProvider$1 = {};
Object.defineProperty(GitHubProvider$1, "__esModule", { value: true });
GitHubProvider$1.GitHubProvider = GitHubProvider$1.BaseGitHubProvider = void 0;
GitHubProvider$1.computeReleaseNotes = computeReleaseNotes;
const builder_util_runtime_1$c = out;
const semver = semver$1;
const url_1$4 = require$$2$1;
const util_1$3 = util;
const Provider_1$9 = Provider$1;
const hrefRegExp = /\/tag\/([^/]+)$/;
class BaseGitHubProvider extends Provider_1$9.Provider {
  constructor(options, defaultHost, runtimeOptions) {
    super({
      ...runtimeOptions,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: false
    });
    this.options = options;
    this.baseUrl = (0, util_1$3.newBaseUrl)((0, builder_util_runtime_1$c.githubUrl)(options, defaultHost));
    const apiHost = defaultHost === "github.com" ? "api.github.com" : defaultHost;
    this.baseApiUrl = (0, util_1$3.newBaseUrl)((0, builder_util_runtime_1$c.githubUrl)(options, apiHost));
  }
  computeGithubBasePath(result) {
    const host = this.options.host;
    return host && !["github.com", "api.github.com"].includes(host) ? `/api/v3${result}` : result;
  }
}
GitHubProvider$1.BaseGitHubProvider = BaseGitHubProvider;
class GitHubProvider extends BaseGitHubProvider {
  constructor(options, updater, runtimeOptions) {
    super(options, "github.com", runtimeOptions);
    this.options = options;
    this.updater = updater;
  }
  get channel() {
    const result = this.updater.channel || this.options.channel;
    return result == null ? this.getDefaultChannelName() : this.getCustomChannelName(result);
  }
  async getLatestVersion() {
    var _a2, _b2, _c, _d, _e;
    const cancellationToken = new builder_util_runtime_1$c.CancellationToken();
    const feedXml = await this.httpRequest((0, util_1$3.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, cancellationToken);
    const feed = (0, builder_util_runtime_1$c.parseXml)(feedXml);
    let latestRelease = feed.element("entry", false, `No published versions on GitHub`);
    let tag = null;
    try {
      if (this.updater.allowPrerelease) {
        const currentChannel = ((_a2 = this.updater) === null || _a2 === void 0 ? void 0 : _a2.channel) || ((_b2 = semver.prerelease(this.updater.currentVersion)) === null || _b2 === void 0 ? void 0 : _b2[0]) || null;
        if (currentChannel === null) {
          tag = hrefRegExp.exec(latestRelease.element("link").attribute("href"))[1];
        } else {
          for (const element of feed.getElements("entry")) {
            const hrefElement = hrefRegExp.exec(element.element("link").attribute("href"));
            if (hrefElement === null) {
              continue;
            }
            const hrefTag = hrefElement[1];
            const hrefChannel = ((_c = semver.prerelease(hrefTag)) === null || _c === void 0 ? void 0 : _c[0]) || null;
            const shouldFetchVersion = !currentChannel || ["alpha", "beta"].includes(currentChannel);
            const isCustomChannel = hrefChannel !== null && !["alpha", "beta"].includes(String(hrefChannel));
            const channelMismatch = currentChannel === "beta" && hrefChannel === "alpha";
            if (shouldFetchVersion && !isCustomChannel && !channelMismatch) {
              tag = hrefTag;
              break;
            }
            const isNextPreRelease = hrefChannel && hrefChannel === currentChannel;
            if (isNextPreRelease) {
              tag = hrefTag;
              break;
            }
          }
        }
      } else {
        tag = await this.getLatestTagName(cancellationToken);
        for (const element of feed.getElements("entry")) {
          if (hrefRegExp.exec(element.element("link").attribute("href"))[1] === tag) {
            latestRelease = element;
            break;
          }
        }
      }
    } catch (e) {
      throw (0, builder_util_runtime_1$c.newError)(`Cannot parse releases feed: ${e.stack || e.message},
XML:
${feedXml}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (tag == null) {
      throw (0, builder_util_runtime_1$c.newError)(`No published versions on GitHub`, "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    }
    let rawData;
    let channelFile = "";
    let channelFileUrl = "";
    const fetchData = async (channelName) => {
      channelFile = (0, util_1$3.getChannelFilename)(channelName);
      channelFileUrl = (0, util_1$3.newUrlFromBase)(this.getBaseDownloadPath(String(tag), channelFile), this.baseUrl);
      const requestOptions = this.createRequestOptions(channelFileUrl);
      try {
        return await this.executor.request(requestOptions, cancellationToken);
      } catch (e) {
        if (e instanceof builder_util_runtime_1$c.HttpError && e.statusCode === 404) {
          throw (0, builder_util_runtime_1$c.newError)(`Cannot find ${channelFile} in the latest release artifacts (${channelFileUrl}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        }
        throw e;
      }
    };
    try {
      let channel = this.channel;
      if (this.updater.allowPrerelease && ((_d = semver.prerelease(tag)) === null || _d === void 0 ? void 0 : _d[0])) {
        channel = this.getCustomChannelName(String((_e = semver.prerelease(tag)) === null || _e === void 0 ? void 0 : _e[0]));
      }
      rawData = await fetchData(channel);
    } catch (e) {
      if (this.updater.allowPrerelease) {
        rawData = await fetchData(this.getDefaultChannelName());
      } else {
        throw e;
      }
    }
    const result = (0, Provider_1$9.parseUpdateInfo)(rawData, channelFile, channelFileUrl);
    if (result.releaseName == null) {
      result.releaseName = latestRelease.elementValueOrEmpty("title");
    }
    if (result.releaseNotes == null) {
      result.releaseNotes = computeReleaseNotes(this.updater.currentVersion, this.updater.fullChangelog, feed, latestRelease);
    }
    return {
      tag,
      ...result
    };
  }
  async getLatestTagName(cancellationToken) {
    const options = this.options;
    const url = options.host == null || options.host === "github.com" ? (0, util_1$3.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new url_1$4.URL(`${this.computeGithubBasePath(`/repos/${options.owner}/${options.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const rawData = await this.httpRequest(url, { Accept: "application/json" }, cancellationToken);
      if (rawData == null) {
        return null;
      }
      const releaseInfo = JSON.parse(rawData);
      return releaseInfo.tag_name;
    } catch (e) {
      throw (0, builder_util_runtime_1$c.newError)(`Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$9.resolveFiles)(updateInfo, this.baseUrl, (p) => this.getBaseDownloadPath(updateInfo.tag, p.replace(/ /g, "-")));
  }
  getBaseDownloadPath(tag, fileName) {
    return `${this.basePath}/download/${tag}/${fileName}`;
  }
}
GitHubProvider$1.GitHubProvider = GitHubProvider;
function getNoteValue(parent) {
  const result = parent.elementValueOrEmpty("content");
  return result === "No content." ? "" : result;
}
function computeReleaseNotes(currentVersion, isFullChangelog, feed, latestRelease) {
  if (!isFullChangelog) {
    return getNoteValue(latestRelease);
  }
  const releaseNotes = [];
  for (const release of feed.getElements("entry")) {
    const versionRelease = /\/tag\/v?([^/]+)$/.exec(release.element("link").attribute("href"))[1];
    if (semver.valid(versionRelease) && semver.lt(currentVersion, versionRelease)) {
      releaseNotes.push({
        version: versionRelease,
        note: getNoteValue(release)
      });
    }
  }
  return releaseNotes.sort((a, b) => semver.rcompare(a.version, b.version));
}
var GitLabProvider$1 = {};
Object.defineProperty(GitLabProvider$1, "__esModule", { value: true });
GitLabProvider$1.GitLabProvider = void 0;
const builder_util_runtime_1$b = out;
const url_1$3 = require$$2$1;
const escapeRegExp = lodash_escaperegexp;
const util_1$2 = util;
const Provider_1$8 = Provider$1;
class GitLabProvider extends Provider_1$8.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(filename) {
    return filename.replace(/ |_/g, "-");
  }
  constructor(options, updater, runtimeOptions) {
    super({
      ...runtimeOptions,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: false
    });
    this.options = options;
    this.updater = updater;
    this.cachedLatestVersion = null;
    const defaultHost = "gitlab.com";
    const host = options.host || defaultHost;
    this.baseApiUrl = (0, util_1$2.newBaseUrl)(`https://${host}/api/v4`);
  }
  get channel() {
    const result = this.updater.channel || this.options.channel;
    return result == null ? this.getDefaultChannelName() : this.getCustomChannelName(result);
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$b.CancellationToken();
    const latestReleaseUrl = (0, util_1$2.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let latestRelease;
    try {
      const header = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
      const releaseResponse = await this.httpRequest(latestReleaseUrl, header, cancellationToken);
      if (!releaseResponse) {
        throw (0, builder_util_runtime_1$b.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      }
      latestRelease = JSON.parse(releaseResponse);
    } catch (e) {
      throw (0, builder_util_runtime_1$b.newError)(`Unable to find latest release on GitLab (${latestReleaseUrl}): ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const tag = latestRelease.tag_name;
    let rawData = null;
    let channelFile = "";
    let channelFileUrl = null;
    const fetchChannelData = async (channelName) => {
      channelFile = (0, util_1$2.getChannelFilename)(channelName);
      const channelAsset = latestRelease.assets.links.find((asset) => asset.name === channelFile);
      if (!channelAsset) {
        throw (0, builder_util_runtime_1$b.newError)(`Cannot find ${channelFile} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      }
      channelFileUrl = new url_1$3.URL(channelAsset.direct_asset_url);
      const headers = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const result2 = await this.httpRequest(channelFileUrl, headers, cancellationToken);
        if (!result2) {
          throw (0, builder_util_runtime_1$b.newError)(`Empty response from ${channelFileUrl}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        }
        return result2;
      } catch (e) {
        if (e instanceof builder_util_runtime_1$b.HttpError && e.statusCode === 404) {
          throw (0, builder_util_runtime_1$b.newError)(`Cannot find ${channelFile} in the latest release artifacts (${channelFileUrl}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        }
        throw e;
      }
    };
    try {
      rawData = await fetchChannelData(this.channel);
    } catch (e) {
      if (this.channel !== this.getDefaultChannelName()) {
        rawData = await fetchChannelData(this.getDefaultChannelName());
      } else {
        throw e;
      }
    }
    if (!rawData) {
      throw (0, builder_util_runtime_1$b.newError)(`Unable to parse channel data from ${channelFile}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    const result = (0, Provider_1$8.parseUpdateInfo)(rawData, channelFile, channelFileUrl);
    if (result.releaseName == null) {
      result.releaseName = latestRelease.name;
    }
    if (result.releaseNotes == null) {
      result.releaseNotes = latestRelease.description || null;
    }
    const assetsMap = /* @__PURE__ */ new Map();
    for (const asset of latestRelease.assets.links) {
      assetsMap.set(this.normalizeFilename(asset.name), asset.direct_asset_url);
    }
    const gitlabUpdateInfo = {
      tag,
      assets: assetsMap,
      ...result
    };
    this.cachedLatestVersion = gitlabUpdateInfo;
    return gitlabUpdateInfo;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(assets) {
    const assetsMap = /* @__PURE__ */ new Map();
    for (const asset of assets.links) {
      assetsMap.set(this.normalizeFilename(asset.name), asset.direct_asset_url);
    }
    return assetsMap;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(assets, filename) {
    const possibleBlockMapNames = [`${filename}.blockmap`, `${this.normalizeFilename(filename)}.blockmap`];
    for (const blockMapName of possibleBlockMapNames) {
      const assetUrl = assets.get(blockMapName);
      if (assetUrl) {
        return new url_1$3.URL(assetUrl);
      }
    }
    return null;
  }
  async fetchReleaseInfoByVersion(version) {
    const cancellationToken = new builder_util_runtime_1$b.CancellationToken();
    const possibleReleaseIds = [`v${version}`, version];
    for (const releaseId of possibleReleaseIds) {
      const releaseUrl = (0, util_1$2.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(releaseId)}`, this.baseApiUrl);
      try {
        const header = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
        const releaseResponse = await this.httpRequest(releaseUrl, header, cancellationToken);
        if (releaseResponse) {
          const release = JSON.parse(releaseResponse);
          return release;
        }
      } catch (e) {
        if (e instanceof builder_util_runtime_1$b.HttpError && e.statusCode === 404) {
          continue;
        }
        throw (0, builder_util_runtime_1$b.newError)(`Unable to find release ${releaseId} on GitLab (${releaseUrl}): ${e.stack || e.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, builder_util_runtime_1$b.newError)(`Unable to find release with version ${version} (tried: ${possibleReleaseIds.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(token) {
    const headers = {};
    if (token != null) {
      if (token.startsWith("Bearer")) {
        headers.authorization = token;
      } else {
        headers["PRIVATE-TOKEN"] = token;
      }
    }
    return headers;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(version) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === version) {
      return this.cachedLatestVersion.assets;
    }
    const versionInfo = await this.fetchReleaseInfoByVersion(version);
    if (versionInfo && versionInfo.assets) {
      return this.convertAssetsToMap(versionInfo.assets);
    }
    return null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(oldVersion, newVersion, baseFilename) {
    let newBlockMapUrl = null;
    let oldBlockMapUrl = null;
    const newVersionAssets = await this.getVersionInfoForBlockMap(newVersion);
    if (newVersionAssets) {
      newBlockMapUrl = this.findBlockMapInAssets(newVersionAssets, baseFilename);
    }
    const oldVersionAssets = await this.getVersionInfoForBlockMap(oldVersion);
    if (oldVersionAssets) {
      const oldFilename = baseFilename.replace(new RegExp(escapeRegExp(newVersion), "g"), oldVersion);
      oldBlockMapUrl = this.findBlockMapInAssets(oldVersionAssets, oldFilename);
    }
    return [oldBlockMapUrl, newBlockMapUrl];
  }
  async getBlockMapFiles(baseUrl, oldVersion, newVersion, oldBlockMapFileBaseUrl = null) {
    if (this.options.uploadTarget === "project_upload") {
      const baseFilename = baseUrl.pathname.split("/").pop() || "";
      const [oldBlockMapUrl, newBlockMapUrl] = await this.findBlockMapUrlsFromAssets(oldVersion, newVersion, baseFilename);
      if (!newBlockMapUrl) {
        throw (0, builder_util_runtime_1$b.newError)(`Cannot find blockmap file for ${newVersion} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      }
      if (!oldBlockMapUrl) {
        throw (0, builder_util_runtime_1$b.newError)(`Cannot find blockmap file for ${oldVersion} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      }
      return [oldBlockMapUrl, newBlockMapUrl];
    } else {
      return super.getBlockMapFiles(baseUrl, oldVersion, newVersion, oldBlockMapFileBaseUrl);
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$8.getFileList)(updateInfo).map((fileInfo) => {
      const possibleNames = [
        fileInfo.url,
        // Original filename
        this.normalizeFilename(fileInfo.url)
        // Normalized filename (spaces/underscores → dashes)
      ];
      const matchingAssetName = possibleNames.find((name) => updateInfo.assets.has(name));
      const assetUrl = matchingAssetName ? updateInfo.assets.get(matchingAssetName) : void 0;
      if (!assetUrl) {
        throw (0, builder_util_runtime_1$b.newError)(`Cannot find asset "${fileInfo.url}" in GitLab release assets. Available assets: ${Array.from(updateInfo.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      }
      return {
        url: new url_1$3.URL(assetUrl),
        info: fileInfo
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
GitLabProvider$1.GitLabProvider = GitLabProvider;
var KeygenProvider$1 = {};
Object.defineProperty(KeygenProvider$1, "__esModule", { value: true });
KeygenProvider$1.KeygenProvider = void 0;
const builder_util_runtime_1$a = out;
const util_1$1 = util;
const Provider_1$7 = Provider$1;
class KeygenProvider extends Provider_1$7.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super({
      ...runtimeOptions,
      isUseMultipleRangeRequest: false
    });
    this.configuration = configuration;
    this.updater = updater;
    this.defaultHostname = "api.keygen.sh";
    const host = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, util_1$1.newBaseUrl)(`https://${host}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$a.CancellationToken();
    const channelFile = (0, util_1$1.getChannelFilename)(this.getCustomChannelName(this.channel));
    const channelUrl = (0, util_1$1.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const updateInfo = await this.httpRequest(channelUrl, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, cancellationToken);
      return (0, Provider_1$7.parseUpdateInfo)(updateInfo, channelFile, channelUrl);
    } catch (e) {
      throw (0, builder_util_runtime_1$a.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$7.resolveFiles)(updateInfo, this.baseUrl);
  }
  toString() {
    const { account, product, platform: platform2 } = this.configuration;
    return `Keygen (account: ${account}, product: ${product}, platform: ${platform2}, channel: ${this.channel})`;
  }
}
KeygenProvider$1.KeygenProvider = KeygenProvider;
var PrivateGitHubProvider$1 = {};
Object.defineProperty(PrivateGitHubProvider$1, "__esModule", { value: true });
PrivateGitHubProvider$1.PrivateGitHubProvider = void 0;
const builder_util_runtime_1$9 = out;
const js_yaml_1$1 = jsYaml;
const path$5 = require$$1$2;
const url_1$2 = require$$2$1;
const util_1 = util;
const GitHubProvider_1$1 = GitHubProvider$1;
const Provider_1$6 = Provider$1;
class PrivateGitHubProvider extends GitHubProvider_1$1.BaseGitHubProvider {
  constructor(options, updater, token, runtimeOptions) {
    super(options, "api.github.com", runtimeOptions);
    this.updater = updater;
    this.token = token;
  }
  createRequestOptions(url, headers) {
    const result = super.createRequestOptions(url, headers);
    result.redirect = "manual";
    return result;
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$9.CancellationToken();
    const channelFile = (0, util_1.getChannelFilename)(this.getDefaultChannelName());
    const releaseInfo = await this.getLatestVersionInfo(cancellationToken);
    const asset = releaseInfo.assets.find((it) => it.name === channelFile);
    if (asset == null) {
      throw (0, builder_util_runtime_1$9.newError)(`Cannot find ${channelFile} in the release ${releaseInfo.html_url || releaseInfo.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    }
    const url = new url_1$2.URL(asset.url);
    let result;
    try {
      result = (0, js_yaml_1$1.load)(await this.httpRequest(url, this.configureHeaders("application/octet-stream"), cancellationToken));
    } catch (e) {
      if (e instanceof builder_util_runtime_1$9.HttpError && e.statusCode === 404) {
        throw (0, builder_util_runtime_1$9.newError)(`Cannot find ${channelFile} in the latest release artifacts (${url}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      }
      throw e;
    }
    result.assets = releaseInfo.assets;
    return result;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(accept) {
    return {
      accept,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(cancellationToken) {
    const allowPrerelease = this.updater.allowPrerelease;
    let basePath = this.basePath;
    if (!allowPrerelease) {
      basePath = `${basePath}/latest`;
    }
    const url = (0, util_1.newUrlFromBase)(basePath, this.baseUrl);
    try {
      const version = JSON.parse(await this.httpRequest(url, this.configureHeaders("application/vnd.github.v3+json"), cancellationToken));
      if (allowPrerelease) {
        return version.find((it) => it.prerelease) || version[0];
      } else {
        return version;
      }
    } catch (e) {
      throw (0, builder_util_runtime_1$9.newError)(`Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$6.getFileList)(updateInfo).map((it) => {
      const name = path$5.posix.basename(it.url).replace(/ /g, "-");
      const asset = updateInfo.assets.find((it2) => it2 != null && it2.name === name);
      if (asset == null) {
        throw (0, builder_util_runtime_1$9.newError)(`Cannot find asset "${name}" in: ${JSON.stringify(updateInfo.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      }
      return {
        url: new url_1$2.URL(asset.url),
        info: it
      };
    });
  }
}
PrivateGitHubProvider$1.PrivateGitHubProvider = PrivateGitHubProvider;
Object.defineProperty(providerFactory, "__esModule", { value: true });
providerFactory.isUrlProbablySupportMultiRangeRequests = isUrlProbablySupportMultiRangeRequests;
providerFactory.createClient = createClient;
const builder_util_runtime_1$8 = out;
const BitbucketProvider_1 = BitbucketProvider$1;
const GenericProvider_1$1 = GenericProvider$1;
const GitHubProvider_1 = GitHubProvider$1;
const GitLabProvider_1 = GitLabProvider$1;
const KeygenProvider_1 = KeygenProvider$1;
const PrivateGitHubProvider_1 = PrivateGitHubProvider$1;
function isUrlProbablySupportMultiRangeRequests(url) {
  return !url.includes("s3.amazonaws.com");
}
function createClient(data, updater, runtimeOptions) {
  if (typeof data === "string") {
    throw (0, builder_util_runtime_1$8.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  }
  const provider = data.provider;
  switch (provider) {
    case "github": {
      const githubOptions = data;
      const token = (githubOptions.private ? process.env["GH_TOKEN"] || process.env["GITHUB_TOKEN"] : null) || githubOptions.token;
      if (token == null) {
        return new GitHubProvider_1.GitHubProvider(githubOptions, updater, runtimeOptions);
      } else {
        return new PrivateGitHubProvider_1.PrivateGitHubProvider(githubOptions, updater, token, runtimeOptions);
      }
    }
    case "bitbucket":
      return new BitbucketProvider_1.BitbucketProvider(data, updater, runtimeOptions);
    case "gitlab":
      return new GitLabProvider_1.GitLabProvider(data, updater, runtimeOptions);
    case "keygen":
      return new KeygenProvider_1.KeygenProvider(data, updater, runtimeOptions);
    case "s3":
    case "spaces":
      return new GenericProvider_1$1.GenericProvider({
        provider: "generic",
        url: (0, builder_util_runtime_1$8.getS3LikeProviderBaseUrl)(data),
        channel: data.channel || null
      }, updater, {
        ...runtimeOptions,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: false
      });
    case "generic": {
      const options = data;
      return new GenericProvider_1$1.GenericProvider(options, updater, {
        ...runtimeOptions,
        isUseMultipleRangeRequest: options.useMultipleRangeRequest !== false && isUrlProbablySupportMultiRangeRequests(options.url)
      });
    }
    case "custom": {
      const options = data;
      const constructor = options.updateProvider;
      if (!constructor) {
        throw (0, builder_util_runtime_1$8.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      }
      return new constructor(options, updater, runtimeOptions);
    }
    default:
      throw (0, builder_util_runtime_1$8.newError)(`Unsupported provider: ${provider}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var GenericDifferentialDownloader$1 = {};
var DifferentialDownloader$1 = {};
var DataSplitter$1 = {};
var downloadPlanBuilder = {};
Object.defineProperty(downloadPlanBuilder, "__esModule", { value: true });
downloadPlanBuilder.OperationKind = void 0;
downloadPlanBuilder.computeOperations = computeOperations;
var OperationKind$1;
(function(OperationKind2) {
  OperationKind2[OperationKind2["COPY"] = 0] = "COPY";
  OperationKind2[OperationKind2["DOWNLOAD"] = 1] = "DOWNLOAD";
})(OperationKind$1 || (downloadPlanBuilder.OperationKind = OperationKind$1 = {}));
function computeOperations(oldBlockMap, newBlockMap, logger) {
  const nameToOldBlocks = buildBlockFileMap(oldBlockMap.files);
  const nameToNewBlocks = buildBlockFileMap(newBlockMap.files);
  let lastOperation = null;
  const blockMapFile = newBlockMap.files[0];
  const operations = [];
  const name = blockMapFile.name;
  const oldEntry = nameToOldBlocks.get(name);
  if (oldEntry == null) {
    throw new Error(`no file ${name} in old blockmap`);
  }
  const newFile = nameToNewBlocks.get(name);
  let changedBlockCount = 0;
  const { checksumToOffset: checksumToOldOffset, checksumToOldSize } = buildChecksumMap(nameToOldBlocks.get(name), oldEntry.offset, logger);
  let newOffset = blockMapFile.offset;
  for (let i = 0; i < newFile.checksums.length; newOffset += newFile.sizes[i], i++) {
    const blockSize = newFile.sizes[i];
    const checksum = newFile.checksums[i];
    let oldOffset = checksumToOldOffset.get(checksum);
    if (oldOffset != null && checksumToOldSize.get(checksum) !== blockSize) {
      logger.warn(`Checksum ("${checksum}") matches, but size differs (old: ${checksumToOldSize.get(checksum)}, new: ${blockSize})`);
      oldOffset = void 0;
    }
    if (oldOffset === void 0) {
      changedBlockCount++;
      if (lastOperation != null && lastOperation.kind === OperationKind$1.DOWNLOAD && lastOperation.end === newOffset) {
        lastOperation.end += blockSize;
      } else {
        lastOperation = {
          kind: OperationKind$1.DOWNLOAD,
          start: newOffset,
          end: newOffset + blockSize
          // oldBlocks: null,
        };
        validateAndAdd(lastOperation, operations, checksum, i);
      }
    } else {
      if (lastOperation != null && lastOperation.kind === OperationKind$1.COPY && lastOperation.end === oldOffset) {
        lastOperation.end += blockSize;
      } else {
        lastOperation = {
          kind: OperationKind$1.COPY,
          start: oldOffset,
          end: oldOffset + blockSize
          // oldBlocks: [checksum]
        };
        validateAndAdd(lastOperation, operations, checksum, i);
      }
    }
  }
  if (changedBlockCount > 0) {
    logger.info(`File${blockMapFile.name === "file" ? "" : " " + blockMapFile.name} has ${changedBlockCount} changed blocks`);
  }
  return operations;
}
const isValidateOperationRange = process.env["DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES"] === "true";
function validateAndAdd(operation, operations, checksum, index) {
  if (isValidateOperationRange && operations.length !== 0) {
    const lastOperation = operations[operations.length - 1];
    if (lastOperation.kind === operation.kind && operation.start < lastOperation.end && operation.start > lastOperation.start) {
      const min = [lastOperation.start, lastOperation.end, operation.start, operation.end].reduce((p, v) => p < v ? p : v);
      throw new Error(`operation (block index: ${index}, checksum: ${checksum}, kind: ${OperationKind$1[operation.kind]}) overlaps previous operation (checksum: ${checksum}):
abs: ${lastOperation.start} until ${lastOperation.end} and ${operation.start} until ${operation.end}
rel: ${lastOperation.start - min} until ${lastOperation.end - min} and ${operation.start - min} until ${operation.end - min}`);
    }
  }
  operations.push(operation);
}
function buildChecksumMap(file2, fileOffset, logger) {
  const checksumToOffset = /* @__PURE__ */ new Map();
  const checksumToSize = /* @__PURE__ */ new Map();
  let offset = fileOffset;
  for (let i = 0; i < file2.checksums.length; i++) {
    const checksum = file2.checksums[i];
    const size = file2.sizes[i];
    const existing = checksumToSize.get(checksum);
    if (existing === void 0) {
      checksumToOffset.set(checksum, offset);
      checksumToSize.set(checksum, size);
    } else if (logger.debug != null) {
      const sizeExplanation = existing === size ? "(same size)" : `(size: ${existing}, this size: ${size})`;
      logger.debug(`${checksum} duplicated in blockmap ${sizeExplanation}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    offset += size;
  }
  return { checksumToOffset, checksumToOldSize: checksumToSize };
}
function buildBlockFileMap(list) {
  const result = /* @__PURE__ */ new Map();
  for (const item of list) {
    result.set(item.name, item);
  }
  return result;
}
Object.defineProperty(DataSplitter$1, "__esModule", { value: true });
DataSplitter$1.DataSplitter = void 0;
DataSplitter$1.copyData = copyData;
const builder_util_runtime_1$7 = out;
const fs_1$3 = require$$1$1;
const stream_1$1 = require$$0$1;
const downloadPlanBuilder_1$2 = downloadPlanBuilder;
const DOUBLE_CRLF = Buffer.from("\r\n\r\n");
var ReadState;
(function(ReadState2) {
  ReadState2[ReadState2["INIT"] = 0] = "INIT";
  ReadState2[ReadState2["HEADER"] = 1] = "HEADER";
  ReadState2[ReadState2["BODY"] = 2] = "BODY";
})(ReadState || (ReadState = {}));
function copyData(task, out2, oldFileFd, reject, resolve) {
  const readStream = (0, fs_1$3.createReadStream)("", {
    fd: oldFileFd,
    autoClose: false,
    start: task.start,
    // end is inclusive
    end: task.end - 1
  });
  readStream.on("error", reject);
  readStream.once("end", resolve);
  readStream.pipe(out2, {
    end: false
  });
}
class DataSplitter extends stream_1$1.Writable {
  constructor(out2, options, partIndexToTaskIndex, boundary, partIndexToLength, finishHandler, grandTotalBytes, onProgress) {
    super();
    this.out = out2;
    this.options = options;
    this.partIndexToTaskIndex = partIndexToTaskIndex;
    this.partIndexToLength = partIndexToLength;
    this.finishHandler = finishHandler;
    this.grandTotalBytes = grandTotalBytes;
    this.onProgress = onProgress;
    this.start = Date.now();
    this.nextUpdate = this.start + 1e3;
    this.transferred = 0;
    this.delta = 0;
    this.partIndex = -1;
    this.headerListBuffer = null;
    this.readState = ReadState.INIT;
    this.ignoreByteCount = 0;
    this.remainingPartDataCount = 0;
    this.actualPartLength = 0;
    this.boundaryLength = boundary.length + 4;
    this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(data, encoding, callback) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${data.length} bytes`);
      return;
    }
    this.handleData(data).then(() => {
      if (this.onProgress) {
        const now = Date.now();
        if ((now >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (now - this.start) / 1e3) {
          this.nextUpdate = now + 1e3;
          this.onProgress({
            total: this.grandTotalBytes,
            delta: this.delta,
            transferred: this.transferred,
            percent: this.transferred / this.grandTotalBytes * 100,
            bytesPerSecond: Math.round(this.transferred / ((now - this.start) / 1e3))
          });
          this.delta = 0;
        }
      }
      callback();
    }).catch(callback);
  }
  async handleData(chunk) {
    let start = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0) {
      throw (0, builder_util_runtime_1$7.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    }
    if (this.ignoreByteCount > 0) {
      const toIgnore = Math.min(this.ignoreByteCount, chunk.length);
      this.ignoreByteCount -= toIgnore;
      start = toIgnore;
    } else if (this.remainingPartDataCount > 0) {
      const toRead = Math.min(this.remainingPartDataCount, chunk.length);
      this.remainingPartDataCount -= toRead;
      await this.processPartData(chunk, 0, toRead);
      start = toRead;
    }
    if (start === chunk.length) {
      return;
    }
    if (this.readState === ReadState.HEADER) {
      const headerListEnd = this.searchHeaderListEnd(chunk, start);
      if (headerListEnd === -1) {
        return;
      }
      start = headerListEnd;
      this.readState = ReadState.BODY;
      this.headerListBuffer = null;
    }
    while (true) {
      if (this.readState === ReadState.BODY) {
        this.readState = ReadState.INIT;
      } else {
        this.partIndex++;
        let taskIndex = this.partIndexToTaskIndex.get(this.partIndex);
        if (taskIndex == null) {
          if (this.isFinished) {
            taskIndex = this.options.end;
          } else {
            throw (0, builder_util_runtime_1$7.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          }
        }
        const prevTaskIndex = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
        if (prevTaskIndex < taskIndex) {
          await this.copyExistingData(prevTaskIndex, taskIndex);
        } else if (prevTaskIndex > taskIndex) {
          throw (0, builder_util_runtime_1$7.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
        }
        if (this.isFinished) {
          this.onPartEnd();
          this.finishHandler();
          return;
        }
        start = this.searchHeaderListEnd(chunk, start);
        if (start === -1) {
          this.readState = ReadState.HEADER;
          return;
        }
      }
      const partLength = this.partIndexToLength[this.partIndex];
      const end = start + partLength;
      const effectiveEnd = Math.min(end, chunk.length);
      await this.processPartStarted(chunk, start, effectiveEnd);
      this.remainingPartDataCount = partLength - (effectiveEnd - start);
      if (this.remainingPartDataCount > 0) {
        return;
      }
      start = end + this.boundaryLength;
      if (start >= chunk.length) {
        this.ignoreByteCount = this.boundaryLength - (chunk.length - end);
        return;
      }
    }
  }
  copyExistingData(index, end) {
    return new Promise((resolve, reject) => {
      const w = () => {
        if (index === end) {
          resolve();
          return;
        }
        const task = this.options.tasks[index];
        if (task.kind !== downloadPlanBuilder_1$2.OperationKind.COPY) {
          reject(new Error("Task kind must be COPY"));
          return;
        }
        copyData(task, this.out, this.options.oldFileFd, reject, () => {
          index++;
          w();
        });
      };
      w();
    });
  }
  searchHeaderListEnd(chunk, readOffset) {
    const headerListEnd = chunk.indexOf(DOUBLE_CRLF, readOffset);
    if (headerListEnd !== -1) {
      return headerListEnd + DOUBLE_CRLF.length;
    }
    const partialChunk = readOffset === 0 ? chunk : chunk.slice(readOffset);
    if (this.headerListBuffer == null) {
      this.headerListBuffer = partialChunk;
    } else {
      this.headerListBuffer = Buffer.concat([this.headerListBuffer, partialChunk]);
    }
    return -1;
  }
  onPartEnd() {
    const expectedLength = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== expectedLength) {
      throw (0, builder_util_runtime_1$7.newError)(`Expected length: ${expectedLength} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    }
    this.actualPartLength = 0;
  }
  processPartStarted(data, start, end) {
    if (this.partIndex !== 0) {
      this.onPartEnd();
    }
    return this.processPartData(data, start, end);
  }
  processPartData(data, start, end) {
    this.actualPartLength += end - start;
    this.transferred += end - start;
    this.delta += end - start;
    const out2 = this.out;
    if (out2.write(start === 0 && data.length === end ? data : data.slice(start, end))) {
      return Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        out2.on("error", reject);
        out2.once("drain", () => {
          out2.removeListener("error", reject);
          resolve();
        });
      });
    }
  }
}
DataSplitter$1.DataSplitter = DataSplitter;
var multipleRangeDownloader = {};
Object.defineProperty(multipleRangeDownloader, "__esModule", { value: true });
multipleRangeDownloader.executeTasksUsingMultipleRangeRequests = executeTasksUsingMultipleRangeRequests;
multipleRangeDownloader.checkIsRangesSupported = checkIsRangesSupported;
const builder_util_runtime_1$6 = out;
const DataSplitter_1$1 = DataSplitter$1;
const downloadPlanBuilder_1$1 = downloadPlanBuilder;
function executeTasksUsingMultipleRangeRequests(differentialDownloader, tasks, out2, oldFileFd, reject) {
  const w = (taskOffset) => {
    if (taskOffset >= tasks.length) {
      if (differentialDownloader.fileMetadataBuffer != null) {
        out2.write(differentialDownloader.fileMetadataBuffer);
      }
      out2.end();
      return;
    }
    const nextOffset = taskOffset + 1e3;
    doExecuteTasks(differentialDownloader, {
      tasks,
      start: taskOffset,
      end: Math.min(tasks.length, nextOffset),
      oldFileFd
    }, out2, () => w(nextOffset), reject);
  };
  return w;
}
function doExecuteTasks(differentialDownloader, options, out2, resolve, reject) {
  let ranges = "bytes=";
  let partCount = 0;
  let grandTotalBytes = 0;
  const partIndexToTaskIndex = /* @__PURE__ */ new Map();
  const partIndexToLength = [];
  for (let i = options.start; i < options.end; i++) {
    const task = options.tasks[i];
    if (task.kind === downloadPlanBuilder_1$1.OperationKind.DOWNLOAD) {
      ranges += `${task.start}-${task.end - 1}, `;
      partIndexToTaskIndex.set(partCount, i);
      partCount++;
      partIndexToLength.push(task.end - task.start);
      grandTotalBytes += task.end - task.start;
    }
  }
  if (partCount <= 1) {
    const w = (index) => {
      if (index >= options.end) {
        resolve();
        return;
      }
      const task = options.tasks[index++];
      if (task.kind === downloadPlanBuilder_1$1.OperationKind.COPY) {
        (0, DataSplitter_1$1.copyData)(task, out2, options.oldFileFd, reject, () => w(index));
      } else {
        const requestOptions2 = differentialDownloader.createRequestOptions();
        requestOptions2.headers.Range = `bytes=${task.start}-${task.end - 1}`;
        const request2 = differentialDownloader.httpExecutor.createRequest(requestOptions2, (response) => {
          response.on("error", reject);
          if (!checkIsRangesSupported(response, reject)) {
            return;
          }
          response.pipe(out2, {
            end: false
          });
          response.once("end", () => w(index));
        });
        differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request2, reject);
        request2.end();
      }
    };
    w(options.start);
    return;
  }
  const requestOptions = differentialDownloader.createRequestOptions();
  requestOptions.headers.Range = ranges.substring(0, ranges.length - 2);
  const request = differentialDownloader.httpExecutor.createRequest(requestOptions, (response) => {
    if (!checkIsRangesSupported(response, reject)) {
      return;
    }
    const contentType = (0, builder_util_runtime_1$6.safeGetHeader)(response, "content-type");
    const m = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(contentType);
    if (m == null) {
      reject(new Error(`Content-Type "multipart/byteranges" is expected, but got "${contentType}"`));
      return;
    }
    const dicer = new DataSplitter_1$1.DataSplitter(out2, options, partIndexToTaskIndex, m[1] || m[2], partIndexToLength, resolve, grandTotalBytes, differentialDownloader.options.onProgress);
    dicer.on("error", reject);
    response.pipe(dicer);
    response.on("end", () => {
      setTimeout(() => {
        request.abort();
        reject(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
  request.end();
}
function checkIsRangesSupported(response, reject) {
  if (response.statusCode >= 400) {
    reject((0, builder_util_runtime_1$6.createHttpError)(response));
    return false;
  }
  if (response.statusCode !== 206) {
    const acceptRanges = (0, builder_util_runtime_1$6.safeGetHeader)(response, "accept-ranges");
    if (acceptRanges == null || acceptRanges === "none") {
      reject(new Error(`Server doesn't support Accept-Ranges (response code ${response.statusCode})`));
      return false;
    }
  }
  return true;
}
var ProgressDifferentialDownloadCallbackTransform$1 = {};
Object.defineProperty(ProgressDifferentialDownloadCallbackTransform$1, "__esModule", { value: true });
ProgressDifferentialDownloadCallbackTransform$1.ProgressDifferentialDownloadCallbackTransform = void 0;
const stream_1 = require$$0$1;
var OperationKind;
(function(OperationKind2) {
  OperationKind2[OperationKind2["COPY"] = 0] = "COPY";
  OperationKind2[OperationKind2["DOWNLOAD"] = 1] = "DOWNLOAD";
})(OperationKind || (OperationKind = {}));
class ProgressDifferentialDownloadCallbackTransform extends stream_1.Transform {
  constructor(progressDifferentialDownloadInfo, cancellationToken, onProgress) {
    super();
    this.progressDifferentialDownloadInfo = progressDifferentialDownloadInfo;
    this.cancellationToken = cancellationToken;
    this.onProgress = onProgress;
    this.start = Date.now();
    this.transferred = 0;
    this.delta = 0;
    this.expectedBytes = 0;
    this.index = 0;
    this.operationType = OperationKind.COPY;
    this.nextUpdate = this.start + 1e3;
  }
  _transform(chunk, encoding, callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == OperationKind.COPY) {
      callback(null, chunk);
      return;
    }
    this.transferred += chunk.length;
    this.delta += chunk.length;
    const now = Date.now();
    if (now >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal) {
      this.nextUpdate = now + 1e3;
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((now - this.start) / 1e3))
      });
      this.delta = 0;
    }
    callback(null, chunk);
  }
  beginFileCopy() {
    this.operationType = OperationKind.COPY;
  }
  beginRangeDownload() {
    this.operationType = OperationKind.DOWNLOAD;
    this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    if (this.transferred !== this.progressDifferentialDownloadInfo.grandTotal) {
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
  }
  // Called when we are 100% done with the connection/download
  _flush(callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
    this.delta = 0;
    this.transferred = 0;
    callback(null);
  }
}
ProgressDifferentialDownloadCallbackTransform$1.ProgressDifferentialDownloadCallbackTransform = ProgressDifferentialDownloadCallbackTransform;
Object.defineProperty(DifferentialDownloader$1, "__esModule", { value: true });
DifferentialDownloader$1.DifferentialDownloader = void 0;
const builder_util_runtime_1$5 = out;
const fs_extra_1$5 = lib;
const fs_1$2 = require$$1$1;
const DataSplitter_1 = DataSplitter$1;
const url_1$1 = require$$2$1;
const downloadPlanBuilder_1 = downloadPlanBuilder;
const multipleRangeDownloader_1 = multipleRangeDownloader;
const ProgressDifferentialDownloadCallbackTransform_1 = ProgressDifferentialDownloadCallbackTransform$1;
class DifferentialDownloader {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(blockAwareFileInfo, httpExecutor2, options) {
    this.blockAwareFileInfo = blockAwareFileInfo;
    this.httpExecutor = httpExecutor2;
    this.options = options;
    this.fileMetadataBuffer = null;
    this.logger = options.logger;
  }
  createRequestOptions() {
    const result = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    (0, builder_util_runtime_1$5.configureRequestUrl)(this.options.newUrl, result);
    (0, builder_util_runtime_1$5.configureRequestOptions)(result);
    return result;
  }
  doDownload(oldBlockMap, newBlockMap) {
    if (oldBlockMap.version !== newBlockMap.version) {
      throw new Error(`version is different (${oldBlockMap.version} - ${newBlockMap.version}), full download is required`);
    }
    const logger = this.logger;
    const operations = (0, downloadPlanBuilder_1.computeOperations)(oldBlockMap, newBlockMap, logger);
    if (logger.debug != null) {
      logger.debug(JSON.stringify(operations, null, 2));
    }
    let downloadSize = 0;
    let copySize = 0;
    for (const operation of operations) {
      const length = operation.end - operation.start;
      if (operation.kind === downloadPlanBuilder_1.OperationKind.DOWNLOAD) {
        downloadSize += length;
      } else {
        copySize += length;
      }
    }
    const newSize = this.blockAwareFileInfo.size;
    if (downloadSize + copySize + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== newSize) {
      throw new Error(`Internal error, size mismatch: downloadSize: ${downloadSize}, copySize: ${copySize}, newSize: ${newSize}`);
    }
    logger.info(`Full: ${formatBytes(newSize)}, To download: ${formatBytes(downloadSize)} (${Math.round(downloadSize / (newSize / 100))}%)`);
    return this.downloadFile(operations);
  }
  downloadFile(tasks) {
    const fdList = [];
    const closeFiles = () => {
      return Promise.all(fdList.map((openedFile) => {
        return (0, fs_extra_1$5.close)(openedFile.descriptor).catch((e) => {
          this.logger.error(`cannot close file "${openedFile.path}": ${e}`);
        });
      }));
    };
    return this.doDownloadFile(tasks, fdList).then(closeFiles).catch((e) => {
      return closeFiles().catch((closeFilesError) => {
        try {
          this.logger.error(`cannot close files: ${closeFilesError}`);
        } catch (errorOnLog) {
          try {
            console.error(errorOnLog);
          } catch (_ignored) {
          }
        }
        throw e;
      }).then(() => {
        throw e;
      });
    });
  }
  async doDownloadFile(tasks, fdList) {
    const oldFileFd = await (0, fs_extra_1$5.open)(this.options.oldFile, "r");
    fdList.push({ descriptor: oldFileFd, path: this.options.oldFile });
    const newFileFd = await (0, fs_extra_1$5.open)(this.options.newFile, "w");
    fdList.push({ descriptor: newFileFd, path: this.options.newFile });
    const fileOut = (0, fs_1$2.createWriteStream)(this.options.newFile, { fd: newFileFd });
    await new Promise((resolve, reject) => {
      const streams = [];
      let downloadInfoTransform = void 0;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const expectedByteCounts = [];
        let grandTotalBytes = 0;
        for (const task of tasks) {
          if (task.kind === downloadPlanBuilder_1.OperationKind.DOWNLOAD) {
            expectedByteCounts.push(task.end - task.start);
            grandTotalBytes += task.end - task.start;
          }
        }
        const progressDifferentialDownloadInfo = {
          expectedByteCounts,
          grandTotal: grandTotalBytes
        };
        downloadInfoTransform = new ProgressDifferentialDownloadCallbackTransform_1.ProgressDifferentialDownloadCallbackTransform(progressDifferentialDownloadInfo, this.options.cancellationToken, this.options.onProgress);
        streams.push(downloadInfoTransform);
      }
      const digestTransform = new builder_util_runtime_1$5.DigestTransform(this.blockAwareFileInfo.sha512);
      digestTransform.isValidateOnEnd = false;
      streams.push(digestTransform);
      fileOut.on("finish", () => {
        fileOut.close(() => {
          fdList.splice(1, 1);
          try {
            digestTransform.validate();
          } catch (e) {
            reject(e);
            return;
          }
          resolve(void 0);
        });
      });
      streams.push(fileOut);
      let lastStream = null;
      for (const stream of streams) {
        stream.on("error", reject);
        if (lastStream == null) {
          lastStream = stream;
        } else {
          lastStream = lastStream.pipe(stream);
        }
      }
      const firstStream = streams[0];
      let w;
      if (this.options.isUseMultipleRangeRequest) {
        w = (0, multipleRangeDownloader_1.executeTasksUsingMultipleRangeRequests)(this, tasks, firstStream, oldFileFd, reject);
        w(0);
        return;
      }
      let downloadOperationCount = 0;
      let actualUrl = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const requestOptions = this.createRequestOptions();
      requestOptions.redirect = "manual";
      w = (index) => {
        var _a2, _b2;
        if (index >= tasks.length) {
          if (this.fileMetadataBuffer != null) {
            firstStream.write(this.fileMetadataBuffer);
          }
          firstStream.end();
          return;
        }
        const operation = tasks[index++];
        if (operation.kind === downloadPlanBuilder_1.OperationKind.COPY) {
          if (downloadInfoTransform) {
            downloadInfoTransform.beginFileCopy();
          }
          (0, DataSplitter_1.copyData)(operation, firstStream, oldFileFd, reject, () => w(index));
          return;
        }
        const range2 = `bytes=${operation.start}-${operation.end - 1}`;
        requestOptions.headers.range = range2;
        (_b2 = (_a2 = this.logger) === null || _a2 === void 0 ? void 0 : _a2.debug) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, `download range: ${range2}`);
        if (downloadInfoTransform) {
          downloadInfoTransform.beginRangeDownload();
        }
        const request = this.httpExecutor.createRequest(requestOptions, (response) => {
          response.on("error", reject);
          response.on("aborted", () => {
            reject(new Error("response has been aborted by the server"));
          });
          if (response.statusCode >= 400) {
            reject((0, builder_util_runtime_1$5.createHttpError)(response));
          }
          response.pipe(firstStream, {
            end: false
          });
          response.once("end", () => {
            if (downloadInfoTransform) {
              downloadInfoTransform.endRangeDownload();
            }
            if (++downloadOperationCount === 100) {
              downloadOperationCount = 0;
              setTimeout(() => w(index), 1e3);
            } else {
              w(index);
            }
          });
        });
        request.on("redirect", (statusCode, method, redirectUrl) => {
          this.logger.info(`Redirect to ${removeQuery(redirectUrl)}`);
          actualUrl = redirectUrl;
          (0, builder_util_runtime_1$5.configureRequestUrl)(new url_1$1.URL(actualUrl), requestOptions);
          request.followRedirect();
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
        request.end();
      };
      w(0);
    });
  }
  async readRemoteBytes(start, endInclusive) {
    const buffer = Buffer.allocUnsafe(endInclusive + 1 - start);
    const requestOptions = this.createRequestOptions();
    requestOptions.headers.range = `bytes=${start}-${endInclusive}`;
    let position = 0;
    await this.request(requestOptions, (chunk) => {
      chunk.copy(buffer, position);
      position += chunk.length;
    });
    if (position !== buffer.length) {
      throw new Error(`Received data length ${position} is not equal to expected ${buffer.length}`);
    }
    return buffer;
  }
  request(requestOptions, dataHandler) {
    return new Promise((resolve, reject) => {
      const request = this.httpExecutor.createRequest(requestOptions, (response) => {
        if (!(0, multipleRangeDownloader_1.checkIsRangesSupported)(response, reject)) {
          return;
        }
        response.on("error", reject);
        response.on("aborted", () => {
          reject(new Error("response has been aborted by the server"));
        });
        response.on("data", dataHandler);
        response.on("end", () => resolve());
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
      request.end();
    });
  }
}
DifferentialDownloader$1.DifferentialDownloader = DifferentialDownloader;
function formatBytes(value, symbol = " KB") {
  return new Intl.NumberFormat("en").format((value / 1024).toFixed(2)) + symbol;
}
function removeQuery(url) {
  const index = url.indexOf("?");
  return index < 0 ? url : url.substring(0, index);
}
Object.defineProperty(GenericDifferentialDownloader$1, "__esModule", { value: true });
GenericDifferentialDownloader$1.GenericDifferentialDownloader = void 0;
const DifferentialDownloader_1$1 = DifferentialDownloader$1;
class GenericDifferentialDownloader extends DifferentialDownloader_1$1.DifferentialDownloader {
  download(oldBlockMap, newBlockMap) {
    return this.doDownload(oldBlockMap, newBlockMap);
  }
}
GenericDifferentialDownloader$1.GenericDifferentialDownloader = GenericDifferentialDownloader;
var types = {};
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.UpdaterSignal = exports2.UPDATE_DOWNLOADED = exports2.DOWNLOAD_PROGRESS = exports2.CancellationToken = void 0;
  exports2.addHandler = addHandler;
  const builder_util_runtime_12 = out;
  Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
    return builder_util_runtime_12.CancellationToken;
  } });
  exports2.DOWNLOAD_PROGRESS = "download-progress";
  exports2.UPDATE_DOWNLOADED = "update-downloaded";
  class UpdaterSignal {
    constructor(emitter) {
      this.emitter = emitter;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(handler) {
      addHandler(this.emitter, "login", handler);
    }
    progress(handler) {
      addHandler(this.emitter, exports2.DOWNLOAD_PROGRESS, handler);
    }
    updateDownloaded(handler) {
      addHandler(this.emitter, exports2.UPDATE_DOWNLOADED, handler);
    }
    updateCancelled(handler) {
      addHandler(this.emitter, "update-cancelled", handler);
    }
  }
  exports2.UpdaterSignal = UpdaterSignal;
  function addHandler(emitter, event, handler) {
    {
      emitter.on(event, handler);
    }
  }
})(types);
Object.defineProperty(AppUpdater$1, "__esModule", { value: true });
AppUpdater$1.NoOpLogger = AppUpdater$1.AppUpdater = void 0;
const builder_util_runtime_1$4 = out;
const crypto_1$1 = require$$0$3;
const os_1 = require$$2;
const events_1 = require$$0$2;
const fs_extra_1$4 = lib;
const js_yaml_1 = jsYaml;
const lazy_val_1 = main;
const path$4 = require$$1$2;
const semver_1 = semver$1;
const DownloadedUpdateHelper_1 = DownloadedUpdateHelper$1;
const ElectronAppAdapter_1 = ElectronAppAdapter$1;
const electronHttpExecutor_1 = electronHttpExecutor;
const GenericProvider_1 = GenericProvider$1;
const providerFactory_1 = providerFactory;
const zlib_1$1 = require$$14;
const GenericDifferentialDownloader_1 = GenericDifferentialDownloader$1;
const types_1$5 = types;
class AppUpdater extends events_1.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(value) {
    if (this._channel != null) {
      if (typeof value !== "string") {
        throw (0, builder_util_runtime_1$4.newError)(`Channel must be a string, but got: ${value}`, "ERR_UPDATER_INVALID_CHANNEL");
      } else if (value.length === 0) {
        throw (0, builder_util_runtime_1$4.newError)(`Channel must be not an empty string`, "ERR_UPDATER_INVALID_CHANNEL");
      }
    }
    this._channel = value;
    this.allowDowngrade = true;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(token) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: token
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, electronHttpExecutor_1.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(value) {
    this._logger = value == null ? new NoOpLogger() : value;
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(value) {
    this.clientPromise = null;
    this._appUpdateConfigPath = value;
    this.configOnDisk = new lazy_val_1.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(value) {
    if (value) {
      this._isUpdateSupported = value;
    }
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(value) {
    if (value) {
      this._isUserWithinRollout = value;
    }
  }
  constructor(options, app) {
    super();
    this.autoDownload = true;
    this.autoInstallOnAppQuit = true;
    this.autoRunAppAfterInstall = true;
    this.allowPrerelease = false;
    this.fullChangelog = false;
    this.allowDowngrade = false;
    this.disableWebInstaller = false;
    this.disableDifferentialDownload = false;
    this.forceDevUpdateConfig = false;
    this.previousBlockmapBaseUrlOverride = null;
    this._channel = null;
    this.downloadedUpdateHelper = null;
    this.requestHeaders = null;
    this._logger = console;
    this.signals = new types_1$5.UpdaterSignal(this);
    this._appUpdateConfigPath = null;
    this._isUpdateSupported = (updateInfo) => this.checkIfUpdateSupported(updateInfo);
    this._isUserWithinRollout = (updateInfo) => this.isStagingMatch(updateInfo);
    this.clientPromise = null;
    this.stagingUserIdPromise = new lazy_val_1.Lazy(() => this.getOrCreateStagingUserId());
    this.configOnDisk = new lazy_val_1.Lazy(() => this.loadUpdateConfig());
    this.checkForUpdatesPromise = null;
    this.downloadPromise = null;
    this.updateInfoAndProvider = null;
    this._testOnlyOptions = null;
    this.on("error", (error2) => {
      this._logger.error(`Error: ${error2.stack || error2.message}`);
    });
    if (app == null) {
      this.app = new ElectronAppAdapter_1.ElectronAppAdapter();
      this.httpExecutor = new electronHttpExecutor_1.ElectronHttpExecutor((authInfo, callback) => this.emit("login", authInfo, callback));
    } else {
      this.app = app;
      this.httpExecutor = null;
    }
    const currentVersionString = this.app.version;
    const currentVersion = (0, semver_1.parse)(currentVersionString);
    if (currentVersion == null) {
      throw (0, builder_util_runtime_1$4.newError)(`App version is not a valid semver version: "${currentVersionString}"`, "ERR_UPDATER_INVALID_VERSION");
    }
    this.currentVersion = currentVersion;
    this.allowPrerelease = hasPrereleaseComponents(currentVersion);
    if (options != null) {
      this.setFeedURL(options);
      if (typeof options !== "string" && options.requestHeaders) {
        this.requestHeaders = options.requestHeaders;
      }
    }
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(options) {
    const runtimeOptions = this.createProviderRuntimeOptions();
    let provider;
    if (typeof options === "string") {
      provider = new GenericProvider_1.GenericProvider({ provider: "generic", url: options }, this, {
        ...runtimeOptions,
        isUseMultipleRangeRequest: (0, providerFactory_1.isUrlProbablySupportMultiRangeRequests)(options)
      });
    } else {
      provider = (0, providerFactory_1.createClient)(options, this, runtimeOptions);
    }
    this.clientPromise = Promise.resolve(provider);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive()) {
      return Promise.resolve(null);
    }
    let checkForUpdatesPromise = this.checkForUpdatesPromise;
    if (checkForUpdatesPromise != null) {
      this._logger.info("Checking for update (already in progress)");
      return checkForUpdatesPromise;
    }
    const nullizePromise = () => this.checkForUpdatesPromise = null;
    this._logger.info("Checking for update");
    checkForUpdatesPromise = this.doCheckForUpdates().then((it) => {
      nullizePromise();
      return it;
    }).catch((e) => {
      nullizePromise();
      this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`);
      throw e;
    });
    this.checkForUpdatesPromise = checkForUpdatesPromise;
    return checkForUpdatesPromise;
  }
  isUpdaterActive() {
    const isEnabled = this.app.isPackaged || this.forceDevUpdateConfig;
    if (!isEnabled) {
      this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced");
      return false;
    }
    return true;
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(downloadNotification) {
    return this.checkForUpdates().then((it) => {
      if (!(it === null || it === void 0 ? void 0 : it.downloadPromise)) {
        if (this._logger.debug != null) {
          this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null");
        }
        return it;
      }
      void it.downloadPromise.then(() => {
        const notificationContent = AppUpdater.formatDownloadNotification(it.updateInfo.version, this.app.name, downloadNotification);
        new require$$1.Notification(notificationContent).show();
      });
      return it;
    });
  }
  static formatDownloadNotification(version, appName, downloadNotification) {
    if (downloadNotification == null) {
      downloadNotification = {
        title: "A new update is ready to install",
        body: `{appName} version {version} has been downloaded and will be automatically installed on exit`
      };
    }
    downloadNotification = {
      title: downloadNotification.title.replace("{appName}", appName).replace("{version}", version),
      body: downloadNotification.body.replace("{appName}", appName).replace("{version}", version)
    };
    return downloadNotification;
  }
  async isStagingMatch(updateInfo) {
    const rawStagingPercentage = updateInfo.stagingPercentage;
    let stagingPercentage = rawStagingPercentage;
    if (stagingPercentage == null) {
      return true;
    }
    stagingPercentage = parseInt(stagingPercentage, 10);
    if (isNaN(stagingPercentage)) {
      this._logger.warn(`Staging percentage is NaN: ${rawStagingPercentage}`);
      return true;
    }
    stagingPercentage = stagingPercentage / 100;
    const stagingUserId = await this.stagingUserIdPromise.value;
    const val = builder_util_runtime_1$4.UUID.parse(stagingUserId).readUInt32BE(12);
    const percentage = val / 4294967295;
    this._logger.info(`Staging percentage: ${stagingPercentage}, percentage: ${percentage}, user id: ${stagingUserId}`);
    return percentage < stagingPercentage;
  }
  computeFinalHeaders(headers) {
    if (this.requestHeaders != null) {
      Object.assign(headers, this.requestHeaders);
    }
    return headers;
  }
  async isUpdateAvailable(updateInfo) {
    const latestVersion = (0, semver_1.parse)(updateInfo.version);
    if (latestVersion == null) {
      throw (0, builder_util_runtime_1$4.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${updateInfo.version}"`, "ERR_UPDATER_INVALID_VERSION");
    }
    const currentVersion = this.currentVersion;
    if ((0, semver_1.eq)(latestVersion, currentVersion)) {
      return false;
    }
    if (!await Promise.resolve(this.isUpdateSupported(updateInfo))) {
      return false;
    }
    const isUserWithinRollout = await Promise.resolve(this.isUserWithinRollout(updateInfo));
    if (!isUserWithinRollout) {
      return false;
    }
    const isLatestVersionNewer = (0, semver_1.gt)(latestVersion, currentVersion);
    const isLatestVersionOlder = (0, semver_1.lt)(latestVersion, currentVersion);
    if (isLatestVersionNewer) {
      return true;
    }
    return this.allowDowngrade && isLatestVersionOlder;
  }
  checkIfUpdateSupported(updateInfo) {
    const minimumSystemVersion = updateInfo === null || updateInfo === void 0 ? void 0 : updateInfo.minimumSystemVersion;
    const currentOSVersion = (0, os_1.release)();
    if (minimumSystemVersion) {
      try {
        if ((0, semver_1.lt)(currentOSVersion, minimumSystemVersion)) {
          this._logger.info(`Current OS version ${currentOSVersion} is less than the minimum OS version required ${minimumSystemVersion} for version ${currentOSVersion}`);
          return false;
        }
      } catch (e) {
        this._logger.warn(`Failed to compare current OS version(${currentOSVersion}) with minimum OS version(${minimumSystemVersion}): ${(e.message || e).toString()}`);
      }
    }
    return true;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady();
    if (this.clientPromise == null) {
      this.clientPromise = this.configOnDisk.value.then((it) => (0, providerFactory_1.createClient)(it, this, this.createProviderRuntimeOptions()));
    }
    const client = await this.clientPromise;
    const stagingUserId = await this.stagingUserIdPromise.value;
    client.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": stagingUserId }));
    return {
      info: await client.getLatestVersion(),
      provider: client
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: true,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const result = await this.getUpdateInfoAndProvider();
    const updateInfo = result.info;
    if (!await this.isUpdateAvailable(updateInfo)) {
      this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${updateInfo.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`);
      this.emit("update-not-available", updateInfo);
      return {
        isUpdateAvailable: false,
        versionInfo: updateInfo,
        updateInfo
      };
    }
    this.updateInfoAndProvider = result;
    this.onUpdateAvailable(updateInfo);
    const cancellationToken = new builder_util_runtime_1$4.CancellationToken();
    return {
      isUpdateAvailable: true,
      versionInfo: updateInfo,
      updateInfo,
      cancellationToken,
      downloadPromise: this.autoDownload ? this.downloadUpdate(cancellationToken) : null
    };
  }
  onUpdateAvailable(updateInfo) {
    this._logger.info(`Found version ${updateInfo.version} (url: ${(0, builder_util_runtime_1$4.asArray)(updateInfo.files).map((it) => it.url).join(", ")})`);
    this.emit("update-available", updateInfo);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(cancellationToken = new builder_util_runtime_1$4.CancellationToken()) {
    const updateInfoAndProvider = this.updateInfoAndProvider;
    if (updateInfoAndProvider == null) {
      const error2 = new Error("Please check update first");
      this.dispatchError(error2);
      return Promise.reject(error2);
    }
    if (this.downloadPromise != null) {
      this._logger.info("Downloading update (already in progress)");
      return this.downloadPromise;
    }
    this._logger.info(`Downloading update from ${(0, builder_util_runtime_1$4.asArray)(updateInfoAndProvider.info.files).map((it) => it.url).join(", ")}`);
    const errorHandler = (e) => {
      if (!(e instanceof builder_util_runtime_1$4.CancellationError)) {
        try {
          this.dispatchError(e);
        } catch (nestedError) {
          this._logger.warn(`Cannot dispatch error event: ${nestedError.stack || nestedError}`);
        }
      }
      return e;
    };
    this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider,
      requestHeaders: this.computeRequestHeaders(updateInfoAndProvider.provider),
      cancellationToken,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((e) => {
      throw errorHandler(e);
    }).finally(() => {
      this.downloadPromise = null;
    });
    return this.downloadPromise;
  }
  dispatchError(e) {
    this.emit("error", e, (e.stack || e).toString());
  }
  dispatchUpdateDownloaded(event) {
    this.emit(types_1$5.UPDATE_DOWNLOADED, event);
  }
  async loadUpdateConfig() {
    if (this._appUpdateConfigPath == null) {
      this._appUpdateConfigPath = this.app.appUpdateConfigPath;
    }
    return (0, js_yaml_1.load)(await (0, fs_extra_1$4.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(provider) {
    const fileExtraDownloadHeaders = provider.fileExtraDownloadHeaders;
    if (fileExtraDownloadHeaders != null) {
      const requestHeaders = this.requestHeaders;
      return requestHeaders == null ? fileExtraDownloadHeaders : {
        ...fileExtraDownloadHeaders,
        ...requestHeaders
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const file2 = path$4.join(this.app.userDataPath, ".updaterId");
    try {
      const id2 = await (0, fs_extra_1$4.readFile)(file2, "utf-8");
      if (builder_util_runtime_1$4.UUID.check(id2)) {
        return id2;
      } else {
        this._logger.warn(`Staging user id file exists, but content was invalid: ${id2}`);
      }
    } catch (e) {
      if (e.code !== "ENOENT") {
        this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
      }
    }
    const id = builder_util_runtime_1$4.UUID.v5((0, crypto_1$1.randomBytes)(4096), builder_util_runtime_1$4.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${id}`);
    try {
      await (0, fs_extra_1$4.outputFile)(file2, id);
    } catch (e) {
      this._logger.warn(`Couldn't write out staging user ID: ${e}`);
    }
    return id;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const headers = this.requestHeaders;
    if (headers == null) {
      return true;
    }
    for (const headerName of Object.keys(headers)) {
      const s = headerName.toLowerCase();
      if (s === "authorization" || s === "private-token") {
        return false;
      }
    }
    return true;
  }
  async getOrCreateDownloadHelper() {
    let result = this.downloadedUpdateHelper;
    if (result == null) {
      const dirName = (await this.configOnDisk.value).updaterCacheDirName;
      const logger = this._logger;
      if (dirName == null) {
        logger.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      }
      const cacheDir = path$4.join(this.app.baseCachePath, dirName || this.app.name);
      if (logger.debug != null) {
        logger.debug(`updater cache dir: ${cacheDir}`);
      }
      result = new DownloadedUpdateHelper_1.DownloadedUpdateHelper(cacheDir);
      this.downloadedUpdateHelper = result;
    }
    return result;
  }
  async executeDownload(taskOptions) {
    const fileInfo = taskOptions.fileInfo;
    const downloadOptions = {
      headers: taskOptions.downloadUpdateOptions.requestHeaders,
      cancellationToken: taskOptions.downloadUpdateOptions.cancellationToken,
      sha2: fileInfo.info.sha2,
      sha512: fileInfo.info.sha512
    };
    if (this.listenerCount(types_1$5.DOWNLOAD_PROGRESS) > 0) {
      downloadOptions.onProgress = (it) => this.emit(types_1$5.DOWNLOAD_PROGRESS, it);
    }
    const updateInfo = taskOptions.downloadUpdateOptions.updateInfoAndProvider.info;
    const version = updateInfo.version;
    const packageInfo = fileInfo.packageInfo;
    function getCacheUpdateFileName() {
      const urlPath = decodeURIComponent(taskOptions.fileInfo.url.pathname);
      if (urlPath.toLowerCase().endsWith(`.${taskOptions.fileExtension.toLowerCase()}`)) {
        return path$4.basename(urlPath);
      } else {
        return taskOptions.fileInfo.info.url;
      }
    }
    const downloadedUpdateHelper = await this.getOrCreateDownloadHelper();
    const cacheDir = downloadedUpdateHelper.cacheDirForPendingUpdate;
    await (0, fs_extra_1$4.mkdir)(cacheDir, { recursive: true });
    const updateFileName = getCacheUpdateFileName();
    let updateFile = path$4.join(cacheDir, updateFileName);
    const packageFile = packageInfo == null ? null : path$4.join(cacheDir, `package-${version}${path$4.extname(packageInfo.path) || ".7z"}`);
    const done = async (isSaveCache) => {
      await downloadedUpdateHelper.setDownloadedFile(updateFile, packageFile, updateInfo, fileInfo, updateFileName, isSaveCache);
      await taskOptions.done({
        ...updateInfo,
        downloadedFile: updateFile
      });
      const currentBlockMapFile = path$4.join(cacheDir, "current.blockmap");
      if (await (0, fs_extra_1$4.pathExists)(currentBlockMapFile)) {
        await (0, fs_extra_1$4.copyFile)(currentBlockMapFile, path$4.join(downloadedUpdateHelper.cacheDir, "current.blockmap"));
      }
      return packageFile == null ? [updateFile] : [updateFile, packageFile];
    };
    const log = this._logger;
    const cachedUpdateFile = await downloadedUpdateHelper.validateDownloadedPath(updateFile, updateInfo, fileInfo, log);
    if (cachedUpdateFile != null) {
      updateFile = cachedUpdateFile;
      return await done(false);
    }
    const removeFileIfAny = async () => {
      await downloadedUpdateHelper.clear().catch(() => {
      });
      return await (0, fs_extra_1$4.unlink)(updateFile).catch(() => {
      });
    };
    const tempUpdateFile = await (0, DownloadedUpdateHelper_1.createTempUpdateFile)(`temp-${updateFileName}`, cacheDir, log);
    try {
      await taskOptions.task(tempUpdateFile, downloadOptions, packageFile, removeFileIfAny);
      await (0, builder_util_runtime_1$4.retry)(() => (0, fs_extra_1$4.rename)(tempUpdateFile, updateFile), {
        retries: 60,
        interval: 500,
        shouldRetry: (error2) => {
          if (error2 instanceof Error && /^EBUSY:/.test(error2.message)) {
            return true;
          }
          log.warn(`Cannot rename temp file to final file: ${error2.message || error2.stack}`);
          return false;
        }
      });
    } catch (e) {
      await removeFileIfAny();
      if (e instanceof builder_util_runtime_1$4.CancellationError) {
        log.info("cancelled");
        this.emit("update-cancelled", updateInfo);
      }
      throw e;
    }
    log.info(`New version ${version} has been downloaded to ${updateFile}`);
    return await done(true);
  }
  async differentialDownloadInstaller(fileInfo, downloadUpdateOptions, installerPath, provider, oldInstallerFileName) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload) {
        return true;
      }
      const provider2 = downloadUpdateOptions.updateInfoAndProvider.provider;
      const blockmapFileUrls = await provider2.getBlockMapFiles(fileInfo.url, this.app.version, downloadUpdateOptions.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${blockmapFileUrls[0]}", new: ${blockmapFileUrls[1]})`);
      const downloadBlockMap = async (url) => {
        const data = await this.httpExecutor.downloadToBuffer(url, {
          headers: downloadUpdateOptions.requestHeaders,
          cancellationToken: downloadUpdateOptions.cancellationToken
        });
        if (data == null || data.length === 0) {
          throw new Error(`Blockmap "${url.href}" is empty`);
        }
        try {
          return JSON.parse((0, zlib_1$1.gunzipSync)(data).toString());
        } catch (e) {
          throw new Error(`Cannot parse blockmap "${url.href}", error: ${e}`);
        }
      };
      const downloadOptions = {
        newUrl: fileInfo.url,
        oldFile: path$4.join(this.downloadedUpdateHelper.cacheDir, oldInstallerFileName),
        logger: this._logger,
        newFile: installerPath,
        isUseMultipleRangeRequest: provider2.isUseMultipleRangeRequest,
        requestHeaders: downloadUpdateOptions.requestHeaders,
        cancellationToken: downloadUpdateOptions.cancellationToken
      };
      if (this.listenerCount(types_1$5.DOWNLOAD_PROGRESS) > 0) {
        downloadOptions.onProgress = (it) => this.emit(types_1$5.DOWNLOAD_PROGRESS, it);
      }
      const saveBlockMapToCacheDir = async (blockMapData, cacheDir) => {
        const blockMapFile = path$4.join(cacheDir, "current.blockmap");
        await (0, fs_extra_1$4.outputFile)(blockMapFile, (0, zlib_1$1.gzipSync)(JSON.stringify(blockMapData)));
      };
      const getBlockMapFromCacheDir = async (cacheDir) => {
        const blockMapFile = path$4.join(cacheDir, "current.blockmap");
        try {
          if (await (0, fs_extra_1$4.pathExists)(blockMapFile)) {
            return JSON.parse((0, zlib_1$1.gunzipSync)(await (0, fs_extra_1$4.readFile)(blockMapFile)).toString());
          }
        } catch (e) {
          this._logger.warn(`Cannot parse blockmap "${blockMapFile}", error: ${e}`);
        }
        return null;
      };
      const newBlockMapData = await downloadBlockMap(blockmapFileUrls[1]);
      await saveBlockMapToCacheDir(newBlockMapData, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let oldBlockMapData = await getBlockMapFromCacheDir(this.downloadedUpdateHelper.cacheDir);
      if (oldBlockMapData == null) {
        oldBlockMapData = await downloadBlockMap(blockmapFileUrls[0]);
      }
      await new GenericDifferentialDownloader_1.GenericDifferentialDownloader(fileInfo.info, this.httpExecutor, downloadOptions).download(oldBlockMapData, newBlockMapData);
      return false;
    } catch (e) {
      this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
      if (this._testOnlyOptions != null) {
        throw e;
      }
      return true;
    }
  }
}
AppUpdater$1.AppUpdater = AppUpdater;
function hasPrereleaseComponents(version) {
  const versionPrereleaseComponent = (0, semver_1.prerelease)(version);
  return versionPrereleaseComponent != null && versionPrereleaseComponent.length > 0;
}
class NoOpLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(message) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(message) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(message) {
  }
}
AppUpdater$1.NoOpLogger = NoOpLogger;
Object.defineProperty(BaseUpdater$1, "__esModule", { value: true });
BaseUpdater$1.BaseUpdater = void 0;
const child_process_1$3 = require$$1$5;
const AppUpdater_1$1 = AppUpdater$1;
class BaseUpdater extends AppUpdater_1$1.AppUpdater {
  constructor(options, app) {
    super(options, app);
    this.quitAndInstallCalled = false;
    this.quitHandlerAdded = false;
  }
  quitAndInstall(isSilent = false, isForceRunAfter = false) {
    this._logger.info(`Install on explicit quitAndInstall`);
    const isInstalled = this.install(isSilent, isSilent ? isForceRunAfter : this.autoRunAppAfterInstall);
    if (isInstalled) {
      setImmediate(() => {
        require$$1.autoUpdater.emit("before-quit-for-update");
        this.app.quit();
      });
    } else {
      this.quitAndInstallCalled = false;
    }
  }
  executeDownload(taskOptions) {
    return super.executeDownload({
      ...taskOptions,
      done: (event) => {
        this.dispatchUpdateDownloaded(event);
        this.addQuitHandler();
        return Promise.resolve();
      }
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(isSilent = false, isForceRunAfter = false) {
    if (this.quitAndInstallCalled) {
      this._logger.warn("install call ignored: quitAndInstallCalled is set to true");
      return false;
    }
    const downloadedUpdateHelper = this.downloadedUpdateHelper;
    const installerPath = this.installerPath;
    const downloadedFileInfo = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.downloadedFileInfo;
    if (installerPath == null || downloadedFileInfo == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    this.quitAndInstallCalled = true;
    try {
      this._logger.info(`Install: isSilent: ${isSilent}, isForceRunAfter: ${isForceRunAfter}`);
      return this.doInstall({
        isSilent,
        isForceRunAfter,
        isAdminRightsRequired: downloadedFileInfo.isAdminRightsRequired
      });
    } catch (e) {
      this.dispatchError(e);
      return false;
    }
  }
  addQuitHandler() {
    if (this.quitHandlerAdded || !this.autoInstallOnAppQuit) {
      return;
    }
    this.quitHandlerAdded = true;
    this.app.onQuit((exitCode) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (exitCode !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${exitCode}`);
        return;
      }
      this._logger.info("Auto install update on quit");
      this.install(true, false);
    });
  }
  spawnSyncLog(cmd, args = [], env = {}) {
    this._logger.info(`Executing: ${cmd} with args: ${args}`);
    const response = (0, child_process_1$3.spawnSync)(cmd, args, {
      env: { ...process.env, ...env },
      encoding: "utf-8",
      shell: true
    });
    const { error: error2, status, stdout, stderr } = response;
    if (error2 != null) {
      this._logger.error(stderr);
      throw error2;
    } else if (status != null && status !== 0) {
      this._logger.error(stderr);
      throw new Error(`Command ${cmd} exited with code ${status}`);
    }
    return stdout.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(cmd, args = [], env = void 0, stdio = "ignore") {
    this._logger.info(`Executing: ${cmd} with args: ${args}`);
    return new Promise((resolve, reject) => {
      try {
        const params = { stdio, env, detached: true };
        const p = (0, child_process_1$3.spawn)(cmd, args, params);
        p.on("error", (error2) => {
          reject(error2);
        });
        p.unref();
        if (p.pid !== void 0) {
          resolve(true);
        }
      } catch (error2) {
        reject(error2);
      }
    });
  }
}
BaseUpdater$1.BaseUpdater = BaseUpdater;
var AppImageUpdater$1 = {};
var FileWithEmbeddedBlockMapDifferentialDownloader$1 = {};
Object.defineProperty(FileWithEmbeddedBlockMapDifferentialDownloader$1, "__esModule", { value: true });
FileWithEmbeddedBlockMapDifferentialDownloader$1.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const fs_extra_1$3 = lib;
const DifferentialDownloader_1 = DifferentialDownloader$1;
const zlib_1 = require$$14;
class FileWithEmbeddedBlockMapDifferentialDownloader extends DifferentialDownloader_1.DifferentialDownloader {
  async download() {
    const packageInfo = this.blockAwareFileInfo;
    const fileSize = packageInfo.size;
    const offset = fileSize - (packageInfo.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(offset, fileSize - 1);
    const newBlockMap = readBlockMap(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await readEmbeddedBlockMapData(this.options.oldFile), newBlockMap);
  }
}
FileWithEmbeddedBlockMapDifferentialDownloader$1.FileWithEmbeddedBlockMapDifferentialDownloader = FileWithEmbeddedBlockMapDifferentialDownloader;
function readBlockMap(data) {
  return JSON.parse((0, zlib_1.inflateRawSync)(data).toString());
}
async function readEmbeddedBlockMapData(file2) {
  const fd = await (0, fs_extra_1$3.open)(file2, "r");
  try {
    const fileSize = (await (0, fs_extra_1$3.fstat)(fd)).size;
    const sizeBuffer = Buffer.allocUnsafe(4);
    await (0, fs_extra_1$3.read)(fd, sizeBuffer, 0, sizeBuffer.length, fileSize - sizeBuffer.length);
    const dataBuffer = Buffer.allocUnsafe(sizeBuffer.readUInt32BE(0));
    await (0, fs_extra_1$3.read)(fd, dataBuffer, 0, dataBuffer.length, fileSize - sizeBuffer.length - dataBuffer.length);
    await (0, fs_extra_1$3.close)(fd);
    return readBlockMap(dataBuffer);
  } catch (e) {
    await (0, fs_extra_1$3.close)(fd);
    throw e;
  }
}
Object.defineProperty(AppImageUpdater$1, "__esModule", { value: true });
AppImageUpdater$1.AppImageUpdater = void 0;
const builder_util_runtime_1$3 = out;
const child_process_1$2 = require$$1$5;
const fs_extra_1$2 = lib;
const fs_1$1 = require$$1$1;
const path$3 = require$$1$2;
const BaseUpdater_1$2 = BaseUpdater$1;
const FileWithEmbeddedBlockMapDifferentialDownloader_1$1 = FileWithEmbeddedBlockMapDifferentialDownloader$1;
const Provider_1$5 = Provider$1;
const types_1$4 = types;
class AppImageUpdater extends BaseUpdater_1$2.BaseUpdater {
  constructor(options, app) {
    super(options, app);
  }
  isUpdaterActive() {
    if (process.env["APPIMAGE"] == null && !this.forceDevUpdateConfig) {
      if (process.env["SNAP"] == null) {
        this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage");
      } else {
        this._logger.info("SNAP env is defined, updater is disabled");
      }
      return false;
    }
    return super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, Provider_1$5.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo,
      downloadUpdateOptions,
      task: async (updateFile, downloadOptions) => {
        const oldFile = process.env["APPIMAGE"];
        if (oldFile == null) {
          throw (0, builder_util_runtime_1$3.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        }
        if (downloadUpdateOptions.disableDifferentialDownload || await this.downloadDifferential(fileInfo, oldFile, updateFile, provider, downloadUpdateOptions)) {
          await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
        }
        await (0, fs_extra_1$2.chmod)(updateFile, 493);
      }
    });
  }
  async downloadDifferential(fileInfo, oldFile, updateFile, provider, downloadUpdateOptions) {
    try {
      const downloadOptions = {
        newUrl: fileInfo.url,
        oldFile,
        logger: this._logger,
        newFile: updateFile,
        isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
        requestHeaders: downloadUpdateOptions.requestHeaders,
        cancellationToken: downloadUpdateOptions.cancellationToken
      };
      if (this.listenerCount(types_1$4.DOWNLOAD_PROGRESS) > 0) {
        downloadOptions.onProgress = (it) => this.emit(types_1$4.DOWNLOAD_PROGRESS, it);
      }
      await new FileWithEmbeddedBlockMapDifferentialDownloader_1$1.FileWithEmbeddedBlockMapDifferentialDownloader(fileInfo.info, this.httpExecutor, downloadOptions).download();
      return false;
    } catch (e) {
      this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
      return process.platform === "linux";
    }
  }
  doInstall(options) {
    const appImageFile = process.env["APPIMAGE"];
    if (appImageFile == null) {
      throw (0, builder_util_runtime_1$3.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    }
    (0, fs_1$1.unlinkSync)(appImageFile);
    let destination;
    const existingBaseName = path$3.basename(appImageFile);
    const installerPath = this.installerPath;
    if (installerPath == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    if (path$3.basename(installerPath) === existingBaseName || !/\d+\.\d+\.\d+/.test(existingBaseName)) {
      destination = appImageFile;
    } else {
      destination = path$3.join(path$3.dirname(appImageFile), path$3.basename(installerPath));
    }
    (0, child_process_1$2.execFileSync)("mv", ["-f", installerPath, destination]);
    if (destination !== appImageFile) {
      this.emit("appimage-filename-updated", destination);
    }
    const env = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    if (options.isForceRunAfter) {
      this.spawnLog(destination, [], env);
    } else {
      env.APPIMAGE_EXIT_AFTER_INSTALL = "true";
      (0, child_process_1$2.execFileSync)(destination, [], { env });
    }
    return true;
  }
}
AppImageUpdater$1.AppImageUpdater = AppImageUpdater;
var DebUpdater$1 = {};
var LinuxUpdater$1 = {};
Object.defineProperty(LinuxUpdater$1, "__esModule", { value: true });
LinuxUpdater$1.LinuxUpdater = void 0;
const BaseUpdater_1$1 = BaseUpdater$1;
class LinuxUpdater extends BaseUpdater_1$1.BaseUpdater {
  constructor(options, app) {
    super(options, app);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var _a2;
    return ((_a2 = process.getuid) === null || _a2 === void 0 ? void 0 : _a2.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var _a2, _b2;
    return (_b2 = (_a2 = super.installerPath) === null || _a2 === void 0 ? void 0 : _a2.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && _b2 !== void 0 ? _b2 : null;
  }
  runCommandWithSudoIfNeeded(commandWithArgs) {
    if (this.isRunningAsRoot()) {
      this._logger.info("Running as root, no need to use sudo");
      return this.spawnSyncLog(commandWithArgs[0], commandWithArgs.slice(1));
    }
    const { name } = this.app;
    const installComment = `"${name} would like to update"`;
    const sudo = this.sudoWithArgs(installComment);
    this._logger.info(`Running as non-root user, using sudo to install: ${sudo}`);
    let wrapper = `"`;
    if (/pkexec/i.test(sudo[0]) || sudo[0] === "sudo") {
      wrapper = "";
    }
    return this.spawnSyncLog(sudo[0], [...sudo.length > 1 ? sudo.slice(1) : [], `${wrapper}/bin/bash`, "-c", `'${commandWithArgs.join(" ")}'${wrapper}`]);
  }
  sudoWithArgs(installComment) {
    const sudo = this.determineSudoCommand();
    const command = [sudo];
    if (/kdesudo/i.test(sudo)) {
      command.push("--comment", installComment);
      command.push("-c");
    } else if (/gksudo/i.test(sudo)) {
      command.push("--message", installComment);
    } else if (/pkexec/i.test(sudo)) {
      command.push("--disable-internal-agent");
    }
    return command;
  }
  hasCommand(cmd) {
    try {
      this.spawnSyncLog(`command`, ["-v", cmd]);
      return true;
    } catch {
      return false;
    }
  }
  determineSudoCommand() {
    const sudos = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const sudo of sudos) {
      if (this.hasCommand(sudo)) {
        return sudo;
      }
    }
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(pms) {
    var _a2;
    const pmOverride = (_a2 = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || _a2 === void 0 ? void 0 : _a2.trim();
    if (pmOverride) {
      return pmOverride;
    }
    for (const pm of pms) {
      if (this.hasCommand(pm)) {
        return pm;
      }
    }
    this._logger.warn(`No package manager found in the list: ${pms.join(", ")}. Defaulting to the first one: ${pms[0]}`);
    return pms[0];
  }
}
LinuxUpdater$1.LinuxUpdater = LinuxUpdater;
Object.defineProperty(DebUpdater$1, "__esModule", { value: true });
DebUpdater$1.DebUpdater = void 0;
const Provider_1$4 = Provider$1;
const types_1$3 = types;
const LinuxUpdater_1$2 = LinuxUpdater$1;
class DebUpdater extends LinuxUpdater_1$2.LinuxUpdater {
  constructor(options, app) {
    super(options, app);
  }
  /*** @private */
  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, Provider_1$4.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo,
      downloadUpdateOptions,
      task: async (updateFile, downloadOptions) => {
        if (this.listenerCount(types_1$3.DOWNLOAD_PROGRESS) > 0) {
          downloadOptions.onProgress = (it) => this.emit(types_1$3.DOWNLOAD_PROGRESS, it);
        }
        await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
      }
    });
  }
  doInstall(options) {
    const installerPath = this.installerPath;
    if (installerPath == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt")) {
      this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package."));
      return false;
    }
    const priorityList = ["dpkg", "apt"];
    const packageManager = this.detectPackageManager(priorityList);
    try {
      DebUpdater.installWithCommandRunner(packageManager, installerPath, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (error2) {
      this.dispatchError(error2);
      return false;
    }
    if (options.isForceRunAfter) {
      this.app.relaunch();
    }
    return true;
  }
  static installWithCommandRunner(packageManager, installerPath, commandRunner, logger) {
    var _a2;
    if (packageManager === "dpkg") {
      try {
        commandRunner(["dpkg", "-i", installerPath]);
      } catch (error2) {
        logger.warn((_a2 = error2.message) !== null && _a2 !== void 0 ? _a2 : error2);
        logger.warn("dpkg installation failed, trying to fix broken dependencies with apt-get");
        commandRunner(["apt-get", "install", "-f", "-y"]);
      }
    } else if (packageManager === "apt") {
      logger.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured.");
      commandRunner([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        installerPath
      ]);
    } else {
      throw new Error(`Package manager ${packageManager} not supported`);
    }
  }
}
DebUpdater$1.DebUpdater = DebUpdater;
var PacmanUpdater$1 = {};
Object.defineProperty(PacmanUpdater$1, "__esModule", { value: true });
PacmanUpdater$1.PacmanUpdater = void 0;
const types_1$2 = types;
const Provider_1$3 = Provider$1;
const LinuxUpdater_1$1 = LinuxUpdater$1;
class PacmanUpdater extends LinuxUpdater_1$1.LinuxUpdater {
  constructor(options, app) {
    super(options, app);
  }
  /*** @private */
  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, Provider_1$3.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo,
      downloadUpdateOptions,
      task: async (updateFile, downloadOptions) => {
        if (this.listenerCount(types_1$2.DOWNLOAD_PROGRESS) > 0) {
          downloadOptions.onProgress = (it) => this.emit(types_1$2.DOWNLOAD_PROGRESS, it);
        }
        await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
      }
    });
  }
  doInstall(options) {
    const installerPath = this.installerPath;
    if (installerPath == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    try {
      PacmanUpdater.installWithCommandRunner(installerPath, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (error2) {
      this.dispatchError(error2);
      return false;
    }
    if (options.isForceRunAfter) {
      this.app.relaunch();
    }
    return true;
  }
  static installWithCommandRunner(installerPath, commandRunner, logger) {
    var _a2;
    try {
      commandRunner(["pacman", "-U", "--noconfirm", installerPath]);
    } catch (error2) {
      logger.warn((_a2 = error2.message) !== null && _a2 !== void 0 ? _a2 : error2);
      logger.warn("pacman installation failed, attempting to update package database and retry");
      try {
        commandRunner(["pacman", "-Sy", "--noconfirm"]);
        commandRunner(["pacman", "-U", "--noconfirm", installerPath]);
      } catch (retryError) {
        logger.error("Retry after pacman -Sy failed");
        throw retryError;
      }
    }
  }
}
PacmanUpdater$1.PacmanUpdater = PacmanUpdater;
var RpmUpdater$1 = {};
Object.defineProperty(RpmUpdater$1, "__esModule", { value: true });
RpmUpdater$1.RpmUpdater = void 0;
const types_1$1 = types;
const Provider_1$2 = Provider$1;
const LinuxUpdater_1 = LinuxUpdater$1;
class RpmUpdater extends LinuxUpdater_1.LinuxUpdater {
  constructor(options, app) {
    super(options, app);
  }
  /*** @private */
  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, Provider_1$2.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo,
      downloadUpdateOptions,
      task: async (updateFile, downloadOptions) => {
        if (this.listenerCount(types_1$1.DOWNLOAD_PROGRESS) > 0) {
          downloadOptions.onProgress = (it) => this.emit(types_1$1.DOWNLOAD_PROGRESS, it);
        }
        await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
      }
    });
  }
  doInstall(options) {
    const installerPath = this.installerPath;
    if (installerPath == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    const priorityList = ["zypper", "dnf", "yum", "rpm"];
    const packageManager = this.detectPackageManager(priorityList);
    try {
      RpmUpdater.installWithCommandRunner(packageManager, installerPath, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (error2) {
      this.dispatchError(error2);
      return false;
    }
    if (options.isForceRunAfter) {
      this.app.relaunch();
    }
    return true;
  }
  static installWithCommandRunner(packageManager, installerPath, commandRunner, logger) {
    if (packageManager === "zypper") {
      return commandRunner(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", installerPath]);
    }
    if (packageManager === "dnf") {
      return commandRunner(["dnf", "install", "--nogpgcheck", "-y", installerPath]);
    }
    if (packageManager === "yum") {
      return commandRunner(["yum", "install", "--nogpgcheck", "-y", installerPath]);
    }
    if (packageManager === "rpm") {
      logger.warn("Installing with rpm only (no dependency resolution).");
      return commandRunner(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", installerPath]);
    }
    throw new Error(`Package manager ${packageManager} not supported`);
  }
}
RpmUpdater$1.RpmUpdater = RpmUpdater;
var MacUpdater$1 = {};
Object.defineProperty(MacUpdater$1, "__esModule", { value: true });
MacUpdater$1.MacUpdater = void 0;
const builder_util_runtime_1$2 = out;
const fs_extra_1$1 = lib;
const fs_1 = require$$1$1;
const path$2 = require$$1$2;
const http_1 = require$$4$1;
const AppUpdater_1 = AppUpdater$1;
const Provider_1$1 = Provider$1;
const child_process_1$1 = require$$1$5;
const crypto_1 = require$$0$3;
class MacUpdater extends AppUpdater_1.AppUpdater {
  constructor(options, app) {
    super(options, app);
    this.nativeUpdater = require$$1.autoUpdater;
    this.squirrelDownloadedUpdate = false;
    this.nativeUpdater.on("error", (it) => {
      this._logger.warn(it);
      this.emit("error", it);
    });
    this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = true;
      this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(message) {
    if (this._logger.debug != null) {
      this._logger.debug(message);
    }
  }
  closeServerIfExists() {
    if (this.server) {
      this.debug("Closing proxy server");
      this.server.close((err) => {
        if (err) {
          this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
        }
      });
    }
  }
  async doDownloadUpdate(downloadUpdateOptions) {
    let files = downloadUpdateOptions.updateInfoAndProvider.provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info);
    const log = this._logger;
    const sysctlRosettaInfoKey = "sysctl.proc_translated";
    let isRosetta = false;
    try {
      this.debug("Checking for macOS Rosetta environment");
      const result = (0, child_process_1$1.execFileSync)("sysctl", [sysctlRosettaInfoKey], { encoding: "utf8" });
      isRosetta = result.includes(`${sysctlRosettaInfoKey}: 1`);
      log.info(`Checked for macOS Rosetta environment (isRosetta=${isRosetta})`);
    } catch (e) {
      log.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${e}`);
    }
    let isArm64Mac = false;
    try {
      this.debug("Checking for arm64 in uname");
      const result = (0, child_process_1$1.execFileSync)("uname", ["-a"], { encoding: "utf8" });
      const isArm = result.includes("ARM");
      log.info(`Checked 'uname -a': arm64=${isArm}`);
      isArm64Mac = isArm64Mac || isArm;
    } catch (e) {
      log.warn(`uname shell command to check for arm64 failed: ${e}`);
    }
    isArm64Mac = isArm64Mac || process.arch === "arm64" || isRosetta;
    const isArm64 = (file2) => {
      var _a2;
      return file2.url.pathname.includes("arm64") || ((_a2 = file2.info.url) === null || _a2 === void 0 ? void 0 : _a2.includes("arm64"));
    };
    if (isArm64Mac && files.some(isArm64)) {
      files = files.filter((file2) => isArm64Mac === isArm64(file2));
    } else {
      files = files.filter((file2) => !isArm64(file2));
    }
    const zipFileInfo = (0, Provider_1$1.findFile)(files, "zip", ["pkg", "dmg"]);
    if (zipFileInfo == null) {
      throw (0, builder_util_runtime_1$2.newError)(`ZIP file not provided: ${(0, builder_util_runtime_1$2.safeStringifyJson)(files)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    }
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const CURRENT_MAC_APP_ZIP_FILE_NAME = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: zipFileInfo,
      downloadUpdateOptions,
      task: async (destinationFile, downloadOptions) => {
        const cachedUpdateFilePath = path$2.join(this.downloadedUpdateHelper.cacheDir, CURRENT_MAC_APP_ZIP_FILE_NAME);
        const canDifferentialDownload = () => {
          if (!(0, fs_extra_1$1.pathExistsSync)(cachedUpdateFilePath)) {
            log.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download");
            return false;
          }
          return !downloadUpdateOptions.disableDifferentialDownload;
        };
        let differentialDownloadFailed = true;
        if (canDifferentialDownload()) {
          differentialDownloadFailed = await this.differentialDownloadInstaller(zipFileInfo, downloadUpdateOptions, destinationFile, provider, CURRENT_MAC_APP_ZIP_FILE_NAME);
        }
        if (differentialDownloadFailed) {
          await this.httpExecutor.download(zipFileInfo.url, destinationFile, downloadOptions);
        }
      },
      done: async (event) => {
        if (!downloadUpdateOptions.disableDifferentialDownload) {
          try {
            const cachedUpdateFilePath = path$2.join(this.downloadedUpdateHelper.cacheDir, CURRENT_MAC_APP_ZIP_FILE_NAME);
            await (0, fs_extra_1$1.copyFile)(event.downloadedFile, cachedUpdateFilePath);
          } catch (error2) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${error2.message}`);
          }
        }
        return this.updateDownloaded(zipFileInfo, event);
      }
    });
  }
  async updateDownloaded(zipFileInfo, event) {
    var _a2;
    const downloadedFile = event.downloadedFile;
    const updateFileSize = (_a2 = zipFileInfo.info.size) !== null && _a2 !== void 0 ? _a2 : (await (0, fs_extra_1$1.stat)(downloadedFile)).size;
    const log = this._logger;
    const logContext = `fileToProxy=${zipFileInfo.url.href}`;
    this.closeServerIfExists();
    this.debug(`Creating proxy server for native Squirrel.Mac (${logContext})`);
    this.server = (0, http_1.createServer)();
    this.debug(`Proxy server for native Squirrel.Mac is created (${logContext})`);
    this.server.on("close", () => {
      log.info(`Proxy server for native Squirrel.Mac is closed (${logContext})`);
    });
    const getServerUrl = (s) => {
      const address = s.address();
      if (typeof address === "string") {
        return address;
      }
      return `http://127.0.0.1:${address === null || address === void 0 ? void 0 : address.port}`;
    };
    return await new Promise((resolve, reject) => {
      const pass = (0, crypto_1.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-");
      const authInfo = Buffer.from(`autoupdater:${pass}`, "ascii");
      const fileUrl = `/${(0, crypto_1.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (request, response) => {
        const requestUrl = request.url;
        log.info(`${requestUrl} requested`);
        if (requestUrl === "/") {
          if (!request.headers.authorization || request.headers.authorization.indexOf("Basic ") === -1) {
            response.statusCode = 401;
            response.statusMessage = "Invalid Authentication Credentials";
            response.end();
            log.warn("No authenthication info");
            return;
          }
          const base64Credentials = request.headers.authorization.split(" ")[1];
          const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
          const [username, password] = credentials.split(":");
          if (username !== "autoupdater" || password !== pass) {
            response.statusCode = 401;
            response.statusMessage = "Invalid Authentication Credentials";
            response.end();
            log.warn("Invalid authenthication credentials");
            return;
          }
          const data = Buffer.from(`{ "url": "${getServerUrl(this.server)}${fileUrl}" }`);
          response.writeHead(200, { "Content-Type": "application/json", "Content-Length": data.length });
          response.end(data);
          return;
        }
        if (!requestUrl.startsWith(fileUrl)) {
          log.warn(`${requestUrl} requested, but not supported`);
          response.writeHead(404);
          response.end();
          return;
        }
        log.info(`${fileUrl} requested by Squirrel.Mac, pipe ${downloadedFile}`);
        let errorOccurred = false;
        response.on("finish", () => {
          if (!errorOccurred) {
            this.nativeUpdater.removeListener("error", reject);
            resolve([]);
          }
        });
        const readStream = (0, fs_1.createReadStream)(downloadedFile);
        readStream.on("error", (error2) => {
          try {
            response.end();
          } catch (e) {
            log.warn(`cannot end response: ${e}`);
          }
          errorOccurred = true;
          this.nativeUpdater.removeListener("error", reject);
          reject(new Error(`Cannot pipe "${downloadedFile}": ${error2}`));
        });
        response.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": updateFileSize
        });
        readStream.pipe(response);
      });
      this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${logContext})`);
      this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${getServerUrl(this.server)}, ${logContext})`);
        this.nativeUpdater.setFeedURL({
          url: getServerUrl(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${authInfo.toString("base64")}`
          }
        });
        this.dispatchUpdateDownloaded(event);
        if (this.autoInstallOnAppQuit) {
          this.nativeUpdater.once("error", reject);
          this.nativeUpdater.checkForUpdates();
        } else {
          resolve([]);
        }
      });
    });
  }
  handleUpdateDownloaded() {
    if (this.autoRunAppAfterInstall) {
      this.nativeUpdater.quitAndInstall();
    } else {
      this.app.quit();
    }
    this.closeServerIfExists();
  }
  quitAndInstall() {
    if (this.squirrelDownloadedUpdate) {
      this.handleUpdateDownloaded();
    } else {
      this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded());
      if (!this.autoInstallOnAppQuit) {
        this.nativeUpdater.checkForUpdates();
      }
    }
  }
}
MacUpdater$1.MacUpdater = MacUpdater;
var NsisUpdater$1 = {};
var windowsExecutableCodeSignatureVerifier = {};
Object.defineProperty(windowsExecutableCodeSignatureVerifier, "__esModule", { value: true });
windowsExecutableCodeSignatureVerifier.verifySignature = verifySignature;
const builder_util_runtime_1$1 = out;
const child_process_1 = require$$1$5;
const os = require$$2;
const path$1 = require$$1$2;
function preparePowerShellExec(command, timeout) {
  const executable = `set "PSModulePath=" & chcp 65001 >NUL & powershell.exe`;
  const args = ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", command];
  const options = {
    shell: true,
    timeout
  };
  return [executable, args, options];
}
function verifySignature(publisherNames, unescapedTempUpdateFile, logger) {
  return new Promise((resolve, reject) => {
    const tempUpdateFile = unescapedTempUpdateFile.replace(/'/g, "''");
    logger.info(`Verifying signature ${tempUpdateFile}`);
    (0, child_process_1.execFile)(...preparePowerShellExec(`"Get-AuthenticodeSignature -LiteralPath '${tempUpdateFile}' | ConvertTo-Json -Compress"`, 20 * 1e3), (error2, stdout, stderr) => {
      var _a2;
      try {
        if (error2 != null || stderr) {
          handleError(logger, error2, stderr, reject);
          resolve(null);
          return;
        }
        const data = parseOut(stdout);
        if (data.Status === 0) {
          try {
            const normlaizedUpdateFilePath = path$1.normalize(data.Path);
            const normalizedTempUpdateFile = path$1.normalize(unescapedTempUpdateFile);
            logger.info(`LiteralPath: ${normlaizedUpdateFilePath}. Update Path: ${normalizedTempUpdateFile}`);
            if (normlaizedUpdateFilePath !== normalizedTempUpdateFile) {
              handleError(logger, new Error(`LiteralPath of ${normlaizedUpdateFilePath} is different than ${normalizedTempUpdateFile}`), stderr, reject);
              resolve(null);
              return;
            }
          } catch (error3) {
            logger.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(_a2 = error3.message) !== null && _a2 !== void 0 ? _a2 : error3.stack}`);
          }
          const subject = (0, builder_util_runtime_1$1.parseDn)(data.SignerCertificate.Subject);
          let match = false;
          for (const name of publisherNames) {
            const dn = (0, builder_util_runtime_1$1.parseDn)(name);
            if (dn.size) {
              const allKeys = Array.from(dn.keys());
              match = allKeys.every((key) => {
                return dn.get(key) === subject.get(key);
              });
            } else if (name === subject.get("CN")) {
              logger.warn(`Signature validated using only CN ${name}. Please add your full Distinguished Name (DN) to publisherNames configuration`);
              match = true;
            }
            if (match) {
              resolve(null);
              return;
            }
          }
        }
        const result = `publisherNames: ${publisherNames.join(" | ")}, raw info: ` + JSON.stringify(data, (name, value) => name === "RawData" ? void 0 : value, 2);
        logger.warn(`Sign verification failed, installer signed with incorrect certificate: ${result}`);
        resolve(result);
      } catch (e) {
        handleError(logger, e, null, reject);
        resolve(null);
        return;
      }
    });
  });
}
function parseOut(out2) {
  const data = JSON.parse(out2);
  delete data.PrivateKey;
  delete data.IsOSBinary;
  delete data.SignatureType;
  const signerCertificate = data.SignerCertificate;
  if (signerCertificate != null) {
    delete signerCertificate.Archived;
    delete signerCertificate.Extensions;
    delete signerCertificate.Handle;
    delete signerCertificate.HasPrivateKey;
    delete signerCertificate.SubjectName;
  }
  return data;
}
function handleError(logger, error2, stderr, reject) {
  if (isOldWin6()) {
    logger.warn(`Cannot execute Get-AuthenticodeSignature: ${error2 || stderr}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, child_process_1.execFileSync)(...preparePowerShellExec("ConvertTo-Json test", 10 * 1e3));
  } catch (testError) {
    logger.warn(`Cannot execute ConvertTo-Json: ${testError.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  if (error2 != null) {
    reject(error2);
  }
  if (stderr) {
    reject(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${stderr}. Failing signature validation due to unknown stderr.`));
  }
}
function isOldWin6() {
  const winVersion = os.release();
  return winVersion.startsWith("6.") && !winVersion.startsWith("6.3");
}
Object.defineProperty(NsisUpdater$1, "__esModule", { value: true });
NsisUpdater$1.NsisUpdater = void 0;
const builder_util_runtime_1 = out;
const path = require$$1$2;
const BaseUpdater_1 = BaseUpdater$1;
const FileWithEmbeddedBlockMapDifferentialDownloader_1 = FileWithEmbeddedBlockMapDifferentialDownloader$1;
const types_1 = types;
const Provider_1 = Provider$1;
const fs_extra_1 = lib;
const windowsExecutableCodeSignatureVerifier_1 = windowsExecutableCodeSignatureVerifier;
const url_1 = require$$2$1;
class NsisUpdater extends BaseUpdater_1.BaseUpdater {
  constructor(options, app) {
    super(options, app);
    this._verifyUpdateCodeSignature = (publisherNames, unescapedTempUpdateFile) => (0, windowsExecutableCodeSignatureVerifier_1.verifySignature)(publisherNames, unescapedTempUpdateFile, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(value) {
    if (value) {
      this._verifyUpdateCodeSignature = value;
    }
  }
  /*** @private */
  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, Provider_1.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions,
      fileInfo,
      task: async (destinationFile, downloadOptions, packageFile, removeTempDirIfAny) => {
        const packageInfo = fileInfo.packageInfo;
        const isWebInstaller = packageInfo != null && packageFile != null;
        if (isWebInstaller && downloadUpdateOptions.disableWebInstaller) {
          throw (0, builder_util_runtime_1.newError)(`Unable to download new version ${downloadUpdateOptions.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        }
        if (!isWebInstaller && !downloadUpdateOptions.disableWebInstaller) {
          this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version.");
        }
        if (isWebInstaller || downloadUpdateOptions.disableDifferentialDownload || await this.differentialDownloadInstaller(fileInfo, downloadUpdateOptions, destinationFile, provider, builder_util_runtime_1.CURRENT_APP_INSTALLER_FILE_NAME)) {
          await this.httpExecutor.download(fileInfo.url, destinationFile, downloadOptions);
        }
        const signatureVerificationStatus = await this.verifySignature(destinationFile);
        if (signatureVerificationStatus != null) {
          await removeTempDirIfAny();
          throw (0, builder_util_runtime_1.newError)(`New version ${downloadUpdateOptions.updateInfoAndProvider.info.version} is not signed by the application owner: ${signatureVerificationStatus}`, "ERR_UPDATER_INVALID_SIGNATURE");
        }
        if (isWebInstaller) {
          if (await this.differentialDownloadWebPackage(downloadUpdateOptions, packageInfo, packageFile, provider)) {
            try {
              await this.httpExecutor.download(new url_1.URL(packageInfo.path), packageFile, {
                headers: downloadUpdateOptions.requestHeaders,
                cancellationToken: downloadUpdateOptions.cancellationToken,
                sha512: packageInfo.sha512
              });
            } catch (e) {
              try {
                await (0, fs_extra_1.unlink)(packageFile);
              } catch (_ignored) {
              }
              throw e;
            }
          }
        }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(tempUpdateFile) {
    let publisherName;
    try {
      publisherName = (await this.configOnDisk.value).publisherName;
      if (publisherName == null) {
        return null;
      }
    } catch (e) {
      if (e.code === "ENOENT") {
        return null;
      }
      throw e;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(publisherName) ? publisherName : [publisherName], tempUpdateFile);
  }
  doInstall(options) {
    const installerPath = this.installerPath;
    if (installerPath == null) {
      this.dispatchError(new Error("No update filepath provided, can't quit and install"));
      return false;
    }
    const args = ["--updated"];
    if (options.isSilent) {
      args.push("/S");
    }
    if (options.isForceRunAfter) {
      args.push("--force-run");
    }
    if (this.installDirectory) {
      args.push(`/D=${this.installDirectory}`);
    }
    const packagePath = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    if (packagePath != null) {
      args.push(`--package-file=${packagePath}`);
    }
    const callUsingElevation = () => {
      this.spawnLog(path.join(process.resourcesPath, "elevate.exe"), [installerPath].concat(args)).catch((e) => this.dispatchError(e));
    };
    if (options.isAdminRightsRequired) {
      this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe");
      callUsingElevation();
      return true;
    }
    this.spawnLog(installerPath, args).catch((e) => {
      const errorCode = e.code;
      this._logger.info(`Cannot run installer: error code: ${errorCode}, error message: "${e.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`);
      if (errorCode === "UNKNOWN" || errorCode === "EACCES") {
        callUsingElevation();
      } else if (errorCode === "ENOENT") {
        require$$1.shell.openPath(installerPath).catch((err) => this.dispatchError(err));
      } else {
        this.dispatchError(e);
      }
    });
    return true;
  }
  async differentialDownloadWebPackage(downloadUpdateOptions, packageInfo, packagePath, provider) {
    if (packageInfo.blockMapSize == null) {
      return true;
    }
    try {
      const downloadOptions = {
        newUrl: new url_1.URL(packageInfo.path),
        oldFile: path.join(this.downloadedUpdateHelper.cacheDir, builder_util_runtime_1.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: packagePath,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
        cancellationToken: downloadUpdateOptions.cancellationToken
      };
      if (this.listenerCount(types_1.DOWNLOAD_PROGRESS) > 0) {
        downloadOptions.onProgress = (it) => this.emit(types_1.DOWNLOAD_PROGRESS, it);
      }
      await new FileWithEmbeddedBlockMapDifferentialDownloader_1.FileWithEmbeddedBlockMapDifferentialDownloader(packageInfo, this.httpExecutor, downloadOptions).download();
    } catch (e) {
      this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
      return process.platform === "win32";
    }
    return false;
  }
}
NsisUpdater$1.NsisUpdater = NsisUpdater;
(function(exports2) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports3) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
  };
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.NsisUpdater = exports2.MacUpdater = exports2.RpmUpdater = exports2.PacmanUpdater = exports2.DebUpdater = exports2.AppImageUpdater = exports2.Provider = exports2.NoOpLogger = exports2.AppUpdater = exports2.BaseUpdater = void 0;
  const fs_extra_12 = lib;
  const path2 = require$$1$2;
  var BaseUpdater_12 = BaseUpdater$1;
  Object.defineProperty(exports2, "BaseUpdater", { enumerable: true, get: function() {
    return BaseUpdater_12.BaseUpdater;
  } });
  var AppUpdater_12 = AppUpdater$1;
  Object.defineProperty(exports2, "AppUpdater", { enumerable: true, get: function() {
    return AppUpdater_12.AppUpdater;
  } });
  Object.defineProperty(exports2, "NoOpLogger", { enumerable: true, get: function() {
    return AppUpdater_12.NoOpLogger;
  } });
  var Provider_12 = Provider$1;
  Object.defineProperty(exports2, "Provider", { enumerable: true, get: function() {
    return Provider_12.Provider;
  } });
  var AppImageUpdater_1 = AppImageUpdater$1;
  Object.defineProperty(exports2, "AppImageUpdater", { enumerable: true, get: function() {
    return AppImageUpdater_1.AppImageUpdater;
  } });
  var DebUpdater_1 = DebUpdater$1;
  Object.defineProperty(exports2, "DebUpdater", { enumerable: true, get: function() {
    return DebUpdater_1.DebUpdater;
  } });
  var PacmanUpdater_1 = PacmanUpdater$1;
  Object.defineProperty(exports2, "PacmanUpdater", { enumerable: true, get: function() {
    return PacmanUpdater_1.PacmanUpdater;
  } });
  var RpmUpdater_1 = RpmUpdater$1;
  Object.defineProperty(exports2, "RpmUpdater", { enumerable: true, get: function() {
    return RpmUpdater_1.RpmUpdater;
  } });
  var MacUpdater_1 = MacUpdater$1;
  Object.defineProperty(exports2, "MacUpdater", { enumerable: true, get: function() {
    return MacUpdater_1.MacUpdater;
  } });
  var NsisUpdater_1 = NsisUpdater$1;
  Object.defineProperty(exports2, "NsisUpdater", { enumerable: true, get: function() {
    return NsisUpdater_1.NsisUpdater;
  } });
  __exportStar(types, exports2);
  let _autoUpdater;
  function doLoadAutoUpdater() {
    if (process.platform === "win32") {
      _autoUpdater = new NsisUpdater$1.NsisUpdater();
    } else if (process.platform === "darwin") {
      _autoUpdater = new MacUpdater$1.MacUpdater();
    } else {
      _autoUpdater = new AppImageUpdater$1.AppImageUpdater();
      try {
        const identity = path2.join(process.resourcesPath, "package-type");
        if (!(0, fs_extra_12.existsSync)(identity)) {
          return _autoUpdater;
        }
        const fileType = (0, fs_extra_12.readFileSync)(identity).toString().trim();
        switch (fileType) {
          case "deb":
            _autoUpdater = new DebUpdater$1.DebUpdater();
            break;
          case "rpm":
            _autoUpdater = new RpmUpdater$1.RpmUpdater();
            break;
          case "pacman":
            _autoUpdater = new PacmanUpdater$1.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (error2) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", error2.message);
      }
    }
    return _autoUpdater;
  }
  Object.defineProperty(exports2, "autoUpdater", {
    enumerable: true,
    get: () => {
      return _autoUpdater || doLoadAutoUpdater();
    }
  });
})(main$1);
const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1e3;
const UPDATE_REMINDER_DELAY_MS = 3 * 60 * 60 * 1e3;
const DISMISSED_READY_REMINDER_DELAY_MS = 5 * 60 * 1e3;
const AUTO_UPDATES_DISABLED = process.env.RECORDLY_DISABLE_AUTO_UPDATES === "1";
const AUTO_UPDATE_ERROR_TOASTS_DISABLED = process.env.RECORDLY_DISABLE_AUTO_UPDATE_ERROR_TOASTS === "1";
const UPDATE_FEED_URL_OVERRIDE = ((_a = process.env.RECORDLY_UPDATE_FEED_URL) == null ? void 0 : _a.trim()) ?? "";
const UPDATER_LOG_PATH = ((_b = process.env.RECORDLY_UPDATER_LOG_PATH) == null ? void 0 : _b.trim()) || path$m.join(USER_DATA_PATH, "updater.log");
const DEV_UPDATE_PREVIEW_VERSION = "9.9.9";
const DEV_UPDATE_PREVIEW_PROGRESS_STEP_MS = 300;
const DEV_UPDATE_PREVIEW_PROGRESS_INCREMENT = 20;
const ONE_MEGABYTE = 1024 * 1024;
let updaterInitialized = false;
let updateCheckInProgress = false;
let manualCheckRequested = false;
let periodicCheckTimer = null;
let deferredReminderTimer = null;
let devPreviewProgressTimer = null;
let currentToastPayload = null;
let availableVersion = null;
let pendingDownloadedVersion = null;
let downloadInProgress = false;
let downloadToastDismissed = false;
let skippedVersion = null;
let updateCheckErrorHandled = false;
let installAfterDownloadRequested = false;
let activeUpdateToastSender;
let updateStatusSummary = {
  status: "idle",
  currentVersion: require$$1.app.getVersion(),
  availableVersion: null
};
function setUpdateStatusSummary(summary) {
  updateStatusSummary = {
    ...updateStatusSummary,
    currentVersion: require$$1.app.getVersion(),
    ...summary
  };
}
function summarizeError(error2) {
  if (error2 instanceof Error) {
    return error2.stack || `${error2.name}: ${error2.message}`;
  }
  return String(error2);
}
function writeUpdaterLog(message, detail) {
  try {
    fs$j.mkdirSync(path$m.dirname(UPDATER_LOG_PATH), { recursive: true });
    const suffix = detail === void 0 ? "" : ` ${summarizeError(detail)}`;
    fs$j.appendFileSync(
      UPDATER_LOG_PATH,
      `${(/* @__PURE__ */ new Date()).toISOString()} ${message}${suffix}
`,
      "utf8"
    );
  } catch (logError) {
    console.error("Failed to write updater log:", logError);
  }
}
function createAutoCheckErrorToastPayload() {
  return {
    version: require$$1.app.getVersion(),
    phase: "error",
    detail: "Recordly could not check for updates automatically. Retry now, or inspect updater.log in your user data folder.",
    delayMs: UPDATE_REMINDER_DELAY_MS,
    primaryAction: "retry-check"
  };
}
function shouldSurfaceAutomaticCheckErrors() {
  return !AUTO_UPDATE_ERROR_TOASTS_DISABLED;
}
function configureUpdateFeed() {
  if (!UPDATE_FEED_URL_OVERRIDE) {
    writeUpdaterLog("Using published GitHub update feed.");
    return;
  }
  main$1.autoUpdater.setFeedURL({
    provider: "generic",
    url: UPDATE_FEED_URL_OVERRIDE,
    channel: "latest"
  });
  writeUpdaterLog(`Using overridden update feed: ${UPDATE_FEED_URL_OVERRIDE}`);
}
function canUseAutoUpdates() {
  return !AUTO_UPDATES_DISABLED && require$$1.app.isPackaged && !process.mas;
}
function getDialogWindow(getMainWindow) {
  const window2 = getMainWindow();
  return window2 && !window2.isDestroyed() ? window2 : void 0;
}
function showMessageBox(getMainWindow, options) {
  const window2 = getDialogWindow(getMainWindow);
  return window2 ? require$$1.dialog.showMessageBox(window2, options) : require$$1.dialog.showMessageBox(options);
}
function clearDeferredReminderTimer() {
  if (deferredReminderTimer) {
    clearTimeout(deferredReminderTimer);
    deferredReminderTimer = null;
  }
}
function clearDevPreviewProgressTimer() {
  if (devPreviewProgressTimer) {
    clearInterval(devPreviewProgressTimer);
    devPreviewProgressTimer = null;
  }
}
function emitUpdateToastState(sendToRenderer, payload) {
  currentToastPayload = payload;
  if (!sendToRenderer) {
    return false;
  }
  return sendToRenderer("update-toast-state", payload);
}
function createAvailableUpdateToastPayload(version) {
  return {
    version,
    phase: "available",
    detail: "Install the latest version now, or remind yourself to come back to it later.",
    delayMs: UPDATE_REMINDER_DELAY_MS,
    primaryAction: "install-and-restart"
  };
}
function createDownloadingUpdateToastPayload(version, progress = {}) {
  const normalizedProgress = Math.max(
    0,
    Math.min(100, Math.round(progress.progressPercent ?? 0))
  );
  const transferredBytes = typeof progress.transferredBytes === "number" && Number.isFinite(progress.transferredBytes) ? Math.max(0, progress.transferredBytes) : void 0;
  const totalBytes = typeof progress.totalBytes === "number" && Number.isFinite(progress.totalBytes) ? Math.max(0, progress.totalBytes) : void 0;
  const remainingBytes = totalBytes !== void 0 && transferredBytes !== void 0 ? Math.max(totalBytes - transferredBytes, 0) : void 0;
  const bytesPerSecond = typeof progress.bytesPerSecond === "number" && Number.isFinite(progress.bytesPerSecond) ? Math.max(0, progress.bytesPerSecond) : void 0;
  const remainingMb = remainingBytes !== void 0 ? Math.max(0, remainingBytes / ONE_MEGABYTE) : null;
  return {
    version,
    phase: "downloading",
    detail: normalizedProgress >= 100 ? "Finishing the update download. Recordly will restart as soon as the installer is ready." : remainingMb !== null ? `${remainingMb.toFixed(1)} MB left before Recordly restarts.` : "Downloading the update now. Recordly will restart when it finishes.",
    delayMs: UPDATE_REMINDER_DELAY_MS,
    progressPercent: normalizedProgress,
    transferredBytes,
    totalBytes,
    remainingBytes,
    bytesPerSecond,
    primaryAction: "install-and-restart"
  };
}
function createDownloadedUpdateToastPayload(version) {
  return {
    version,
    phase: "ready",
    detail: "The update is ready. Install and restart now, or remind yourself later.",
    delayMs: UPDATE_REMINDER_DELAY_MS,
    primaryAction: "install-and-restart"
  };
}
function createUpdateErrorToastPayload(version, error2) {
  return {
    version,
    phase: "error",
    detail: `The update could not be downloaded. ${String(error2)}`,
    delayMs: UPDATE_REMINDER_DELAY_MS,
    primaryAction: "install-and-restart"
  };
}
function getReminderPayload() {
  if (pendingDownloadedVersion) {
    return createDownloadedUpdateToastPayload(pendingDownloadedVersion);
  }
  if (availableVersion && !downloadInProgress) {
    return createAvailableUpdateToastPayload(availableVersion);
  }
  return null;
}
function clearVisibleUpdateToast(sendToRenderer) {
  emitUpdateToastState(sendToRenderer, null);
}
function getCurrentUpdateToastPayload() {
  return currentToastPayload;
}
function getUpdaterLogPath() {
  return UPDATER_LOG_PATH;
}
function getUpdateStatusSummary() {
  return updateStatusSummary;
}
async function showUpdateErrorDialog(getMainWindow, error2) {
  await showMessageBox(getMainWindow, {
    type: "error",
    title: "Update Check Failed",
    message: "Recordly could not check for updates.",
    detail: String(error2)
  });
}
function resetDevPreviewState(sendToRenderer) {
  clearDevPreviewProgressTimer();
  availableVersion = null;
  pendingDownloadedVersion = null;
  downloadInProgress = false;
  downloadToastDismissed = false;
  skippedVersion = null;
  installAfterDownloadRequested = false;
  clearVisibleUpdateToast(sendToRenderer);
}
function simulateDevPreviewDownload(sendToRenderer) {
  availableVersion = DEV_UPDATE_PREVIEW_VERSION;
  pendingDownloadedVersion = null;
  downloadInProgress = true;
  downloadToastDismissed = false;
  clearDeferredReminderTimer();
  clearDevPreviewProgressTimer();
  let progressPercent = 0;
  emitUpdateToastState(sendToRenderer, {
    ...createDownloadingUpdateToastPayload(DEV_UPDATE_PREVIEW_VERSION, {
      progressPercent,
      transferredBytes: 0,
      totalBytes: 20 * ONE_MEGABYTE,
      bytesPerSecond: 5 * ONE_MEGABYTE
    }),
    isPreview: true
  });
  devPreviewProgressTimer = setInterval(() => {
    progressPercent = Math.min(100, progressPercent + DEV_UPDATE_PREVIEW_PROGRESS_INCREMENT);
    if (progressPercent >= 100) {
      clearDevPreviewProgressTimer();
      downloadInProgress = false;
      pendingDownloadedVersion = DEV_UPDATE_PREVIEW_VERSION;
      emitUpdateToastState(sendToRenderer, {
        ...createDownloadedUpdateToastPayload(DEV_UPDATE_PREVIEW_VERSION),
        isPreview: true,
        detail: "Development preview: the update is ready to install. No real update will be installed."
      });
      return;
    }
    if (downloadToastDismissed) {
      return;
    }
    emitUpdateToastState(sendToRenderer, {
      ...createDownloadingUpdateToastPayload(DEV_UPDATE_PREVIEW_VERSION, {
        progressPercent,
        transferredBytes: progressPercent / 100 * 20 * ONE_MEGABYTE,
        totalBytes: 20 * ONE_MEGABYTE,
        bytesPerSecond: 5 * ONE_MEGABYTE
      }),
      isPreview: true
    });
  }, DEV_UPDATE_PREVIEW_PROGRESS_STEP_MS);
  return { success: true };
}
function dismissUpdateToast(getMainWindow, sendToRenderer) {
  if (currentToastPayload == null ? void 0 : currentToastPayload.isPreview) {
    resetDevPreviewState(sendToRenderer);
    return { success: true };
  }
  if (downloadInProgress) {
    installAfterDownloadRequested = false;
    downloadToastDismissed = true;
    clearVisibleUpdateToast(sendToRenderer);
    return { success: true };
  }
  if ((currentToastPayload == null ? void 0 : currentToastPayload.phase) === "ready") {
    return deferUpdateReminder(
      getMainWindow,
      sendToRenderer,
      DISMISSED_READY_REMINDER_DELAY_MS
    );
  }
  if ((currentToastPayload == null ? void 0 : currentToastPayload.phase) === "available" || (currentToastPayload == null ? void 0 : currentToastPayload.phase) === "error") {
    return deferUpdateReminder(getMainWindow, sendToRenderer, UPDATE_REMINDER_DELAY_MS);
  }
  clearVisibleUpdateToast(sendToRenderer);
  return { success: true };
}
function installDownloadedUpdateNow(sendToRenderer) {
  if (currentToastPayload == null ? void 0 : currentToastPayload.isPreview) {
    resetDevPreviewState(sendToRenderer);
    return;
  }
  clearDeferredReminderTimer();
  downloadToastDismissed = false;
  installAfterDownloadRequested = false;
  clearVisibleUpdateToast(sendToRenderer);
  setUpdateStatusSummary({ status: "ready", availableVersion: pendingDownloadedVersion });
  writeUpdaterLog("Installing downloaded update.");
  main$1.autoUpdater.quitAndInstall();
}
async function downloadAvailableUpdate(sendToRenderer, options) {
  if (currentToastPayload == null ? void 0 : currentToastPayload.isPreview) {
    return simulateDevPreviewDownload(sendToRenderer);
  }
  if (!availableVersion) {
    return { success: false, message: "No update is ready to download." };
  }
  if (pendingDownloadedVersion === availableVersion) {
    return { success: false, message: "This update has already been downloaded." };
  }
  if (downloadInProgress) {
    return { success: false, message: "This update is already downloading." };
  }
  clearDeferredReminderTimer();
  downloadInProgress = true;
  downloadToastDismissed = false;
  installAfterDownloadRequested = Boolean(options == null ? void 0 : options.installAfterDownload) || installAfterDownloadRequested;
  setUpdateStatusSummary({
    status: "downloading",
    availableVersion,
    detail: `Downloading Recordly ${availableVersion}`
  });
  emitUpdateToastState(
    sendToRenderer,
    createDownloadingUpdateToastPayload(availableVersion, {
      progressPercent: 0,
      transferredBytes: 0
    })
  );
  writeUpdaterLog(`Starting update download for ${availableVersion}.`);
  try {
    await main$1.autoUpdater.downloadUpdate();
    writeUpdaterLog(`Update download requested for ${availableVersion}.`);
    return { success: true };
  } catch (error2) {
    downloadInProgress = false;
    setUpdateStatusSummary({
      status: "error",
      availableVersion,
      detail: String(error2)
    });
    writeUpdaterLog(`Update download failed for ${availableVersion}.`, error2);
    emitUpdateToastState(
      sendToRenderer,
      createUpdateErrorToastPayload(availableVersion, error2)
    );
    return { success: false, message: String(error2) };
  }
}
function deferUpdateReminder(getMainWindow, sendToRenderer, delayMs = UPDATE_REMINDER_DELAY_MS) {
  const payload = getReminderPayload();
  if (!payload) {
    return { success: false, message: "No update reminder is ready yet." };
  }
  clearDeferredReminderTimer();
  installAfterDownloadRequested = false;
  clearVisibleUpdateToast(sendToRenderer);
  deferredReminderTimer = setTimeout(() => {
    const nextPayload = getReminderPayload();
    if (!nextPayload) {
      return;
    }
    if (sendToRenderer && emitUpdateToastState(sendToRenderer, nextPayload)) {
      return;
    }
    if (nextPayload.phase === "ready") {
      void showDownloadedUpdateDialog(getMainWindow, nextPayload.version);
      return;
    }
    void showAvailableUpdateDialog(getMainWindow, nextPayload.version, sendToRenderer);
  }, delayMs);
  return { success: true };
}
function skipAvailableUpdateVersion(sendToRenderer) {
  const versionToSkip = pendingDownloadedVersion ?? availableVersion;
  if (!versionToSkip) {
    return { success: false, message: "No update is available to skip." };
  }
  skippedVersion = versionToSkip;
  if (pendingDownloadedVersion === versionToSkip) {
    pendingDownloadedVersion = null;
  }
  if (availableVersion === versionToSkip) {
    availableVersion = null;
  }
  downloadInProgress = false;
  downloadToastDismissed = false;
  installAfterDownloadRequested = false;
  clearDeferredReminderTimer();
  clearVisibleUpdateToast(sendToRenderer);
  return { success: true };
}
function previewUpdateToast(sendToRenderer) {
  clearDeferredReminderTimer();
  clearDevPreviewProgressTimer();
  availableVersion = DEV_UPDATE_PREVIEW_VERSION;
  pendingDownloadedVersion = null;
  downloadInProgress = false;
  downloadToastDismissed = false;
  installAfterDownloadRequested = false;
  return emitUpdateToastState(sendToRenderer, {
    version: DEV_UPDATE_PREVIEW_VERSION,
    phase: "available",
    detail: "This is a development preview of the in-app update toast.",
    delayMs: UPDATE_REMINDER_DELAY_MS,
    isPreview: true
  });
}
async function showAvailableUpdateDialog(getMainWindow, version, sendToRenderer) {
  const result = await showMessageBox(getMainWindow, {
    type: "info",
    title: "Update Available",
    message: `Recordly ${version} is available.`,
    detail: "Install and restart now, or remind me later.",
    buttons: ["Install & Restart", "Later"],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  });
  if (result.response === 0) {
    await downloadAvailableUpdate(sendToRenderer, { installAfterDownload: true });
    return;
  }
  deferUpdateReminder(getMainWindow, sendToRenderer, UPDATE_REMINDER_DELAY_MS);
}
async function showDownloadedUpdateDialog(getMainWindow, version, options) {
  const isPreview = Boolean(options == null ? void 0 : options.isPreview);
  const result = await showMessageBox(getMainWindow, {
    type: "info",
    title: "Update Ready",
    message: isPreview ? `Recordly ${version} is ready to install.` : `Recordly ${version} has been downloaded.`,
    detail: isPreview ? "Development preview of the native update prompt. No real update will be installed." : "Install and restart now, or remind me later.",
    buttons: ["Install & Restart", "Later"],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  });
  if (result.response === 0) {
    if (isPreview) {
      await showMessageBox(getMainWindow, {
        type: "info",
        title: "Preview Only",
        message: "No real update was installed.",
        detail: "This was only a manual development preview of the update prompt."
      });
      return;
    }
    clearDeferredReminderTimer();
    setImmediate(() => {
      installDownloadedUpdateNow();
    });
    return;
  }
  if (result.response === 1) {
    if (isPreview) {
      return;
    }
    deferUpdateReminder(getMainWindow, void 0, UPDATE_REMINDER_DELAY_MS);
  }
}
async function checkForAppUpdates(getMainWindow, options) {
  if (!canUseAutoUpdates()) {
    writeUpdaterLog(
      `Skipped update check because auto-updates are unavailable. packaged=${require$$1.app.isPackaged} mas=${process.mas ? "yes" : "no"} disabled=${AUTO_UPDATES_DISABLED ? "yes" : "no"}`
    );
    if (options == null ? void 0 : options.manual) {
      await showMessageBox(getMainWindow, {
        type: "info",
        title: "Updates Not Enabled",
        message: "Auto-updates are only available in packaged releases.",
        detail: AUTO_UPDATES_DISABLED ? "This build disabled auto-updates through RECORDLY_DISABLE_AUTO_UPDATES=1." : "Development builds do not ship the packaged update metadata required by electron-updater."
      });
    }
    return;
  }
  if (updateCheckInProgress) {
    writeUpdaterLog("Skipped update check because a previous check is still running.");
    return;
  }
  manualCheckRequested = Boolean(options == null ? void 0 : options.manual);
  updateCheckInProgress = true;
  updateCheckErrorHandled = false;
  setUpdateStatusSummary({ status: "checking", detail: "Checking for updates..." });
  writeUpdaterLog(`Starting ${manualCheckRequested ? "manual" : "automatic"} update check.`);
  try {
    await main$1.autoUpdater.checkForUpdates();
    writeUpdaterLog("Update check request completed.");
  } catch (error2) {
    updateCheckInProgress = false;
    const shouldReport = manualCheckRequested;
    manualCheckRequested = false;
    setUpdateStatusSummary({
      status: "error",
      availableVersion,
      detail: String(error2)
    });
    writeUpdaterLog("Update check failed.", error2);
    console.error("Auto-update check failed:", error2);
    if (shouldReport && !updateCheckErrorHandled) {
      await showUpdateErrorDialog(getMainWindow, error2);
    } else if (!updateCheckErrorHandled && shouldSurfaceAutomaticCheckErrors()) {
      emitUpdateToastState(activeUpdateToastSender, createAutoCheckErrorToastPayload());
    }
  }
}
function setupAutoUpdates(getMainWindow, sendToRenderer) {
  if (updaterInitialized) {
    return;
  }
  if (!canUseAutoUpdates()) {
    setUpdateStatusSummary({ status: "idle", availableVersion: null, detail: void 0 });
    return;
  }
  updaterInitialized = true;
  activeUpdateToastSender = sendToRenderer;
  configureUpdateFeed();
  main$1.autoUpdater.autoDownload = false;
  main$1.autoUpdater.autoInstallOnAppQuit = false;
  writeUpdaterLog(`Updater initialized. logPath=${UPDATER_LOG_PATH}`);
  main$1.autoUpdater.on("checking-for-update", () => {
    setUpdateStatusSummary({
      status: "checking",
      availableVersion: null,
      detail: "Checking for updates..."
    });
    writeUpdaterLog("electron-updater emitted checking-for-update.");
  });
  main$1.autoUpdater.on("update-available", (info) => {
    writeUpdaterLog(`Update available: version=${info.version}`);
    updateCheckInProgress = false;
    availableVersion = info.version;
    pendingDownloadedVersion = null;
    downloadInProgress = false;
    downloadToastDismissed = false;
    installAfterDownloadRequested = false;
    setUpdateStatusSummary({
      status: "available",
      availableVersion: info.version,
      detail: `Recordly ${info.version} is available.`
    });
    if (skippedVersion === info.version) {
      manualCheckRequested = false;
      return;
    }
    const payload = createAvailableUpdateToastPayload(info.version);
    if (emitUpdateToastState(sendToRenderer, payload)) {
      manualCheckRequested = false;
      return;
    }
    if (manualCheckRequested) {
      void showAvailableUpdateDialog(getMainWindow, info.version, sendToRenderer);
      manualCheckRequested = false;
    }
  });
  main$1.autoUpdater.on("update-not-available", () => {
    writeUpdaterLog("No update available.");
    updateCheckInProgress = false;
    availableVersion = null;
    pendingDownloadedVersion = null;
    downloadInProgress = false;
    downloadToastDismissed = false;
    installAfterDownloadRequested = false;
    setUpdateStatusSummary({
      status: "up-to-date",
      availableVersion: null,
      detail: `Recordly ${require$$1.app.getVersion()} is up to date.`
    });
    clearVisibleUpdateToast(sendToRenderer);
    manualCheckRequested = false;
  });
  main$1.autoUpdater.on("download-progress", (progress) => {
    if (!availableVersion) {
      return;
    }
    downloadInProgress = true;
    setUpdateStatusSummary({
      status: "downloading",
      availableVersion,
      detail: `Downloading Recordly ${availableVersion}`
    });
    writeUpdaterLog(
      `Download progress for ${availableVersion}: ${progress.percent.toFixed(1)}%`
    );
    if (downloadToastDismissed) {
      return;
    }
    emitUpdateToastState(
      sendToRenderer,
      createDownloadingUpdateToastPayload(availableVersion, {
        progressPercent: progress.percent,
        transferredBytes: progress.transferred,
        totalBytes: progress.total,
        bytesPerSecond: progress.bytesPerSecond
      })
    );
  });
  main$1.autoUpdater.on("error", (error2) => {
    updateCheckInProgress = false;
    const shouldReport = manualCheckRequested;
    manualCheckRequested = false;
    if (!downloadInProgress) {
      updateCheckErrorHandled = true;
    }
    setUpdateStatusSummary({
      status: "error",
      availableVersion,
      detail: String(error2)
    });
    writeUpdaterLog("electron-updater emitted error.", error2);
    console.error("Auto-updater error:", error2);
    if (downloadInProgress && availableVersion) {
      downloadInProgress = false;
      downloadToastDismissed = false;
      installAfterDownloadRequested = false;
      emitUpdateToastState(
        sendToRenderer,
        createUpdateErrorToastPayload(availableVersion, error2)
      );
    }
    if (shouldReport) {
      void showUpdateErrorDialog(getMainWindow, error2);
    } else if (shouldSurfaceAutomaticCheckErrors()) {
      emitUpdateToastState(sendToRenderer, createAutoCheckErrorToastPayload());
    }
  });
  main$1.autoUpdater.on("update-downloaded", (info) => {
    writeUpdaterLog(`Update downloaded: version=${info.version}`);
    updateCheckInProgress = false;
    manualCheckRequested = false;
    downloadInProgress = false;
    downloadToastDismissed = false;
    if (skippedVersion === info.version) {
      installAfterDownloadRequested = false;
      return;
    }
    availableVersion = info.version;
    pendingDownloadedVersion = info.version;
    setUpdateStatusSummary({
      status: "ready",
      availableVersion: info.version,
      detail: `Recordly ${info.version} is ready to install.`
    });
    clearDeferredReminderTimer();
    if (installAfterDownloadRequested && !(currentToastPayload == null ? void 0 : currentToastPayload.isPreview)) {
      installAfterDownloadRequested = false;
      clearVisibleUpdateToast(sendToRenderer);
      writeUpdaterLog(`Auto-installing downloaded update: version=${info.version}`);
      setImmediate(() => {
        installDownloadedUpdateNow(sendToRenderer);
      });
      return;
    }
    if (emitUpdateToastState(sendToRenderer, createDownloadedUpdateToastPayload(info.version))) {
      return;
    }
    void showDownloadedUpdateDialog(getMainWindow, info.version);
  });
  void checkForAppUpdates(getMainWindow);
  periodicCheckTimer = setInterval(() => {
    void checkForAppUpdates(getMainWindow);
  }, UPDATE_CHECK_INTERVAL_MS);
  require$$1.app.on("before-quit", () => {
    clearDeferredReminderTimer();
    clearDevPreviewProgressTimer();
    if (periodicCheckTimer) {
      clearInterval(periodicCheckTimer);
      periodicCheckTimer = null;
    }
  });
}
const __dirname$1 = path$m.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.cjs", document.baseURI).href));
const IS_SMOKE_EXPORT = process.env.RECORDLY_SMOKE_EXPORT === "1";
require$$1.app.commandLine.appendSwitch("ignore-gpu-blocklist");
require$$1.app.commandLine.appendSwitch("enable-unsafe-webgpu");
require$$1.app.commandLine.appendSwitch("enable-gpu-rasterization");
function configureGpuAccelerationSwitches() {
  const { useAngle, useGl, disableFeatures } = getGpuSwitches(process.platform, process.env);
  if (useAngle) {
    require$$1.app.commandLine.appendSwitch("use-angle", useAngle);
  }
  if (useGl) {
    require$$1.app.commandLine.appendSwitch("use-gl", useGl);
  }
  if (disableFeatures && disableFeatures.length > 0) {
    require$$1.app.commandLine.appendSwitch("disable-features", disableFeatures.join(","));
  }
}
async function logSmokeExportGpuDiagnostics() {
  if (!IS_SMOKE_EXPORT) {
    return;
  }
  try {
    console.log("[smoke-export] GPU feature status", JSON.stringify(require$$1.app.getGPUFeatureStatus()));
    console.log("[smoke-export] GPU info", JSON.stringify(await require$$1.app.getGPUInfo("basic")));
  } catch (error2) {
    console.warn("[smoke-export] Failed to read GPU diagnostics:", error2);
  }
}
configureGpuAccelerationSwitches();
async function ensureRecordingsDir() {
  try {
    await fs$k.mkdir(RECORDINGS_DIR, { recursive: true });
    console.log("RECORDINGS_DIR:", RECORDINGS_DIR);
    console.log("User Data Path:", require$$1.app.getPath("userData"));
  } catch (error2) {
    console.error("Failed to create recordings directory:", error2);
  }
}
process.env.APP_ROOT = path$m.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$m.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$m.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$m.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let mainWindow = null;
let sourceSelectorWindow = null;
let tray = null;
let trayContextMenu = null;
let selectedSourceName = "";
let editorHasUnsavedChanges = false;
let isForceClosing = false;
let activeUpdateNotification = null;
let activeUpdateNotificationKey = null;
const hasSingleInstanceLock = require$$1.app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  require$$1.app.quit();
}
function closeEditorWindowBypassingUnsavedPrompt(window2) {
  if (!window2 || window2.isDestroyed()) {
    return;
  }
  if (isEditorWindow(window2)) {
    isForceClosing = true;
    editorHasUnsavedChanges = false;
  }
  window2.close();
}
function restoreWindowSafely(window2) {
  if (!window2 || window2.isDestroyed()) {
    return;
  }
  if (!isEditorWindow(window2) && process.platform === "win32") {
    showHudOverlayFromTray();
    return;
  }
  if (window2.isMinimized()) {
    window2.restore();
  }
  if (!window2.isVisible()) {
    window2.show();
  }
  window2.moveTop();
  window2.focus();
}
let defaultTrayIcon = null;
let recordingTrayIcon = null;
function getDefaultTrayIcon() {
  if (!defaultTrayIcon) {
    defaultTrayIcon = getTrayIcon("app-icons/recordly-32.png");
  }
  return defaultTrayIcon;
}
function getRecordingTrayIcon() {
  if (!recordingTrayIcon) {
    recordingTrayIcon = getTrayIcon("rec-button.png");
  }
  return recordingTrayIcon;
}
function showHudOverlayFromTray() {
  const hud = getHudOverlayWindow();
  if (!hud) {
    return false;
  }
  if (hud.isMinimized()) {
    hud.restore();
  }
  if (process.platform === "win32" && isHudOverlayMousePassthroughSupported()) {
    hud.showInactive();
    hud.moveTop();
    reassertHudOverlayMouseState();
    return true;
  }
  hud.show();
  hud.moveTop();
  hud.focus();
  return true;
}
require$$1.ipcMain.on("set-has-unsaved-changes", (_event, hasChanges) => {
  editorHasUnsavedChanges = hasChanges;
});
function createWindow() {
  if (!require$$1.app.isReady()) {
    void require$$1.app.whenReady().then(() => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        createWindow();
      }
    });
    return;
  }
  mainWindow = createHudOverlayWindow();
}
function focusOrCreateMainWindow() {
  if (!require$$1.app.isReady()) {
    void require$$1.app.whenReady().then(() => {
      focusOrCreateMainWindow();
    });
    return;
  }
  if (require$$1.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    return;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (process.platform === "linux" && !mainWindow.isFocused() && !isEditorWindow(mainWindow)) {
      const win = mainWindow;
      mainWindow = null;
      win.once("closed", () => createWindow());
      win.destroy();
      return;
    }
    if (process.platform === "win32" && !isEditorWindow(mainWindow) && isHudOverlayMousePassthroughSupported()) {
      showHudOverlayFromTray();
      return;
    }
    mainWindow.show();
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.moveTop();
    mainWindow.focus();
  }
}
function reassertHudOverlayMouseState() {
  if (process.platform !== "win32" || !isHudOverlayMousePassthroughSupported()) {
    return;
  }
  const hud = getHudOverlayWindow();
  if (!hud) {
    return;
  }
  hud.setIgnoreMouseEvents(false);
  setTimeout(() => {
    if (!hud.isDestroyed()) {
      hud.setIgnoreMouseEvents(true, { forward: true });
    }
  }, 50);
}
function isEditorWindow(window2) {
  return window2.webContents.getURL().includes("windowType=editor");
}
function sendEditorMenuAction(channel) {
  let targetWindow = require$$1.BrowserWindow.getFocusedWindow() ?? mainWindow;
  if (!targetWindow || targetWindow.isDestroyed() || !isEditorWindow(targetWindow)) {
    createEditorWindowWrapper();
    targetWindow = mainWindow;
    if (!targetWindow || targetWindow.isDestroyed()) return;
    targetWindow.webContents.once("did-finish-load", () => {
      if (!targetWindow || targetWindow.isDestroyed()) return;
      targetWindow.webContents.send(channel);
    });
    return;
  }
  targetWindow.webContents.send(channel);
}
function setupApplicationMenu() {
  const isMac = process.platform === "darwin";
  if (!isMac) {
    require$$1.Menu.setApplicationMenu(null);
    return;
  }
  const template = [];
  template.push({
    label: require$$1.app.name,
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" }
    ]
  });
  template.push(
    {
      label: "File",
      submenu: [
        {
          label: "Open Projects…",
          accelerator: "CmdOrCtrl+O",
          click: () => sendEditorMenuAction("menu-load-project")
        },
        {
          label: "Save Project…",
          accelerator: "CmdOrCtrl+S",
          click: () => sendEditorMenuAction("menu-save-project")
        },
        {
          label: "Save Project As…",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => sendEditorMenuAction("menu-save-project-as")
        },
        ...isMac ? [] : [{ type: "separator" }, { role: "quit" }]
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: isMac ? [{ role: "minimize" }, { role: "zoom" }, { type: "separator" }, { role: "front" }] : [{ role: "minimize" }, { role: "close" }]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Check for Updates…",
          click: () => {
            void checkForAppUpdates(getUpdateDialogWindow, { manual: true });
          }
        }
      ]
    }
  );
  const menu = require$$1.Menu.buildFromTemplate(template);
  require$$1.Menu.setApplicationMenu(menu);
}
function isPrimaryTrayClick(event) {
  const button = event && typeof event === "object" && "button" in event ? event.button : void 0;
  return button === void 0 || button === 0 || button === "left";
}
function createTray() {
  tray = new require$$1.Tray(getDefaultTrayIcon());
  tray.on("click", (event) => {
    if (process.platform === "win32" && !isPrimaryTrayClick(event)) {
      return;
    }
    focusOrCreateMainWindow();
  });
  if (process.platform === "win32") {
    tray.on("right-click", () => {
      if (!tray || !trayContextMenu) {
        return;
      }
      tray.popUpContextMenu(trayContextMenu);
    });
    return;
  }
  tray.on("double-click", () => focusOrCreateMainWindow());
}
function getPublicAssetPath(filename) {
  return path$m.join(process.env.VITE_PUBLIC || RENDERER_DIST, filename);
}
function getAppImage(filename) {
  return require$$1.nativeImage.createFromPath(getPublicAssetPath(filename));
}
function getTrayIcon(filename) {
  return getAppImage(filename).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function syncDockIcon() {
  if (process.platform !== "darwin" || !require$$1.app.dock) {
    return;
  }
  const dockIcon = getAppImage("app-icons/recordly-512.png");
  if (!dockIcon.isEmpty()) {
    require$$1.app.dock.setIcon(dockIcon);
  }
}
function getUpdateNotificationTitle(payload) {
  switch (payload.phase) {
    case "available":
      return `Recordly ${payload.version} is available`;
    case "downloading":
      return `Downloading Recordly ${payload.version}`;
    case "ready":
      return `Recordly ${payload.version} is ready`;
    case "error":
      return `Recordly ${payload.version} needs attention`;
  }
}
function getUpdateNotificationBody(payload) {
  switch (payload.phase) {
    case "available":
      return "Click to install the update and restart Recordly.";
    case "downloading":
      return "Recordly is downloading the update and will restart when it is ready.";
    case "ready":
      return "Click to install the downloaded update and restart.";
    case "error":
      return payload.primaryAction === "install-and-restart" ? "Click to try the install again." : "Click to retry checking for updates.";
  }
}
function clearActiveUpdateNotification() {
  if (activeUpdateNotification) {
    activeUpdateNotification.close();
    activeUpdateNotification = null;
  }
  activeUpdateNotificationKey = null;
}
function sendUpdateToastToWindows(channel, payload) {
  if (process.platform !== "darwin") {
    if (!payload) {
      clearActiveUpdateNotification();
      return true;
    }
    const updatePayload = payload;
    if (updatePayload.phase === "downloading") {
      return true;
    }
    if (!require$$1.Notification.isSupported()) {
      return false;
    }
    const notificationKey = [
      updatePayload.phase,
      updatePayload.version,
      updatePayload.detail
    ].join(":");
    if (activeUpdateNotificationKey === notificationKey) {
      return true;
    }
    clearActiveUpdateNotification();
    const notification = new require$$1.Notification({
      title: getUpdateNotificationTitle(updatePayload),
      body: getUpdateNotificationBody(updatePayload),
      icon: getAppImage("app-icons/recordly-128.png"),
      silent: false
    });
    notification.on("click", () => {
      focusOrCreateMainWindow();
      switch (updatePayload.phase) {
        case "available":
          void downloadAvailableUpdate(sendUpdateToastToWindows, {
            installAfterDownload: true
          });
          break;
        case "ready":
          installDownloadedUpdateNow(sendUpdateToastToWindows);
          break;
        case "error":
          if (updatePayload.primaryAction === "install-and-restart") {
            void downloadAvailableUpdate(sendUpdateToastToWindows, {
              installAfterDownload: true
            });
          } else {
            void checkForAppUpdates(getUpdateDialogWindow, { manual: true });
          }
          break;
      }
    });
    notification.on("close", () => {
      if (activeUpdateNotification === notification) {
        activeUpdateNotification = null;
        activeUpdateNotificationKey = null;
      }
    });
    notification.show();
    reassertHudOverlayMouseState();
    activeUpdateNotification = notification;
    activeUpdateNotificationKey = notificationKey;
    return true;
  }
  if (!payload) {
    const existingWindow = getUpdateToastWindow();
    if (!existingWindow) {
      return false;
    }
    existingWindow.webContents.send(channel, null);
    hideUpdateToastWindow();
    return true;
  }
  const toastWindow = showUpdateToastWindow();
  const sendPayload = () => {
    toastWindow.webContents.send(channel, payload);
    showUpdateToastWindow();
  };
  if (toastWindow.webContents.isLoadingMainFrame()) {
    toastWindow.webContents.once("did-finish-load", sendPayload);
  } else {
    sendPayload();
  }
  return true;
}
function getUpdateDialogWindow() {
  const focusedWindow = require$$1.BrowserWindow.getFocusedWindow();
  if (focusedWindow && !focusedWindow.isDestroyed()) {
    return focusedWindow;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow;
  }
  return getHudOverlayWindow();
}
require$$1.ipcMain.handle("install-downloaded-update", () => {
  installDownloadedUpdateNow(sendUpdateToastToWindows);
  return { success: true };
});
require$$1.ipcMain.handle("download-available-update", (_event, installAfterDownload) => {
  return downloadAvailableUpdate(sendUpdateToastToWindows, {
    installAfterDownload: Boolean(installAfterDownload)
  });
});
require$$1.ipcMain.handle("defer-downloaded-update", (_event, delayMs) => {
  return deferUpdateReminder(getUpdateDialogWindow, sendUpdateToastToWindows, delayMs);
});
require$$1.ipcMain.handle("dismiss-update-toast", () => {
  return dismissUpdateToast(getUpdateDialogWindow, sendUpdateToastToWindows);
});
require$$1.ipcMain.handle("skip-update-version", () => {
  return skipAvailableUpdateVersion(sendUpdateToastToWindows);
});
require$$1.ipcMain.handle("get-current-update-toast-payload", () => {
  return getCurrentUpdateToastPayload();
});
require$$1.ipcMain.handle("get-update-status-summary", () => {
  return getUpdateStatusSummary();
});
require$$1.ipcMain.handle("preview-update-toast", () => {
  return { success: previewUpdateToast(sendUpdateToastToWindows) };
});
require$$1.ipcMain.handle("check-for-app-updates", async () => {
  await checkForAppUpdates(getUpdateDialogWindow, { manual: true });
  return { success: true, logPath: getUpdaterLogPath() };
});
function updateTrayMenu(recording = false) {
  if (!tray) return;
  const trayIcon = recording ? getRecordingTrayIcon() : getDefaultTrayIcon();
  const trayToolTip = recording ? `Recording: ${selectedSourceName}` : "Recordly";
  const menuTemplate = recording ? [
    {
      label: "Show Controls",
      click: () => {
        if (!showHudOverlayFromTray()) {
          focusOrCreateMainWindow();
        }
      }
    },
    {
      label: "Stop Recording",
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("stop-recording-from-tray");
        }
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        if (!showHudOverlayFromTray()) {
          focusOrCreateMainWindow();
        }
      }
    },
    {
      label: "Quit",
      click: () => {
        require$$1.app.quit();
      }
    }
  ];
  const menu = require$$1.Menu.buildFromTemplate(menuTemplate);
  trayContextMenu = menu;
  tray.setImage(trayIcon);
  tray.setToolTip(trayToolTip);
  if (process.platform !== "win32") {
    tray.setContextMenu(menu);
  }
}
function createEditorWindowWrapper() {
  const previousWindow = mainWindow;
  if (previousWindow && !previousWindow.isDestroyed()) {
    const closingEditorWindow = isEditorWindow(previousWindow);
    closeEditorWindowBypassingUnsavedPrompt(previousWindow);
    if (!closingEditorWindow) {
      isForceClosing = false;
    }
    if (mainWindow === previousWindow) {
      mainWindow = null;
    }
  }
  const editorWindow = createEditorWindow();
  mainWindow = editorWindow;
  editorHasUnsavedChanges = false;
  editorWindow.on("closed", () => {
    if (mainWindow === editorWindow) {
      mainWindow = null;
    }
    isForceClosing = false;
    editorHasUnsavedChanges = false;
  });
  editorWindow.on("close", (event) => {
    if (isForceClosing || !editorHasUnsavedChanges) {
      return;
    }
    event.preventDefault();
    const choice = require$$1.dialog.showMessageBoxSync(editorWindow, {
      type: "warning",
      buttons: ["Save & Close", "Discard & Close", "Cancel"],
      defaultId: 0,
      cancelId: 2,
      title: "Unsaved Changes",
      message: "You have unsaved changes.",
      detail: "Do you want to save your project before closing?"
    });
    if (choice === 0) {
      editorWindow.webContents.send("request-save-before-close");
      require$$1.ipcMain.once("save-before-close-done", (_event, saved) => {
        if (saved) {
          closeEditorWindowBypassingUnsavedPrompt(editorWindow);
        }
      });
    } else if (choice === 1) {
      closeEditorWindowBypassingUnsavedPrompt(editorWindow);
    }
  });
}
function createSourceSelectorWindowWrapper() {
  sourceSelectorWindow = createSourceSelectorWindow();
  sourceSelectorWindow.on("closed", () => {
    sourceSelectorWindow = null;
  });
  return sourceSelectorWindow;
}
require$$1.app.on("before-quit", () => {
  killWindowsCaptureProcess();
  showCursor();
  cleanupNativeVideoExportSessions();
  void cleanupAllExportStreams();
});
require$$1.app.on("window-all-closed", () => {
  if (IS_SMOKE_EXPORT || process.platform !== "darwin") {
    require$$1.app.quit();
  }
});
require$$1.app.on("activate", () => {
  focusOrCreateMainWindow();
});
require$$1.app.on("second-instance", () => {
  focusOrCreateMainWindow();
});
require$$1.app.whenReady().then(async () => {
  if (process.platform === "win32") {
    require$$1.app.setAppUserModelId("dev.recordly.app");
  }
  require$$1.session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    const allowed = ["media", "audioCapture", "microphone", "camera", "videoCapture"];
    return allowed.includes(permission);
  });
  require$$1.session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ["media", "audioCapture", "microphone", "camera", "videoCapture"];
    callback(allowed.includes(permission));
  });
  require$$1.session.defaultSession.setDevicePermissionHandler((_details) => true);
  if (process.platform === "darwin") {
    const cameraStatus = require$$1.systemPreferences.getMediaAccessStatus("camera");
    if (cameraStatus !== "granted") {
      await require$$1.systemPreferences.askForMediaAccess("camera");
    }
    const micStatus = require$$1.systemPreferences.getMediaAccessStatus("microphone");
    if (micStatus !== "granted") {
      await require$$1.systemPreferences.askForMediaAccess("microphone");
    }
  } else if (process.platform === "win32") {
    const cameraStatus = require$$1.systemPreferences.getMediaAccessStatus("camera");
    const micStatus = require$$1.systemPreferences.getMediaAccessStatus("microphone");
    if (cameraStatus !== "granted") {
      console.warn(
        `[permissions] Camera access is "${cameraStatus}" — webcam may not work. Check Windows Settings > Privacy > Camera.`
      );
    }
    if (micStatus !== "granted") {
      console.warn(
        `[permissions] Microphone access is "${micStatus}" — mic recording may not work. Check Windows Settings > Privacy > Microphone.`
      );
    }
  }
  require$$1.ipcMain.on("hud-overlay-close", () => {
    require$$1.app.quit();
  });
  syncDockIcon();
  createTray();
  updateTrayMenu();
  setupApplicationMenu();
  await ensureRecordingsDir();
  if (!VITE_DEV_SERVER_URL) {
    try {
      await ensurePackagedRendererServer(RENDERER_DIST);
    } catch (error2) {
      console.warn("[renderer-server] Failed to start packaged renderer server:", error2);
    }
  }
  try {
    await ensureMediaServer();
  } catch (error2) {
    console.warn("[media-server] Failed to start media server:", error2);
  }
  registerIpcHandlers(
    createEditorWindowWrapper,
    createSourceSelectorWindowWrapper,
    () => mainWindow,
    () => sourceSelectorWindow,
    (recording, sourceName) => {
      selectedSourceName = sourceName;
      if (!tray) createTray();
      updateTrayMenu(recording);
      if (recording) {
        reassertHudOverlayMouseState();
      }
      if (!recording) {
        restoreWindowSafely(mainWindow);
      }
    }
  );
  registerExtensionIpcHandlers();
  if (IS_SMOKE_EXPORT) {
    await logSmokeExportGpuDiagnostics();
    const smokeSource = process.env.RECORDLY_SMOKE_EXPORT_PROJECT ?? process.env.RECORDLY_SMOKE_EXPORT_INPUT ?? "<missing input>";
    console.log(`[smoke-export] Starting editor smoke export for ${smokeSource}`);
    createEditorWindowWrapper();
    return;
  }
  createWindow();
  setupAutoUpdates(getUpdateDialogWindow, sendUpdateToastToWindows);
  require$$1.session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sourceId = getSelectedSourceId();
      const isLinuxPortalSentinel = process.platform === "linux" && (sourceId === "screen:linux-portal" || !sourceId);
      if (isLinuxPortalSentinel) {
        callback({ video: { id: "screen:0:0", name: "Entire screen" } });
        return;
      }
      const sources = await require$$1.desktopCapturer.getSources({ types: ["screen", "window"] });
      const source = sourceId ? sources.find((s) => s.id === sourceId) ?? sources[0] : sources[0];
      if (source) {
        callback({
          video: { id: source.id, name: source.name }
        });
      } else {
        callback({});
      }
    } catch (error2) {
      console.error("setDisplayMediaRequestHandler error:", error2);
      callback({});
    }
  });
  const currentToastPayload2 = getCurrentUpdateToastPayload();
  if (currentToastPayload2) {
    sendUpdateToastToWindows("update-toast-state", currentToastPayload2);
  }
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
