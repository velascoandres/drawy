import { Controller, useFormContext } from 'react-hook-form'

import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputProps } from '@chakra-ui/react'

interface InputHFProps {
    name: string
    label?: string
    inputProps: InputProps
    helperText?: string
}

const InputHF = (props: InputHFProps) => {
  const { name, inputProps, label, helperText } = props
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
          {
            fieldState.error?.message ? (
              <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {helperText}
              </FormHelperText>
            )
          }
        </FormControl>  
      )}
    />
  )
}


export default InputHF