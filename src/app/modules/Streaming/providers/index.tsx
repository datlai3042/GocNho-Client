"use client";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../styles/styles.module.scss";
import useCall from "../hooks/useCall";
import { MediaConnection } from "peerjs";
import ButtonAcceptCall from "../../Call/components/ButtonAcceptCall";

type TStreamingContext = {
  styles: {
    readonly [key: string]: string;
  };
  refVideoCore: React.MutableRefObject<HTMLVideoElement | null>;
  refVideoRemote: React.MutableRefObject<HTMLVideoElement | null>;

  handleEvent: {
    onShareScreen: () => Promise<void> | void;
    onWebcam: () => Promise<void> | void;
    onStopStream: () => Promise<void> | void;
    onCall: () => Promise<void> | void;
    setPeerRemoteId: (vl: string) => void;
    setPeerId: React.Dispatch<React.SetStateAction<string>>;
  };
  heightVideo: number;
  stream: MediaStream | null;
  streamRemote: MediaStream | null;
  peerId: string;
  peerRemoteId: string;
};

export const StreamingContext = createContext<Partial<TStreamingContext>>({});

const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const refVideoCore = useRef<HTMLVideoElement | null>(null);
  const refVideoRemote = useRef<HTMLVideoElement | null>(null);

  const stream = useRef<MediaStream | undefined>(undefined);
  const [heightVideo, setHeightVideo] = useState(0);
  const {
    onCall,
    setPeerRemoteId,
    setPeerId,
    streamRemote,
    hasStream,
    peerId,
    connectStream,
    peerRemoteId,
    callQueue,
  } = useCall({ stream });
  const onShareScreen = useCallback(async () => {
    if (stream) {
      await onStopStream();
    }
    try {
      const streamAPI = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (streamAPI && refVideoCore.current) {
        stream.current = streamAPI;

        refVideoCore.current.srcObject = streamAPI;
        refVideoCore.current.play();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);
  const onWebcam = useCallback(async () => {
    if (stream) {
      await onStopStream();
    }
    try {
      const streamAPI = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (streamAPI && refVideoCore.current) {
        stream.current = streamAPI;

        refVideoCore.current.srcObject = streamAPI;
        refVideoCore.current.play();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const onStopStream = useCallback(async () => {
    if (!stream.current) return;
    try {
      stream.current.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (error) {
      console.log({ error });
    }
  }, [stream]);

  useEffect(() => {
    const handleBrowserResize = () => {
      const streamVideo = document.getElementById("stream__video");
      if (!streamVideo) return;
      const viewHeight = window.innerHeight;
      const rect = streamVideo.getBoundingClientRect();
      const positionBottom = viewHeight - (streamVideo.offsetTop + rect.height);
      const heightVideo = viewHeight - (streamVideo.offsetTop + positionBottom);
      setHeightVideo(heightVideo);
    };

    handleBrowserResize();
    window.addEventListener("resize", handleBrowserResize);

    return () => {
      window.removeEventListener("resize", handleBrowserResize);
    };
  }, []);

  const handleEvent = useMemo(() => {
    return {
      onShareScreen,
      onWebcam,
      onStopStream,
      onCall,
      setPeerRemoteId,
      setPeerId,
    };
  }, []);
  useEffect(() => {
    if (hasStream && streamRemote.current && refVideoRemote.current) {
      console.log("other");

      refVideoRemote.current.srcObject = streamRemote.current;
      refVideoRemote.current.onloadedmetadata = () => {
        refVideoRemote.current
          ?.play()
          .catch((err) => console.log("Auto-play blocked:", err));
      };
      refVideoRemote.current.play(); // 🔁 Đừng quên play!
    }
    console.log({ connectStream, stream });
    if (connectStream && stream.current && refVideoCore.current) {
      console.log("me");
      refVideoCore.current.srcObject = stream.current;
      refVideoCore.current.onloadedmetadata = () => {
        refVideoCore.current
          ?.play()
          .catch((err) => console.log("Auto-play blocked:", err));
      };
      refVideoCore.current.play(); // 🔁 Đừng quên play!
    }
  }, [hasStream, connectStream]);
  // useEffect(() => {
  //   console.log({ connectStream, stream });
  //   if (connectStream && stream.current && refVideoCore.current) {
  //     console.log("me");
  //     refVideoCore.current.srcObject = stream.current;
  //     refVideoCore.current.play(); // 🔁 Đừng quên play!
  //   }
  // }, [connectStream]);
  console.log({ callQueue });
  return (
    <StreamingContext.Provider
      value={{
        styles,
        refVideoCore,
        stream: stream.current,
        streamRemote: streamRemote.current,
        peerRemoteId,
        refVideoRemote,
        handleEvent,
        peerId,
        heightVideo,
      }}
    >
      {children}

      {callQueue && <ButtonAcceptCall />}
    </StreamingContext.Provider>
  );
};
export default StreamProvider;
