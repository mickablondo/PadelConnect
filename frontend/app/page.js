"use client"
import styles from './page.module.css'

import { Flex, useToast, Card, CardBody } from '@chakra-ui/react'
import { useState } from 'react'

// WAGMI & VIEM
import { createPublicClient, http, parseAbiItem  } from 'viem'
import { hardhat } from 'viem/chains'
import { useAccount } from 'wagmi'

import NotConnected from '@/components/NotConnected/NotConnected'
import Link from 'next/link'

export default function Home() {

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  })

  const [events, setEvents] = useState([])

  //ISCONNECTED
  const { isConnected, address } = useAccount()

  const toast = useToast()

  return (
    <Flex 
      width="100%" 
      direction={["column", "column", "row", "row"]} 
      alignItems={["center", "center", "flex-start", "flex-start"]}
      flexWrap="wrap"
    >
      {isConnected ? (
        <Flex>
          <span>Tu es connecté : {address}</span>
          <Card>
          <CardBody>
            <Link href="/tournament/1">Tournoi de Rouen</Link>
          </CardBody>
          </Card>
        </Flex>
      ) : (
        <NotConnected />
      )}
      </Flex>
  )
}
