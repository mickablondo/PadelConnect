"use client"
import NotConnected from '@/components/NotConnected/NotConnected';
import { isOwner } from '@/components/Utils/Role';
import { AbsoluteCenter, Button, Flex, HStack, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { prepareWriteContract, writeContract } from '@wagmi/core'
import { parseAbiItem  } from 'viem'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Client } from '@/components/Utils/Client';
import { v4 as uuidv4 } from 'uuid';
import Contract from '../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';

const Admin = () => {

  const { isConnected, address } = useAccount();
  const router = useRouter();
  const toast = useToast();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const [managers, setManagers] = useState([]);
  const [managerAddress, setManagerAddress] = useState([]);

  const getManagers = async() => {
    setManagers([]);
    const managersLogs = await Client().getLogs({
        event: parseAbiItem('event ManagerAdded(address _address)'),
        fromBlock: 0n
    });

    managersLogs.map(async log => {
      setManagers(oldManagers => [...oldManagers, log.args._address]);
    });
  }

  const addManager = async () => {
    try {
      const { request } = await prepareWriteContract({
          address: contractAddress,
          abi: Contract.abi,
          functionName: "addManager",
          args: [managerAddress]
      });
      await writeContract(request);

      getManagers();

      toast({
          title: 'Manager ajouté',
          description: "Un nouveau responsable a été ajouté.",
          status: 'success',
          duration: 4000,
          isClosable: true,
      })
    } catch(err) {
        console.log(err);
        toast({
            title: 'Error.',
            description: 'Une erreur est survenue.',
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
    }
  };

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
        <AbsoluteCenter>
          <Flex>
            <HStack spacing='30px'>
              <HStack spacing='24px'>
                <Input onChange={e => setManagerAddress(e.target.value)} placeholder="0x..." />
                <Button colorScheme='whatsapp' onClick={() => addManager()}>Ajouter</Button>
              </HStack>
              <TableContainer>
                <Table variant='simple' style={{borderCollapse:"separate", borderSpacing:"0 0.5em"}}>
                  <Thead>
                    <Tr>
                      <Th>
                        Adresses des responsables de tournoi
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {managers.length > 0 ? (
                      managers.map(manager =>(
                      <Tr key={uuidv4()}>
                        <Td>
                            <Text as='kbd'>{manager}</Text>
                        </Td>
                      </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td>
                          <Text>Aucun responsable ajouté.</Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </HStack>
          </Flex>
        </AbsoluteCenter>
      ) : (
        <NotConnected />
      )}
    </>
  )
}

export default Admin