import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import usePeer from "./usePeer"
import { MediaConnection } from "peerjs"
import { getPeer } from "../config/peer"

type TUseCall = {
    stream?: MutableRefObject<MediaStream | undefined>
}

// const useCall = (props: TUseCall) => {
//     let { stream } = props
//     const streamRemote = useRef<MediaStream>()
//     const [peerId, setPeerId] = useState('')
//     const peerRemoteIdRef = useRef('') // ✅ dùng ref thay cho state
//     const setPeerRemoteId = (id: string) => {
//         peerRemoteIdRef.current = id
//     }
//     const [hasStream, setHasStream] = useState(false);
//     const onReceive = useCallback(async (call: MediaConnection) => {
//         console.log({ peerRemoteIdRef, receive: true })
//         if (stream?.current) {
//             stream.current.getTracks().forEach((track) => track.stop())
//             try {
//                 const streamAPI = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true,
//                 });

//                 if (streamAPI) {
//                     stream.current = streamAPI;
//                 }
//             } catch (error) {
//                 console.log({ error });
//             }
//         }

//         call.answer(stream?.current)
//         call.on('stream', (stream) => {
//             streamRemote.current = stream
//             setHasStream(true)
//         })
//         return
//     }, [peerRemoteIdRef, peerId])
//     useEffect(() => {
//         const handleOpen = (id: string) => {
//             console.log('[peer open]', id)
//             setPeerId(id);
//         };

//         peer.on('open', handleOpen);
//         peer.on('call', onReceive);

//         return () => {
//             peer.off('open', handleOpen);
//             peer.off('call', onReceive);
//         };
//     }, [onReceive, peerRemoteIdRef]);

//     const onCall = useCallback(async () => {
//         console.log({ peerRemoteIdRef, call: true })
//         if (!peerRemoteIdRef) return
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {

//             const call = peer.call(peerRemoteIdRef.current, stream); // Gọi đến remote peer
//             console.log({ call })
//             if (!call) {
//                 console.error('peer.call failed – remote peer not found');
//                 return;
//             }
//             call.on('stream', remoteStream => {

//                 console.log({ peerRemoteIdRef, call: true })


//                 streamRemote.current = remoteStream
//                 setHasStream(true)
//             });
//         });
//     }, [peerRemoteIdRef, peerId])
//     console.log({ peerId, peerRemoteIdRef })

//     return { onCall, onReceive, streamRemote, hasStream, setPeerRemoteId, setPeerId }
// }

const useCall = (props: TUseCall) => {
    let { stream } = props
    const streamRemote = useRef<MediaStream>()
    const [peerId, setPeerId] = useState('')
    const [peerRemoteId, setPeerRemoteId] = useState('')
    const [acceptCall, setAcceptCall] = useState(false)
    const [callQueue, setCallQueue] = useState<MediaConnection | undefined>(undefined)

    // Dùng ref giữ giá trị peerRemoteId mới nhất
    const peerRemoteIdRef = useRef(peerRemoteId)
    useEffect(() => {
        peerRemoteIdRef.current = peerRemoteId
    }, [peerRemoteId])

    const onReceive = useCallback(async (call: MediaConnection) => {
        setAcceptCall(true)
        setCallQueue(call)

    }, [stream])

    useEffect(() => {
        if (!acceptCall && !callQueue) {
            return
        }
        const callActive = async (call: MediaConnection) => {
            console.log({ peerRemoteId: peerRemoteIdRef.current, receive: true, stream, streamRemote })
            if (!stream?.current) {
                try {
                    const streamAPI = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                    stream!.current = streamAPI;
                    setConnectStream(true);
                } catch (error) {
                    console.log({ error });
                }
            }
            call.answer(stream?.current)
            call.on('stream', (stream) => {
                streamRemote.current = stream
                setHasStream(true)
            })
        }
        if (acceptCall && callQueue) {
            callActive(callQueue)
            setAcceptCall(false)
            setCallQueue(undefined)
        }

    }, [acceptCall, callQueue])
    const peer = getPeer()
    useEffect(() => {
        const handleOpen = (id: string) => {
            console.log('[peer open]', id)
            setPeerId(id)
        }
        if(!peer) return
        peer.on('open', handleOpen)
        peer.on('call', onReceive)

        return () => {
            peer.off('open', handleOpen)
            peer.off('call', onReceive)
        }
    }, [onReceive])

    const [hasStream, setHasStream] = useState(false)
    const [connectStream, setConnectStream] = useState(false)

    const onCall = useCallback(async () => {
        if(!peer) return
        const remoteId = peerRemoteIdRef.current
        console.log({ peerRemoteId: remoteId, call: true, stream, streamRemote })
        if (!remoteId) return

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            stream!.current = localStream; // ✅ Gán vào ref được truyền từ props

            setConnectStream(true);

            const call = peer.call(remoteId, localStream)
            if (!call) {
                console.error('peer.call failed – remote peer not found')
                return
            }
            call.on('stream', (remoteStream) => {
                streamRemote.current = remoteStream
                setHasStream(true)
            })
        } catch (err) {
            console.error('Error getting media or calling peer:', err)
        }
    }, [connectStream])

    return { onCall, streamRemote, hasStream, setPeerRemoteId, setPeerId, peerId, connectStream, peerRemoteId, callQueue, setAcceptCall }
}

export default useCall