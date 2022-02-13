const { task } = require("@iboss/terrain");

task(async ({ wallets, refs, config, client }) => {
  // query is a thin wrapper of contract query
  const count = await client.query("board", { get_count: {} });
  console.log("prev count = ", count);

  // execute is a thin wrapper of signing and broadcasting execute contract
  await client.execute(wallets.validator, "board", {
    increment: {},
  });
  const count2 = await client.query("board", { get_count: {} });
  console.log("new count = ", count2);
});
