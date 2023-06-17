import React from 'react'

import { Flex, FlexProps } from '@chakra-ui/react'

import { IDrawListItem } from './DrawList'
import { DrawListContext, IDrawListContext } from './DrawListContext'

export interface IDrawListItemProps extends FlexProps {
    item: IDrawListItem   
    children: React.ReactNode
}
const DrawListItem = ({ item, children, ...rest }: IDrawListItemProps) => {
  const { onSelectItem, selectedItem, onHoverItem, unHover } = React.useContext(DrawListContext) as IDrawListContext
  const isSelected = selectedItem?.id === item.id

  return (
    <Flex
      onClick={() => onSelectItem(item)}
      onMouseEnter={() => onHoverItem(item) }
      onMouseLeave={() => unHover() }
      bg={isSelected ? 'black' : 'white'}
      align="center"
      px="4"
      py="5"
      mx="4"
      my="0"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      color={isSelected ? 'white' : 'black'}
      _hover={{
        bg: isSelected ? 'black' : 'gray.200'
      }}
      {...rest}
    >
      {children}
    </Flex>
  )
}

  
export default DrawListItem