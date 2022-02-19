// calls batch twice with both keys. but doesnt return. uses batchSchedule functions

let batchFunction;
const keys = [];

const dispatchBatch = () => {
  batchFunction(keys);
};

const batchScheduleFn = (cb) => {
  // add more logic if scheduling
  process.nextTick(cb);
};

const load = async (id) => {
  keys.push(id);
  // new scheduler
  batchScheduleFn(() => {
    // new dispathcer
    dispatchBatch();
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
