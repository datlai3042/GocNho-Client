'use client'
import { useContext } from 'react'
import { StreamingContext } from '../../providers'

const ButtonStopStream = () => {
 
  const {handleEvent} = useContext(StreamingContext)

  return (
    <button onClick={handleEvent?.onStopStream}>ButtonStopStream</button>
  )
}

export default ButtonStopStream