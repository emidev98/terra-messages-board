import { useWallet } from '@terra-dev/use-wallet'
import { Button } from 'primereact/button';

export const DisconnectWallet = () => {
    const { disconnect } = useWallet()

    return (
        <div>
            <Button
                onClick={() => disconnect()}
                type="button"
            >
                Disconnect
            </Button>
        </div>
    )
}
