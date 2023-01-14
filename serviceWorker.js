'use strict';
const CACHE_NAME = 'location-game-cache';
const CACHE_VERSION = 0.01;
const CACHE_KEY = `${CACHE_NAME}:${CACHE_VERSION}`;
const CACHE_FILES = [
	"./",
	"./index.html",
	"./css/main.css",
	"./js/main.js"
].map(path => new URL(path, registration.scope).pathname);

self.addEventListener('fetch', function(event) {
	event.respondWith(async function() {
		try{
			var res = await fetch(event.request);
			var cache = await caches.open(CACHE_KEY);
			cache.put(event.request.url, res.clone());
			return res;
		}
		catch(error){
			console.log('Using cache');
			return caches.match(event.request);
		}
	}());
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