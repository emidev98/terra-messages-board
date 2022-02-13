module.exports = ({ wallets, refs, config, client }) => ({
  getPosts: () => client.query("board", { get_posts: {} }),
  increment: (signer = wallets.validator) =>
    client.execute(signer, "board", { increment: {} }),
});
