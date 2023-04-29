import React, { useState } from 'react'
import {
  FiDownload,
  FiInfo,
  FiMenu,
  FiMoreVertical, 
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
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import DrawList, { IDrawListItem } from '@/components/DrawList/DrawList'
import Paginator from '@/components/Paginator/Paginator'
import SearchInput from '@/components/SearchInput/SearchInput'
import StatusBar from '@/components/StatusBar/StatusBar'
import CreateUpdateDrawModal from '@/modals/CreateUpdateDraw/CreateUpdateDrawModal'
import ExportFile from '@/modals/ExportFile/ExportFile'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawsInfoQuery } from '@/queries/drawQueries'
import { IDrawInfo, IDrawInfoQuery } from '@/services/drawService'
import useConfirmationStore from '@/store/confirmation/confirmationStore'
import useModalStore from '@/store/modal/modalStore'


// eslint-disable-next-line max-lines-per-function
const RootPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const params = useParams()

  const { openModal } = useModalStore()
  const { openConfirmation } = useConfirmationStore()
  const { mutate: deleteDraw } = useDeleteDrawMutation()

  const [query, setQuery] = React.useState<IDrawInfoQuery>({ page: 1 })
  const { data: response } = useGetDrawsInfoQuery(query)

  const navigateToDrawPage = (item: IDrawListItem) => {
    navigate(`/draw/${item.id}`)
  }

  const handleSearch = (search: string) => {
    setQuery({
      search,
      page: 1
    })
  }

  const openCreateDrawModal = () => {
    openModal({
      component: CreateUpdateDrawModal,
      config: {
        closeOnClickOutside: false,
        closeOnEscapeKeydown: true,
      }
    })
  }

  const openCrateUpdateDrawModal = (draw: IDrawInfo) => (e: React.MouseEvent) => {
    e.stopPropagation()
    
    openModal({
      component: CreateUpdateDrawModal,
      props: {
        draw,
      },
      config: {
        closeOnClickOutside: false,
        closeOnEscapeKeydown: true,
      }
    })
  }

  const handleDeleteDraw = (draw: IDrawListItem) => (e: React.MouseEvent) => {
    e.stopPropagation()

    openConfirmation({
      title: 'Confirm action',
      content: `Do you want to delete: ${draw.name}?`,
      onConfirm: () => deleteDraw(draw.id.toString())
    })
  }

  const openExportModal = (draw: IDrawListItem) => (e: React.MouseEvent) => {
    e.stopPropagation()

    openModal({
      component: ExportFile,
      props: {
        drawId: draw.id,
      },
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
      top={0}
      bottom={0}
      {...props}
      zIndex={999}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="center">
        <Image fontFamily="Virgil" width="100px" src="/logo.png" alt="drawy-logo" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex alignItems="center" direction="column" justifyContent="center" marginBottom="5" gap={2} mx={2}>
        <SearchInput placeholder="Search a draw" onSearch={handleSearch} /> 

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
      <Box overflowY="auto" height="75%">
        <DrawList 
          items={response?.results || []} 
          selectedValue={params.drawId}
          onSelectDraw={navigateToDrawPage}
        > 

          {(draw, isSelected) => (
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

              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="options"
                  bg="transparent"
                  _hover={{ bg: 'tranparent', borderWidth: '1px', borderColor: isSelected ? 'white' : 'black' }}
                  _expanded={{ bg: 'transparent', borderWidth: '1px', borderColor: isSelected ? 'white' : 'black' }}
                  icon={<FiMoreVertical />}
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList zIndex={9999}>
                  <MenuItem 
                    color="black"
                    aria-label="info"
                    icon={<FiInfo />} 
                    onClick={openCrateUpdateDrawModal(draw)}
                  >
                  Information
                  </MenuItem>
                  <MenuItem 
                    color="black"
                    aria-label="download"
                    icon={<FiDownload />} 
                    onClick={openExportModal(draw)}
                  >
                  Export
                  </MenuItem>
                  <MenuItem 
                    color="black"
                    aria-label="remove"
                    icon={<FiTrash />} 
                    onClick={handleDeleteDraw(draw)}
                  >
                  Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </DrawList>
      </Box>
      <Box position="absolute" bottom={0} bg="white" w="full" marginTop={20}>
        {
          response && (
            <Paginator 
              page={query.page} 
              totalPages={response.totalPages}
              onPageChange={(page) => {
                setQuery(currentQuery => ({
                  ...currentQuery,
                  page,
                }))
              }}
            />
          ) 
        }
      </Box>
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
        <Image fontFamily="Virgil" width="100px" src="/logo.png" alt="drawy-logo" />
      </Flex>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
      <StatusBar />
    </Box>
  )
}

export default RootPage