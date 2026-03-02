const CACHE_NAME = 'rb-hybrid-v7'; // v7にアップデートしたのは良い判断だ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',       // manifest.json で指定されているアイコン
  './F1.jpg',         // ★ HTMLの poster と apple-touch-icon で使用 (追加)
  './f1.mp4',         // ←★ ここにカンマが必要！
  './晋平太.m4a',
  './sum.m4a',
  './focus.m4a',      // ←★ ここにカンマが必要！
  './hoodstar.m4a',   // ←★ ここにカンマが必要！
  './stay.m4a',       // ←★ ここにカンマが必要！
  './R指定.m4a' 
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell & Video');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

/* --- ここから下は変更なしだが、念のため記載 --- */
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          // 古いバージョンのキャッシュ（v4以前）を削除してゴミ掃除
          return caches.delete(key);
        }
      }));
    })
  );
});
