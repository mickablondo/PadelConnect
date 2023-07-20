"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotConnected from '@/components/NotConnected/NotConnected';
import { getManager } from '@/components/Utils/Tournament';
import Contract from '../../../../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount } from 'wagmi';
import InputEmoji from "react-input-emoji";
import { AbsoluteCenter, Button, Flex, HStack, Table, TableContainer, Tbody, Td, Text, Tr, useToast } from '@chakra-ui/react';

const Ask = () => {
    const { isConnected, address } = useAccount();
    const params = useParams();
    const [comments, setComments] = useState([]);
    const [addingComment, setAddingComment] = useState('');
    const toast = useToast();
    const router = useRouter();

    const writeMessage = async () => {

    }

    useEffect(() => {
        async function getMessages() {
            if(isConnected) {
                // vérif de l'utilisateur connecté : seulement player et le manager
                const managerAddressFromBc = await getManager(params.tournamentId, address);
                console.log('address', address); 
                console.log('params.address', params.address);
                console.log('managerAddressFromBc', managerAddressFromBc);
                if(params.address !== address || managerAddressFromBc !== address) {
                    router.replace('/');
                }

                // recherche des messages à afficher

            }
        }
        getMessages();
      }, [address]);

    return (
        <>
            {isConnected ? (
                <AbsoluteCenter>
                    <Flex flexDirection='column'>
                        <Text fontSize='4xl'>Posez vos questions au responsable du tournoi :</Text>
                        <TableContainer>
                            <Table variant='striped' colorScheme='teal' style={{borderCollapse:"separate", borderSpacing:"0 0.5em"}}>
                                <Tbody>
                                    {comments.map(commentToWrite =>(
                                    <Tr key={uuidv4()}>
                                        <Td>
                                            <Text>{commentToWrite.author} {managerAddress === commentToWrite.author && '(responsable)'} : </Text> 
                                            <Text align='right'>{commentToWrite.message}</Text>
                                        </Td>
                                    </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <HStack spacing='24px'>
                            <InputEmoji value={addingComment} onChange={setAddingComment} placeholder="Mon message ..."/>
                            <Button colorScheme='whatsapp' onClick={() => writeMessage()}>Envoyer</Button>
                        </HStack>
                    </Flex>
                </AbsoluteCenter>
            ) : (
                <NotConnected />
            )}
        </>
    )
}

export default Ask