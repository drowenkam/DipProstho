/* Independent offline shell — compatible with the self-contained SBA and HTML notes readers. */
const CACHE_NAME = 'dip-pros-notes-readability-reviewed-v23-20261109';
const CORE = ['./','./index.html','./notes.html','./repair.html','./manifest.webmanifest','./assets/style.css','./assets/app.js'];
self.addEventListener('install', e => e.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await Promise.allSettled(CORE.map(url=>cache.add(new Request(url,{cache:'reload'}))));
  await self.skipWaiting();
})()));
self.addEventListener('activate', e => e.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(x=>x.startsWith('dip-pros-')&&x!==CACHE_NAME).map(x=>caches.delete(x)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    if(req.mode==='navigate'){
      try{const fresh=await fetch(req,{cache:'no-cache'});if(fresh.ok){await cache.put(req,fresh.clone());return fresh;}const old=await cache.match(req,{ignoreSearch:true});return old||fresh;}
      catch(err){return await cache.match(req,{ignoreSearch:true})||await cache.match('./index.html')||Response.error();}
    }
    const old=await cache.match(req,{ignoreSearch:true});if(old)return old;
    try{const fresh=await fetch(req);if(fresh.ok)await cache.put(req,fresh.clone());return fresh;}catch(err){return Response.error();}
  })());
});
