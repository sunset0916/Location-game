'use strict';
const CACHE_NAME = 'location-game-cache';
const urlsToCache = [
	"../",
	"../index.html",
	"../css/main.css",
	"./main.js"
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(async function() {
		try{
			var res = await fetch(event.request);
			var cache = await caches.open(CACHE_NAME);
			cache.put(event.request.url, res.clone());
			return res;
		}
		catch(error){
			console.log('Using cache');
			return caches.match(event.request);
		}
	}());
});