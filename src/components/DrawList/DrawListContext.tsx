import { createContext } from 'react'

import { IDrawListItem } from './DrawList'

export interface IDrawListContext {
    selectedItem?: IDrawListItem
    hoveredItem?: IDrawListItem
    onSelectItem: (item: IDrawListItem) => void
    onHoverItem: (item: IDrawListItem) => void
    unHover: () => void
}

export const DrawListContext = createContext<IDrawListContext | null>(null)
