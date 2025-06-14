"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { CallContext } from "..";
import ButtonDisableMicro from "../components/ButtonDisableMicro";
import ButtonEndCall from "../components/ButtonEndCall";
import styles from "../styles/styles.module.scss";
import CountdownTimer from "../components/CountCallTime";

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
        infoCall?.call_status !== "COMPLETE" && <VideoCallInfo />}
      <div style={{ height: "calc(100vh - 6rem)" }} className="relative">
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
    <div className=" absolute left-[50%] text-[#fff] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent flex flex-col items-center gap-[2.6rem]">
      <span className=" text-[2rem]">Đang kết nối...</span>
      <CountdownTimer initialSeconds={0}/>
      <div className="flex gap-[1.4rem] justify-center items-center">
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-8 w-8 bg-[#fff] rounded-full animate-bounce" />
      </div>
    </div>
  );
};

const VideoCallInfo = () => {
  const { infoCall } = useContext(CallContext);
  const [count, setCount] = useState(0);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerId.current as NodeJS.Timeout);
    };
  }, []);

  return (
    <div className="min-h-[4rem] py-[1rem] bg-[#fff] flex flex-wrap  justify-between text-[#a452f8]">
      <span className="font-semibold text-[1.6rem]">{infoCall?.other?.user_email}</span>
     <CountdownTimer initialSeconds={0}/>
    </div>
  );
};

const VideoCallRemote = () => {
  const { instanceHook } = useContext(CallContext);
  const { infoCall } = useContext(CallContext);
  console.log({ infoCall });
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
    <>
      <div className={`${styles.videoCallController__container} bottom-0-0 md:bottom-[2rem]`}>
        <div className={`${styles.videoCallController__wrapper} pb-[7rem] md:pb-0 flex justify-center items-center min-h-[8rem]`} >
          <div className={`${styles.videoCallController__videoSetting}`}>
            <ButtonDisableMicro />
          </div>
          <div className="absolute right-[50%] translate-x-[50%] md:translate-x-0 md:right-[2rem] top-[50%]">
            <ButtonEndCall />
          </div>
        </div>
      </div>
    </>
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
