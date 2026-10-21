'use strict';
// Scope-derived relative URLs work on both username.github.io and /repository-name/.
const CACHE_NAME='line5-v1.1.0';
const APP_ROOT=new URL('./',self.location.href);
const CORE=[
  './','index.html','badges.html','resources.html','presentation.html','css/presentation.css','css/style.css','css/updates.css','css/badges.css','css/pwa.css','css/line5.css',
  'js/vendor/lucide.min.js','js/questions.js','js/questions-2016.js','js/questions-presentation.js','js/presentation.js','js/badges.js','js/app.js','js/pwa.js',
  'manifest.webmanifest','images/line5-train.jpg','images/icon-192.png','images/icon-512.png'
].map(path=>new URL(path,APP_ROOT).href);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)));
  // Do not skipWaiting automatically: an open quiz stays on its current application version.
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('line5-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==APP_ROOT.origin||!url.pathname.startsWith(APP_ROOT.pathname))return;
  const cacheable=CORE.includes(url.href)||url.pathname.startsWith(new URL('materials/',APP_ROOT).pathname);
  if(!cacheable)return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request);
      if(response.status===200&&!event.request.headers.has('range')){
        try{const cache=await caches.open(CACHE_NAME);await cache.put(event.request,response.clone());}catch(cacheError){/* Online content remains usable if storage is unavailable. */}
      }
      return response;
    }catch(error){
      const cached=await caches.match(event.request);
      if(cached)return cached;
      if(event.request.mode==='navigate'){const fallback=await caches.match(new URL('index.html',APP_ROOT).href);if(fallback)return fallback;}
      return Response.error();
    }
  })());
});
