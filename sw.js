/* Scoped, versioned offline support for the question bank and final notebook reader. */
const CACHE_NAME = 'dip-pros-navigation-repair-v17-20261109';
const OFFLINE_FILES = ['./','./index.html','./notes.html','./pdf.html','./assets/chapter-map.json','./assets/style.css','./assets/app.js','./assets/questions.json','./assets/reader.css','./assets/reader.js','./assets/notebook-pages-index.json','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/sba-questions.pdf','./assets/sba-answers.pdf'];
const keepCaches = [CACHE_NAME];
async function cacheResponse(request,response) {
  if(response.ok) {try {const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());}catch(err) {/* Storage may be full or restricted. Online reading still works. */}}
  return response;
}
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(OFFLINE_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dip-pros-')&&!keepCaches.includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  const uri=new URL(request.url);
  const networkFirst=request.mode==='navigate'||/\/(?:app|reader)\.js$/.test(uri.pathname)||/\/(?:notebook-pages\.(?:pack)|notebook-pages-index\.json|chapter-map\.json)$/.test(uri.pathname);
  event.respondWith((async()=>{
    if(networkFirst){
      try{return await cacheResponse(request,await fetch(request));}
      catch(err){return await caches.match(request)||(request.mode==='navigate'?await caches.match('./index.html'):null)||Response.error();}
    }
    const cached=await caches.match(request);
    if(cached)return cached;
    try{return await cacheResponse(request,await fetch(request));}
    catch(err){return Response.error();}
  })());
});
