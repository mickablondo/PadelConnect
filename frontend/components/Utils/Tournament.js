"use client"
import Contract from '../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';
import { readContract } from '@wagmi/core';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getTournamentInfos = async (id, address) => {
  const data = await readContract({
      address: contractAddress,
      abi: Contract.abi,
      functionName: "tournaments",
      args: [id],
      account: address
    });

  return data;
}

export const getTournamentsByManager = async (address) => {
  const data = await readContract({
    address: contractAddress,
    abi: Contract.abi,
    functionName: "getTournaments",
    account: address
  });

  return data;
}

export const getManager = async (id, address) => {
  const data = await readContract({
    address: contractAddress,
    abi: Contract.abi,
    functionName: "linkManagerTournament",
    args: [id],
    account: address
  });

  return data;
}