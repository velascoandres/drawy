import React from 'react'
import {
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi'

import { Flex, IconButton, Text } from '@chakra-ui/react'

const DEFAULT_PAGE = 1
const PAGINATION_FACTOR = 1

interface IProps {
    page?: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Paginator = (props: IProps) => {
  const { page = DEFAULT_PAGE, onPageChange, totalPages } = props

  const [currentPage, setCurrentPage] = React.useState(page)

  const buildPagintionHandler = (paginationFactor: number) => () => {
    const newPage = currentPage + paginationFactor
    
    setCurrentPage(newPage)
  
    onPageChange(newPage)
  }

  return (
    <Flex direction="row" justifyContent="center" gap={2} alignItems="center">
      <IconButton
        isDisabled={currentPage === DEFAULT_PAGE}
        variant="outline"
        onClick={buildPagintionHandler(-PAGINATION_FACTOR)}
        aria-label="prev-page"
        icon={<FiArrowLeft />}
      />

      <Text as="p" size="md">
        {`${currentPage} / ${totalPages}`}
      </Text>
      
      <IconButton
        isDisabled={currentPage === totalPages}
        variant="outline"
        onClick={buildPagintionHandler(PAGINATION_FACTOR)}
        aria-label="next-page"
        icon={<FiArrowRight />}
      />
    </Flex>
  )
}

export default Paginator