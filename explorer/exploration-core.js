(function(root){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const defaults={mountainHeight:180,steepness:2.2,canyonDepth:150,canyonWidth:95,inertia:1.8,gravity:9.81,throttle:0.65};
  function terrain(x,z,p){
    const ridge=(Math.sin(x/210+Math.sin(z/340))*.5+.5);
    const hills=24*Math.sin(x/450)*Math.cos(z/330);
    const line=x-160*Math.sin(z/330);
    const canyon=Math.exp(-Math.pow(line/p.canyonWidth,4))*p.canyonDepth;
    return 45+hills+p.mountainHeight*Math.pow(ridge,p.steepness)-canyon;
  }
  function initial(p){return {x:0,z:-700,y:Math.max(250,terrain(0,-700,p)+170),vx:0,vy:0,vz:32,yaw:0,pitch:0,roll:0,collision:false};}
  function step(s,input,p,dt){
    dt=clamp(dt,0,1/30);
    s.pitch=clamp(s.pitch+(input.pitch||0)*0.65*dt,-0.8,0.8);
    s.roll=clamp(s.roll+(input.roll||0)*1.1*dt,-0.95,0.95);
    if(!input.roll)s.roll*=Math.exp(-dt*1.8);
    s.yaw+=(Math.sin(s.roll)*0.65+(input.yaw||0)*.55)*dt;
    const speed=12+p.throttle*65, response=1-Math.exp(-dt/Math.max(.15,p.inertia));
    s.vx+=(Math.sin(s.yaw)*Math.cos(s.pitch)*speed-s.vx)*response;
    s.vz+=(Math.cos(s.yaw)*Math.cos(s.pitch)*speed-s.vz)*response;
    // Lift balances only part of gravity; pitch and throttle must sustain climb.
    s.vy+=(Math.sin(s.pitch)*speed-s.vy)*response;
    s.vy-=p.gravity*(1-p.throttle*.8)*dt;
    s.x+=s.vx*dt;s.z+=s.vz*dt;s.y+=s.vy*dt;
    const floor=terrain(s.x,s.z,p)+8;
    s.collision=s.y<floor;
    if(s.collision){s.y=floor;s.vy=Math.max(0,s.vy);s.vx*=.9;s.vz*=.9;}
    return s;
  }
  function clearance(s,p,seconds=3){
    let low=s.y-terrain(s.x,s.z,p);
    for(let i=1;i<=12;i++){const t=seconds*i/12;low=Math.min(low,s.y+s.vy*t-terrain(s.x+s.vx*t,s.z+s.vz*t,p));}
    return low;
  }
  function heading(yaw){return ((yaw*180/Math.PI)%360+360)%360;}
  const api={clamp,defaults,terrain,initial,step,clearance,heading};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.EchoExplorer=api;
})(typeof globalThis!=='undefined'?globalThis:this);
