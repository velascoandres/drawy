import {
  FiMenu,
} from 'react-icons/fi'
import { Outlet, useNavigate } from 'react-router-dom'

import { 
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import DrawList, { IDrawListItem } from '@/components/DrawList/DrawList'
import CreateDrawModal from '@/modals/CreateDraw/CreateDrawModal'
import useModalStore from '@/store/modal/modalStore'

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

const RootPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const { openModal } = useModalStore()

  const navigateToDrawPage = (item: IDrawListItem) => {
    navigate(`/draw/${item.id}`)
  }

  const openCreateDrawModal = () => {
    openModal({
      component: CreateDrawModal,
      config: {
        closeOnClickOutside: false,
        closeOnEscapeKeydown: true,
      }
    })
  }


  const renderSideContent = (props: BoxProps = {}) => (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Drawy
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Button onClick={openCreateDrawModal}>Add draw</Button>
      <DrawList items={items} onSelectDraw={navigateToDrawPage} />
    </Box>
  )

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {renderSideContent({ display: { base: 'none', md: 'block' } })}
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
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 24 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent="flex-start"
        display={{ base: 'flex', md: 'none' }}
      >
        <IconButton
          variant="outline"
          onClick={onOpen}
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
          Drawy
        </Text>
      </Flex>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  )
}

export default RootPage