import { FormProvider, useForm } from 'react-hook-form'
import {
  FiCheck,
  FiX,
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Container, 
  Divider, 
  Flex, 
  Heading,
  IconButton,
  useDisclosure,
  VStack 
} from '@chakra-ui/react'

import InputHF from '@/components/InputHF/InputHF'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()
  const form = useForm<{name: string}>({
    values: {
      name: draw?.name || ''
    }
  })

  const { isOpen: isEditingName, onToggle } = useDisclosure()
  
  const handleUpdateName = ({ name }:{name: string}) => {
    updateDraw({ id: params.drawId as string, name })
    onToggle()
  }

  const resetForm = () => {
    form.setValue('name', draw?.name as string)
    onToggle()
  }


  return (
    <VStack align="start">
      <Flex direction="row" justifyContent="start">
        {
          isEditingName ? (
            <form onSubmit={form.handleSubmit(handleUpdateName)}>
              <FormProvider {...form}>
                <Flex direction="row" justifyContent="start">
                  <InputHF 
                    name="name" 
                    inputProps={{ placeholder: 'Write a name for your draw' }} 
                  />
                  <IconButton aria-label="confirm-update" icon={<FiCheck />} type="submit" />
                  <IconButton aria-label="cancel-update" icon={<FiX />} onClick={resetForm} />
                </Flex>
              </FormProvider>
            </form>
          ) : (
            <Heading as="h3" size="lg" onClick={onToggle} cursor="pointer" >
              {draw?.name}
            </Heading>
          )
        }
      
      </Flex>
      <Divider orientation="horizontal" />
      <Container maxW="3xl">
          Content
      </Container>
    </VStack>
  )
}

export default DrawPage