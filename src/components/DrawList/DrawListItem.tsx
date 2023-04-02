import React from 'react'

import { Flex, FlexProps } from '@chakra-ui/react'

import { IDrawListItem } from './DrawList'
import { DrawListContext, IDrawListContext } from './DrawListContext'

export interface IDrawListItemProps extends FlexProps {
    item: IDrawListItem    
}
const DrawListItem = ({ item, ...rest }: IDrawListItemProps) => {
  const { onSelectItem, selectedItem } = React.useContext(DrawListContext) as IDrawListContext
  const isSelected = selectedItem?.id === item.id

  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isSelected ? 'black' : 'white'}
      color={isSelected ? 'white' : 'black'}
      onClick={() => onSelectItem(item)}
      _hover={{
        bg: isSelected ? 'black' : 'gray.200'
      }}
      {...rest}
    >
      {item.name}
    </Flex>
  )
}

  
export default DrawListItem