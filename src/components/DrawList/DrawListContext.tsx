import { createContext } from 'react'

import { IDrawListItem } from './DrawList'

export interface IDrawListContext {
    selectedItem?: IDrawListItem
    onSelectItem: (item: IDrawListItem) => void
}

export const DrawListContext = createContext<IDrawListContext | null>(null)
