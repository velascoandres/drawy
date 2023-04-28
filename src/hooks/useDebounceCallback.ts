/* eslint-disable callback-return */
import React from 'react'

const DEFAULT_DEBOUNCE_TIME = 500

type ICallBack = () => void

const useDebounceCallback = (delay?: number) => {
  const timerRef = React.useRef<NodeJS.Timer | null>(null)

  const debounceCallback = React.useCallback((cb: ICallBack) => {
    cleanTimer()

    timerRef.current = setTimeout(() => {  
      cb()
    }, delay || DEFAULT_DEBOUNCE_TIME)
  }, [delay])

  const cleanTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  React.useEffect(() => {  
    return () => {
      cleanTimer()
    }
  }, [delay])

  return debounceCallback
}

export default useDebounceCallback
