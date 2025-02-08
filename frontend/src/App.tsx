import { useState } from 'react'
import { Name } from '@coinbase/onchainkit/identity';
import './App.css'
import { NFTCard, NFTCardDefault } from '@coinbase/onchainkit/nft'; 


function App() {
  const [count, setCount] = useState(0)
  const address = 'DjXxXmBz7QqmdKtpAeGLQDsG9E7xLgE5ckazXicPNRUM';

  return (
    <>
     <NFTCard
  contractAddress='0xb4703a3a73aec16e764cbd210b0fde9efdab8941'
  tokenId='1'
> 
</NFTCard>
    </>
  )
}

export default App
