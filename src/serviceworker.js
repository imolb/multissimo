'use strict'

/**
 * serviceworker.js
 *
 * Last update: 18.10.2024 14:09
 */

/* global self caches */

const urlsToCache = ['favicon.ico', 'index.html', 'multissimo.css', 'multissimo.js', 'multissimo.webmanifest',
  'multissimo_32x.png', 'multissimo_192x.png', 'multissimo_512x.png']

const filesUpdate = cache => {
  const stack = []
  urlsToCache.forEach(file => stack.push(
    cache.add(file).catch(_ => console.error(`can't load ${file} to cache`))
  ))
  return Promise.all(stack)
}

self.addEventListener('install', event => {
  self.skipWaiting()

  event.waitUntil(
    caches.open('multissimo_cache').then(filesUpdate)
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // It can update the cache to serve updated content on the next request
        return cachedResponse || fetch(event.request)
      }
      )
  )
})
