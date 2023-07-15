"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTournamentInfos } from '@/components/Utils/Tournament';
import { isManager } from '@/components/Utils/Role';
import { Button, Checkbox, Flex, HStack, Heading, Input, SimpleGrid, Table, TableCaption, TableContainer, Tbody, Td, Text, Tr, useToast } from '@chakra-ui/react';
import NotConnected from '@/components/NotConnected/NotConnected';
import { EnumDifficulty } from '@/components/Utils/EnumDifficulty';
import Contract from '../../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';
import NextLink  from 'next/link';
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
    const [isFollowing, setIsFollowing] = useState(false);
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
                // recherche des infos    
                const data = await getTournamentInfos(id, address);
                setTournamentSelected((prevState => ({
                    ...prevState,
                    id: data[0], city: data[1], date: data[2], difficulty: data[3], availables: data[4], winner1: data[5]
                })));

                // recherche du rôle
                const dataManager = await isManager(address);
                setIsManagerValue(dataManager);

                // recherche si l'utilisateur suit le tournoi
                const followData = await readContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "followedTournaments",
                    args: [id, address],
                    account: address
                });
                if(followData) setIsFollowing(true);
                else setIsFollowing(false);
            }
        }
        getInfos(params.tournamentId);
      }, [address]);

    return (
        <>
            {isConnected ? (
                <Flex       
                flexDirection='column'
                alignItems="center"
                p="2rem"
                width="100%"
                >
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    p="2rem"
                    width="100%"
                    height="95%"
                >
                    <TableContainer>
                        <Table variant='striped' colorScheme='teal'>
                            <TableCaption>
                                <Checkbox size='md' colorScheme='green' isChecked={isFollowing}
                                    onChange={(e) => changee.target.checked}
                                >
                                    Suivre le tournoi
                                </Checkbox>
                            </TableCaption>
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
                {tournamentSelected !== undefined && tournamentSelected.winner1 == ZERO_ADDRESS && 
                    <Flex
                        p="2rem"
                        justifyContent="right"
                        alignItems="center"
                        width="100%"
                        height="5%"
                    >
                        <HStack spacing='24px'>
                            <NextLink href={'/tournament/' + params.tournamentId + '/inscription'}>
                                <Button colorScheme='telegram'>S'inscrire</Button>
                            </NextLink>
                            <NextLink href={'/tournament/' + params.tournamentId + '/ask'}>
                                <Button colorScheme='telegram'>Contacter le responsable du tournoi</Button>
                            </NextLink>
                        </HStack>
                    </Flex>
                }
                </Flex>
            ) : (
                <NotConnected />
            )}
        </>
    )
}

export default Tournament