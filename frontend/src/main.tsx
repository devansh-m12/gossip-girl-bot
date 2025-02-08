import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@coinbase/onchainkit/styles.css'
import { OnchainKitProvider } from '@coinbase/onchainkit'

const solanaDevnet = {
  id: 501,
  name: 'Solana Devnet',
  network: 'solana-devnet',
  nativeCurrency: {
    name: 'SOL',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: { http: ['https://api.devnet.solana.com'] },
  },
  
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/?cluster=devnet',
    },
  },
};



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
      chain={solanaDevnet}
    >
      <App />
    </OnchainKitProvider>
  </StrictMode>,
)