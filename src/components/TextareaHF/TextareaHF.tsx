import { Controller, useFormContext } from 'react-hook-form'

import { FormControl, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react'

interface IProps {
    name: string
    label?: string
    textareaProps: TextareaProps
}

const TextareaHF = (props: IProps) => {
  const { name, textareaProps, label } = props
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={textareaProps.value || ''}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={fieldState.invalid}>
          {label && <FormLabel>{label}</FormLabel>}
          <Textarea
            {...field}
            {...textareaProps}
            value={field.value || ''}
            name={name}
          />
        </FormControl>  
      )}
    />
  )
}


export default TextareaHF