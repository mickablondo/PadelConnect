"use client"
import Contract from '../../artifacts/contracts/PadelConnect.sol/PadelConnect.json'

// WAGMI
import { readContract } from '@wagmi/core'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const isManager = async (addressToCheck) => {
    const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "managers",
        args: [addressToCheck],
        account: addressToCheck
    });

    return data;
}

export const isOwner = async (addressToCheck) => {
    const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "owner",
        account: addressToCheck
    });

    return data == addressToCheck;
}