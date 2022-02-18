import { DataLoader } from "./data-loader.mjs";

const database = {
  0: {
    id: 0,
    name: "zero",
    lastInvitedID: 3,
    invitedByID: 3,
  },
  1: {
    id: 1,
    name: "one",
    lastInvitedID: 0,
    invitedByID: 0,
  },
  2: {
    id: 2,
    name: "two",
    lastInvitedID: 1,
    invitedByID: 1,
  },
};
async function threadTwo(loader) {
  // Elsewhere in your application
  const user = await loader.load(2);
  console.log('threadTwo user', user.id)
  // simplified
  // const lastInvited = await loader.load(user.lastInvitedID);
  // console.log(`User 2 last invited ${lastInvited.name}`);
}

async function threadOne(loader) {
  const user = await loader.load(1);
  console.log('threadOne user', user.id)
  // simplified
  // const userInvitedBy = await loader.load(user.invitedByID);
  // console.log(`User 1 was invited by ${userInvitedBy.name}`);
}

const run = async () => {
  const loader = new DataLoader(async (keys) => {
    // Get cache hits (via id and edge)
    // Query by id those missing
    // Set response values key and value into cache (key == id and edge)

    console.log("batch function keys", keys);
    const values = keys.map((key) => {
      return database[key];
    });
    return values;
  });

  // await means batch func called with individual keys
  // WHY - as the batched keys arent both threadOne, its threadOne + threadTwo sync
  // SO loader called with first load(x) of each sync function
  threadOne(loader);
  threadTwo(loader);
};

run();
