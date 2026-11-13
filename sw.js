const C='vth2-v142';const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./musica_n1.mp3','./musica_n3.mp3','./boss_capitan.mp3','./boss_sylvaraeth.mp3','./boss_morgrave.mp3','./boss_gorrath.mp3','./musica_n4.mp3','./boss_nhazrakh.mp3','./boss_gigantes.mp3','./boss_medusa.mp3','./zona_cirlene.mp3','./boss_cirlene.mp3','./mazmorras84.mp3','./boss_coloso87.mp3','./boss_coloso103.mp3','./mazmorras117.mp3', './garg_mision123.mp3', './garg_jefe123.mp3'];
// Solo se guarda un index completo: 200, cuerpo == Content-Length (si viene) y termina en </html>.
const okIndex=async r=>{if(!r||!r.ok||r.status!==200)return null;const b=await r.clone().arrayBuffer();const cl=+r.headers.get('content-length');if(cl&&cl!==b.byteLength)return null;const tail=new TextDecoder().decode(b.slice(Math.max(0,b.byteLength-64)));if(!/<\/html>\s*$/i.test(tail))return null;return new Response(b,{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}});};
const putIndex=async(c,r)=>{const g=await okIndex(r);if(!g)throw new Error('index incompleto');await c.put('./index.html',g.clone());await c.put('./',g);};
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(C);
 await putIndex(c,await fetch('./index.html',{cache:'reload'}));
 await c.addAll(A.filter(u=>u!=='./'&&u!=='./index.html').map(u=>new Request(u,{cache:'reload'})));await self.skipWaiting();})());});
// skipWaiting solo tras instalar un index completo: toma control sin cerrar la app (el index v90 no se auto-recarga).
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('vth2-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting();});
const isIndex=req=>{if(req.mode==='navigate')return true;return /\/$|\/index\.html$/.test(new URL(req.url).pathname);};
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 if(isIndex(req)){e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match('./index.html');
  const net=fetch('./index.html',{cache:'no-store'}).then(r=>putIndex(c,r)).catch(()=>{});
  if(hit){e.waitUntil(net);return hit;}           // cache-first + revalidar en segundo plano
  try{const r=await fetch(req);return r;}catch(_){return (await caches.match('./'))||Response.error();}})());return;}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));});
