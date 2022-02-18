// calls batch twice with both keys. but doesnt return

let resolvedPromise;
let batchFunction;
const keys = [];

const dispatchBatch = () => {
  batchFunction(keys);
};
const batchScheduleFn = (cb) => {
  const resolvedPromise = Promise.resolve();
  resolvedPromise.then(() => {
    process.nextTick(cb);
  });
};

const load = async (id) => {
  keys.push(id);
  batchScheduleFn(() => {
    dispatchBatch();
  });
};

const run = async () => {
  batchFunction = (keys) => {
    // called with [1,2], [1,2]
    console.log("BATCH, keys:", keys);
  };
  const a = await load(1);
  const b = await load(2);

  console.log("a", a); // undefined
  console.log("b", b); // undefined
};

run();
