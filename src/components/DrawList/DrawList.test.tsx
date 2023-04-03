import { describe, expect, it, vi } from 'vitest'

import { customRender, fireEvent } from '@/test-utils/custom-render'

import DrawList from './DrawList'

const items = [{ id: '1', name: 'Draw 1' }, { id: '2', name: 'Draw 2' }]


describe('<DrawList /> tests', () => {
  describe('When renders', () => {
    it.each(items)('should show a $name', ({ name }) => {
      const { getByText } = customRender(
        <DrawList items={items} onSelectDraw={vi.fn()}>
          {({ name }) => <div>{name}</div>}
        </DrawList>
      )

      expect(getByText(name)).toBeInTheDocument()
    })
  })

  describe('When click on list item', () => {
    it('should call onSelect', () => {
      const onSelectMock = vi.fn()

      const { getByText } = customRender(
        <DrawList items={items} onSelectDraw={onSelectMock}>
          {({ name }) => <div>{name}</div>}
        </DrawList>
      )

      fireEvent.click(getByText('Draw 2'))

      expect(onSelectMock).toHaveBeenCalledWith({ id: '2', name: 'Draw 2' })
    })
  })
})