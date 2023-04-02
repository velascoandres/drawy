import React from 'react'

import { Box } from '@chakra-ui/react'

import { DrawListContext } from './DrawListContext'
import DrawListItem from './DrawListItem'

export interface IDrawListItem {
    id: number | string
    name: string
}

export interface IDrawListProps {
    items: IDrawListItem[]
    onSelectDraw: (item: IDrawListItem) => void
}

const DrawList = (props: IDrawListProps) => {
  const { items, onSelectDraw } = props
  const [selectedItem, setSelectedItem] = React.useState<IDrawListItem>()

  const handleSelectDrawFromList = (item: IDrawListItem) => {
    setSelectedItem(item)
    onSelectDraw(item)
  }

  return (
    <DrawListContext.Provider value={{
      selectedItem,
      onSelectItem: handleSelectDrawFromList,
    }}>
      <Box
        padding="2"
      >
        {items.map((draw) => (
          <DrawListItem key={draw.id} item={draw} />
        ))}
      </Box>
    </DrawListContext.Provider>
  )
}

export default DrawList