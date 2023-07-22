import { createPublicClient, http } from 'viem'
import { hardhat, sepolia, goerli } from 'viem/chains';

export const Client = () => {

    // local
    if(process.env.NEXT_PUBLIC_ENV == 'local') {
        return createPublicClient({
            chain: hardhat,
            transport: http(),
        });
    }

    // goerli
    return createPublicClient({
        chain: goerli,
        transport: http(),
    });
}