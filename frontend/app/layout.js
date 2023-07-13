"use client"
import './globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  hardhat
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '@/components/Layout/Layout';

const { chains, publicClient } = configureChains(
  [hardhat],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

/*
export const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.goerli, chain.rinkeby, chain.kovan, chain.ropsten],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
        jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) }),
        publicProvider(),
    ],
);
*/

const { connectors  } = getDefaultWallets({
  appName: 'Padel Connect',
  projectId:'ea0cd859091151569ea66d64014c6434',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <ChakraProvider>
              <Layout>
                {children}
              </Layout>
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}