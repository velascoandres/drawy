import React from 'react'

import { DrawListContext } from './DrawListContext'
import DrawListItem from './DrawListItem'

export interface IDrawListItem {
    id: number | string
    name: string
}

export interface IDrawListProps {
    items: IDrawListItem[]
    selectedValue?: string
    onSelectDraw: (item: IDrawListItem) => void
    children: (item: IDrawListItem, isSelected: boolean) => React.ReactNode
}

const DrawList = (props: IDrawListProps) => {
  const { items, selectedValue, onSelectDraw, children } = props
  const [selectedItem, setSelectedItem] = React.useState<IDrawListItem>()

  const handleSelectDrawFromList = (item: IDrawListItem) => {
    setSelectedItem(item)
    onSelectDraw(item)
  }

  React.useEffect(() => {
    const selectedDraw = items.find(({ id }) => id === selectedValue)
    
    if (selectedDraw) {
      setSelectedItem(selectedDraw)
    }
    
  }, [selectedValue, items])

  return (
    <DrawListContext.Provider value={{
      selectedItem,
      onSelectItem: handleSelectDrawFromList,
    }}>
      {items.map((draw) => (
        <DrawListItem key={draw.id} item={draw} >
          {children(draw, selectedItem?.id === draw.id)}
        </DrawListItem>
      ))}
    </DrawListContext.Provider>
  )
}

export default DrawList