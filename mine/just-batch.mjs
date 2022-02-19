// calls batch twice with both keys. but doesnt return

const run = async () => {
  const keys = [];
  const batchFunction = (keys) => {
    // called with [1,2], [1,2]
    console.log("keys: ", keys);
  };

  const load = async (id) => {
    keys.push(id);
    process.nextTick(() => {
      batchFunction(keys);
    });
  };

  const a = await load(1); // undefined
  const b = await load(2); // undefined
};

run();
