import React from 'react'

interface IWindowSize {
    width: number
    height: number
    isMobile: boolean
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState<IWindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
  })


  React.useEffect(() => {
    function handleResize() {
      const { innerWidth, innerHeight } = window

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: innerHeight > innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return windowSize
}

export default useWindowSize