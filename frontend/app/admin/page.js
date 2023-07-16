"use client"
import NotConnected from '@/components/NotConnected/NotConnected';
import { isOwner } from '@/components/Utils/Role';
import { Flex } from '@chakra-ui/react';
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { parseAbiItem  } from 'viem'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Client } from '@/components/Utils/Client';

const Admin = () => {

  const { isConnected, address } = useAccount();
  const router = useRouter();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const [managers, setManagers] = useState([]);

  const getManagers = async() => {
    setManagers([]);
    const managersLogs = await Client().getLogs({
        event: parseAbiItem('event ManagerAdded(address _address)'),
        fromBlock: 0n
    });

    managersLogs.map(async log => {
      console.log(log.args._address);
      setManagers(oldManagers => [...oldManagers, log.args._address]);
    });
  }

  useEffect(() => {
    async function getInfos() {
      // check if the user is the owner, else redirect to main page
      const dataOwner = await isOwner(address);
      if(!dataOwner) router.replace('/');

      // get the managers
      await getManagers();
    }
    getInfos();
  }, [address]);

  return (
    <>
      {isConnected ? (
        <Flex></Flex>
      ) : (
        <NotConnected />
      )}
    </>
  )
}

export default Admin