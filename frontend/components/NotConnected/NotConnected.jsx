import React from 'react'
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, AbsoluteCenter } from '@chakra-ui/react'

const NotConnected = () => {
  return (
    <Box>
      <AbsoluteCenter>
        <Alert status='warning'>
          <AlertIcon />
          <AlertTitle>Please connect your Wallet.</AlertTitle>
          <AlertDescription>Click on the 'connect wallet' button a the top right of the page.</AlertDescription>
        </Alert>
      </AbsoluteCenter>
    </Box>
  )
}

export default NotConnected