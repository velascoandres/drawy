import { describe, it, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import Paginator from '@/components/Paginator/Paginator'
import { customRender } from '@/test-utils/custom-render'

describe('<Paginator /> tests', () => {
  describe('when renders', () => {
    it('should show initial ui', () => {
      const { getByText } = customRender(
        <Paginator
          perPage={100}
          total={10} 
          page={1}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByText('1 / 10')).toBeInTheDocument()
    })

    it('should show page info', () => {
      const { getByText } = customRender(
        <Paginator
          perPage={10}
          total={100} 
          page={3}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByText('21 - 30 of 100')).toBeInTheDocument()
    })

    it('should show page info for last page', () => {
      const { getByText } = customRender(
        <Paginator
          perPage={10}
          total={102} 
          page={11}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByText('101 - 102 of 102')).toBeInTheDocument()
    })

    it('should show page info for empty state', () => {
      const { getByText } = customRender(
        <Paginator
          perPage={10}
          total={0} 
          page={11}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByText('0 - 0 of 0')).toBeInTheDocument()
    })

    it('should show page actions', () => {
      const { getByLabelText } = customRender(
        <Paginator 
          perPage={100}
          total={10} 
          page={1}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByLabelText('prev-page')).toBeInTheDocument()
      expect(getByLabelText('next-page')).toBeInTheDocument()
    })

    it('should show prev-page action disabled if page is 1', () => {
      const { getByLabelText } = customRender(
        <Paginator
          perPage={100}
          total={10}  
          page={1}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByLabelText('prev-page')).toBeDisabled()
    })

    it('should show prev-page action disabled if page is the last', () => {
      const { getByLabelText } = customRender(
        <Paginator
          perPage={100}
          total={10}  
          page={10}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByLabelText('next-page')).toBeDisabled()
    })

    it('should show 0 / 0 if total pages is zero', () => {
      const { getByText } = customRender(
        <Paginator
          perPage={100}
          total={10}  
          page={1}
          onPageChange={vi.fn()}
          totalPages={0}
        />
      )

      expect(getByText('0 / 0')).toBeInTheDocument()
    })
  })

  describe('When paginate', () => { 
    it('should update pagination info', async () => {
      const { getByText, getByLabelText } = customRender(
        <Paginator
          perPage={100}
          total={10}  
          page={1}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      await userEvent.click(getByLabelText('next-page'))
      expect(getByText('2 / 10')).toBeInTheDocument()
      await userEvent.click(getByLabelText('prev-page'))

      expect(getByText('1 / 10')).toBeInTheDocument()
    })

    it('should call onPageChange with current page', async () => {
      const onPageChangeMock = vi.fn()

      const { getByLabelText } = customRender(
        <Paginator 
          perPage={100}
          total={10} 
          page={1}
          onPageChange={onPageChangeMock}
          totalPages={10}
        />
      )

      await userEvent.click(getByLabelText('next-page'))

      expect(onPageChangeMock).toHaveBeenCalledWith(2)
    })
  })
})