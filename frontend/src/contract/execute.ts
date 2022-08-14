import { LCDClient, MsgExecuteContract, Fee } from "@terra-money/terra.js";
import { Post } from "../models/Post";
import { contractAdress } from "./address";

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg) =>
    async (wallet) => {
      const lcd = new LCDClient({
        URL: wallet.network.lcd,
        chainID: wallet.network.chainID,
      });

      const { result } = await wallet.post({
        msgs: [
          new MsgExecuteContract(
            wallet.walletAddress,
            contractAdress(wallet),
            msg
          ),
        ],
      });

      while (true) {
        try {
          const txInfo = await lcd.tx.txInfo(result.txhash);

          return txInfo.tx.body.messages;
        } catch (e) {
          if (Date.now() < untilInterval) {
            await sleep(500);
          } else if (Date.now() < until) {
            await sleep(1000 * 10);
          } else {
            throw new Error(
              `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
            );
          }
        }
      }
    };

// ==== execute contract ====
export const createPost = async (wallet, post: Post) =>
  _exec({
    create_post: {
      title: post.title,
      body: post.body,
      image: post.image
    }
  })(wallet);

export const toggleUpvote = async (wallet, index: number) =>
  _exec({
    toggle_upvote_post: { index }
  })(wallet);