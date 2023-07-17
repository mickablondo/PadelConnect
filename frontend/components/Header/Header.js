"use client"
import { Flex, Center, Menu, MenuButton, MenuItem, MenuList, Icon, IconButton, Image, Heading, Highlight } from '@chakra-ui/react';
import { HamburgerIcon, PlusSquareIcon, SettingsIcon, EmailIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MdHome, MdAccountCircle } from 'react-icons/md';
import NextLink  from 'next/link';
import { useEffect, useState } from 'react';
import { isManager, isOwner } from '../Utils/Role';

// WAGMI
import { useAccount } from 'wagmi'
import Link from 'next/link';

const Header = () => {

  const { isConnected, address } = useAccount();
  const [isOwnerValue, setIsOwnerValue] = useState(false);
  const [isManagerValue, setIsManagerValue] = useState(false);

  useEffect(() => {
    async function getRole() {
      if(isConnected) {
        let data = await isManager(address);
        setIsManagerValue(data);

        data = await isOwner(address);
        setIsOwnerValue(data);
      }
    }
    getRole();
  }, [address])

  return (
    <Flex
        justifyContent="space-between"
        alignItems="center"
        p="2rem"
    >
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
          />
          <MenuList>
            <NextLink href={'/'}>
              <MenuItem icon={<Icon as={MdHome}/>}>
                Accueil
              </MenuItem>
            </NextLink>
            <NextLink href={'/profile'}>
              <MenuItem icon={<Icon as={MdHome}/>}>
                Mon profil
              </MenuItem>
            </NextLink>
            { isOwnerValue &&
            <NextLink href={'/admin'}>
              <MenuItem icon={<SettingsIcon />}>
                Ajouter un responsable de tournoi
              </MenuItem>
            </NextLink>
            }
            { isManagerValue && 
            <>
              <NextLink href={'/tournament/add'}>
                <MenuItem icon={<PlusSquareIcon />}>
                  Ajouter un tournoi
                </MenuItem>
              </NextLink>
              <NextLink href={'/messageboard'}>
                <MenuItem icon={<EmailIcon />}>
                  Messagerie
                </MenuItem>
              </NextLink>
            </>
            }
          </MenuList>
        </Menu>
        <Link href="/">
        <Flex>
            <Image
              boxSize='60px'
              objectFit='cover'
              src='/padel.png'
            />
            <Center>
              <Heading lineHeight='tall'>
                <Highlight
                  query='- Padel Connect -'
                  styles={{ px: '2', py: '1', rounded: 'full', bg: 'green.100' }}
                >
                  - Padel Connect -
                </Highlight>
              </Heading>
            </Center>
            <Image
              boxSize='60px'
              objectFit='cover'
              src='/padel.png'
            />
        </Flex>
        </Link>
        <ConnectButton />
    </Flex>
  )
}

export default Header