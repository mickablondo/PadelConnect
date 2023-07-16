import { createPublicClient, http  } from 'viem'
import { hardhat } from 'viem/chains'

export const Client = () => {
    return createPublicClient({
        chain: hardhat,
        transport: http(),
    });
}