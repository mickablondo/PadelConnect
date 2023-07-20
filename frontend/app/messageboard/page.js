"use client"
import { v4 as uuidv4 } from 'uuid';
import { isManager } from '@/components/Utils/Role';
import NotConnected from '@/components/NotConnected/NotConnected';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTournamentInfos, getTournamentsByManager } from '@/components/Utils/Tournament';
import { AbsoluteCenter, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import Contract from '../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';
import Link from 'next/link';

const MessageBoard = () => {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const [exchanges, setExchanges] = useState([]);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    const getPlayers = async () => {
        setExchanges([]);
        const listTournaments = await getTournamentsByManager(address);
        listTournaments.map(async tournamentId => {
            const dataExchanges = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getExchanges",
                args: [tournamentId],
                account: address
            });

            dataExchanges.map(async playerAddr => {
                const tInfos = await getTournamentInfos(tournamentId, address);
                setExchanges(oldExchange => [...oldExchange, {id : tournamentId, city: tInfos[1], player: playerAddr}]);
            });
        });
    }

    useEffect(() => {
        async function getInfos() {
            // check if the user is a manager, else redirect to main page
            const dataOwner = await isManager(address);
            if(!dataOwner) router.replace('/');

            getPlayers();
        }
        getInfos();
    }, [address])

    return (
        <>
        {isConnected ? (
            <AbsoluteCenter>
                <HStack spacing='30px'>
                <TableContainer>
                <Table variant='simple' style={{borderCollapse:"separate", borderSpacing:"0 0.5em"}}>
                  <Thead>
                    <Tr>
                        <Th>Tournoi</Th>
                        <Th>
                            Joueurs souhaitant discuter
                        </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {exchanges.length > 0 ? (
                      exchanges.map(exchange =>(
                      <Tr key={uuidv4()}>
                        <Td>
                            <Text>{exchange.city}</Text>
                        </Td>
                        <Td>
                            <Link href={"/tournament/" + exchange.id + "/ask/" + exchange.player}>
                                <Text as='kbd'>{exchange.player}</Text>
                            </Link>
                        </Td>
                      </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td>
                          <Text>Aucun commentaire reçu.</Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
                </TableContainer>
                </HStack>
            </AbsoluteCenter>
        ) : (
            <NotConnected />
        )}
        </>
    )
}

export default MessageBoard