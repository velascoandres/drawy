import React, { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { 
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'


const RootPage = () => {
  const { isOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <DrawList />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <DrawList />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  )
}

const DrawList = () => {
  const items: {name: string, path: string}[] = [
    {
      name: 'draw 1',
      path: 'draw/1'
    },
    {
      name: 'draw 2',
      path: 'draw/2'
    }
  ]
  const { onClose } = useDisclosure()

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      display={{ base: 'none', md: 'block' }}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Drawy
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {items.map((link) => (
        <NavItem key={link.name} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  path: string
  children: ReactNode;
}
const NavItem = ({ children, path, ...rest }: NavItemProps) => {
  return (
    <Link to={path}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {children}
      </Flex>
    </Link>
  )
}


export default RootPage