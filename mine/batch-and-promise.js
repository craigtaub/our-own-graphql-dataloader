// calls batch once with both keys. returns values from batch function

let resolvedPromise;
let batchFunction;
let batch;

const dispatchBatch = () => {
  batch.hasDispatched = true;
  const batchPromise = batchFunction(batch.keys);

  batchPromise.then((values) => {
    for (var i = 0; i < batch.callbacks.length; i++) {
      var value = values[i];
      // resolve promise callback
      batch.callbacks[i].resolve(value);
    }
  });
};

const batchScheduleFn = (cb) => {
  // add more logic if scheduling
  process.nextTick(cb);
};

const getCurrentBatch = () => {
  // !hasDispatched only needed if using a 2nd tick - this example isnt
  if (batch && !batch.hasDispatched) {
    return batch;
  }
  const newBatch = { hasDispatched: false, keys: [], callbacks: [] };
  batch = newBatch;
  batchScheduleFn(() => {
    dispatchBatch();
  });
  return newBatch;
};

const load = async (id) => {
  const localBatch = getCurrentBatch();
  localBatch.keys.push(id);
  // add promise callback to batch
  const promise = new Promise((resolve, reject) => {
    localBatch.callbacks.push({ resolve, reject });
  });

  return promise;
};

async function threadTwo() {
  const user = await load(2);
  console.log("threadTwo user", user.id);
}

async function threadOne() {
  const user = await load(1);
  console.log("threadOne user", user.id);
}

const run = async () => {
  // make async
  batchFunction = async (keys) => {
    console.log("keys:", keys);
    // keys: [ 1, 2 ]
    return keys.map((key) => ({ id: key }));
  };

  threadOne();
  threadTwo();
  // wont work with: (like real dataloader)
  // const user = await load(1);
  // const user = await load(2);
};

run();
