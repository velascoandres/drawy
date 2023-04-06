import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import useDebounceCallback from '@/hooks/useDebounceCallback'

vi.useFakeTimers()

const DEBOUNCE_TIME = 10000

vi.spyOn(global, 'setTimeout')

describe('useDebounceCallback tests', () => { 
  describe('When hook renders', () => { 
    it('should return the initial value', () => {
      const { result } = renderHook(() => useDebounceCallback(DEBOUNCE_TIME))
        
      const handler = result.current

      expect(handler).toStrictEqual(expect.any(Function))
    })

    it('should call setTimeout with default time', () => {
      const { result } = renderHook(() => useDebounceCallback())
        
      const handler = result.current

      handler(() => null)

      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        500
      )
    })
    
    it('should call setTimeout with another time', async () => {
      const { result } = renderHook(() => useDebounceCallback(DEBOUNCE_TIME))
        
      const handler = result.current
  
      handler(() => null)
      await act(() => {
        handler(() => null)
      })

      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        DEBOUNCE_TIME
      )
    })
  })

  describe('When debounce', () => { 
    it('should call setTimeout with another time', async () => {
      const { result } = renderHook(() => {
        const debounce = useDebounceCallback(DEBOUNCE_TIME)
        const [value, setValue] = React.useState(0)

        const changeValue = () => setValue(10)

        return {
          value,
          changeValue,
          debounce,
        }
      })
          
      const debounce = result.current.debounce
      const changeValue = result.current.changeValue
    
      
      await act(() => {
        debounce(changeValue)
        vi.runAllTimers()
      })

      expect(result.current.value).toBe(10)
    })
  })
})