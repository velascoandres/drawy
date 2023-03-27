import React from 'react'

import { Flex, FlexProps } from '@chakra-ui/react'

import { IDrawListItem } from './DrawList'
import { DrawListContext, IDrawListContext } from './DrawListContext'

export interface IDrawListItemProps extends FlexProps {
    item: IDrawListItem    
}
const DrawListItem = ({ item, ...rest }: IDrawListItemProps) => {
  const { onSelectItem, selectedItem } = React.useContext(DrawListContext) as IDrawListContext
  
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={selectedItem?.id === item.id ? 'cyan.400' : 'white'}
      onClick={() => onSelectItem(item)}
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
      {...rest}
    >
      {item.name}
    </Flex>
  )
}

  
export default DrawListItem