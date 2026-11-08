const ids=['V','R','M','C','D','E','DR','O','I','W','F','K','T','B','A','G','S','P','L','H','U','EV','EL','SE'];
const results=[];
for (const id of ids){
 location.hash='#module/'+id;
 await new Promise(r=>setTimeout(r,100));
 const lessons=[...document.querySelectorAll('[data-teaching-lesson]')];
 const sourceLinks=[...document.querySelectorAll('.lesson-sources a')];
 const missingSections=lessons.filter(el=>!document.getElementById(el.dataset.teachingLesson)).map(el=>el.dataset.teachingLesson);
 results.push({id,title:document.querySelector('h1')?.textContent,lessons:lessons.length,missingSections,svgs:document.querySelectorAll('#page-root svg').length,sourceLinks:sourceLinks.length,overflow:document.documentElement.scrollWidth>innerWidth+2});
}
const navigation=[];
for(const hash of ['#home','#map','#tools','#sources']){ location.hash=hash; await new Promise(r=>setTimeout(r,100)); navigation.push({hash,title:document.querySelector('h1')?.textContent,text:document.querySelector('#page-root')?.textContent?.length}); }
location.hash='#search?q='+encodeURIComponent('Edge_DT');await new Promise(r=>setTimeout(r,200));const search={hash:location.hash,text:document.querySelector('#page-root')?.textContent?.slice(0,1500)};
location.hash='#module/G';await new Promise(r=>setTimeout(r,200));return {results,navigation,search};
