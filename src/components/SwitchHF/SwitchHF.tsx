import { Controller, useFormContext } from 'react-hook-form'

import { Flex, FormControl, FormLabel, Switch, SwitchProps } from '@chakra-ui/react'

interface IProps {
    name: string
    label: string
    value?: boolean
    switchProps?: SwitchProps
    justifyContent?: 'space-between' | 'start'
}

const SwitchHF = (props: IProps) => {
  const { name, value, label, switchProps = {}, justifyContent = 'space-between' } = props
  const { control } = useFormContext()

  return (
    <Controller 
      name={name} 
      control={control} 
      defaultValue={value}
      render={({ field }) => (
        <FormControl>
          <Flex direction="row" alignItems="center" justifyContent={justifyContent}>
            <FormLabel htmlFor='email-alerts' mb='0'>
              {label}
            </FormLabel>
            <Switch 
              {...switchProps}
              {...field}
              isChecked={Boolean(field.value)}
              name={name}
            />
          </Flex>
          
        </FormControl>
      )}
    />
  )
}

export default SwitchHF