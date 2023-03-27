import { useParams } from 'react-router-dom'

const DrawPage = () => {
  const params = useParams()  

  return (
    <div>{params.drawId}</div>
  )
}

export default DrawPage