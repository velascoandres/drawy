import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { 
  Button, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader 
} from '@chakra-ui/react'

import InputHF from '@/components/InputHF/InputHF'
import { useCreateDrawMutation } from '@/mutations/drawMutations'
import useModalStore from '@/store/modal/modalStore'

interface IDrawForm {
  name: string
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
            <InputHF 
              name="name" 
              label="Draw name"
              inputProps={{ placeholder: 'Write a name for your draw' }} 
            />
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' type="submit">Create</Button>
          <Button variant='ghost' onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

export default CreateDrawModal