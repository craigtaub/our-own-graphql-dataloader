// calls batch twice with both keys. but doesnt return

let batchFunction;
const keys = [];

const load = async (id) => {
  keys.push(id);
  process.nextTick(() => {
    batchFunction(keys);
  });
};

const run = async () => {
  batchFunction = (keys) => {
    // called with [1,2], [1,2]
    console.log("BATCH, keys:", keys);
  };
  const a = await load(1); // undefined
  const b = await load(2); // undefined
};

run();
