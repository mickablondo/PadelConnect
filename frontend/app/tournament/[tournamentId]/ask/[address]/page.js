"use client"
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
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
    const [managerAddress, setManagerAddress] = useState();
    const toast = useToast();
    const router = useRouter();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const MAX_MESSAGES = 10; // 10 derniers messages affichés seulement

    // snippet for 'Expected server HTML to contain a matching ...'
    const [mounted, setMounted] = useState(false);

    const writeMessage = async () => {
        try {
            let functionToCall = "addMessageToManager";
            let paramsToBC = [params.tournamentId];
            if(managerAddress === address) {
                functionToCall = "addResponseToPlayer";
                paramsToBC.push(params.address);
            }
            paramsToBC.push(addingComment);

            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: functionToCall,
                args: paramsToBC
            });
            await writeContract(request);

            getMessages();
            setAddingComment('');

            toast({
                title: 'Message ajouté.',
                description: "Le message a bien été ajouté.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        } catch(err) {
            let description = 'Une erreur est survenue.';
            if(err.details.includes('Wait')) description = "Merci d'attendre avant de poster un message à nouveau.";
            toast({
                title: 'Error.',
                description: description,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    const getMessages = async () => {
        // recherche des messages à afficher
        const data = await readContract({
            address: contractAddress,
            abi: Contract.abi,
            functionName: "getMessagesManagerPlayer",
            args: [params.tournamentId, params.address],
            account: address
        });

        let start_messages = 0;
        if(data.length > MAX_MESSAGES) {
            start_messages = (parseInt(data.length)-MAX_MESSAGES+1);
        }

        setComments([]);

        for (let i = start_messages; i <= parseInt(data.length)-1; i++) {
            setComments(oldComments => [...oldComments, {
                message: data[i].message, author: data[i].author
            }]);
        }
    }

    useEffect(() => {
        async function getInfos() {
            if(isConnected) {
                // vérif de l'utilisateur connecté : seulement player et le manager
                const managerAddressFromBc = await getManager(params.tournamentId, address);
                setManagerAddress(managerAddressFromBc);
                if(params.address !== address && managerAddressFromBc !== address) {
                    router.replace('/');
                }

                getMessages();
            }
        }
        setMounted(true);
        getInfos();
      }, [address]);

    return ( mounted && 
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