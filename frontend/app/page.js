"use client"
import styles from './page.module.css'

import { Flex, useToast } from '@chakra-ui/react'
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

// WAGMI & VIEM
import { createPublicClient, http, parseAbiItem  } from 'viem'
import { hardhat } from 'viem/chains'
import { useAccount } from 'wagmi'

import NotConnected from '@/components/NotConnected/NotConnected'

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
        <span>Tu es connecté : {address}</span>
      ) : (
        <NotConnected />
      )}
      </Flex>
  )
}
