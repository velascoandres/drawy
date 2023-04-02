import { Controller, useFormContext } from 'react-hook-form'

import { FormControl, FormLabel, Input, InputProps } from '@chakra-ui/react'

interface InputHFProps {
    name: string
    label?: string
    inputProps: InputProps
}

const InputHF = (props: InputHFProps) => {
  const { name, inputProps, label } = props
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={inputProps.value || ''}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={fieldState.invalid}>
          {label && <FormLabel>{label}</FormLabel>}
          <Input
            {...field}
            {...inputProps}
            value={field.value}
            name={name}
          />
        </FormControl>  
      )}
    />
  )
}


export default InputHF