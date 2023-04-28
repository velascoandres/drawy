import { describe, it, vi } from 'vitest'

import { customRender, fireEvent } from '@/test-utils/custom-render'

import SearchInput from './SearchInput'

const onSearchMock = vi.fn()

vi.useFakeTimers()

describe('<SearchInput /> tests', () => {
  describe('When renders', () => { 
    it('should show an input content', () => {
      const { 
        getByPlaceholderText, 
        getByLabelText 
      } = customRender(
        <SearchInput 
          placeholder="Write to search" 
          onSearch={vi.fn()} 
        />
      )
    
      expect(getByPlaceholderText('Write to search'))
      expect(getByLabelText('search-icon'))
    })

    it('should show an input value', () => {
      const { getByDisplayValue } = customRender(
        <SearchInput placeholder="Write to search" value="search value test" onSearch={vi.fn()} />
      )
      
      expect(getByDisplayValue('search value test'))
    })
  })

  describe('When search a value', () => { 
    it('should call onSearch with the new search value', async () => {
      const { getByPlaceholderText } = customRender(
        <SearchInput placeholder="Write to search" onSearch={onSearchMock}/>
      )
      
      const input = getByPlaceholderText('Write to search')


      fireEvent.change(input, { target: { value: 'new search' } })

      vi.runAllTimers()
     
      expect(onSearchMock).toHaveBeenCalledWith('new search')
    })
  })
})