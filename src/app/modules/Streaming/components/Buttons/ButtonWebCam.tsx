'use client'
import { useContext } from 'react'
import { StreamingContext } from '../../providers'

const ButtonWebCam = () => {

  const {handleEvent} = useContext(StreamingContext)

  return (
    <button onClick={handleEvent?.onWebcam}>ButtonWebCam</button>
  )
}

export default ButtonWebCam