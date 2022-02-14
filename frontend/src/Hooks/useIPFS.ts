import * as IPFS from 'ipfs-core'

let IPFS_INSTANCE : IPFS.IPFS | undefined;

export async function useIPFS(): Promise<IPFS.IPFS> {
    if(IPFS_INSTANCE) return IPFS_INSTANCE;
    else {
        IPFS_INSTANCE = await IPFS.create();
        return IPFS_INSTANCE;
    }
}