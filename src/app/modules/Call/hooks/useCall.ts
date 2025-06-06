import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import Peer, { DataConnection, MediaConnection } from "peerjs"
import { createPeer, getPeer } from "../../Streaming/config/peer"

type TUseCall = {
    stream?: MutableRefObject<MediaStream | undefined>
    peerReceiverId: string
    peerCallId: string
    triggerCreate: boolean
}


const useCall = (props: TUseCall) => {
    let { stream, peerReceiverId, peerCallId, triggerCreate } = props
    const streamRemote = useRef<MediaStream>()
    const [peerId, setPeerId] = useState('')
    const [peerRemoteId, setPeerRemoteId] = useState(peerReceiverId)
    const [peerReady, setPeerReady] = useState(false);
    const peerRef = useRef<Peer | null>(null)
    const [pendingAccpet, setPendingAccpet] = useState(false)

    const onAcceptCallTrigger = () => {
        setPendingAccpet(true)
    }




    useEffect(() => {
        try {
            console.log({ triggerCreate, peerCallId })
            if (!triggerCreate) return
            if (peerRef.current && !peerCallId) return
            const peer = createPeer(peerCallId);
            peerRef.current = peer
            const handleOpen = (id: string) => {
                setPeerId(peerCallId)
                setPeerReady(true)
            }

            const onReceive = async (call: MediaConnection) => {
                console.log({ peerRemoteId: peerReceiverId, receive: true, stream, streamRemote })

                if (!stream?.current) {
                    try {
                        const streamAPI = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true,
                        });

                        stream!.current = streamAPI;
                        console.log({ streamAPI })
                        setConnectStream(true);
                    } catch (error: any) {
                        console.error("Lỗi truy cập camera:", error?.name, error?.message, error);

                    }
                }
                call.answer(stream?.current)
                call.on('stream', (stream) => {
                    console.log({ peerId, stream })
                    streamRemote.current = stream
                    setHasStream(true)
                })
            }
            console.log({ peer, peerCallId, peerReceiverId, peerReady })
            peer.on('open', handleOpen)
            peer.on('call', onReceive)



            const handleError = (err: any) => {
                console.error('[peer error]', err);
                peer.destroy()
                peerRef.current = null
            };
            peer.on('error', handleError);
        } catch (error) {
            console.log({ error })
        }

        return () => {
            // peer.off('open', handleOpen)
            // peer.off('call', onReceive)
        }
    }, [triggerCreate])

    const [hasStream, setHasStream] = useState(false)
    const [connectStream, setConnectStream] = useState(false)

    const onCall = useCallback(async () => {

        if (!peerReceiverId || !peerRef.current || !peerRef.current) return

        try {
            console.log('cai gi vay')

            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            stream!.current = localStream; // ✅ Gán vào ref được truyền từ props

            setConnectStream(true);
            if (!pendingAccpet) return


            const call = peerRef.current!.call(peerReceiverId, localStream)
            console.log({ call })
            if (!call) {
                console.error('peer.call failed – remote peer not found')
                return
            }
            alert(`Đã gửi tới ${peerReceiverId}`)
            call.on('stream', (remoteStream) => {
                streamRemote.current = remoteStream
                console.log('co stream', remoteStream)
                setHasStream(true)
            })



        } catch (err) {
            console.error('Error getting media or calling peer:', err)
        }
    }, [connectStream, pendingAccpet])

    const getValueHook = () => {
        return { onCall, streamRemote, stream, hasStream, setPeerRemoteId, setPeerId, peerId, connectStream, peerRemoteId, peerReady, destroy }

    }


    useEffect(() => {
        console.log({ connectStream })
    }, [connectStream])


    useEffect(() => {
        console.log({ pendingAccpet })
        if (pendingAccpet) {
            onCall()

        }
    }, [pendingAccpet])

    const destroy = () => {
        peerRef.current?.destroy()
        peerRef.current = null

    }

    return { onAcceptCallTrigger, onCall, getValueHook, streamRemote, stream, hasStream, setPeerRemoteId, setPeerId, peerId, connectStream, peerRemoteId, peerReady, destroy }
}

export default useCall