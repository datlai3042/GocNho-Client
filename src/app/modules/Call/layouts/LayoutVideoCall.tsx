"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/styles.module.scss";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";
import ButtonRejectCall from "../components/ButtonRejectCall";
import ButtonAcceptCall from "../components/ButtonAcceptCall";
import { CallContext } from "..";

const LayoutVideoCall = () => {
  // useEffect(() => {
  //   const eventLeaving = (event: BeforeUnloadEvent) => {
  //       instanceHook?.destroy();
  //       handleEventCall.emitRejectCall(infoCall!);
  //   };
  //   window.addEventListener("beforeunload", eventLeaving);
  //   return () => {
  //     window.removeEventListener("beforeunload", eventLeaving);
  //   };
  // }, []);
  const { infoCall } = useContext(CallContext);
  console.log({ infoCall });
  return (
    <div id={`${styles.call__container}`}>
      {infoCall?.call_status === "CREATE" && (
        <>
          <LoadingOnWaitingConnect />
        </>
      )}
      <VideoCallController />
      {infoCall?.call_status === "REJECT" && <span>Không bắt máy</span>}

      <VideoCallMe />
      {infoCall?.call_status === "ACCPET" && (
        <>
          <VideoCallRemote />
        </>
      )}
      {infoCall?.call_status === "COMPLETE" && <VideoCallEndUI />}
    </div>
  );
};

const LoadingOnWaitingConnect = () => {
  return (
    <div className=" absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent flex flex-col gap-[2.6rem]">
      <span className="text-[#fff] text-[2rem]">Đang kết nối...</span>
      <div className="flex gap-[1.4rem] justify-center items-center">
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce" />
      </div>
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
        style={{ width: "34rem" }}
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
  return (
    <div className={`${styles.videoCallController__container}`}>
      <ButtonRejectCall />
      <ButtonAcceptCall />
    </div>
  );
};

const VideoCallEndUI = () => {
  return (
    <div className={`${styles.videoCallEndUI__container}`}>
      <span>Cuộc gọi đã kết thúc</span>
    </div>
  );
};

export default LayoutVideoCall;
