"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getTournamentInfos, getManager } from '@/components/Utils/Tournament';
import { isManager } from '@/components/Utils/Role';
import { Button, Card, Checkbox, Flex, HStack, Heading, Input, SimpleGrid, Table, TableCaption, TableContainer, Tbody, Td, Text, Tr, useToast } from '@chakra-ui/react';
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
    const [managerAddress, setManagerAddress] = useState();
    const [isFollowing, setIsFollowing] = useState(false);
    const [comments, setComments] = useState([]);
    const [addingComment, setAddingComment] = useState();
    const toast = useToast();

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const MAX_MESSAGES = 10;

    const getMessages = async (id) => {
        let data = await readContract({
            address: contractAddress,
            abi: Contract.abi,
            functionName: "idComments",
            args: [id],
            account: address
        });

        let start_messages = 0;
        if(parseInt(data) > MAX_MESSAGES) {
            start_messages = (parseInt(data)-MAX_MESSAGES+1);
        }

        setComments([]);
        for (let i = start_messages; i <= parseInt(data)-1; i++) {
            let comment = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "comments",
                args: [id, i],
                account: address
            });
            setComments(oldComments => [...oldComments, {
                message: comment[0], author: comment[1]
            }]);
        }
    }

    const writeMessage = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "addComment",
                args: [params.tournamentId, addingComment]
            });
            await writeContract(request);

            getMessages(params.tournamentId);
            setAddingComment('');

            toast({
                title: 'Message ajouté.',
                description: "Le message a bien été ajouté.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        } catch(err) {
            let description = 'Une erreur est survenue.';
            if(err.details.includes('Wait')) description = "Merci d'attendre avant de poster un message à nouveau.";
            toast({
                title: 'Error.',
                description: description,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    const send = async () => {
        if(winner1 == undefined || winner2 == undefined ||
            winner1 == '' || winner2 == '') {
            toast({
                title: 'Champs obligatoires',
                description: 'Tous les champs doivent être renseignés.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
              })
        } else {
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
                    title: 'Error',
                    description: "Une erreur est survenue.",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
    }

    const changeFollow = async (follow) => {
        const { request } = await prepareWriteContract({
            address: contractAddress,
            abi: Contract.abi,
            functionName: "followTournament",
            args: [params.tournamentId, follow]
        });
        await writeContract(request);

        setIsFollowing(follow);
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

                // recherche des messages à afficher
                await getMessages(id);

                // recherche le manager du tournoi
                const managerAddressFromBc = await getManager(id, address);
                setManagerAddress(managerAddressFromBc);
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
                    <Flex width={isManagerValue ? "25%" : "35%" }>
                        <Card variant='filled'>
                            <TableContainer>
                                <Table variant='simple'>
                                    <TableCaption>
                                        <Checkbox size='md' colorScheme='green' isChecked={isFollowing}
                                            onChange={(e) => changeFollow(e.target.checked)}
                                        >
                                            Suivre le tournoi
                                        </Checkbox>
                                    </TableCaption>
                                    <Tbody>
                                        <Tr>
                                            <Td>
                                                <Text as='b'>Ville</Text>
                                            </Td>
                                            <Td>
                                                {tournamentSelected !== undefined ? tournamentSelected.city : ""}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>
                                                <Text as='b'>Date</Text>
                                            </Td>
                                            <Td>
                                                {tournamentSelected !== undefined ? new Date(parseInt(tournamentSelected.date) * 1000).toLocaleDateString("fr") : ""}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>
                                                <Text as='b'>Niveau</Text>
                                            </Td>
                                            <Td>
                                                {tournamentSelected !== undefined ? EnumDifficulty[tournamentSelected.difficulty] : ""}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>
                                                <Text as='b'>Nombre de places disponibles</Text>
                                            </Td>
                                            <Td>
                                                {tournamentSelected !== undefined ? tournamentSelected.availables : ""}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Flex>
                    {isManagerValue && tournamentSelected.winner1 == ZERO_ADDRESS ? (
                        <Flex flexDirection='column' width="20%">
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
                    <Flex flexDirection='column' width={isManagerValue ? "35%" : "50%" }>
                        <TableContainer>
                            <Table variant='striped' colorScheme='teal' style={{borderCollapse:"separate", borderSpacing:"0 0.5em"}}>
                                <Tbody>
                                    {comments.map(commentToWrite =>(
                                    <Tr key={uuidv4()}>
                                        <Td>
                                                <Text>{commentToWrite.author} {managerAddress === commentToWrite.author && '(responsable)'} : </Text> 
                                                <Text align='right'>{commentToWrite.message}</Text>
                                        </Td>
                                    </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <HStack spacing='24px'>
                            <Input value={addingComment} onChange={e => setAddingComment(e.target.value)} placeholder="Mon message ..." />
                            <Button colorScheme='whatsapp' onClick={() => writeMessage()}>Envoyer</Button>
                        </HStack>
                    </Flex>
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