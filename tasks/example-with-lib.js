const { task } = require("@iboss/terrain");
const lib = require("../lib");

task(async (env) => {
  const { getPosts, increment } = lib(env);
  console.log("count 1 = ", await getPosts());
  await increment();
  console.log("count 2 = ", await getPosts());
});
