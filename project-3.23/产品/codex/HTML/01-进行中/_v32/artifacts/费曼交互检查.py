from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');P=R/'豆包汽车-业务学习站-v31-工作副本.html';O=R/'_shots/费曼学习版';O.mkdir(exist_ok=True)
s=P.read_text();d,_=json.JSONDecoder().raw_decode(s.split('const DATA=',1)[1]);errors=[];results=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/Users/bytedance/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')
 page=b.new_page(viewport={'width':1440,'height':1000});page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(P.as_uri()+'#module/V');page.wait_for_selector('[data-feynman-course]')
 for pg in d['pages']:
  page.evaluate('(h)=>location.hash=h','#module/'+pg['id']);page.wait_for_function('(id)=>document.querySelector("[data-feynman-course]")?.dataset.feynmanCourse===id',arg=pg['id'])
  x=page.evaluate('''()=>({id:document.querySelector('[data-feynman-course]').dataset.feynmanCourse,sections:document.querySelectorAll('.feynman-reading>section').length,questions:document.querySelectorAll('.feynman-variations article').length,hiddenReferences:!document.querySelector('#version-details').open,overflow:document.documentElement.scrollWidth>innerWidth+2,svgs:document.querySelectorAll('#page-root svg').length})''');results.append(x)
 page.evaluate("location.hash='#module/V'");page.wait_for_function("document.querySelector('[data-feynman-course]')?.dataset.feynmanCourse==='V'");page.screenshot(path=str(O/'V章开篇.png'))
 page.locator('[data-feynman-toggle]').click();assert page.locator('.feynman-reading').is_hidden();page.locator('[data-feynman-note]').fill('先有过程文字，再用停顿触发准备；准备不执行。');page.locator('.feynman-answer summary').first.click();page.screenshot(path=str(O/'V章复述.png'));page.reload();page.wait_for_selector('[data-feynman-note]');assert page.locator('[data-feynman-note]').input_value().startswith('先有过程文字')
 page.locator('[data-feynman-note]').fill('')
 page.evaluate("location.hash='#module/V/section/V-L3'");page.wait_for_function("document.querySelector('#version-details').open");assert page.locator('#V-L3').is_visible()
 page.evaluate("location.hash='#search?q='+encodeURIComponent('因果讲解')");page.wait_for_selector('.search-result');search_count=page.locator('.search-result').count()
 page.set_viewport_size({'width':390,'height':844});page.evaluate("location.hash='#module/K'");page.wait_for_function("document.querySelector('[data-feynman-course]')?.dataset.feynmanCourse==='K'");page.screenshot(path=str(O/'K章移动.png'));assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
 b.close()
report={'pages':results,'pageErrors':errors,'recallToggle':True,'localNotePersistence':True,'legacyDeepLink':True,'searchResultsShown':search_count,'mobileOverflow':False,'note':'测试数据已从新浏览器上下文清除，未使用用户浏览器存储。'}
(O/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));assert not errors and all(not x['overflow'] and x['sections']>0 and x['questions']>=2 for x in results);print(json.dumps(report,ensure_ascii=False))
