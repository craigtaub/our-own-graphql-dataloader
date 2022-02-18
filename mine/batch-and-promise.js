// calls batch with both keys. returns values from batch function

let resolvedPromise;
let batchFunction;
let batch = {
  keys: [],
  callbacks: [],
};
const dispatchBatch = () => {
  const batchPromise = batchFunction(batch.keys);

  batchPromise.then((values) => {
    // returned from batch function
    for (var i = 0; i < batch.callbacks.length; i++) {
      var value = values[i];
      batch.callbacks[i].resolve(value);
    }
  });
};
const batchScheduleFn = (cb) => {
  const resolvedPromise = Promise.resolve();
  resolvedPromise.then(() => {
    process.nextTick(cb);
  });
};

const load = async (id) => {
  batch.keys.push(id);
  batchScheduleFn(() => {
    dispatchBatch();
  });
  const promise = new Promise((resolve, reject) => {
    batch.callbacks.push({ resolve, reject });
  });

  return promise;
};

const run = async () => {
  batchFunction = async (keys) => {
    console.log("BATCH, keys:", keys);
    return keys.map((key) => ({ id: key }));
  };
  const a = await load(1);
  const b = await load(2);

  console.log("a", a); // undefined
  console.log("b", b); // undefined
};

run();
