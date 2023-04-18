import React, { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FormControl, RadioGroup, Stack } from '@chakra-ui/react'

interface IProps {
    name: string
    children: ReactNode
    value?: string | number
}

const RadioGroupHF = (props: IProps) => {
  const { children, name, value } = props
  const { control } = useFormContext()

  return (
    <Controller 
      name={name} 
      control={control} 
      defaultValue={value}
      render={({ field }) => (
        <FormControl>
          <RadioGroup onChange={field.onChange} value={field.value} name={name}>
            <Stack direction="column">
              {children}
            </Stack>
          </RadioGroup>
        </FormControl>
      )}
    />
  )
}

export default RadioGroupHF