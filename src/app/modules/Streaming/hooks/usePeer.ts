import { useEffect, useState } from "react"
import { MediaConnection } from "peerjs"

type TProps = {
    callEventCallback: () => void
}

const usePeer = (props: TProps) => {
    let peerId = ''
    let peer  = ''
    const setPeerId = () => {}

    return { peerId, peer, setPeerId }
}



export default usePeer