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
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

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
        getFollowedTournaments();
    }, [address]);

    return (
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
                    </HStack>
                </AbsoluteCenter>
            ) :(
                <NotConnected />
            )}
        </>
    )
}

export default Profil