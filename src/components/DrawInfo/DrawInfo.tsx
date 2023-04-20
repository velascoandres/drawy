import { Divider, Flex, Heading, Text } from '@chakra-ui/react'

import { IDrawInfo } from '@/services/drawService'

interface IProps {
    draw: IDrawInfo
}

const DrawInfo = (props: IProps) => {
  const { draw } = props

  return (
    <Flex direction="column" gap={4}>
      <Heading as="h3" fontSize="xl">{draw.name}</Heading>
      <Divider />
      <Text fontSize='lg' fontStyle={draw.description ? 'normal' : 'italic'}>
        {draw.description ? draw.description : 'This draw does not have a description'}
      </Text>
    </Flex>
  )
}


export default DrawInfo