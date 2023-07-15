"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTournamentInfos } from '@/components/Utils/Tournament';
import { useAccount } from 'wagmi';
import { isManager } from '@/components/Utils/Role';
import { AbsoluteCenter, Box, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import NotConnected from '@/components/NotConnected/NotConnected';
import { EnumDifficulty } from '@/components/Utils/EnumDifficulty';

/**
 * Fiche tournoi
 */
const Tournament = () => {
    const { isConnected, address } = useAccount()
    const params = useParams();
    const [isManagerValue, setIsManagerValue] = useState(false);
    const [tournamentSelected, setTournamentSelected] = useState();

    useEffect(() => {
        async function getInfos(id) {
            if(isConnected) {
              const data = await getTournamentInfos(id, address);
              setTournamentSelected((prevState => ({
                ...prevState,
                id: data[0], city: data[1], date: data[2], difficulty: data[3], availables: data[4]
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
                <AbsoluteCenter>
                <Flex flexDirection='column'>
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
                {isManagerValue && <Text>Add winner</Text>}
                <Text>Le CHAT</Text>
                </Flex>
                </AbsoluteCenter>
            ) : (
                <NotConnected />
            )}
        </>
    )
}

export default Tournament