import { describe, it, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import Paginator from '@/components/Paginator/Paginator'
import { customRender } from '@/test-utils/custom-render'

describe('<Paginator /> tests', () => {
  describe('when renders', () => {
    it('should show initial ui', () => {
      const { getByText } = customRender(
        <Paginator 
          page={1}
          onPageChange={vi.fn()}
          totalPages={10}
        />
      )

      expect(getByText('1 / 10')).toBeInTheDocument()
    })

    it('should show page actions', () => {
      const { getByLabelText } = customRender(
        <Paginator 
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