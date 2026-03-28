function memoize(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || Infinity;
  const policy = options.policy || 'lru';
  const ttl = options.ttl || null; 
  
  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (ttl && (now - entry.timestamp > ttl)) {
        cache.delete(key);
      } else {
        entry.count += 1;
        if (policy === 'lru') {
          cache.delete(key);
          cache.set(key, entry);
        }
        return entry.result;
      }
    }
    const result = fn(...args);
    if (cache.size >= maxSize) {
      if (policy === 'lru') {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      } else if (policy === 'lfu') {
        let minCount = Infinity;
        let lfuKey = null;
        for (const [k, v] of cache.entries()) {
          if (v.count < minCount) {
            minCount = v.count;
            lfuKey = k;
          }
        }
        cache.delete(lfuKey);
      }
    }
    cache.set(key, { result, count: 1, timestamp: now });
    return result;
  };
}