'use strict';
const CACHE_NAME = 'location-game-cache';
const CACHE_VERSION = 0.02;
const CACHE_KEY = `${CACHE_NAME}:${CACHE_VERSION}`;
const CACHE_FILES = [
	"./",
	"./index.html",
	"./css/main.css",
	"./js/main.js"
].map(path => new URL(path, registration.scope).pathname);

const isTargetFile = function(url) {
    return CACHE_FILES.indexOf(new URL(url).pathname) >= 0;
};

this.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_KEY).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                // もしキャッシュがあればそれを返す
                if (response) {
					console.log("using cache");
					return response;
				}
				// もし無ければネットワークに取得しに行く
				return fetch(event.request).then(function(response) {
					if (isTargetFile(event.request.url) && response.ok) {
						cache.put(event.request, response.clone());
					}
					return response;
				});
            });
        })
    );
});

self.addEventListener('install', function(event) {
	console.log("ServiceWorker was installed");
	event.waitUntil(
		caches.open(CACHE_KEY).then(function(cache) {
			console.log("adding cache...");
			return cache.addAll(CACHE_FILES);
		})
	);
});

self.addEventListener('activate', function(event) {
	console.log("ServiceWorker has been activated");
    event.waitUntil(
        caches.keys().then(function(cacheKeys) {
            return Promise.all(
                cacheKeys.filter(function(cacheKey) {
                    const [cacheName, cacheVersion] = cacheKey.split(':');
                    return cacheName == CACHE_NAME && cacheVersion != CACHE_VERSION;
                }).map(function(cacheKey) {
					console.log("delete cache:" + cacheKey);
                    return caches.delete(cacheKey);
                })
            );
        })
    );
});