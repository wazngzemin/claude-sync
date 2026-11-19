import * as T from './vendor/three.module.js';
import { EffectComposer } from './vendor/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/postprocessing/OutputPass.js';

const TAU = Math.PI * 2;
const mix = T.MathUtils.lerp;
const clamp = T.MathUtils.clamp;
const smooth = (a,b,x) => T.MathUtils.smoothstep(x,a,b);
function seeded(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let z = Math.imul(seed ^ seed >>> 15, 1 | seed);
    z = z + Math.imul(z ^ z >>> 7, 61 | z) ^ z;
    return ((z ^ z >>> 14) >>> 0) / 4294967296;
  };
}
const noise = `
float hash(vec3 p) { p=fract(p*.3183099+.173);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p){
  vec3 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+1.),f.x),f.y),f.z);
}
float fbm(vec3 p){float v=0.,a=.53;for(int i=0;i<5;i++){v+=a*noise3(p);p=mat3(0.,.8,.6,-.8,.36,-.48,-.6,-.48,.64)*p*2.08+9.1;a*=.48;}return v;}
`;
const flat = `
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
const skyShader = `
uniform float uTime,uEra,uAspect;
uniform vec2 uView;
varying vec2 vUv;
${noise}
void main(){
  vec2 uv=vUv;
  vec2 p=(uv-.5)*vec2(uAspect,1.);
  vec2 s=p-vec2(.12,.035)+uView*.043;
  float cold=smoothstep(.67,1.,uEra);
  vec2 v=mat2(.89,.46,-.46,.89)*s;
  float lane=exp(-abs(v.y+.045)*7.)*exp(-abs(v.x)*1.08);
  vec3 k=vec3(v*4.5,1.7);
  float bend=fbm(k+vec3(4.6,0,0));
  float n=fbm(k+vec3(bend*2.7,bend*2.4,0.));
  float fine=fbm(vec3(v*vec2(12.,20.)+n*.65,3.4));
  float gas=lane*pow(max(0.,n-.22)*1.65,2.8);
  float clouds=gas*(.28+fine*1.65);
  vec3 dim=vec3(.0035,.0028,.0060)+vec3(.007,.006,.010)*exp(-length(s)*2.);
  vec3 red=mix(vec3(.29,.057,.037),vec3(.036,.077,.22),cold);
  vec3 violet=mix(vec3(.077,.020,.066),vec3(.034,.037,.11),cold);
  vec3 rgb=dim+red*clouds*.84+violet*gas*2.8;
  rgb+=vec3(.17,.053,.012)*pow(max(0.,fine-.46),1.5)*lane*(1.-cold)*.8;
  float vignette=(1.-smoothstep(.28,1.24,length(p*vec2(.63,1.1))));
  rgb*=.47+.53*vignette;
  float grain=hash(vec3(gl_FragCoord.xy,1.3));
  gl_FragColor=vec4(max(vec3(0.),rgb+(grain-.5)*.0015),1.);
}
`;
const orbShader = `
varying vec3 vLocal,vWorld,vN;
uniform float uTime,uEra,uPulse;
${noise}
void main(){
  vec3 n=normalize(vLocal);
  vec3 view=normalize(cameraPosition-vWorld);
  float nd=max(0.,dot(normalize(vN),view));
  float fres=pow(1.-nd,3.8);
  float cold=smoothstep(.66,1.,uEra);
  float tide=exp(-pow(abs((uEra-.48)*5.),2.));
  vec3 p=n*3.7+vec3(uTime*.028,.1,-.6);
  float sw=fbm(p);
  float q=fbm(p*2.2+sw*2.1);
  float veins=pow(1.-abs(sin(22.*q+sw*7.+n.y*2.)),18.);
  float grain=noise3(n*178.);
  float coast=smoothstep(.39,.72,sw)*smoothstep(.44,.77,noise3(p*3.1+2.));
  float belt=exp(-abs(n.y+n.x*.24+sin(n.z*4.)*.07)*4.8);
  float rimLight=.25+.75*pow(.5+.5*dot(n,normalize(vec3(.4,-.48,1.))),2.);
  vec3 metal=mix(vec3(.021,.009,.012),vec3(.008,.016,.037),cold);
  vec3 hot=mix(vec3(1.15,.23,.063),vec3(.15,.43,1.3),cold);
  vec3 edge=mix(vec3(2.8,.91,.36),vec3(.45,1.09,2.55),cold);
  vec3 c=metal*(.25+q*1.65+grain*.25) + hot*veins*coast*(.065+belt*.38+tide*.28);
  c+=hot*fres*rimLight*(.38+belt*.65)*(1.-cold*.65);
  c+=edge*pow(1.-nd,16.)*(.27+belt*.65+uPulse*.68);
  c*=1.-cold*.65;
  gl_FragColor=vec4(c,1.);
}
`;
const diskShader = `
varying vec2 vUv;
uniform float uTime,uEra,uPulse;
${noise}
void main(){
  vec2 p=(vUv-.5)*2.;
  float r=length(p); if(r<.29 || r>1.) discard;
  float a=atan(p.y,p.x+1e-6);
  float cold=smoothstep(.73,1.,uEra);
  float tide=exp(-pow(abs((uEra-.46)*5.),2.));
  float rupture=smoothstep(.52,.73,uEra)*(1.-smoothstep(.85,1.,uEra));
  float base=fbm(vec3(p*5.0,0.5+uTime*.036));
  float angle=a+sin(r*12.)*.095+base*.35;
  vec2 spun=vec2(cos(angle+uTime*.046+r*3.5),sin(angle+uTime*.046+r*3.5));
  float g=fbm(vec3(spun*(2.5+r*4.),r*22.));
  float f=fbm(vec3(spun*9.5,r*46.));
  float streak=pow(.5+.5*sin(r*135.+g*4.4),3.);
  float filament=pow(max(0.,f-.21)*1.45,2.6);
  float cut=smoothstep(.313,.347,r+base*.022)*exp(-(r-.32)*4.6)*(1.-smoothstep(.84,.996,r));
  float gaps=mix(1.,smoothstep(-.75,.45,sin(a*5.+r*14.+base*3.)),rupture*.86);
  float jaw=.27+.73*pow(.5+.5*cos(a+1.95),1.7);
  vec3 orange=mix(vec3(1.7,.28,.045),vec3(.11,.37,1.45),cold);
  vec3 cream=mix(vec3(3.7,1.5,.53),vec3(.35,.95,2.55),cold);
  float thick=filament*(.28+.72*streak)+g*g*.26;
  float inner=exp(-pow(abs((r-.344-base*.01)*100.),2.))*.38;
  float light=(thick*2.8+inner)*cut*gaps*jaw*(1.+tide*.65+uPulse*.86);
  vec3 color=mix(orange,cream,clamp(streak*.24+inner+filament*.53,0.,1.))*light;
  color+=vec3(.32,.037,.064)*cut*pow(g,2.)*gaps*(1.-cold)*.55;
  if(!(color.r>=0. && color.r<50. && color.g>=0. && color.g<50. && color.b>=0. && color.b<50.)) discard;
  gl_FragColor=vec4(color*(1.-cold*.94),1.);
}
`;
const auraShader = `
uniform float uEra,uPulse;
varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float c=smoothstep(.66,1.,uEra);
  float halo=exp(-r*6.5)*.85+exp(-pow(abs((r-.385)*14.),2.))*.075;
  float faint=exp(-r*3.5)*.055;
  vec3 color=mix(vec3(1.6,.25,.077),vec3(.16,.40,1.3),c);
  gl_FragColor=vec4(color*(halo+faint)*(1.-smoothstep(.62,1.,r))*(1.+uPulse)*mix(1.,.37,c),1.);
}
`;

export function buildCosmos(canvas) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng=seeded(50319);
  const renderer=new T.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'});
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.06;
  renderer.outputColorSpace=T.SRGBColorSpace;
  const scene=new T.Scene();
  scene.background=new T.Color(0x0c0a10);
  const camera=new T.PerspectiveCamera(43,1,.07,190);
  const composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new T.Vector2(1,1),.77,.73,.59);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const time={value:0}, era={value:.24}, pulse={value:0}, view={value:new T.Vector2()}, aspect={value:1};
  const uniforms={uTime:time,uEra:era,uPulse:pulse};
  const sky=new T.Mesh(new T.PlaneGeometry(2,2),new T.ShaderMaterial({
    uniforms:{...uniforms,uView:view,uAspect:aspect},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}',
    fragmentShader:skyShader, depthWrite:false, depthTest:false
  }));
  sky.frustumCulled=false;
  sky.renderOrder=-1000;
  scene.add(sky);

  const relic=new T.Group();
  scene.add(relic);
  const aura=new T.Mesh(new T.PlaneGeometry(10.4,10.4),new T.ShaderMaterial({
    uniforms, vertexShader:flat,fragmentShader:auraShader, transparent:true,depthWrite:false,depthTest:true,blending:T.AdditiveBlending
  }));
  aura.renderOrder=-90;
  scene.add(aura);

  const core=new T.Mesh(new T.SphereGeometry(1.69,112,80),new T.ShaderMaterial({
    uniforms,
    vertexShader:`varying vec3 vLocal,vWorld,vN;void main(){vLocal=position;vWorld=(modelMatrix*vec4(position,1.)).xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`,
    fragmentShader:orbShader
  }));
  relic.add(core);

  const diskRig=new T.Group();
  diskRig.rotation.set(1.16,0,.23,'ZYX');
  relic.add(diskRig);
  const disk=new T.Mesh(new T.PlaneGeometry(12,12),new T.ShaderMaterial({
    uniforms,vertexShader:flat,fragmentShader:diskShader,side:T.DoubleSide,
    transparent:true,depthWrite:false,blending:T.AdditiveBlending
  }));
  diskRig.add(disk);

  function ringGeometry(r, a=0, b=TAU, count=180, oval=1, z=0){
    const p=new Float32Array((count+1)*3);
    for(let i=0;i<=count;i++){const f=mix(a,b,i/count);p[i*3]=Math.cos(f)*r;p[i*3+1]=Math.sin(f)*r*oval;p[i*3+2]=z;}
    return new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(p,3));
  }
  function wire(color,opacity){
    return new T.LineBasicMaterial({color,opacity,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
  }
  function arc(parent,r,material,start=0,end=TAU,n=200,oval=1,z=0) {
    const line=new T.Line(ringGeometry(r,start,end,n,oval,z),material);
    parent.add(line);return line;
  }
  function metalRing(radius,a,b,width,group,color) {
    const curve=new T.Curve();
    curve.getPoint=(v,target=new T.Vector3())=>{
      const t=mix(a,b,v);
      return target.set(Math.cos(t)*radius,Math.sin(t)*radius,.018*Math.sin(t*5.));
    };
    const mat=new T.MeshStandardMaterial({color,roughness:.34,metalness:.52,emissive:color,emissiveIntensity:.22});
    const obj=new T.Mesh(new T.TubeGeometry(curve,Math.ceil((b-a)*28),width,5,false),mat);
    group.add(obj);
    return obj;
  }
  const ambient=new T.HemisphereLight(0xffbc8f,0x322e53,2.0);
  scene.add(ambient);
  const key=new T.PointLight(0xff9e64,35,18,1.7);
  key.position.set(1.7,-3.2,4.1);
  scene.add(key);

  const cage=new T.Group();
  cage.rotation.set(-.28,.28,-.11);
  relic.add(cage);
  const warm=new T.Color('#e9ad7b'), cold=new T.Color('#84a8df');
  const fine=wire(warm,.30), ghost=wire('#b87e64',.18), stroke=wire('#ffc294',.67);
  const cageRings=[], ringSegments=[];
  for(let j=0;j<4;j++){
    const band=new T.Group();
    band.rotation.set([0,.05,-.13,.16][j],[0,.08,-.24,.29][j],j*.21);
    cage.add(band);
    const r=[4.55,4.95,5.39,5.63][j];
    for(let part=0;part<6;part++){
      const begin=part*TAU/6+j*.07, end=begin+TAU/6-.018;
      const a=arc(band,r,j===1?fine:ghost,begin,end,44);
      const b=j<3?arc(band,r+.055,ghost,begin,end,44):null;
      ringSegments.push({a,b,begin,end,j,part});
    }
    const divisions=[120,96,72,36][j];
    const vertices=[];
    for(let i=0;i<divisions;i++){
      const a=i/divisions*TAU;
      const L=i%12===0?.21:i%4===0?.115:.05;
      const x=Math.cos(a),y=Math.sin(a);
      vertices.push(x*(r-L),y*(r-L),0,x*r,y*r,0);
    }
    band.add(new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(vertices,3)),j===0?fine:ghost));
    for(let k=0;k<7;k++){
      const a=k*TAU/7+j*.65+rng()*.25, b=a+.06+rng()*.32;
      arc(band,r+.073,k%3===0?stroke:fine,a,b,24);
      if(j<3&&k%2===0)metalRing(r-.034,a,b,.018+j*.003,band,'#ad7955');
    }
    cageRings.push(band);
  }
  const armillary=[];
  for(const [i,x,y,z,r] of [[0,.86,.63,.72,4.48],[1,-.94,-.3,-.55,4.37],[2,1.23,.19,.09,5.2],[3,-1.24,.31,1.42,4.87]]) {
    const g=new T.Group(); g.rotation.set(x,y,z,'ZYX');relic.add(g);
    arc(g,r,ghost,0,TAU,270);
    arc(g,r+.042,fine,.58,2.49,115);
    arc(g,r-.015,stroke,3.63+i*.26,4.04+i*.26,32);
    metalRing(r,1.84+i*.18,2.09+i*.22,.019,g,'#b38365');
    armillary.push(g);
  }
  for(let i=0;i<5;i++){
    const g=arc(diskRig,2.15+i*.45,i%2===0?fine:ghost,.45+i*.69,3.68+i*.73,132);
    g.rotation.z=i*.32;
  }

  function clockFace() {
    const c=document.createElement('canvas');c.width=1024;c.height=1024;
    const g=c.getContext('2d');
    g.translate(512,512);
    g.strokeStyle='#c38f68';g.lineWidth=1;
    g.fillStyle='#f5c29a';g.textAlign='center';g.textBaseline='middle';
    g.font='20px Georgia';
    const numeral=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
    for(let i=0;i<12;i++){
      const a=i/12*TAU;
      const x=Math.sin(a), y=-Math.cos(a);
      g.globalAlpha=i%3===0?.84:.54;
      g.fillText(numeral[i],x*453,y*453);
      g.beginPath();g.moveTo(x*406,y*406);g.lineTo(x*424,y*424);g.stroke();
      g.save();g.translate(x*425,y*425);g.rotate(a);g.strokeRect(-2,-2,4,4);g.restore();
    }
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
    const face=new T.Mesh(new T.PlaneGeometry(10.58,10.58),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.86,side:T.DoubleSide}));
    face.position.z=.04;
    cageRings[0].add(face);
    return face;
  }
  const face=clockFace();

  const handRig=new T.Group();
  handRig.position.z=1.7;
  relic.add(handRig);
  const handMat=new T.MeshBasicMaterial({color:new T.Color(2.6,.99,.40),transparent:true,opacity:.75,depthWrite:false});
  const handShape=new T.Shape().moveTo(-.025,-.39).lineTo(-.018,2.99).lineTo(-.08,3.23).lineTo(0,3.57).lineTo(.08,3.23).lineTo(.018,2.99).lineTo(.025,-.39).closePath();
  handRig.add(new T.Mesh(new T.ShapeGeometry(handShape),handMat));
  const needle=new T.Mesh(new T.CircleGeometry(.043,16),handMat);
  needle.position.y=3.71;handRig.add(needle);

  const pointsVertex=`
uniform float uTime,uEra,uPulse,uPixel,uMode;
attribute vec4 seed;
varying vec3 vColor;
varying float vOpacity,vFlare;
void main(){
  vec3 p=position;
  float collapse=smoothstep(.72,1.,uEra);
  float tide=exp(-pow(abs((uEra-.48)*4.7),2.));
  float scatter=smoothstep(.48,.73,uEra)*(1.-smoothstep(.78,1.,uEra));
  if(uMode>.5){
    float angle=seed.x+uTime*(.05+seed.z*.14)/(1.+p.x*.13)+uEra*(3.0+seed.z);
    float rad=p.x*(1.+scatter*(.16+seed.y*.66))*(1.-collapse*.94);
    rad+=uPulse*(.25+seed.y*.65);
    p=vec3(cos(angle)*rad,sin(angle)*rad,p.z*(1.+scatter*2.)*(1.-collapse*.73)+sin(angle*2.+seed.y*15.)*.2*tide);
  }
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  float star=step(.963,seed.z);
  float twinkle=.75+.25*sin(seed.y*51.+uTime*(.41+seed.z*.84));
  float sz=uMode>.5?(1.9+4.8*pow(seed.z,5.))/(.32+max(1.,-mv.z)*.070):(1.15+6.*pow(seed.z,10.));
  gl_PointSize=clamp(sz*uPixel,1.,13.);
  vec3 amber=mix(vec3(.48,.12,.077),vec3(1.98,.85,.38),seed.y);
  vec3 ice=mix(vec3(.16,.28,.60),vec3(.73,1.21,2.3),seed.y);
  vColor=mix(amber,ice,max(smoothstep(.64,1.,uEra),step(.78,seed.y)*.61));
  if(uMode<.5)vColor=mix(vColor,vec3(.70,.68,.82),.42);
  vOpacity=twinkle*(.27+.73*seed.w)*(uMode>.5?mix(1.,.14,collapse):1.);
  vFlare=star;
}
`;
  const pointsFragment=`
varying vec3 vColor;varying float vOpacity,vFlare;
void main(){
  vec2 p=gl_PointCoord-.5;
  float d=length(p);
  float s=exp(-d*d*34.)*(1.-smoothstep(.25,.51,d));
  float arms=(exp(-abs(p.x)*34.)+exp(-abs(p.y)*34.))*(1.-smoothstep(.1,.49,d));
  gl_FragColor=vec4(vColor*(s+arms*vFlare*.23)*vOpacity,1.);
}
`;
  const pixel={value:1};
  function points(count,mode){
    const positions=new Float32Array(count*3), seeds=new Float32Array(count*4);
    for(let i=0;i<count;i++){
      const a=rng()*TAU,b=rng(),c=rng(),d=rng(), off=i*3;
      if(mode){
        const r=2.01+Math.pow(rng(),1.71)*4.75;
        const h=(rng()-.5)*(.13+(r-2)*.29)*(rng()<.90?1:4.);
        positions.set([r,0,h],off);
      }else{
        const dist=28+67*rng(), z=2*rng()-1., m=Math.sqrt(1-z*z);
        positions.set([Math.cos(a)*m*dist,Math.sin(a)*m*dist,z*dist],off);
      }
      seeds.set([a,b,c,d],i*4);
    }
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.BufferAttribute(positions,3));
    geometry.setAttribute('seed',new T.BufferAttribute(seeds,4));
    const obj=new T.Points(geometry,new T.ShaderMaterial({
      uniforms:{...uniforms,uPixel:pixel,uMode:{value:mode}},vertexShader:pointsVertex,fragmentShader:pointsFragment,
      transparent:true,depthWrite:false,blending:T.AdditiveBlending
    }));
    obj.frustumCulled=false;return obj;
  }
  const stars=points(9500,0);
  stars.renderOrder=-70;
  scene.add(stars);
  diskRig.add(points(9600,1));
  const dust=points(2500,1);
  dust.rotation.set(.74,.88,.37);
  relic.add(dust);

  const fragments=Array.from({length:125},()=>({
    a:rng()*TAU,r:2.34+rng()*4.4,z:(rng()-.5)*3.9,q:rng(),
    s:.012+Math.pow(rng(),3.)*.12, w:rng()*TAU
  }));
  const shard=new T.InstancedMesh(new T.DodecahedronGeometry(1,0),new T.MeshStandardMaterial({
    color:0x795347,roughness:.48,metalness:.48,emissive:0x69311b,emissiveIntensity:.42,flatShading:true
  }),fragments.length);
  shard.frustumCulled=false;
  diskRig.add(shard);
  const dummy=new T.Object3D();

  const waves=[];
  for(let i=0;i<3;i++){
    const g=new T.Group();scene.add(g);
    const m=wire('#ffd5aa',.0);
    arc(g,1,m,0,TAU,150);
    const second=wire('#d29df9',.0);
    arc(g,1.023,second,0,TAU,150);
    g.visible=false;
    waves.push({g,m,second,t:-10});
  }
  const silence=new T.Group();
  scene.add(silence);
  const seedLight=new T.Mesh(new T.SphereGeometry(.045,24,16),new T.MeshBasicMaterial({color:new T.Color(1.5,3.3,8)}));
  silence.add(seedLight);
  const seedGlow=new T.Mesh(new T.PlaneGeometry(3,3),new T.ShaderMaterial({
    uniforms,vertexShader:flat,fragmentShader:`varying vec2 vUv;uniform float uPulse;
    void main(){vec2 p=abs(vUv-.5);float r=length(p);float flare=exp(-r*40.)+exp(-r*15.)*.21;
    flare+=(exp(-p.x*340.)*exp(-p.y*31.)+exp(-p.y*290.)*exp(-p.x*20.))*.17;
    gl_FragColor=vec4(vec3(.37,.64,1.35)*flare*(1.+uPulse*.8)*(1.-smoothstep(.26,.5,r)),1.);}`,
    transparent:true,depthWrite:false,blending:T.AdditiveBlending
  }));
  silence.add(seedGlow);
  const seedRing=wire('#a9caff',.3);
  arc(silence,.36,seedRing,0,TAU,100);

  let width=1,height=1, mobile=false, cx=.64,cy=.44, renderRatio=1;
  let goalEra=.24, last=performance.now(), elapsed=0, yaw=.045,pitch=.06,distance=16.8;
  let toYaw=yaw,toPitch=pitch,toDistance=distance, focus=false, pointerDown=null, pinch=0;
  const restDistance=()=>mobile?clamp(height/width*12.3,19.5,32):16.8;
  let waveIndex=0, pulseAt=-10, tick=0, stopped=false;
  let projectionX=0,projectionY=0,projectedRadius=0;
  const pointers=new Map(), projected=new T.Vector3(), edge=new T.Vector3();
  const mark=document.querySelector('#core-mark'), note=document.querySelector('#annotation');
  function resize(){
    width=canvas.clientWidth;height=canvas.clientHeight;
    if(!width||!height)return;
    const wasMobile=mobile;
    mobile=width<=600;
    if(wasMobile!==mobile)toDistance=restDistance();
    renderRatio=Math.min(devicePixelRatio||1,mobile?1.35:1.55,Math.sqrt(2900000/(width*height)));
    pixel.value=renderRatio;
    aspect.value=width/height;
    renderer.setPixelRatio(renderRatio);
    renderer.setSize(width,height,false);
    composer.setPixelRatio(renderRatio);
    composer.setSize(width,height);
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize);
  function reset(){
    toYaw=.045;toPitch=.06;toDistance=restDistance();
  }
  reset();
  if(mobile) distance=toDistance;
  function pointerOnCore(x,y){
    const r=canvas.getBoundingClientRect();
    return Math.hypot(x-r.left-projectionX,y-r.top-projectionY)<Math.max(30,projectedRadius*1.19);
  }
  function fire(){
    const w=waves[waveIndex++%waves.length];
    w.t=elapsed;pulseAt=elapsed;
    w.g.quaternion.copy(camera.quaternion);
    w.g.rotateZ(rng()*.5);
  }
  let onEcho=()=>{};
  function echo(){fire();onEcho();}
  canvas.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    pointerDown=pointers.size===1?{x:e.clientX,y:e.clientY,moved:false}:null;
    if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);}
    canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove',e=>{
    const prev=pointers.get(e.pointerId);
    if(!prev){canvas.classList.toggle('over-core',pointerOnCore(e.clientX,e.clientY));return;}
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size>=2){
      const [a,b]=[...pointers.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d>0&&pinch>0)toDistance=clamp(toDistance*pinch/d,7.3,34);
      pinch=d;return;
    }
    if(pointerDown&&!pointerDown.moved&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>5)pointerDown.moved=true;
    if(pointerDown&&!pointerDown.moved)return;
    toYaw-=(e.clientX-prev.x)*.006;
    toPitch=clamp(toPitch+(e.clientY-prev.y)*.0056,-1.26,1.26);
  });
  function finish(e){
    if(!pointers.has(e.pointerId))return;
    if(e.type==='pointerup'&&pointers.size===1&&pointerDown&&!pointerDown.moved&&pointerOnCore(e.clientX,e.clientY))echo();
    pointers.delete(e.pointerId);pointerDown=null;
    if(!pointers.size)canvas.classList.remove('dragging');
  }
  canvas.addEventListener('pointerup',finish);
  canvas.addEventListener('pointercancel',finish);
  canvas.addEventListener('lostpointercapture',finish);
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();toDistance=clamp(toDistance*Math.exp(e.deltaY*(e.deltaMode===1?.016:.00115)),7.3,34);
  },{passive:false});
  canvas.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')toYaw+=.22;
    else if(e.key==='ArrowRight')toYaw-=.22;
    else if(e.key==='ArrowUp')toPitch=clamp(toPitch-.16,-1.26,1.26);
    else if(e.key==='ArrowDown')toPitch=clamp(toPitch+.16,-1.26,1.26);
    else if(e.key==='+'||e.key==='=')toDistance=clamp(toDistance*.88,7.3,34);
    else if(e.key==='-')toDistance=clamp(toDistance*1.13,7.3,34);
    else if(e.key==='Enter')echo();
    else return;
    e.preventDefault();
  });

  function draw(stamp){
    if(stopped)return;
    const dt=Math.min(.05,(stamp-last)*.001);
    last=stamp;elapsed+=Math.max(dt,0);
    const alpha=1-Math.exp(-dt*(reduced?50:9.2));
    yaw=mix(yaw,toYaw,alpha);pitch=mix(pitch,toPitch,alpha);distance=mix(distance,toDistance,alpha);
    const targetX=focus?.5:mobile?.5:width<850?.64:.638;
    const targetY=focus?.5:mobile?.515:.445;
    cx=mix(cx,targetX,alpha);cy=mix(cy,targetY,alpha);
    camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);
    camera.lookAt(0,0,0);
    camera.setViewOffset(width,height,(.5-cx)*width,(.5-cy)*height,width,height);
    camera.updateMatrixWorld();
    view.value.set(Math.sin(yaw),pitch);
    aura.quaternion.copy(camera.quaternion);
    aura.position.copy(camera.position).normalize().multiplyScalar(-2.3);
    silence.quaternion.copy(camera.quaternion);
    time.value=reduced?0:elapsed;
    era.value=mix(era.value,goalEra,alpha);
    const v=era.value;
    const pe=elapsed-pulseAt;
    pulse.value=pe<1.8 ? Math.exp(-pe*3.2)*(reduced?.45:1) : 0;
    const cooling=smooth(.62,1.,v);
    const collapse=smooth(.75,.996,v);
    const fracture=smooth(.49,.73,v)*(1.-smooth(.83,1.,v));
    const activity=smooth(.11,.51,v);
    relic.visible=v<.998;
    silence.visible=v>.79;
    core.rotation.y=(reduced?0:elapsed*.065)+v*.75;
    core.rotation.z=-.14;
    core.scale.setScalar(mix(1.0,.036,collapse));
    diskRig.rotation.x=1.16+activity*.17-fracture*.23;
    diskRig.rotation.z=.24+v*.24+(reduced?0:Math.sin(elapsed*.32)*.022);
    disk.scale.setScalar(mix(1, .07, collapse));
    cage.rotation.z=-.16+v*.65+(reduced?0:Math.sin(elapsed*.12)*.06);
    cage.scale.setScalar(mix(1,.035,collapse));
    fine.color.copy(warm).lerp(cold,cooling);
    fine.opacity=(.34+activity*.10)*(1.-collapse);
    ghost.opacity=(.20+fracture*.13)*(1.-collapse);
    stroke.opacity=(.7+activity*.12)*(1.-collapse);
    face.material.opacity=.86*(1.-collapse)*(1.-fracture*.69);
    for(const {a,b,begin,end,j,part} of ringSegments){
      const cut=fracture*(.13+.13*((part+j)%3));
      const angle=(begin+end)*.5, slide=fracture*(.11+.24*((part+j)%3));
      for(const line of b?[a,b]:[a]){
        line.geometry.setDrawRange(0,Math.round(45*(1.-cut)));
        line.position.set(Math.cos(angle)*slide,Math.sin(angle)*slide,(part%2-.5)*slide*1.4);
      }
    }
    cageRings.forEach((g,i)=>{
      g.rotation.z=i*.21+(reduced?0:elapsed*.017*(i%2===0?1:-1))+v*.29*i;
      g.position.z=fracture*(i-1.3)*.59;
    });
    armillary.forEach((g,i)=>{
      g.rotation.y+=reduced?0:dt*.022*(i%2===0?1:-1);
      g.scale.setScalar((1+fracture*(.1+i*.06))*(1-collapse*.96));
    });
    handRig.rotation.z=-.39-v*TAU;
    handRig.scale.setScalar(1-collapse*.97);
    handRig.position.z=core.scale.x*1.70;
    handMat.opacity=(.73+activity*.15)*(1-collapse);
    key.color.copy(warm).lerp(cold,cooling);
    bloom.strength=.77+activity*.18+pulse.value*.21;
    aura.scale.setScalar(1-collapse*.70);
    seedLight.scale.setScalar(smooth(.8,.994,v)*(1+pulse.value*.4));
    seedGlow.scale.setScalar(smooth(.79,.994,v)*(1+pulse.value*.22));
    seedRing.opacity=.20*collapse+pulse.value*.20;
    fragments.forEach((f,i)=>{
      const a=f.a+(reduced?0:elapsed*.13/(f.r*.42))+v*(2.1+f.q);
      const r=f.r*(1+fracture*f.q*.75)*(1-collapse*.96);
      dummy.position.set(Math.cos(a)*r,Math.sin(a)*r,f.z*(1+fracture*2.)*(1-collapse*.8));
      dummy.rotation.set(f.w+v*3.,a*.4,f.q*7+v);
      const size=f.s*(1+fracture*.73)*(1-collapse*.95);
      dummy.scale.set(size*.77,size*1.52,size*.48);
      dummy.updateMatrix();shard.setMatrixAt(i,dummy.matrix);
    });
    shard.instanceMatrix.needsUpdate=true;
    for(const w of waves){
      const age=elapsed-w.t;
      w.g.visible=age<2.45;
      if(w.g.visible){
        const r=(1.62*(1-collapse))+.12+age*(reduced?1.5:4.7);
        w.g.scale.setScalar(r);
        w.m.opacity=Math.max(0,(1-age/2.45)**2)*.88;
        w.second.opacity=w.m.opacity*.40;
      }
    }
    projected.set(0,0,0).project(camera);
    edge.set(1.69*core.scale.x,0,0).applyQuaternion(camera.quaternion).project(camera);
    projectionX=(projected.x*.5+.5)*width;projectionY=(.5-projected.y*.5)*height;
    projectedRadius=Math.abs(edge.x-projected.x)*width*.5;
    if(tick++%2===0){
      mark.style.left=projectionX+'px';mark.style.top=projectionY+'px';
      mark.classList.toggle('active',canvas.classList.contains('over-core')&&!canvas.classList.contains('dragging'));
      note.style.left=Math.min(width-208,projectionX+Math.max(projectedRadius*1.36,28))+'px';
      note.style.top=(projectionY+Math.max(projectedRadius*1.18,37))+'px';
      note.style.opacity=collapse>.55?'0':'';
    }
    composer.render(dt);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  return {
    setEra(v){goalEra=clamp(v,0,1);}, setFocus(v){focus=v;}, reset, echo,
    onEcho(fn){onEcho=fn;}, stop(){stopped=true;window.removeEventListener('resize',resize);},
    getView(){return {yaw,pitch,distance,era:era.value,center:[projectionX,projectionY],webgl:renderer.info.render.frame};}
  };
}
