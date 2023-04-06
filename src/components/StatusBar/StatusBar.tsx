import React from 'react'
import { useIsFetching, useIsMutating } from 'react-query'

import { Box, Text } from '@chakra-ui/react'

const StatusBar = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const status = React.useMemo(() => {
    if (isFetching) {
      return 'Some info is fetching...'
    }
    if (isMutating) {
      return 'Some info is updating...'  
    }

    return 'All ok ✅'
  }, [isFetching, isMutating])
  
  return (
    <Box 
      position="fixed" 
      bottom={0}
      bg="white"
      width="100%" 
      px={1}
      ml={{ base: 0, md: 60 }}
    >
      <Text fontSize="sm">{status}</Text>
    </Box>
  )
}

export default StatusBar