import { 
  Button, 
  FormControl,
  FormLabel, 
  Input, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader 
} from '@chakra-ui/react'

import useModalStore from '@/store/modal/modalStore'

const CreateDrawModal = () => {
  const { closeModal } = useModalStore()
  
  return (
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Draw name</FormLabel>
          <Input placeholder='Draw name' />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button variant='ghost' onClick={closeModal}>Secondary Action</Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default CreateDrawModal