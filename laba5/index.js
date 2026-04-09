function asyncMapCallback(array, iteratee, finalCallback) {
  if (array.length === 0) return finalCallback(null, []);

  const results = [];
  let completedCount = 0;
  let hasError = false;

  array.forEach((item, index) => {
    iteratee(item, (err, result) => {
      if (hasError) return; 
      if (err) {
        hasError = true;
        return finalCallback(err, null);
      }

      results[index] = result; 
      completedCount++;

      if (completedCount === array.length) {
        finalCallback(null, results);
      }
    });
  });
}

console.log("Callback Demo");
const data1 = [1, 2, 3];

asyncMapCallback(
  data1,
  (item, cb) => {
    setTimeout(() => cb(null, item * 2), 500); 
  },
  (err, results) => {
    if (err) console.error("Error:", err);
    else console.log("Callback results:", results);
  }
);

function asyncMapPromise(array, iteratee) {
  return new Promise((resolve, reject) => {
    const promises = array.map(item => iteratee(item));
    
    Promise.all(promises)
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
}
async function runAsyncAwaitDemo() {
  console.log("\nAsync/Await Demo");
  const data2 = [10, 20, 30];

  try {
    const results = await asyncMapPromise(data2, async (item) => {
      return new Promise(resolve => setTimeout(() => resolve(item * 2), 500));
    });
    console.log("Async/Await results:", results); 
  } catch (err) {
    console.error("Async/Await error:", err);
  }
}

setTimeout(runAsyncAwaitDemo, 1000);

function asyncMapAbortable(array, iteratee, options = {}) {
  return new Promise((resolve, reject) => {
    const signal = options.signal;

    if (signal && signal.aborted) {
      return reject(new Error('cancelled before starting'));
    }

    const onAbort = () => reject(new Error('Operation was aborted'));
    if (signal) {
      signal.addEventListener('abort', onAbort);
    }

    const promises = array.map(item => iteratee(item));

    Promise.all(promises)
      .then(results => {
        if (signal) signal.removeEventListener('abort', onAbort); 
        resolve(results);
      })
      .catch(err => {
        if (signal) signal.removeEventListener('abort', onAbort);
        reject(err);
      });
  });
}