"use client"
import { Flex, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Flex
        p="2rem"
        justifyContent="center"
        alignItems="center"
    >
        <Text as='cite'>All rights reserved &copy; PadelConnect Company {new Date().getFullYear()}</Text>
    </Flex>
  )
}

export default Footer