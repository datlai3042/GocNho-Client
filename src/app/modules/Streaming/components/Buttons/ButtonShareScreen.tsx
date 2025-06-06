'use client'
import { useContext } from 'react'
import { StreamingContext } from '../../providers'

const ButtonShareScreen = () => {
    const {handleEvent} = useContext(StreamingContext)

  return (
    <button onClick={handleEvent?.onShareScreen}>ButtonShareScreen</button>
  )
}

export default ButtonShareScreen