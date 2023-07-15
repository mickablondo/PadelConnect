"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTournamentInfos } from '@/components/Utils/Tournament';
import { isManager } from '@/components/Utils/Role';
import { Button, Flex, Heading, Input, SimpleGrid, Table, TableCaption, TableContainer, Tbody, Td, Text, Tr, useToast } from '@chakra-ui/react';
import NotConnected from '@/components/NotConnected/NotConnected';
import { EnumDifficulty } from '@/components/Utils/EnumDifficulty';
import Contract from '../../../artifacts/contracts/PadelConnect.sol/PadelConnect.json'
// WAGMI
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount } from 'wagmi';

/**
 * Fiche tournoi
 */
const Tournament = () => {
    const { isConnected, address } = useAccount()
    const params = useParams();
    const [isManagerValue, setIsManagerValue] = useState(false);
    const [tournamentSelected, setTournamentSelected] = useState();
    const [winner1, setWinner1] = useState();
    const [winner2, setWinner2] = useState();
    const toast = useToast();

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    const send = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "addWinners",
                args: [params.tournamentId, winner1, winner2]
            });
            await writeContract(request);

            const data = await getTournamentInfos(params.tournamentId, address);
            setTournamentSelected((prevState => ({
                ...prevState,
                id: data[0], city: data[1], date: data[2], difficulty: data[3], availables: data[4], winner1: data[5]
            })));

            toast({
                title: 'Tournoi terminé.',
                description: "Les vainqueurs ont bien été ajoutés.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        } catch(err) {
            toast({
                title: 'Error.',
                description: "Une erreur est survenue.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        async function getInfos(id) {
            if(isConnected) {
              const data = await getTournamentInfos(id, address);
              setTournamentSelected((prevState => ({
                ...prevState,
                id: data[0], city: data[1], date: data[2], difficulty: data[3], availables: data[4], winner1: data[5]
              })));

              const dataManager = await isManager(address);
              setIsManagerValue(dataManager);
            }
        }
        getInfos(params.tournamentId);
      }, [address]);

    return (
        <>
            {isConnected ? (
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    p="2rem"
                    width="100%"
                >
                    <TableContainer>
                        <Table variant='striped' colorScheme='teal'>
                            <TableCaption>Informations générales du tournoi</TableCaption>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        <Text>Ville</Text>
                                    </Td>
                                    <Td>
                                        {tournamentSelected !== undefined ? tournamentSelected.city : ""}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Text>Date</Text>
                                    </Td>
                                    <Td>
                                        {tournamentSelected !== undefined ? new Date(parseInt(tournamentSelected.date) * 1000).toLocaleDateString("fr") : ""}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Text>Niveau</Text>
                                    </Td>
                                    <Td>
                                        {tournamentSelected !== undefined ? EnumDifficulty[tournamentSelected.difficulty] : ""}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Text>Nombre de places disponibles</Text>
                                    </Td>
                                    <Td>
                                        {tournamentSelected !== undefined ? tournamentSelected.availables : ""}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {isManagerValue && tournamentSelected.winner1 == ZERO_ADDRESS ? (
                        <Flex flexDirection='column'>
                            <Heading>
                                Ajouter les vainqueurs
                            </Heading>
                            <Flex mt="1rem" flexDirection='column'>
                                <SimpleGrid columns={1} spacing={4}>
                                <Input onChange={e => setWinner1(e.target.value)} placeholder="0X..." />
                                <Input onChange={e => setWinner2(e.target.value)} placeholder="0X..." />
                                <Button colorScheme='whatsapp' onClick={() => send()}>Envoyer</Button>
                                </SimpleGrid>
                            </Flex>
                        </Flex>
                    ) : (
                        isManagerValue && <Heading>Vainqueurs déjà renseignés</Heading>
                    )
                    }
                    <Text>Le CHAT</Text>
                </Flex>
            ) : (
                <NotConnected />
            )}
        </>
    )
}

export default Tournament