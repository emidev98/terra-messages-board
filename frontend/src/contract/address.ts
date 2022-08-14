// sync-ed from root via `tr sync-refs`
import config from "../refs.terrain.json"
export const contractAdress = (wallet) => {
    return config[wallet.network.name].board.contractAddresses.default;
}
