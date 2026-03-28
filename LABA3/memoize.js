function memoize(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || Infinity;
  const policy = options.policy || 'lru'; 

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (policy === 'lru') {
        cache.delete(key);
        cache.set(key, entry);
      }
      return entry.result;
    }
    const result = fn(...args);
    if (cache.size >= maxSize) {
      if (policy === 'lru') {
        const oldKey = cache.keys().next().value;
        cache.delete(oldKey);
      }
    }
    cache.set(key, { result });
    return result;
  };
}