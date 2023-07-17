import { createPublicClient, http } from 'viem'
import { hardhat, sepolia } from 'viem/chains';

export const Client = () => {

    if(process.env.NEXT_PUBLIC_ENV == 'local') {
        return createPublicClient({
            chain: hardhat,
            transport: http(),
        });
    }

    return createPublicClient({
        chain: sepolia,
        transport: http(),
    });
}