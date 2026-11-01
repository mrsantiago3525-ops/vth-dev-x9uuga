const C='vth2-v89';const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./musica_n1.mp3','./musica_n3.mp3','./boss_capitan.mp3','./boss_sylvaraeth.mp3','./boss_morgrave.mp3','./boss_gorrath.mp3','./musica_n4.mp3','./boss_nhazrakh.mp3','./boss_gigantes.mp3','./boss_medusa.mp3','./zona_cirlene.mp3','./boss_cirlene.mp3','./mazmorras84.mp3','./boss_coloso87.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('vth2-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
const fresh=req=>{if(req.mode==='navigate')return true;const p=new URL(req.url).pathname;return /\/$|\/index\.html$|\/sw\.js$|\.webmanifest$/.test(p);};
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 if(fresh(req)){e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(r&&r.ok){const cp=r.clone();const key=req.mode==='navigate'?new URL(req.url).pathname.replace(/\/$/,'/index.html'):req;caches.open(C).then(c=>c.put(key,cp));}return r;})
  .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html')).then(r=>r||caches.match('./'))));return;}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));});
