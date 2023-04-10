import {
  FiMenu,
  FiPlus,
  FiTrash
} from 'react-icons/fi'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { 
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import DrawList, { IDrawListItem } from '@/components/DrawList/DrawList'
import StatusBar from '@/components/StatusBar/StatusBar'
import CreateDrawModal from '@/modals/CreateDraw/CreateDrawModal'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawsInfoQuery, useGetDrawsQuery } from '@/queries/drawQueries'
import useConfirmationStore from '@/store/confirmation/confirmationStore'
import useModalStore from '@/store/modal/modalStore'


const RootPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const params = useParams()

  const { openModal } = useModalStore()
  const { openConfirmation } = useConfirmationStore()
  const { mutate: deleteDraw } = useDeleteDrawMutation()

  const { data: response } = useGetDrawsInfoQuery()

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

  const handleDeleteDraw = (draw: IDrawListItem) => () => {
    openConfirmation({
      title: 'Confirm action',
      content: `Do you want to delete: ${draw.name}?`,
      onConfirm: () => deleteDraw(draw.id.toString())
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
      <Flex h="20" alignItems="center" mx="8" justifyContent="center">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Drawy
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex alignItems="center" justifyContent="center" marginBottom="5">
        <Button 
          leftIcon={<FiPlus />} 
          variant="outline"
          mx={4} 
          width="100%"
          onClick={openCreateDrawModal}
        >
          Add draw
        </Button>
      </Flex>
      <DrawList 
        items={response?.results || []} 
        selectedValue={params.drawId}
        onSelectDraw={navigateToDrawPage}
      > 

        {(draw) => (
          <Flex 
            direction="row" 
            gap={2} 
            alignContent="space-between" 
            width="100%"
            alignItems="center"
          >
            <Heading 
              as='h6' 
              size='xs' 
              width="100%"
              noOfLines={1}
            >
              {draw.name}
            </Heading>
            <IconButton 
              aria-label="delete-draw"
              size='sm'
              bg="transparent"
              icon={<FiTrash />}
              onClick={handleDeleteDraw(draw)} 
              _hover={{
                bg: 'white',
                color: 'black'
              }}
            />
          </Flex>
        )}
      </DrawList>
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
      <StatusBar />
    </Box>
  )
}

export default RootPage