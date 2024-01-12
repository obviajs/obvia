import { Cache } from "/obvia/lib/cache/Cache.js";
let cache = Cache.getInstance();

let ServiceWorkerCacheUtils = {};
ServiceWorkerCacheUtils.clearCache = async function () {
  var eventSource = new EventSource("http://localhost/billing/sse.php");
  console.log("Creating EventSource...");
  eventSource.retry = 5000; // Retry connection after 5 seconds

  eventSource.addEventListener("cache-cleared", async function (event) {
    console.log("Cache cleared event received.");
    // Clear the cache in the browser
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        cache.clear();
        cache.persist();
        console.log("Cache cleared successfully.");
      } catch (error) {
        console.error("Cache clearing failed:", error);
      }
    }
  });
};

export { ServiceWorkerCacheUtils };
