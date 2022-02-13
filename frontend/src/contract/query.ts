import { LCDClient } from '@terra-money/terra.js'
import { Post } from '../models/Post';
import { contractAdress } from './address'

export function getPosts(wallet): Promise<Response>{
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_posts: {}});
}

interface Response {
  posts: Array<Post>;
}
