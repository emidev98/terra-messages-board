import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { DisconnectWallet } from '../DisconnectWallet/DisconnectWallet';
import './AppHeader.scss';

export const AppHeader = () => {
    const { status } = useWallet();

    return (
        <header className="AppHeader">
            <h1>Terra Board</h1>

            {status === WalletStatus.WALLET_CONNECTED ? (
                <DisconnectWallet />
            ) : (
                <ConnectWallet />
            )}
        </header>
    )
}
