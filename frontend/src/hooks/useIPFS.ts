import * as IPFS from 'ipfs-core'
import all from 'it-all';
import { concat } from 'uint8arrays';

let ipfs: IPFS.IPFS | undefined;

export function useIPFS() {

    const readFile = async (fileCid: string) => {
        if (!ipfs) ipfs = await IPFS.create();

        const fileContent = await all(ipfs.cat(fileCid));
        return concat(fileContent);
    }

    const uploadFile = async (file: File) => {
        if (!ipfs) ipfs = await IPFS.create();

        return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const buffer = Buffer.from(reader.result as string)
                const addResult = ipfs?.add(buffer);
                return resolve((await addResult)?.path as string);
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const readFileAndCreateURL = async (fileCid: string) => {
        if (!ipfs) ipfs = await IPFS.create();

        const fileContent = await all(ipfs.cat(fileCid));
        const file = concat(fileContent);

        return URL.createObjectURL(new Blob([file]));
    }

    return {
        readFile,
        uploadFile,
        readFileAndCreateURL
    }
}