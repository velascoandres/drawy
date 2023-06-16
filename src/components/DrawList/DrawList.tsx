import React from 'react'

import { DrawListContext } from './DrawListContext'
import DrawListItem from './DrawListItem'

export interface IDrawListItem {
    id: string
    name: string
    description?: string
}

interface IChildrenProps {
  draw: IDrawListItem
  isSelected: boolean
  isHovered: boolean
}

export interface IDrawListProps {
    items: IDrawListItem[]
    selectedValue?: string
    onSelectDraw: (item: IDrawListItem) => void
    onHoverDraw?: (item?: IDrawListItem) => void
    children: (props: IChildrenProps) => React.ReactNode
}

const DrawList = (props: IDrawListProps) => {
  const { items, selectedValue, onSelectDraw, children, onHoverDraw } = props
  const [selectedItem, setSelectedItem] = React.useState<IDrawListItem>()
  const [hoveredItem, setHoveredItem] = React.useState<IDrawListItem>()

  const handleSelectDrawFromList = (item: IDrawListItem) => {
    setSelectedItem(item)
    onSelectDraw(item)
  }

  const handleHoverDrawFromList = (item: IDrawListItem) => {
    setHoveredItem(item)
    onHoverDraw && onHoverDraw(item)
  }

  const handleUnHover = () => {
    setHoveredItem(undefined)
    onHoverDraw && onHoverDraw()
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
      hoveredItem,
      onSelectItem: handleSelectDrawFromList,
      onHoverItem: handleHoverDrawFromList,
      unHover: handleUnHover,
    }}>
      {items.map((draw) => (
        <DrawListItem key={draw.id} item={draw} >
          {children({ 
            draw, 
            isSelected: selectedItem?.id === draw.id,
            isHovered: hoveredItem?.id === draw.id
          })}
        </DrawListItem>
      ))}
    </DrawListContext.Provider>
  )
}

export default DrawList