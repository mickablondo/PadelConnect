"use client"
import styles from './page.module.css'

import { Flex, useToast, Card, CardBody, AbsoluteCenter, SimpleGrid, CardHeader, Text, Button, Heading, CardFooter } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

// WAGMI & VIEM
import { createPublicClient, http, parseAbiItem  } from 'viem'
import { hardhat } from 'viem/chains'
import { useAccount } from 'wagmi'

import NotConnected from '@/components/NotConnected/NotConnected'
import Link from 'next/link'
import Contract from '../artifacts/contracts/PadelConnect.sol/PadelConnect.json'

export default function Home() {

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  })

  // DATE : console.log(new Date(dateInSecs * 1000));

  const [events, setEvents] = useState([])
  const { isConnected, address } = useAccount()

  useEffect(() => {
    async function fetchData() {
      const blockNumber = await client.getBlockNumber();
      console.log("blocknumber : ", blockNumber)
    }
    fetchData();
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
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Rouen</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P100<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
                <Link href="/tournament/1">
                  <Button>Aller à la fiche</Button>
                </Link>
                </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Caen</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P50<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
                <Link href="/tournament/2">
                  <Button>Aller à la fiche</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Strasbourg</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P50<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
              <Link href="/tournament/3">
                  <Button>Aller à la fiche</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Paris</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P50<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
              <Link href="/tournament/4">
                  <Button>Aller à la fiche</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Nantes</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P50<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
              <Link href="/tournament/5">
                  <Button>Aller à la fiche</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>Tournoi de Bordeaux</Heading>
              </CardHeader>
              <CardBody>
                <Text>Niveau : P50<br/>
                    Date : 01/08/2023<br/>
                    Places restantes : 5</Text>
              </CardBody>
              <CardFooter>
              <Link href="/tournament/6">
                  <Button>Aller à la fiche</Button>
                </Link>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </AbsoluteCenter>
      ) : (
        <NotConnected />
      )}
      </Flex>
  )
}
