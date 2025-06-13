"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { CallContext } from "..";
import ButtonDisableMicro from "../components/ButtonDisableMicro";
import ButtonEndCall from "../components/ButtonEndCall";
import styles from "../styles/styles.module.scss";

const LayoutVideoCall = () => {
  const { infoCall } = useContext(CallContext);
  return (
    <div
      id={`${styles.call__container}`}
      className="flex flex-col "
      style={{
        backgroundColor: infoCall?.call_status === "ACCPET" ? "#fff" : "",
      }}
    >
      {infoCall &&
        infoCall?.call_status !== "CREATE" &&
        infoCall?.call_status !== "COMPLETE" && (
          <div className="h-[3rem] min-h-[3rem] bg-[#fff] flex justify-between"></div>
        )}
      <div style={{ height: "calc(100vh - 10rem)" }} className="relative">
        {(infoCall?.call_status === "CREATE" || !infoCall) && (
          <span>
            <LoadingOnWaitingConnect />
          </span>
        )}
        {infoCall?.call_status !== "COMPLETE" && <VideoCallController />}

        <VideoCallMe />
        {infoCall?.call_status === "REJECT" && <span>Không bắt máy</span>}
        {infoCall?.call_status === "ACCPET" && (
          <>
            <VideoCallRemote />
          </>
        )}
        {infoCall?.call_status === "COMPLETE" && <VideoCallEndUI />}
      </div>
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
    <div
      className={`${styles.videoCallMe__container} ${
        instanceHook?.stream?.current ? styles?.active : ""
      }`}
    >
      <video ref={videoMeRef} autoPlay playsInline></video>
    </div>
  );
};

const VideoCallController = () => {
  return (
    <div className={`${styles.videoCallController__container}`}>
      <ButtonDisableMicro />
      <ButtonEndCall />
    </div>
  );
};

const VideoCallEndUI = () => {
  return (
    <div className={`${styles.videoCallEndUI__container}`}>
      <span className="text-[#fff] text-[2.4rem]">Cuộc gọi đã kết thúc</span>
    </div>
  );
};

export default LayoutVideoCall;
