#!/usr/bin/env python3
"""记忆宫殿单词卡 — 本地服务器
启动：python3 memory-palace-server.py
自动打开 http://localhost:8877
"""

import http.server, json, subprocess, webbrowser, threading, re
from urllib.parse import urlparse, parse_qs

PORT = 8877

PROMPT_TEMPLATE = '''你是「记忆宫殿英语教练」，专为互联网/AI从业者设计单词记忆卡片。

## 核心规则（优先级从高到低）
1. 谐音必须真实对应发音（按音节拆，不按字母拆）
2. 句子必须逻辑连贯（有主体、有动作、有因果，删掉括号标注后中文本身读起来通顺）
3. 必须落到词义（句尾自然导向中文意思）
4. 构词优先于纯谐音（复合词→词根词缀→谐音）
5. 场景优先互联网/AI语境（接口、部署、上线、模型、调参、badcase、需求评审等）
6. 禁止音译词（"斯坦普""康迪申"等无意义汉字组合）

## method 字段取值
- compound：复合词拆解（如 bottleneck = bottle + neck）
- root：词根词缀拆解（如 sympathy = sym + path + y）
- homophone：谐音联想

## scene 字段格式
画面句中，每个被拆解的字母块用中文全角括号标注。
例：一（a）个人打（da）喷嚏扑通（pt）栽倒

## 严格返回以下 JSON，不要任何其他文字：
{"word":"单词","meaning":"中文释义","homophone":"中文谐音","ipa":"/国际音标/","method":"compound或root或homophone","scene":"画面句，用（）标注拆解块","anchor":"词义落点句"}

现在为这个单词生成卡片：%s'''


HTML_PAGE = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>记忆宫殿单词卡</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0c0c14;color:#e0e0e8;min-height:100vh}

/* header */
.header{padding:40px 20px 0;text-align:center}
.header h1{font-size:32px;font-weight:800;background:linear-gradient(135deg,#7c5cfc,#c084fc,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}
.header .sub{color:#555;font-size:13px;margin-bottom:28px}

/* stats bar */
.stats{display:flex;justify-content:center;gap:32px;margin-bottom:28px}
.stat-item{text-align:center}
.stat-num{font-size:32px;font-weight:900;color:#b794f6}
.stat-label{font-size:11px;color:#555;margin-top:2px;letter-spacing:1px}

/* input area */
.gen-area{max-width:720px;margin:0 auto 32px;padding:0 20px}
.gen-box{display:flex;gap:10px;background:#161622;border:1px solid#2d2d3a;border-radius:14px;padding:6px 6px 6px 18px;align-items:center;transition:border-color .2s}
.gen-box:focus-within{border-color:#7c5cfc}
.gen-box input{flex:1;background:none;border:none;color:#e0e0e8;font-size:16px;outline:none;padding:10px 0}
.gen-box input::placeholder{color:#555}
.gen-box button{padding:12px 24px;border-radius:10px;border:none;background:linear-gradient(135deg,#7c5cfc,#6341e0);color:#fff;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .15s}
.gen-box button:hover{opacity:.85}
.gen-box button:disabled{opacity:.35;cursor:wait}

/* loading */
.loading-bar{max-width:720px;margin:-16px auto 20px;padding:0 20px;display:none}
.loading-bar.show{display:block}
.loading-inner{background:#161622;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:10px;color:#9f7aea;font-size:14px}
.spinner{width:16px;height:16px;border:2px solid#2d2d3a;border-top-color:#9f7aea;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

/* error */
.error-toast{max-width:720px;margin:0 auto 12px;padding:0 20px;display:none}
.error-toast.show{display:block}
.error-inner{background:#2d1a1a;border:1px solid#5a2a2a;border-radius:10px;padding:12px 18px;color:#f56565;font-size:13px}

/* tabs */
.tabs{max-width:720px;margin:0 auto 20px;padding:0 20px;display:flex;gap:8px;flex-wrap:wrap}
.tab{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid#2d2d3a;background:#161622;color:#888;transition:all .15s}
.tab:hover{border-color:#3a3a4d;color:#aaa}
.tab.active{border-color:#7c5cfc;background:#1e1a2e;color:#b794f6}
.tab .num{color:#555;margin-left:4px}

/* cards */
.cards-wrap{max-width:720px;margin:0 auto;padding:0 20px 80px}
.section-title{font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 12px;padding-left:4px}

.card{background:#161622;border:1px solid#2d2d3a;border-radius:14px;margin-bottom:12px;overflow:hidden;animation:fadeUp .35s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card summary{padding:16px 20px;cursor:pointer;list-style:none;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;user-select:none}
.card summary::-webkit-details-marker{display:none}
.card summary::after{content:'▾';color:#444;margin-left:auto;font-size:12px;transition:transform .2s}
.card[open] summary::after{transform:rotate(180deg);color:#9f7aea}
.card:hover{border-color:#3a3a4d}
.card.fresh{border-color:#7c5cfc44}

.w{font-size:21px;font-weight:800;color:#b794f6}
.m{font-size:15px;color:#aaa;font-weight:600}
.tg{font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:.3px;vertical-align:middle}
.tg-homophone{background:#1a1a2e;color:#63b3ed}
.tg-root{background:#2a1a2e;color:#d6a0f0}
.tg-compound{background:#1a2e1a;color:#68d391}

.body{padding:0 20px 18px}
.ph{display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.ph-h{color:#9f7aea;font-weight:600;font-size:14px}
.ph-i{color:#555;font-size:13px;font-family:'Lucida Grande',serif}
.scene-box{background:#1a1a28;border-radius:10px;padding:14px 16px}
.scene{font-size:14px;line-height:2;color:#c8c8d8}
.ck{color:#b794f6;font-weight:700;background:rgba(124,92,252,.1);padding:1px 3px;border-radius:3px}
.divider{height:1px;background:#252535;margin:10px 0}
.anchor{font-size:13px;color:#b794f6;font-weight:600;padding-left:12px;border-left:3px solid#7c5cfc}

.del-btn{float:right;background:none;border:none;color:#444;cursor:pointer;font-size:12px;padding:2px 6px;border-radius:4px}
.del-btn:hover{color:#f56565;background:#2d1a1a}

/* footer */
.footer{max-width:720px;margin:0 auto;padding:20px;text-align:center;color:#2a2a35;font-size:11px}

/* empty */
.empty{text-align:center;padding:48px 20px;color:#333}
.empty p{font-size:14px;margin-bottom:6px}
</style>
</head>
<body>

<div class="header">
  <h1>记忆宫殿单词卡</h1>
  <p class="sub">输入任意英文单词，AI 实时生成记忆卡片 · 基于谐音/词根/复合词三种记法</p>
</div>

<div class="stats">
  <div class="stat-item"><div class="stat-num" id="totalNum">0</div><div class="stat-label">张卡片</div></div>
  <div class="stat-item"><div class="stat-num" id="methodNum">0</div><div class="stat-label">种记法</div></div>
  <div class="stat-item"><div class="stat-num" id="genNum">0</div><div class="stat-label">AI 生成</div></div>
</div>

<div class="gen-area">
  <div class="gen-box">
    <input type="text" id="wordInput" placeholder="输入英文单词，如 threshold、resilient..." autocomplete="off">
    <button id="genBtn">生成卡片</button>
  </div>
</div>

<div class="loading-bar" id="loading">
  <div class="loading-inner"><span class="spinner"></span><span id="loadingText">正在生成卡片...</span></div>
</div>

<div class="error-toast" id="errBox">
  <div class="error-inner" id="errMsg"></div>
</div>

<div class="tabs" id="tabs"></div>
<div class="cards-wrap" id="cardsWrap"></div>

<div class="footer">发音准确 > 逻辑连贯 > 落到词义 > 互联网场景 · 记忆宫殿法</div>

<script>
// ========== 预置卡片 ==========
var PRESETS = [
  {word:"adapt",meaning:"适应",homophone:"额-戴普特",ipa:"/əˈdæpt/",method:"homophone",scene:"一（a）个人打（da）喷嚏扑通（pt）栽倒，新环境水土不服",anchor:"需要慢慢适应"},
  {word:"adopt",meaning:"采用",homophone:"额-道普特",ipa:"/əˈdɒpt/",method:"homophone",scene:"打喷嚏之后采用药物治疗，药丸是圆（o）形的",anchor:"用圆形 o 记住和 adapt 的差别字母"},
  {word:"bottleneck",meaning:"瓶颈",homophone:"鲍头-耐克",ipa:"/ˈbɒtlnek/",method:"compound",scene:"瓶子（bottle）的脖子（neck）最细，水流到这里全堵住了",anchor:"系统性能卡住的地方就是瓶颈"},
  {word:"sympathy",meaning:"同情",homophone:"辛帕思",ipa:"/ˈsɪmpəθi/",method:"root",scene:"帅爷们（sym）感觉（path）到了，歪着头叹气（y）",anchor:"他对别人的处境产生了同情"},
  {word:"empathy",meaning:"共情",homophone:"恩帕思",ipa:"/ˈempəθi/",method:"root",scene:"走进去（em-）感觉（path）到了——不是旁观者的同情，是钻进对方身体里去感受",anchor:"em- 是进入，进入对方的感觉 = 共情"},
  {word:"threshold",meaning:"阈值",homophone:"斯瑞什-后德",ipa:"/ˈθreʃhoʊld/",method:"homophone",scene:"三（thre）道报警线闪（sh）烁，hold住（hold）不许越过",anchor:"只有突破这条线——阈值——才会触发报警"},
  {word:"latency",meaning:"延迟",homophone:"雷腾-C",ipa:"/ˈleɪtənsi/",method:"homophone",scene:"用户点了按钮，迟（late）迟等不到响应，盯着（n）转圈（cy）的 loading",anchor:"接口响应太慢——这就是延迟"},
  {word:"deploy",meaning:"部署",homophone:"迪-普洛伊",ipa:"/dɪˈplɔɪ/",method:"homophone",scene:"深夜（de）值班，一行命令（ploy）敲下去，代码从本地飞到线上",anchor:"服务上线——部署完成"},
  {word:"throughput",meaning:"吞吐量",homophone:"斯鲁-普特",ipa:"/ˈθruːpʊt/",method:"compound",scene:"数据流穿过（through）管道被推出来（put），一秒过了多少条",anchor:"管道每秒能推出多少——吞吐量"},
  {word:"rollback",meaning:"回滚",homophone:"柔-拜克",ipa:"/ˈroʊlbæk/",method:"compound",scene:"上线出 bug，赶紧把代码卷（roll）回（back）去，版本倒退一格",anchor:"紧急撤回——回滚"},
  {word:"iterate",meaning:"迭代",homophone:"伊特-瑞特",ipa:"/ˈɪtəreɪt/",method:"root",scene:"一（i）条路（ter）走不通，再走（ate）一条——每次走出新路线",anchor:"反复走新路线 = 迭代"},
  {word:"deprecate",meaning:"弃用",homophone:"戴普-瑞凯特",ipa:"/ˈdeprəkeɪt/",method:"root",scene:"老接口额头上贴了一张（de）便签：求（prec）你们别（ate）再调我了",anchor:"标记为不推荐使用——弃用"},
  {word:"resilient",meaning:"高可用",homophone:"瑞-兹利恩特",ipa:"/rɪˈzɪliənt/",method:"homophone",scene:"服务器被瑞（re）兹（zil）一拳打倒，弹（lient）了回来继续跑",anchor:"打不死的服务——高可用"},
  {word:"idempotent",meaning:"幂等的",homophone:"爱登-剖腾特",ipa:"/aɪˈdempətənt/",method:"root",scene:"同一个按钮（idem）按一次和按十次（potent），系统状态一模一样",anchor:"重复操作结果不变——幂等"},
  {word:"cache",meaning:"缓存",homophone:"凯什",ipa:"/kæʃ/",method:"homophone",scene:"收银台旁的快（ca）取架（che），最常买的东西放在伸手就够到的地方",anchor:"把高频数据放在最近的地方——缓存"},
  {word:"scaffold",meaning:"脚手架",homophone:"思凯-佛德",ipa:"/ˈskæfəld/",method:"homophone",scene:"新项目刚起步，先搭（sca）一层（ff）骨架（old），代码模板自动生成目录结构",anchor:"项目初始化的骨架——脚手架"},
  {word:"mutex",meaning:"互斥锁",homophone:"谬-泰克斯",ipa:"/ˈmjuːteks/",method:"compound",scene:"互相（mut-ual）排斥（ex-clusive），两个线程抢同一把锁，只有一个能进门",anchor:"同一时刻只允许一个通过——互斥锁"},
  {word:"paradigm",meaning:"范式",homophone:"派拉-代姆",ipa:"/ˈpærədaɪm/",method:"root",scene:"一对（para）标杆模型（digm）竖在那里，所有后来者照着它的样子做",anchor:"大家照着做的标准模型——范式"},
  {word:"quite",meaning:"相当",homophone:"夸特",ipa:"/kwaɪt/",method:"homophone",scene:"取（qu）出一根相当大的蜡烛（i 象形蜡烛），很特（te）别",anchor:"相当特别"},
  {word:"quiet",meaning:"安静的",homophone:"夸爱特",ipa:"/ˈkwaɪət/",method:"homophone",scene:"和 quite 结尾的（et）和（te）顺序刚好相反",anchor:"字母一调换，从相当变成安静"}
];

// ========== 数据层 ==========
var STORE_KEY = 'memory_palace_cards';

function loadCards() {
  try {
    var saved = localStorage.getItem(STORE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch(e) { return []; }
}

function saveCards(generated) {
  localStorage.setItem(STORE_KEY, JSON.stringify(generated));
}

function getAllCards() {
  var generated = loadCards();
  var genWords = {};
  generated.forEach(function(c) { genWords[c.word.toLowerCase()] = true; });
  var presets = PRESETS.filter(function(c) { return !genWords[c.word.toLowerCase()]; });
  // generated first, then presets
  return { generated: generated, presets: presets, all: generated.concat(presets) };
}

// ========== 渲染 ==========
var methodNames = { compound:'复合词', root:'词根', homophone:'谐音' };

function esc(s) { var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

function fmtScene(raw) {
  return esc(raw).replace(/（([^）]+)）/g, '<span class="ck">（$1）</span>');
}

function renderCard(c, isGenerated) {
  var method = c.method || 'homophone';
  var label = methodNames[method] || '谐音';
  return '<details class="card' + (isGenerated ? ' fresh' : '') + '" open>' +
    '<summary>' +
      '<span class="w">（' + esc(c.word) + '）</span>' +
      '<span class="m">' + esc(c.meaning) + '</span>' +
      '<span class="tg tg-' + method + '">' + label + '</span>' +
      (isGenerated ? '<button class="del-btn" onclick="event.stopPropagation();deleteCard(\'' + esc(c.word) + '\')">删除</button>' : '') +
    '</summary>' +
    '<div class="body">' +
      '<div class="ph">' +
        '<span class="ph-h">' + esc(c.homophone) + '</span>' +
        '<span class="ph-i">' + esc(c.ipa) + '</span>' +
      '</div>' +
      '<div class="scene-box">' +
        '<div class="scene">' + fmtScene(c.scene) + '</div>' +
        '<div class="divider"></div>' +
        '<div class="anchor">' + esc(c.anchor) + '</div>' +
      '</div>' +
    '</div>' +
  '</details>';
}

var currentFilter = 'all';

function render() {
  var data = getAllCards();
  var all = data.all;

  // stats
  document.getElementById('totalNum').textContent = all.length;
  var methods = {};
  all.forEach(function(c) { methods[c.method] = true; });
  document.getElementById('methodNum').textContent = Object.keys(methods).length;
  document.getElementById('genNum').textContent = data.generated.length;

  // tabs
  var counts = { all: all.length, homophone: 0, root: 0, compound: 0 };
  all.forEach(function(c) { if (counts[c.method] !== undefined) counts[c.method]++; });
  var tabsHtml = '';
  [['all','全部'],['homophone','谐音'],['root','词根'],['compound','复合词']].forEach(function(t) {
    var active = currentFilter === t[0] ? ' active' : '';
    tabsHtml += '<div class="tab' + active + '" onclick="filterBy(\'' + t[0] + '\')">' + t[1] + '<span class="num">' + counts[t[0]] + '</span></div>';
  });
  document.getElementById('tabs').innerHTML = tabsHtml;

  // filter
  var filtered;
  if (currentFilter === 'all') {
    filtered = { generated: data.generated, presets: data.presets };
  } else {
    filtered = {
      generated: data.generated.filter(function(c) { return c.method === currentFilter; }),
      presets: data.presets.filter(function(c) { return c.method === currentFilter; })
    };
  }

  // cards
  var html = '';
  if (filtered.generated.length > 0) {
    html += '<div class="section-title">AI 生成</div>';
    filtered.generated.forEach(function(c) { html += renderCard(c, true); });
  }
  if (filtered.presets.length > 0) {
    html += '<div class="section-title">预置示例</div>';
    filtered.presets.forEach(function(c) { html += renderCard(c, false); });
  }
  if (filtered.generated.length === 0 && filtered.presets.length === 0) {
    html = '<div class="empty"><p>该分类下暂无卡片</p></div>';
  }
  document.getElementById('cardsWrap').innerHTML = html;
}

function filterBy(f) {
  currentFilter = f;
  render();
}

function deleteCard(word) {
  var cards = loadCards().filter(function(c) { return c.word !== word; });
  saveCards(cards);
  render();
}

// ========== 生成 ==========
function generate() {
  var input = document.getElementById('wordInput');
  var word = input.value.trim().toLowerCase();
  if (!word) return;

  // check duplicate
  var existing = getAllCards().all;
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].word.toLowerCase() === word) {
      showError('「' + word + '」已存在，请换一个单词');
      return;
    }
  }

  var btn = document.getElementById('genBtn');
  btn.disabled = true;
  showLoading(true, '正在为「' + word + '」生成记忆卡片...');
  hideError();

  fetch('/api/generate?word=' + encodeURIComponent(word))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) { showError(data.error); return; }
      var cards = loadCards();
      cards.unshift(data);
      saveCards(cards);
      render();
      input.value = '';
      input.focus();
      // scroll to top of new card
      window.scrollTo({ top: document.querySelector('.card.fresh').offsetTop - 100, behavior: 'smooth' });
    })
    .catch(function(e) { showError('生成失败: ' + e.message); })
    .finally(function() { btn.disabled = false; showLoading(false); });
}

function showLoading(show, text) {
  var el = document.getElementById('loading');
  if (show) { document.getElementById('loadingText').textContent = text || '生成中...'; el.classList.add('show'); }
  else { el.classList.remove('show'); }
}

function showError(msg) { var el = document.getElementById('errBox'); document.getElementById('errMsg').textContent = msg; el.classList.add('show'); }
function hideError() { document.getElementById('errBox').classList.remove('show'); }

// ========== init ==========
document.getElementById('wordInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') generate(); });
document.getElementById('genBtn').addEventListener('click', generate);
render();
</script>
</body>
</html>
'''


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        msg = fmt % args
        if '/api/' in msg:
            print(f'  [API] {msg}')

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path in ('/', ''):
            self._serve_html()
        elif parsed.path == '/api/generate':
            self._generate(parsed)
        else:
            self.send_response(404)
            self.end_headers()

    def _serve_html(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(HTML_PAGE.encode('utf-8'))

    def _generate(self, parsed):
        params = parse_qs(parsed.query)
        word = params.get('word', [''])[0].strip()
        if not word:
            self._json(400, {'error': '请输入单词'})
            return

        prompt = PROMPT_TEMPLATE % word
        print(f'  [生成] {word} ...')

        try:
            result = subprocess.run(
                ['claude', '-p', prompt],
                capture_output=True, text=True, timeout=120
            )
            raw = result.stdout.strip()
            # Strip markdown code blocks
            cleaned = re.sub(r'^```\w*\n?', '', raw)
            cleaned = re.sub(r'\n?```$', '', cleaned).strip()

            start = cleaned.find('{')
            end = cleaned.rfind('}')
            if start == -1 or end == -1:
                self._json(500, {'error': '生成格式异常，请重试'})
                return

            card = json.loads(cleaned[start:end + 1])

            required = ('word', 'meaning', 'homophone', 'ipa', 'method', 'scene', 'anchor')
            for key in required:
                if key not in card:
                    self._json(500, {'error': f'生成结果缺少字段: {key}'})
                    return

            if card['method'] not in ('compound', 'root', 'homophone'):
                card['method'] = 'homophone'

            print(f'  [完成] {word} -> {card["meaning"]}')
            self._json(200, card)

        except subprocess.TimeoutExpired:
            self._json(500, {'error': '生成超时（>120s），请重试'})
        except json.JSONDecodeError as e:
            self._json(500, {'error': f'JSON 解析失败: {e}'})
        except Exception as e:
            self._json(500, {'error': str(e)})

    def _json(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))


if __name__ == '__main__':
    server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
    url = f'http://localhost:{PORT}'
    print(f'\n  记忆宫殿单词卡')
    print(f'  ──────────────────')
    print(f'  地址: {url}')
    print(f'  按 Ctrl+C 停止\n')
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  已停止')
        server.server_close()
