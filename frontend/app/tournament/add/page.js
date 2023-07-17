"use client"
import { AbsoluteCenter, Button, Flex, FormControl, FormLabel, Input, Select, Text, useToast } from "@chakra-ui/react"
import { EnumDifficulty } from "@/components/Utils/EnumDifficulty";
import { prepareWriteContract, writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi';
import { isManager } from "@/components/Utils/Role";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState  } from "react";
import { useRouter } from 'next/navigation';
import NotConnected from "@/components/NotConnected/NotConnected";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Contract from '../../../artifacts/contracts/PadelConnect.sol/PadelConnect.json';

const AddTournament = () => {

  const { isConnected, address } = useAccount()
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [startDate, setStartDate] = useState(tomorrow);
  const [playersNumber, setPlayersNumber] = useState();
  const [difficulty, setDifficulty] = useState();
  const [city, setCity] = useState();
  const toast = useToast();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const addTournament = async () => {
    // check champs requis
    if(difficulty == undefined || startDate == undefined || city == undefined || playersNumber == undefined || 
        difficulty == '' || startDate == '' || city == '' || playersNumber == '') {
      toast({
        title: 'Champs obligatoires',
        description: 'Tous les champs doivent être renseignés.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
    } else {
      // recherche de l'id de la difficulté
      let idDiff;
      for(let i=0; i < EnumDifficulty.length; i++) {
        if(EnumDifficulty[i] == difficulty) {
          idDiff = i;
          break;
        }
      }

      // create tournament
      try {
        const { request } = await prepareWriteContract({
            address: contractAddress,
            abi: Contract.abi,
            functionName: "addTournament",
            args: [city, Math.floor(startDate.getTime() / 1000), idDiff, playersNumber]
        });
        await writeContract(request);

        toast({
            title: 'Tournoi ajouté.',
            description: "Le nouveau tournoi a bien été ajouté.",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
      } catch(err) {
        toast({
            title: 'Error.',
            description: 'Une erreur est survenue.',
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
      }
    }
  };

  useEffect(() => {
    async function getInfos() {
      if(isConnected) {
        // recherche du rôle
        const dataManager = await isManager(address);
        if(!dataManager) router.replace('/');
      }
    }
    getInfos();
  })

  return (
    <>
      {isConnected ? (
        <AbsoluteCenter>
          <Text fontSize='6xl'>Créer un nouveau tournoi</Text>
          <FormControl isRequired>
            <FormLabel>Ville</FormLabel>
            <Input onChange={e => setCity(e.target.value)} placeholder='Paris' />
            <FormLabel>Nombre de joueurs</FormLabel>
            <Input onChange={e => setPlayersNumber(e.target.value)} placeholder='10' />
            <FormLabel>Niveau</FormLabel>
            <Select placeholder='Sélectionner le niveau' onChange={(e) => setDifficulty(e.target.value)}>
              {EnumDifficulty.map(diff => (
                <option key={uuidv4()}>{diff}</option>
              ))}
            </Select>
            <FormLabel>Date</FormLabel>
            <ReactDatePicker dateFormat='dd/MM/yyyy' selected={startDate} onChange={(date) => setStartDate(date)} />
          </FormControl>
          <Flex justifyContent="right">
            <Button colorScheme='whatsapp' onClick={() => addTournament()}>Ajouter</Button>
          </Flex>
        </AbsoluteCenter>
      ) : (
        <NotConnected />
      )}
    </>
  )
}

export default AddTournament