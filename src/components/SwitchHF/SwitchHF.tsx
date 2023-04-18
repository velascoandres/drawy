import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Flex, FormControl, FormLabel, Switch, SwitchProps } from '@chakra-ui/react'

interface IProps {
    name: string
    label: string
    value?: boolean
    switchProps?: SwitchProps
}

const SwitchHF = (props: IProps) => {
  const { name, value, label, switchProps = {} } = props
  const { control } = useFormContext()

  return (
    <Controller 
      name={name} 
      control={control} 
      defaultValue={value}
      render={() => (
        <FormControl>
          <Flex direction="row" alignItems="center">
            <FormLabel htmlFor='email-alerts' mb='0'>
              {label}
            </FormLabel>
            <Switch 
              {...switchProps}
              name={name}
            />
          </Flex>
          
        </FormControl>
      )}
    />
  )
}

export default SwitchHF