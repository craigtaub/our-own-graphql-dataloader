import { DataLoader } from "./data-loader.mjs";

const database = {
  1: {
    id: 1,
    name: "one",
    lastInvitedID: "0",
    invitedByID: "0",
  },
  2: {
    id: 2,
    name: "two",
    lastInvitedID: "1",
    invitedByID: "1",
  },
};
async function threadTwo(loader) {
  // Elsewhere in your application
  const user = await loader.load(2);
  const lastInvited = await loader.load(user.lastInvitedID);
  console.log(`User 2 last invited ${lastInvited}`);
}

async function threadOne(loader) {
  const user = await loader.load(1);
  const invitedBy = await loader.load(user.invitedByID);
  console.log(`User 1 was invited by ${invitedBy}`);
}

const run = async () => {
  const loader = new DataLoader(async (keys) => {
    // Get cache hits (via id and edge)
    // Query by id those missing
    // Set response values key and value into cache (key == id and edge)

    // console.log("batch function keys", keys);
    const values = keys.map((key) => {
      return database[key];
    });
    return values;
  });

  threadOne(loader);
  threadTwo(loader);
};

run();
