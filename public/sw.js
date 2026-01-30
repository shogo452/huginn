// Huginn Service Worker
const CACHE_NAME = 'huginn-cache-v1';
const BASE_PATH = '/huginn/';
const STATIC_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}tags/`,
  `${BASE_PATH}feeds/`,
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュの削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ネットワークファースト戦略（HTMLページ用）
// キャッシュファースト戦略（静的アセット用）
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 外部リソースはネットワークのみ
  if (url.origin !== location.origin) {
    return;
  }

  // HTMLページはネットワークファースト
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // レスポンスをキャッシュに保存
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // キャッシュにもない場合はトップページを返す
            return caches.match(BASE_PATH);
          });
        })
    );
    return;
  }

  // 静的アセット（CSS, JS, 画像など）はキャッシュファースト
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // バックグラウンドで更新
        fetch(request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response);
          });
        });
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // キャッシュに保存
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});
