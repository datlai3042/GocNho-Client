"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/styles.module.scss";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";
import { CallContext } from "../providers";
const LayoutVideoCall = () => {
  const { infoCall } = useContext(SocketCallVideoContext);
  const { instanceHook } = useContext(CallContext);
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
  const { infoCall } = useContext(SocketCallVideoContext);
  const { instanceHook } = useContext(CallContext);

  const videoRemoteef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    console.log("step2-remote");
    if (
      instanceHook?.hasStream &&
      instanceHook.streamRemote?.current &&
      videoRemoteef.current
    ) {
      console.log({ instanceHook });
      console.log("🎥 srcObject:", videoRemoteef.current?.srcObject);
      const tracks = instanceHook.streamRemote?.current?.getVideoTracks();
      console.log("🎥 Video track:", tracks?.[0], tracks?.[0]?.readyState);
      instanceHook?.streamRemote.current.getVideoTracks().forEach((track) => {
        console.log(
          "🔍 Track enabled:",
          track.enabled,
          "readyState:",
          track.readyState
        );
      });

      videoRemoteef.current.srcObject = instanceHook.streamRemote.current;
      videoRemoteef.current.play();
    }
  }, [instanceHook?.hasStream]);
  return (
    <div className={`${styles.videoCallRemote__container}`}>
      <video ref={videoRemoteef} muted></video>
    </div>
  );
};

const VideoCallMe = () => {
  const { infoCall } = useContext(SocketCallVideoContext);
  const { instanceHook } = useContext(CallContext);

  const videoMeRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log("step1-local");

    if (
      instanceHook?.connectStream &&
      instanceHook.stream?.current &&
      videoMeRef.current
    ) {
      console.log({ instanceHook });

      videoMeRef.current.srcObject = instanceHook.stream.current;
      videoMeRef.current.play();
    }
  }, [instanceHook?.connectStream]);

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
