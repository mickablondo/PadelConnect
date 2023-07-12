"use client"
import { Flex, Center, Menu, MenuButton, MenuItem, MenuList, IconButton, Image, Heading, Highlight } from '@chakra-ui/react';
import { HamburgerIcon, PlusSquareIcon, SettingsIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
            <MenuItem icon={<SettingsIcon />} onClick={() => alert("add_manager")}>
              Ajouter un responsable de tournoi
            </MenuItem>
            <MenuItem icon={<PlusSquareIcon />} onClick={() => alert("add_tournament")}>
              Ajouter un tournoi
            </MenuItem>
          </MenuList>
        </Menu>
        <Flex>
            <Image
              boxSize='60px'
              objectFit='cover'
              src='padel.png'
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
              src='padel.png'
            />
        </Flex>
        <ConnectButton />
    </Flex>
  )
}

export default Header