import { describe, expect, it } from 'vitest'

import { act, renderHook } from '@/test-utils/custom-render'

import useWindowSize from './useWindowSize'


describe('When window resize', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 500)
    vi.stubGlobal('innerHeight', 800)
  })  

  it('should return update window values (mobile)', () => {
    const { result } = renderHook(() => useWindowSize())
      
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toEqual(500)
    expect(result.current.height).toEqual(800)
    expect(result.current.isMobile).toBeTruthy()
    expect(result.current.isTablet).toBeFalsy()
  })

  it('should return update window values (tablet)', () => {
    vi.stubGlobal('innerWidth', 767)
    vi.stubGlobal('innerHeight', 900)

    const { result } = renderHook(() => useWindowSize())
      
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toEqual(767)
    expect(result.current.height).toEqual(900)
    expect(result.current.isMobile).toBeFalsy()
    expect(result.current.isTablet).toBeTruthy()
  })

  it('should return update window values on multiple resize events', () => {
    const { result } = renderHook(() => useWindowSize())
      
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.isMobile).toBeTruthy()
    expect(result.current.isTablet).toBeFalsy()

    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 720)

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toEqual(1024)
    expect(result.current.height).toEqual(720)
    expect(result.current.isMobile).toBeFalsy()
    expect(result.current.isTablet).toBeFalsy()
  })
})
