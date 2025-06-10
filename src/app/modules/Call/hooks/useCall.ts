import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import Peer, { DataConnection, MediaConnection } from "peerjs"
import { createPeer, getPeer } from "../../Streaming/config/peer"

type TUseCall = {
    stream?: MutableRefObject<MediaStream | undefined>
    peerReceiverId: string
    peerCallId: string
    triggerCreate: boolean
}

const CONFIG_VIDEO = {
    width: { ideal: 1280 }, // hoặc 1920 cho FullHD
    height: { ideal: 720 }, // hoặc 1080 cho FullHD
    frameRate: { ideal: 30, max: 60 }
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
                console.log('Peer open:', id)
                setPeerId(peerCallId)
                setPeerReady(true)
            }

            const onReceive = async (call: MediaConnection) => {
                console.log({ peerRemoteId: peerReceiverId, receive: true, stream, streamRemote });

                try {
                    // Nếu chưa có stream local, lấy từ camera + mic
                    if (typeof stream?.current === 'undefined') {
                        const streamAPI = await navigator.mediaDevices.getUserMedia({
                            video: CONFIG_VIDEO,
                            audio: true,
                        });

                        stream!.current = streamAPI;
                        console.log("✅ Lấy được stream local:", streamAPI);
                        setConnectStream(true);
                    }
                    // Trả lời cuộc gọi với stream local
                    console.log("📞 Trả lời cuộc gọi với stream local...");
                    call.answer(stream!.current);

                    // Khi nhận stream từ phía bên kia
                    call.on('stream', (remoteStream) => {
                        console.log("📥 Nhận stream từ peer:", peerId, remoteStream);
                        console.log("Tracks:", remoteStream.getTracks());

                        streamRemote.current = remoteStream;
                        setHasStream(true);
                    });

                } catch (error: any) {
                    console.error("❌ Lỗi truy cập camera:", error?.name, error?.message, error);
                }
            };

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
    }, [triggerCreate, peerCallId])

    const [hasStream, setHasStream] = useState(false)
    const [connectStream, setConnectStream] = useState(false)

    const onCall = useCallback(async () => {

        if (!peerReceiverId || !peerRef.current || !peerRef.current) return

        try {

            const localStream = await navigator.mediaDevices.getUserMedia({ video: CONFIG_VIDEO, audio: true })
            stream!.current = localStream; // ✅ Gán vào ref được truyền từ props

            setConnectStream(true);
            if (!pendingAccpet) return


            const call = peerRef.current!.call(peerReceiverId, localStream)
            if (!call) {
                console.error('peer.call failed – remote peer not found')
                return
            }
            console.log('Peer received call:', call)
            call.on('stream', (remoteStream) => {
                streamRemote.current = remoteStream
                console.log('Received remote stream:', remoteStream);

                setHasStream(true)
            })



        } catch (err) {
            console.error('Error getting media or calling peer:', err)
        }
    }, [pendingAccpet])

    const getValueHook = () => {
        return { onCall, streamRemote, stream, hasStream, setPeerRemoteId, setPeerId, peerId, connectStream, peerRemoteId, peerReady, destroy }

    }


    useEffect(() => {
        console.log({ connectStream })
    }, [connectStream])


    useEffect(() => {
        console.log({ pendingAccpet })
        if (pendingAccpet) {
            setTimeout(() => {
                onCall()
            }, 5000)

        }
    }, [pendingAccpet])

    const destroy = () => {
        peerRef.current?.destroy()
        peerRef.current = null

    }

    return { onAcceptCallTrigger, onCall, getValueHook, streamRemote, stream, hasStream, setPeerRemoteId, setPeerId, peerId, connectStream, peerRemoteId, peerReady, destroy }
}

export default useCall