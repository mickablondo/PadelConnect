"use client"
import styles from './page.module.css'

import { Flex, Card, CardBody, AbsoluteCenter, SimpleGrid, CardHeader, Text, Button, Heading, CardFooter } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

// VIEM
import { createPublicClient, http, parseAbiItem  } from 'viem'
import { hardhat } from 'viem/chains'

// WAGMI
import { useAccount } from 'wagmi'

import NotConnected from '@/components/NotConnected/NotConnected'
import Link from 'next/link'
import { EnumDifficulty } from '@/components/Utils/EnumDifficulty'
import { getTournamentInfos } from '@/components/Utils/Tournament'

export default function Home() {

  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  })

  const [tournaments, setTournaments] = useState([])
  const { isConnected, address } = useAccount()

  const getTournamnentEvents = async() => {
    const tournamentsLogs = await client.getLogs({
        event: parseAbiItem('event TournamentCreated(uint id)'),
        fromBlock: 0n
    });
    const lastTournamentsId = tournamentsLogs.slice(-12); // récupération des 12 derniers tournois enregistrés

    lastTournamentsId.map(async log => {
      const data = await getTournamentInfos(log.args.id, address);
      setTournaments(oldTournaments => [...oldTournaments, {
        id: data[0], city: data[1], date: data[2], difficulty: data[3], availables: data[4]
      }]);
    });
  }

  useEffect(() => {
    async function getTournaments() {
      if(isConnected) {
        await getTournamnentEvents();
      }
    }
    getTournaments();
  }, [address])

  return (
    <Flex 
      width="100%" 
      direction={["column", "column", "row", "row"]} 
      alignItems={["center", "center", "flex-start", "flex-start"]}
      flexWrap="wrap"
    >
      {isConnected ? (
        <AbsoluteCenter>
          <SimpleGrid columns={4} spacing={4}>
            {tournaments.map(tournament => (
              <Card key={tournament.id} variant='filled'>
                <CardHeader>
                  <Heading size='md'>Tournoi de {tournament.city}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>Niveau : {EnumDifficulty[tournament.difficulty]}<br/>
                      Date : {new Date(parseInt(tournament.date) * 1000).toLocaleDateString("fr")} <br/>
                      Places restantes : {tournament.availables}</Text>
                </CardBody>
                <CardFooter>
                  <Link href={"/tournament/" + tournament.id}>
                    <Button colorScheme='blue'>Aller à la fiche</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </AbsoluteCenter>
      ) : (
        <NotConnected />
      )}
      </Flex>
  )
}
