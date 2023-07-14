"use client"
import { Flex, Center, Menu, MenuButton, MenuItem, MenuList, Icon, IconButton, Image, Heading, Highlight } from '@chakra-ui/react';
import { HamburgerIcon, PlusSquareIcon, SettingsIcon, EmailIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MdHome } from 'react-icons/md';
import NextLink  from 'next/link';

const Header = () => {
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
            <NextLink href={'/admin'}>
              <MenuItem icon={<SettingsIcon />}>
                Ajouter un responsable de tournoi
              </MenuItem>
            </NextLink>
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
          </MenuList>
        </Menu>
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
        <ConnectButton />
    </Flex>
  )
}

export default Header