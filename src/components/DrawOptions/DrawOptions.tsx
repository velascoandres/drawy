import { FiInfo, FiMoreVertical, FiTrash } from 'react-icons/fi'

import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'

import CreateUpdateDrawModal from '@/modals/CreateUpdateDraw/CreateUpdateDrawModal'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import useConfirmationStore from '@/store/confirmation/confirmationStore'
import useModalStore from '@/store/modal/modalStore'

import { IDrawListItem } from '../DrawList/DrawList'


interface IProps {
    isOpen: boolean
    draw: IDrawListItem
}

const DrawOptions = (props: IProps) => {
  
  const { isOpen, draw } = props
  const { openModal } = useModalStore()
  const { openConfirmation } = useConfirmationStore()

  const { mutate: deleteDraw } = useDeleteDrawMutation()


  const openCrateUpdateDrawModal = (e: React.MouseEvent) => {
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

  const handleDeleteDraw = (e: React.MouseEvent) => {
    e.stopPropagation()

    openConfirmation({
      title: 'Confirm action',
      content: `Do you want to delete: ${draw.name}?`,
      onConfirm: () => deleteDraw(draw.id.toString())
    })
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="options"
        bg="transparent"
        _hover={{ bg: 'tranparent', borderWidth: '1px', borderColor: isOpen ? 'white' : 'black' }}
        _expanded={{ bg: 'transparent', borderWidth: '1px', borderColor: isOpen ? 'white' : 'black' }}
        icon={<FiMoreVertical />}
        onClick={(e) => e.stopPropagation()} />
      <MenuList zIndex={9999}>
        <MenuItem
          color="black"
          aria-label="information"
          icon={<FiInfo />}
          onClick={openCrateUpdateDrawModal}
        >
          Information
        </MenuItem>
        <MenuItem
          color="black"
          aria-label="remove"
          icon={<FiTrash />}
          onClick={handleDeleteDraw}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default DrawOptions