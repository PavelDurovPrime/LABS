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