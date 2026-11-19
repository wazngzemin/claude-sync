import { buildCosmos } from './scene.js';

const $=id=>document.getElementById(id);
const canvas=$('cosmos'), root=$('experience');
const ruler=$('timeline'), play=$('playback'), sound=$('sound'), focus=$('focus');
const stages=[
  {name:'余烬', no:'I', caption:'最后一颗恒星正在熄灭。'},
  {name:'潮汐', no:'II', caption:'引力正在把光拉回它的起点。'},
  {name:'崩解', no:'III', caption:'维持秩序的轨道，一条条断开。'},
  {name:'静默', no:'IV', caption:'最后一秒过去了。余光仍在。'}
];
const epochs=[...document.querySelectorAll('[data-time]')];
let cosmos, timer, value=240, current=-1, playing=false, playbackStart=0, playbackFrom=0, run=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const duration=15000;
const tminus=$('time').firstChild;
function status(text){
  $('toast').textContent=text;
  $('toast').classList.add('visible');
  clearTimeout(timer);
  timer=setTimeout(()=>$('toast').classList.remove('visible'),2200);
}
function setTime(n){
  value=Math.max(0,Math.min(1000,Math.round(n)));
  ruler.value=value;
  $('fill').style.width=value*.1+'%';
  const seconds=((1000-value)/1000).toFixed(3);
  tminus.nodeValue='0'+seconds;
  const i=value<315?0:value<580?1:value<880?2:3;
  if(i!==current){
    current=i;
    const stage=stages[i];
    $('chapter-no').textContent=stage.no+' / IV';
    $('chapter-name').textContent=stage.name;
    $('chapter-caption').textContent=stage.caption;
    for(const [index,b] of epochs.entries())index===i?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current');
    $('live').classList.toggle('silent',i===3);
    $('live').lastElementChild.textContent=i===3?'信号趋于静默':'正在接收信号';
  }
  ruler.setAttribute('aria-valuetext',stages[i].name+'，剩余 '+seconds+' 秒');
  cosmos?.setEra(value/1000);
  audio.update(value/1000);
}
function playState(active){
  if(!cosmos)return;
  playing=active;
  play.setAttribute('aria-pressed',String(active));
  play.setAttribute('aria-label',active?'暂停时间':'播放最后一秒');
  play.querySelector('use').setAttribute('href',active?'#pause':'#play');
  cancelAnimationFrame(run);
  if(!active)return;
  if(value===1000)setTime(0);
  playbackStart=performance.now();playbackFrom=value;
  const step=(stamp)=>{
    if(!playing)return;
    setTime(playbackFrom+(stamp-playbackStart)/duration*1000);
    if(value>=1000)playState(false);
    else run=requestAnimationFrame(step);
  };
  run=requestAnimationFrame(step);
}
function scrub(n){playState(false);setTime(n);}
function setFocus(immersive){
  root.classList.toggle('immersive',immersive);
  focus.setAttribute('aria-pressed',String(immersive));
  focus.setAttribute('aria-label',immersive?'退出沉浸模式':'进入沉浸模式');
  cosmos?.setFocus(immersive);
  if(immersive)status('沉浸模式 · Esc 返回');
}

const audio=(()=>{
  let context, bus, filter, humming=[], enabled=false;
  function setup(){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)throw new Error('Web Audio unavailable');
    context=new AC();
    bus=context.createGain();bus.gain.value=0;bus.connect(context.destination);
    filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=210;filter.Q.value=.56;filter.connect(bus);
    const freqs=[45,67.5,90.08,135.12,180.22];
    humming=freqs.map((frequency,i)=>{
      const osc=context.createOscillator(), amp=context.createGain();
      osc.type=i<2?'sine':'triangle';osc.frequency.value=frequency;
      amp.gain.value=[.12,.064,.026,.013,.010][i];
      osc.connect(amp).connect(filter);
      const lfo=context.createOscillator(), lfoGain=context.createGain();
      lfo.frequency.value=.073+i*.019;
      lfoGain.gain.value=amp.gain.value*.31;
      lfo.connect(lfoGain).connect(amp.gain);lfo.start();osc.start();
      return {osc,frequency};
    });
  }
  return {
    async toggle(){
      if(!context)setup();
      await context.resume();
      enabled=!enabled;
      bus.gain.setTargetAtTime(enabled?.42:0,context.currentTime,.22);
      return enabled;
    },
    update(v){
      if(!context||!enabled)return;
      const at=context.currentTime;
      filter.frequency.setTargetAtTime(180+360*Math.exp(-((v-.54)**2)*28),at,.25);
      for(const {osc,frequency} of humming)osc.frequency.setTargetAtTime(frequency*(1-v*.10),at,.35);
      const volume=v>.82?.42*(1-(v-.82)/.18*.91):.42;
      bus.gain.setTargetAtTime(volume,at,.22);
    },
    echo(v){
      if(!enabled||!context)return;
      const at=context.currentTime;
      for(let i=0;i<4;i++){
        const o=context.createOscillator(), g=context.createGain();
        const freq=(i===0?147:i===1?220:i===2?330:494)*(1+v*.11);
        o.frequency.setValueAtTime(freq*1.016,at);
        o.frequency.exponentialRampToValueAtTime(freq,at+.35);
        g.gain.setValueAtTime(.0001,at);
        g.gain.exponentialRampToValueAtTime(.12/(1+i*1.2),at+.028+i*.012);
        g.gain.exponentialRampToValueAtTime(.0001,at+1.7+i*.18);
        o.connect(g).connect(bus);o.start();o.stop(at+2.55);
        o.onended=()=>{o.disconnect();g.disconnect();};
      }
    }
  };
})();
async function toggleSound(){
  sound.disabled=true;
  try{
    const active=await audio.toggle();
    sound.setAttribute('aria-pressed',String(active));
    sound.setAttribute('aria-label',active?'关闭声音':'开启声音');
    sound.title=active?'关闭声音 (M)':'开启声音 (M)';
    if(active)audio.update(value/1000);
    status(active?'已接通空间声场':'声音已关闭');
  }catch{
    status('此浏览器未能启动声音');
  }finally{sound.disabled=false;}
}

try{
  cosmos=buildCosmos(canvas);
  canvas.dataset.ready='true';
  cosmos.onEcho(()=>{
    audio.echo(value/1000);
    status(value>=880?'静默中，一道回声仍然传开。':'回声已发出');
  });
}catch(err){
  console.error(err);
  $('fallback').hidden=false;
  $('live').lastElementChild.textContent='信号中断';
  [ruler,play,$('reset-view'),focus,sound,...epochs].forEach(el=>el.disabled=true);
}
canvas.addEventListener('webglcontextlost',e=>{
  e.preventDefault();playState(false);cosmos?.stop();
  canvas.dataset.ready='false';$('fallback').hidden=false;
  $('live').lastElementChild.textContent='信号中断';
  [ruler,play,$('reset-view'),focus,...epochs].forEach(el=>el.disabled=true);
});
$('retry').addEventListener('click',()=>location.reload());
if(matchMedia('(pointer: coarse)').matches)document.querySelector('.mouse-help').textContent='拖动环绕 · 双指缩放';
ruler.addEventListener('input',()=>scrub(Number(ruler.value)));
epochs.forEach(button=>button.addEventListener('click',()=>scrub(Number(button.dataset.time))));
play.addEventListener('click',()=>playState(!playing));
focus.addEventListener('click',()=>setFocus(!root.classList.contains('immersive')));
sound.addEventListener('click',toggleSound);
$('reset-view').addEventListener('click',()=>{cosmos?.reset();status('视角已复位');});
window.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.repeat||e.metaKey||e.ctrlKey||e.altKey||!cosmos)return;
  if(e.key==='Escape'){if(root.classList.contains('immersive'))setFocus(false);return;}
  if(e.key.toLowerCase()==='f'){setFocus(!root.classList.contains('immersive'));return;}
  if(e.key.toLowerCase()==='m'){if(!sound.disabled)toggleSound();return;}
  if(e.key.toLowerCase()==='r'){cosmos.reset();status('视角已复位');return;}
  if(e.code==='Space'&&!/^(INPUT|BUTTON)$/.test(e.target.tagName)){e.preventDefault();playState(!playing);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)playState(false);});
setTime(value);

// Local QA hook is omitted in the hosted experience.
if(cosmos&&['localhost','127.0.0.1'].includes(location.hostname))Object.defineProperty(window,'observatory',{value:{
  snapshot:()=>({...cosmos.getView(),value,playing,chapter:stages[current].name,immersive:root.classList.contains('immersive'),sound:sound.getAttribute('aria-pressed')==='true'})
}});
