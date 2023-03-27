import { Outlet, useNavigate } from 'react-router-dom'

import { 
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import DrawList, { IDrawListItem } from '@/components/DrawList/DrawList'


const RootPage = () => {
  const items: {id: string, name: string, path: string}[] = [
    {
      id: '1',
      name: 'draw 1',
      path: 'draw/1'
    },
    {
      id: '2',
      name: 'draw 2',
      path: 'draw/2'
    }
  ]

  const { isOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const navigateToDrawPage = (item: IDrawListItem) => {
    navigate(`/draw/${item.id}`)
  }

  const renderSideContent = () => (
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
      <DrawList items={items} onSelectDraw={navigateToDrawPage} />
    </Box>
  )

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {renderSideContent()}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          {renderSideContent()}
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  )
}

export default RootPage