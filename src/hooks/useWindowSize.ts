import React from 'react'

interface IWindowSize {
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
}

type WindowInnerSize = { 
  innerWidth: number
  innerHeight: number 
}

type ViewportProps = Pick<IWindowSize, 'isMobile' | 'isTablet'>

const MOBILE_MAX_WIDTH = 500
const TABLET_MAX_WIDTH = 768

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState<IWindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false
  })


  React.useEffect(() => {
    const getViewportProps = ({ innerWidth, innerHeight }: WindowInnerSize): ViewportProps => {

      const isMobileRange = innerWidth <= MOBILE_MAX_WIDTH
      const isTabletRange = innerWidth > MOBILE_MAX_WIDTH && innerWidth <= TABLET_MAX_WIDTH
      const hasDifferentAspectRadio = innerHeight > innerWidth

      if (isMobileRange && hasDifferentAspectRadio) {
        return {
          isMobile: true,
          isTablet: false
        }
      }

      if (isTabletRange && hasDifferentAspectRadio) {
        return {
          isMobile: false,
          isTablet: true
        }
      }

      return {
        isMobile: false,
        isTablet: false
      }

    }

    const handleResize = () => {
      const { innerWidth, innerHeight } = window

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        ...getViewportProps({ innerHeight, innerWidth })
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