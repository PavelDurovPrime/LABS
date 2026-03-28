function memoize(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || Infinity;
  const policy = options.policy || 'lru';

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const entry = cache.get(key);
      entry.count += 1; 
      if (policy === 'lru') {
        cache.delete(key);
        cache.set(key, entry);
      }
      return entry.result;
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
    cache.set(key, { result, count: 1 });
    return result;
  };
}