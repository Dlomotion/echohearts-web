(function(){
  'use strict';
  const E=EchoExplorer,$=id=>document.getElementById(id),canvas=$('flightView'),ctx=canvas.getContext('2d'),mini=$('flightMini'),mc=mini.getContext('2d');
  const p={...E.defaults},keys=new Set(),touch={};let state=E.initial(p),running=false,last=0,minimapTick=0,dirty=true;
  const matrix={Flora:['Plant','Bloom-Wood'],Torrent:['Water','Ice-melt Deep'],Pyre:['Fire','Ember-Ash'],Terra:['Earth-Stone','Metal'],Aero:['Wind','Storm-breath'],Glaze:['Ice','Crystal'],Voltic:['Electric','Tech'],Aura:['Light','Aether'],Shade:['Dark','Void']};
  $('expressionMatrix').innerHTML='<table><thead><tr><th>Essence</th><th>Expression one</th><th>Expression two</th></tr></thead><tbody>'+Object.entries(matrix).map(([ess,faces])=>'<tr><th>'+ess+'</th><td>'+faces[0]+'</td><td>'+faces[1]+'</td></tr>').join('')+'</tbody></table>';
  function input(){return {pitch:(keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0)+(touch.pitch||0),roll:(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+(touch.roll||0),yaw:(keys.has('KeyE')?1:0)-(keys.has('KeyQ')?1:0)+(touch.yaw||0)};}
  function pause(){running=false;keys.clear();for(const k in touch)delete touch[k];$('flightToggle').textContent='Resume flight';dirty=true;}
  function toggle(){running=!running;keys.clear();$('flightToggle').textContent=running?'Pause flight':'Resume flight';dirty=true;if(running)canvas.focus({preventScroll:true});}
  $('flightToggle').onclick=toggle;
  $('flightReset').onclick=()=>{pause();state=E.initial(p);$('flightToggle').textContent='Begin flight';dirty=true;};
  Object.keys(p).forEach(key=>{$(key).oninput=()=>{p[key]=Number($(key).value);$(key+'Value').textContent=key==='throttle'?Math.round(p[key]*100)+'%':p[key]+(key==='inertia'?' s':key==='gravity'?' m/s²':key==='steepness'?'':' m');dirty=true;};$(key).oninput();});
  $('flightRegion').onchange=()=>{
    pause();const id=$('flightRegion').value;
    const preset=id==='frostwind'?{mountainHeight:240,steepness:3.1,canyonDepth:130,canyonWidth:80}:id==='redcanyons'?{mountainHeight:140,steepness:2.1,canyonDepth:280,canyonWidth:110}:{mountainHeight:100,steepness:1.7,canyonDepth:80,canyonWidth:120};
    for(const key in preset){$(key).value=preset[key];$(key).oninput();}
    state=E.initial(p);$('regionLabel').textContent=$('flightRegion').selectedOptions[0].textContent;
    if(typeof selectPlace==='function')selectPlace(id,false);
  };
  $('flightRegion').onchange();
  canvas.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','KeyA','KeyD','KeyQ','KeyE','Space'].includes(event.code)){event.preventDefault();if(event.code==='Space'){if(!event.repeat)toggle();}else keys.add(event.code);}});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',pause);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  canvas.addEventListener('blur',()=>{keys.clear();});
  document.querySelectorAll('[data-control]').forEach(button=>{
    const [axis,val]=button.dataset.control.split(':');
    button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touch[axis]=Number(val);};
    const release=()=>{touch[axis]=0;};button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;
  });
  $('flightExport').onclick=()=>{
    const payload={schemaVersion:1,regionId:$('flightRegion').value,status:'AUTHORING_PREVIEW',runtimeVerified:false,units:'meters_seconds',terrain:{mountainHeight:p.mountainHeight,steepness:p.steepness,canyonDepth:p.canyonDepth,canyonWidth:p.canyonWidth},flight:{inertia:p.inertia,gravity:p.gravity,throttle:p.throttle},expressions:matrix};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Echohearts-'+payload.regionId+'-tuning.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  function project(x,y,z,w,h){
    const dx=x-state.x,dy=y-state.y,dz=z-state.z,sy=Math.sin(state.yaw),cy=Math.cos(state.yaw),sp=Math.sin(state.pitch),cp=Math.cos(state.pitch);
    const right=dx*cy-dz*sy,forward=dx*sy+dz*cy;
    const up=dy*cp-forward*sp,depth=dy*sp+forward*cp;
    if(depth<8)return null;
    const sr=Math.sin(state.roll),cr=Math.cos(state.roll),rx=right*cr+up*sr,uy=up*cr-right*sr;
    return [w/2+rx*w*.8/depth,h*.48-uy*w*.8/depth,depth];
  }
  function render(){
    const box=canvas.getBoundingClientRect(),w=Math.max(320,Math.round(box.width)),h=Math.max(360,Math.round(box.height));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#102e48');sky.addColorStop(.6,'#7bada6');sky.addColorStop(1,'#bdc3a0');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fff4c2';ctx.beginPath();ctx.arc(w*.78,h*.18,23,0,Math.PI*2);ctx.fill();
    const polys=[],spacing=55,baseX=Math.floor(state.x/spacing)*spacing,baseZ=Math.floor(state.z/spacing)*spacing;
    for(let iz=-25;iz<26;iz++)for(let ix=-25;ix<26;ix++){
      const x=baseX+ix*spacing,z=baseZ+iz*spacing;
      const points=[[x,z],[x+spacing,z],[x+spacing,z+spacing],[x,z+spacing]];
      const ys=points.map(a=>E.terrain(a[0],a[1],p)),screen=points.map((a,i)=>project(a[0],ys[i],a[1],w,h));
      if(screen.some(a=>!a))continue;
      const depth=screen.reduce((sum,a)=>sum+a[2],0)/4;
      if(depth>1450)continue;
      const height=ys.reduce((a,b)=>a+b,0)/4,light=E.clamp(35+(ys[0]-ys[2])*.22,18,65);
      const region=$('flightRegion').value;
      let color=region==='redcanyons'?`hsl(20 39% ${light}%)`:`hsl(144 23% ${light}%)`;
      if(region==='frostwind'&&height>160)color=`hsl(173 16% ${E.clamp(light+32,55,90)}%)`;
      if(height<0)color=`hsl(192 34% ${E.clamp(light,20,40)}%)`;
      polys.push({screen,depth,color});
    }
    polys.sort((a,b)=>b.depth-a.depth);for(const poly of polys){ctx.beginPath();poly.screen.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fillStyle=poly.color;ctx.fill();ctx.strokeStyle='#d8edc018';ctx.stroke();}
    // Fixed reticle keeps pitch and bank readable without camera shake.
    ctx.strokeStyle='#fff3c5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2-24,h*.49);ctx.lineTo(w/2-8,h*.49);ctx.lineTo(w/2,h*.5);ctx.lineTo(w/2+8,h*.49);ctx.lineTo(w/2+24,h*.49);ctx.stroke();
    const heading=E.heading(state.yaw),cardinal=['N','NE','E','SE','S','SW','W','NW'][Math.round(heading/45)%8];
    $('compass').textContent=cardinal+' · '+String(Math.round(heading)%360).padStart(3,'0')+'°';
    $('altitude').textContent=Math.round(state.y-E.terrain(state.x,state.z,p))+' m';$('airspeed').textContent=Math.round(Math.hypot(state.vx,state.vy,state.vz))+' m/s';
    $('attitude').textContent=Math.round(state.pitch*180/Math.PI)+'° pitch / '+Math.round(state.roll*180/Math.PI)+'° roll';
    $('flightState').textContent=running?'FLYING · Space to pause':'PAUSED · tune or resume';
    const danger=E.clearance(state,p)<30;
    const message=state.collision?'CONTACT · climb and recover':danger?'TERRAIN AHEAD · pitch up / adjust course':'A.E.G.I.S. · route clear';
    if($('flightWarning').textContent!==message)$('flightWarning').textContent=message;
    $('flightWarning').classList.toggle('danger',danger||state.collision);
    if(minimapTick++%6===0||!running)renderMini();
  }
  function renderMini(){
    const size=180;mc.clearRect(0,0,size,size);
    for(let y=0;y<size;y+=5)for(let x=0;x<size;x+=5){const h=E.terrain(state.x+(x-90)*4,state.z+(90-y)*4,p);mc.fillStyle=`hsl(${h<0?191:145} 28% ${E.clamp(25+h*.12,15,70)}%)`;mc.fillRect(x,y,5,5);}
    mc.fillStyle='#fff4ba';mc.font='bold 13px system-ui';mc.textAlign='center';mc.fillText('N',90,17);
    mc.save();mc.translate(90,90);mc.rotate(state.yaw);mc.beginPath();mc.moveTo(0,-14);mc.lineTo(8,9);mc.lineTo(0,5);mc.lineTo(-8,9);mc.closePath();mc.fillStyle='#ffe58b';mc.fill();mc.restore();
    mc.strokeStyle='#ffffff50';mc.beginPath();mc.arc(90,90,55,0,Math.PI*2);mc.stroke();
  }
  new ResizeObserver(()=>{dirty=true;}).observe(canvas);
  function frame(time){const dt=Math.min((time-last)/1000||0,1/30);last=time;if(running){E.step(state,input(),p,dt);dirty=true;}if(dirty){render();dirty=false;}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();
