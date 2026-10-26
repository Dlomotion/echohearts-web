const assert=require('node:assert/strict');const E=require('../exploration-core.js');
const p={...E.defaults};let count=0;function check(name,fn){fn();console.log('PASS '+name);count++;}
check('terrain is deterministic and finite',()=>{for(let x=-1000;x<1000;x+=33){assert.equal(E.terrain(x,100,p),E.terrain(x,100,p));assert.ok(Number.isFinite(E.terrain(x,100,p)));}});
check('deeper canyon lowers canyon center without moving it',()=>{assert.ok(E.terrain(0,0,{...p,canyonDepth:300})<E.terrain(0,0,{...p,canyonDepth:30}));});
check('gravity changes vertical velocity',()=>{const a=E.initial(p),b=E.initial(p);E.step(a,{}, {...p,gravity:0},1/30);E.step(b,{},p,1/30);assert.ok(b.vy<a.vy);});
check('inertia resists an immediate heading change',()=>{const a=E.initial(p),b=E.initial(p);a.yaw=b.yaw=Math.PI/2;E.step(a,{}, {...p,inertia:.3},1/30);E.step(b,{}, {...p,inertia:4},1/30);assert.ok(a.vx>b.vx);assert.ok(b.vz>0);});
check('pitch and bank alter flight while bounded',()=>{const s=E.initial(p);for(let i=0;i<400;i++)E.step(s,{pitch:1,roll:1},p,1/60);assert.ok(s.yaw>0);assert.ok(s.pitch<=.8);assert.ok(s.roll<=.95);assert.ok(s.y>=E.terrain(s.x,s.z,p)+8);});
check('terrain contact recovers above the surface',()=>{const s=E.initial(p);s.y=-1000;s.vy=-50;E.step(s,{},p,1/30);assert.equal(s.collision,true);assert.ok(s.y>=E.terrain(s.x,s.z,p)+8);assert.ok(s.vy>=0);});
check('heading wraps and lookahead warns of collision',()=>{assert.equal(E.heading(-Math.PI/2),270);const s=E.initial(p);s.y=E.terrain(s.x,s.z,p)+12;assert.ok(E.clearance(s,p)<30);});
check('long frames are bounded',()=>{const a=E.initial(p),b=E.initial(p);E.step(a,{pitch:1},p,10);E.step(b,{pitch:1},p,1/30);assert.deepEqual(a,b);});
console.log(count+' tests passed; browser model only, no Unreal verification.');
