import { describe, expect, it } from 'vitest'

import { customRender } from '@/test-utils/custom-render'

import DrawInfo from './DrawInfo'

const drawInfo = {
  id: '1',
  name: 'Test title',
  description: 'Some description'
}

describe('<DrawInfo /> tests', () => { 
  it('should show content', () => {
    const { getByText } = customRender(<DrawInfo draw={drawInfo} />)
  
    expect(getByText('Test title')).toBeInTheDocument()
    expect(getByText('Some description')).toBeInTheDocument()
  })

  it('should show default description content', () => {
    const { getByText } = customRender(<DrawInfo draw={{ id: '1', name: 'Test title' }} />)
  
    expect(getByText('This draw does not have a description')).toBeInTheDocument()
  })
})