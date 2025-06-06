"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/styles.module.scss";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";
import { CallContext } from "../providers";

const LayoutVideoCall = () => {
  const { infoCall } = useContext(SocketCallVideoContext);
  return (
    <div id={`${styles.call__container}`}>
      {infoCall?.call_status === "CREATE" && <span>Đang kết nối</span>}
      {infoCall?.call_status === "REJECT" && <span>Không bắt máy</span>}

      <VideoCallRemote />
      <VideoCallMe />
      <VideoCallController />
    </div>
  );
};

const VideoCallRemote = () => {
  const { instanceHook } = useContext(CallContext);
  const videoRemoteRef = useRef<HTMLVideoElement | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Cập nhật remoteStream mỗi khi instanceHook.hasStream thay đổi
  useEffect(() => {
    if (instanceHook?.hasStream && instanceHook.streamRemote?.current) {
      setRemoteStream(instanceHook.streamRemote.current);
    }
  }, [instanceHook?.hasStream, instanceHook?.streamRemote?.current]);

  // Gán remoteStream vào video element
  useEffect(() => {
    if (videoRemoteRef.current && remoteStream) {
      videoRemoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className={`${styles.videoCallRemote__container}`}>
      <video
        ref={videoRemoteRef}
        autoPlay
        playsInline
        style={{ background: "#000", width: "100%", height: "100%" }}
      ></video>
    </div>
  );
};

const VideoCallMe = () => {
  const { instanceHook } = useContext(CallContext);
  const videoMeRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (
      instanceHook?.connectStream &&
      instanceHook.stream?.current &&
      videoMeRef.current
    ) {
      videoMeRef.current.srcObject = instanceHook.stream.current;
    }
  }, [instanceHook?.connectStream, instanceHook?.stream?.current]);

  return (
    <div className={`${styles.videoCallMe__container}`}>
      <video ref={videoMeRef} autoPlay playsInline></video>
    </div>
  );
};

const VideoCallController = () => {
  return <div className={`${styles.videoCallController__container}`}></div>;
};

export default LayoutVideoCall;