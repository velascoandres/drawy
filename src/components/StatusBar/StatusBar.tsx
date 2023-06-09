import React from 'react'
import { useIsFetching, useIsMutating } from 'react-query'

import { Box, Text } from '@chakra-ui/react'

const StatusBar = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const status = React.useMemo(() => {
    if (isFetching) {
      return 'Synchronizing data'
    }
    if (isMutating) {
      return 'Some info is updating'  
    }

    return 'All ok ✅'
  }, [isFetching, isMutating])
  
  return (
    <Box 
      position="fixed" 
      bottom={0}
      bg="gray.900"
      width="100%" 
      px={1}
      ml={{ base: 0, md: 60 }}
      role="log"
    >
      <Text fontSize="sm" color="white">{status}</Text>
    </Box>
  )
}

export default StatusBar