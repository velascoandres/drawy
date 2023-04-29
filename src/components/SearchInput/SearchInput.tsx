import React from 'react'
import {
  FiSearch,
} from 'react-icons/fi'

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'

import useDebounceCallback from '@/hooks/useDebounceCallback'

interface IProps {
    placeholder: string
    value?: string
    onSearch: (search: string) => void
}

const SEARCH_DEBOUNCE_TIME = 500

const SearchInput = (props: IProps) => {
  const { placeholder, value, onSearch } = props
  const [searchValue, setSearchValue] = React.useState(value || '')
  const debounceCallback = useDebounceCallback(SEARCH_DEBOUNCE_TIME)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setSearchValue(newValue)

    debounceCallback(() => {
      onSearch(newValue)
    })
  }

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
      >
        <FiSearch aria-label="search-icon" />
      </InputLeftElement>
      <Input placeholder={placeholder} value={searchValue} onChange={handleChange} />
    </InputGroup>
  )
}

export default SearchInput