import React from 'react'
import {
  FiMenu,
  FiPlus,
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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import DrawList, { IDrawListItem } from '@/components/DrawList/DrawList'
import DrawOptions from '@/components/DrawOptions/DrawOptions'
import Paginator from '@/components/Paginator/Paginator'
import SearchInput from '@/components/SearchInput/SearchInput'
import StatusBar from '@/components/StatusBar/StatusBar'
import useWindowSize from '@/hooks/useWindowSize'
import CreateUpdateDrawModal from '@/modals/CreateUpdateDraw/CreateUpdateDrawModal'
import { useGetDrawsInfoQuery } from '@/queries/drawQueries'
import { IDrawInfoQuery } from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'

const SMALL_HEIGHT = 300
const MEDIUM_HEIGHT = 645
const LARGE_HEIGHT = 950

const QUARTER_SCALE_FACTOR = 0.25
const MEDIUM_SCALE_FACTOR = 0.50
const STANDARD_SCALE_FACTOR = 0.70
const LARGE_SCALE_FACTOR = 0.75

const RootPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const params = useParams()

  const { openModal } = useModalStore()

  const [query, setQuery] = React.useState<IDrawInfoQuery>({ page: 1 })
  const { data: response } = useGetDrawsInfoQuery(query)
  const { height } = useWindowSize()

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

  const handlePageChange = (page: number) => {
    setQuery({
      ...query,
      page,
    })
  }

  const listHeight = React.useMemo(() => {
    if (height <= SMALL_HEIGHT) {
      return height * QUARTER_SCALE_FACTOR
    }
    
    if (height <= MEDIUM_HEIGHT) {
      return height * MEDIUM_SCALE_FACTOR
    }

    if (height <= LARGE_HEIGHT) {
      return height * STANDARD_SCALE_FACTOR
    }

    return height * LARGE_SCALE_FACTOR
      
  }, [height])


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
      <Box overflowY="auto" height={listHeight}>
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
              {
                isSelected && (
                  <DrawOptions isOpen={isSelected} draw={draw} />
                )
              }
            </Flex>
          )}
        </DrawList>
      </Box>
      <Box position="absolute" bottom={0} bg="white" w="full">
        {
          response && (
            <Paginator 
              page={query.page} 
              totalPages={response.totalPages}
              onPageChange={handlePageChange}
            />
          ) 
        }
      </Box>
    </Box>
  )

  return (
    <Box minH="100vh">
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
      <Box ml={{ base: 0, md: 60 }} py="4">
        <Outlet />
      </Box>
      <StatusBar />
    </Box>
  )
}

export default RootPage