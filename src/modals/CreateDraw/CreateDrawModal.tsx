import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { 
  Button, 
  Flex, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader 
} from '@chakra-ui/react'

import InputHF from '@/components/InputHF/InputHF'
import TextareaHF from '@/components/TextareaHF/TextareaHF'
import { useCreateDrawMutation } from '@/mutations/drawMutations'
import useModalStore from '@/store/modal/modalStore'

interface IDrawForm {
  name: string
  description?: string
}

const CreateDrawModal = () => {
  const form = useForm<IDrawForm>()

  const { mutate: createDraw, isSuccess } = useCreateDrawMutation()
  const { closeModal } = useModalStore()

  const onSubmit = (formValues: IDrawForm) => {
    createDraw(formValues)
  }

  React.useEffect(() => {
    if (isSuccess) {
      closeModal()
    }
  }, [isSuccess])

  
  return (
    <ModalContent>
      <form onSubmit={form.handleSubmit(onSubmit)}>

        <ModalHeader>Create a new Draw</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...form}>
            <Flex direction="column" gap={2}>
              <InputHF 
                name="name" 
                label="Name"
                inputProps={{ placeholder: 'Write a name for your draw' }} 
              />
              <TextareaHF
                name="description" 
                label="Description"
                textareaProps={{ placeholder: 'Write a full description for your draw' }}
              />
            </Flex>
            
          </FormProvider>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="solid" colorScheme="messenger" type="submit">Create</Button>
          <Button variant="ghost" onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

export default CreateDrawModal