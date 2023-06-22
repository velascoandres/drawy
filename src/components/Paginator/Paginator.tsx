/* eslint-disable no-magic-numbers */
import React from 'react'
import {
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi'

import { Flex, IconButton, Text } from '@chakra-ui/react'

const DEFAULT_PAGE = 1
const PAGINATION_FACTOR = 1
const EMPTY_PAGE_INDICATOR = 0
const PAGE_INDICATOR = 1


interface IProps {
    perPage: number
    total: number
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Paginator = (props: IProps) => {
  const { page = DEFAULT_PAGE, onPageChange, totalPages, perPage, total } = props

  const [currentPage, setCurrentPage] = React.useState(page)

  const buildPaginationHandler = (paginationFactor: number) => () => {
    const newPage = currentPage + paginationFactor
    
    setCurrentPage(newPage)
  
    onPageChange(newPage)
  }

  const pageInfo = React.useMemo(() => {
    let currentPage = 0
    let totalUntilPage = 0

    if (total) {
      currentPage = (page - PAGE_INDICATOR) * perPage + PAGE_INDICATOR
      totalUntilPage = page >= totalPages ? total : perPage * page
    }

    return `${currentPage} - ${totalUntilPage} of ${total}`
  }, [page, perPage, total, totalPages])

  return (
    <Flex direction="row" justifyContent="center" gap={2} alignItems="center">
      <Text fontSize="sm" fontWeight="semibold">
        {pageInfo} 
      </Text>
      <IconButton
        isDisabled={currentPage === DEFAULT_PAGE}
        variant="outline"
        onClick={buildPaginationHandler(-PAGINATION_FACTOR)}
        aria-label="prev-page"
        icon={<FiArrowLeft />}
      />

      <Text as="p" fontSize="sm">
        {`${Boolean(totalPages) ? currentPage : EMPTY_PAGE_INDICATOR } / ${totalPages}`}
      </Text>
      
      <IconButton
        isDisabled={currentPage === totalPages}
        variant="outline"
        onClick={buildPaginationHandler(PAGINATION_FACTOR)}
        aria-label="next-page"
        icon={<FiArrowRight />}
      />
    </Flex>
  )
}

export default Paginator