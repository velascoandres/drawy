import { Controller, useFormContext } from 'react-hook-form'

import { 
  FormControl, 
  FormErrorMessage, 
  FormHelperText, 
  FormLabel, 
  Textarea, 
  TextareaProps
} from '@chakra-ui/react'

interface IProps {
    name: string
    label?: string
    textareaProps: TextareaProps
    helperText?: string
}

const TextareaHF = (props: IProps) => {
  const { name, textareaProps, label, helperText } = props
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


export default TextareaHF