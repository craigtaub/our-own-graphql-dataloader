// TODO

let resolvedPromise;
let batchFunction;
const keys = [];

const dispatchBatch = () => {
  batchFunction(keys);
};
const batchScheduleFn = (cb) => {
  const resolvedPromise = Promise.resolve();
  resolvedPromise.then(() => {
    process.nextTick(cb); // called twice. [1,2], [1,2]
    // cb(); // called twice. [1], [1,2]
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
    console.log("BATCH, keys:", keys);
  };
  const a = await load(1);
  const b = await load(2);

  console.log("a", a); // undefined
  console.log("b", b); // undefined
};

run();
