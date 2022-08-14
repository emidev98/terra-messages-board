import { useWallet } from '@terra-money/wallet-provider';
import { Button } from 'primereact/button';

import './ConnectWallet.scss';

export const ConnectWallet = () => {
  const {
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install
  } = useWallet()

  return (
    <div className='ConnectWallet'>
      {availableInstallTypes.map((connectType) => (
        <Button
          key={`install-${connectType}`}
          onClick={() => install(connectType)}
        >
          Install {connectType}
        </Button>
      ))}
      
      {availableConnectTypes.map((connectType) => (
        <Button
          key={`connect-${connectType}`}
          onClick={() => connect(connectType)}
        >
          {connectType}
        </Button>
      ))}
    </div>
  )
}
