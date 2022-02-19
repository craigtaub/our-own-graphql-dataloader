// calls batch twice with both keys

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
    // promise not connected to batch function
    return Promise.resolve(`id: ${id}`);
  };

  const a = await load(1);
  const b = await load(2);
  console.log("a", a); // id: 1
  console.log("b", b); // id: 2
};

run();
