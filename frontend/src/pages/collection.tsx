'use client';

import '@coinbase/onchainkit/styles.css'; 
import Collection from '@/components/collection';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
 
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base} // add baseSepolia for testing
    >
      {props.children}
    </OnchainKitProvider>
  );
}
 
export default function App() {
  return (
    <Providers>
      <Collection />
    </Providers>
  );
}