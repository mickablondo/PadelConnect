"use client"
import NotConnected from '@/components/NotConnected/NotConnected';
import { getTournamentInfos } from '@/components/Utils/Tournament';
import { Client } from '@/components/Utils/Client';
import Contract from '../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';
import { AbsoluteCenter, Flex, HStack, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core'
import { parseAbiItem  } from 'viem';
import { MdCheckCircle } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import Link  from 'next/link';

const Profil = () => {
    const { isConnected, address } = useAccount();
    const [listFollowed, setListFollowed] = useState([]);
    const [listRegistered, setListRegistered] = useState([]);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    // snippet for 'Expected server HTML to contain a matching ...'
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        async function getFollowedTournaments() {
            if(isConnected) {
                setListFollowed([]);
                const followedTournamentsLogs = await Client().getLogs({
                    event: parseAbiItem('event TournamentFollowed(uint tournamentId, address player)'),
                    fromBlock: BigInt(process.env.NEXT_PUBLIC_NODE_NUMBER)
                });

                followedTournamentsLogs.map(async log => {
                    if(log.args.player === address) {
                        // recherche si l'utilisateur suit toujours le tournoi
                        const followData = await readContract({
                            address: contractAddress,
                            abi: Contract.abi,
                            functionName: "followedTournaments",
                            args: [log.args.tournamentId, address],
                            account: address
                        });

                        if(followData) {
                            // recherche des informations du tournoi
                            const data = await getTournamentInfos(log.args.tournamentId, address);
                            setListFollowed(oldTournaments => [...oldTournaments, {
                                id: data[0], city: data[1], date: data[2], availables: data[4], winner1: data[5], winner2: data[6]
                            }]);
                        }
                    }
                });
            }
        }

        async function getRegisterTournaments() {
            if(isConnected) {
                setListRegistered([]);
                const registersData = await readContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "getTournamentsByPlayer",
                    account: address
                });

                registersData.map(async registerData => {
                    // recherche des informations du tournoi
                    const data = await getTournamentInfos(registerData, address);
                    setListRegistered(oldRegistered => [...oldRegistered, {
                        id: data[0], city: data[1], date: data[2]
                    }]);
                });
            }
        }
        setMounted(true);
        getFollowedTournaments();
        getRegisterTournaments();
    }, [address]);

    return ( mounted && 
        <>
            {isConnected ? (
                <AbsoluteCenter>
                    <HStack spacing='30px'>
                        <Flex flexDirection='column'>
                        <Text fontSize='6xl'>Mes tournois suivis :</Text>
                        {listFollowed.length > 0 ? (
                            <List spacing={3}>
                            {listFollowed.map(tournamentFollowed => (
                                <ListItem key={uuidv4()}>
                                    <HStack spacing='30px'>
                                        <ListIcon as={MdCheckCircle} color='green.500' />
                                        <Link href={"/tournament/" + tournamentFollowed.id}><Text as='b'>{tournamentFollowed.city}</Text></Link>
                                        {Math.floor(new Date() / 1000) > tournamentFollowed.date ? (
                                            tournamentFollowed.winner1 == ZERO_ADDRESS ? (
                                                <Text>Tournoi démarré, vainqueurs inconnus pour le moment.</Text>
                                            ) : (
                                                <Text>Tournoi terminé, les vainqueurs sont {tournamentFollowed.winner1} et {tournamentFollowed.winner2}.</Text>
                                            )
                                        ) : (
                                            <Text as='i'>Tournoi non commencé - il reste {tournamentFollowed.availables} places.</Text>
                                        )}
                                    </HStack>
                                </ListItem>
                            ))}
                            </List>
                        ) : (
                            <Text fontSize='4xl' as='i'>Aucun tournoi suivi.</Text>
                        )}
                        </Flex>
                        <Flex flexDirection='column'>
                            <Text fontSize='6xl'>Mes inscriptions :</Text>
                            {listRegistered.length > 0 ? (
                                <List spacing={3}>
                                {listRegistered.map(tournamentRegistered => (
                                    <ListItem key={uuidv4()}>
                                        <HStack spacing='30px'>
                                            <ListIcon as={MdCheckCircle} color='green.500' />
                                            <Link href={"/tournament/" + tournamentRegistered.id}><Text as='b'>{tournamentRegistered.city}</Text></Link>
                                            <Text> le {new Date(parseInt(tournamentRegistered.date) * 1000).toLocaleDateString("fr")}</Text>
                                        </HStack>
                                    </ListItem>
                                ))}
                                </List>
                            ) : (
                                <Text fontSize='4xl' as='i'>Aucune inscription réalisée.</Text>
                            )}
                        </Flex>
                    </HStack>
                </AbsoluteCenter>
            ) :(
                <NotConnected />
            )}
        </>
    )
}

export default Profil