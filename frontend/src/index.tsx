import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.scss'
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'
import PrimeReact from 'primereact/api';

PrimeReact.ripple = true;

(async function init() {
  const chainOptions = await getChainOptions();
  
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <App />
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  )
})();