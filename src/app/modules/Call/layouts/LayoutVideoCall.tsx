"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { CallContext } from "..";
import ButtonDisableMicro from "../components/ButtonDisableMicro";
import ButtonEndCall from "../components/ButtonEndCall";
import styles from "../styles/styles.module.scss";
import CountdownTimer from "../components/CountCallTime";

const LayoutVideoCall = () => {
  const { infoCall } = useContext(CallContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heightContent, setHeightContent] = useState<string | number>(
    "calc(100vh - 3rem)"
  );

  useEffect(() => {
    const handleBrowserResize = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const heightContent =
          windowHeight - containerRef.current.offsetTop - 10;
        setHeightContent(heightContent);
      }
    };

    handleBrowserResize();
    window.addEventListener("resize", handleBrowserResize);

    return () => {
      window.removeEventListener("resize", handleBrowserResize);
    };
  }, [infoCall]);

  if (false) {
    return (
      <div
        id={`${styles.call__container}`}
        className="flex flex-col "
        style={{
          backgroundColor: infoCall?.call_status === "ACCPET" ? "#fff" : "",
        }}
      >
        <div
          style={{ height: heightContent }}
          ref={containerRef}
          className="relative"
        >
          <div className="flex justify-between absolute top-[2rem] z-[999] w-full ">
            {true && <VideoCallInfo />}
            <VideoCallMeDebugger />
          </div>
          <VideoCallControllerDebugger />

          <>
            <VideoCallRemoteDebugger />
          </>

          {infoCall?.call_status === "COMPLETE" && <VideoCallEndUI />}
        </div>
      </div>
    );
  }
  return (
    <div
      id={`${styles.call__container}`}
      className="flex flex-col "
      style={{
        backgroundColor: infoCall?.call_status === "ACCPET" ? "#fff" : "",
      }}
    >
      <div
        style={{ height: heightContent }}
        ref={containerRef}
        className="relative"
      >
        <div className="flex justify-between gap-[4rem] w-full h-full">
          {true && <VideoCallInfo />}
            <>
          <VideoCallRemote />
        </>
          <VideoCallMe/>
        </div>
        <VideoCallController />

      

        {infoCall?.call_status === "COMPLETE" && <VideoCallEndUI />}
      </div>
    </div>
  );
};

const LoadingOnWaitingConnect = () => {
  return (
    <div className=" absolute left-[50%] text-[#fff] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent flex flex-col items-center gap-[2.6rem]">
      <span className=" text-[2rem]">Đang kết nối...</span>
      <CountdownTimer initialSeconds={0} />
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
    <div className="hidden md:flex p-[.6rem_1.2rem] bg-[#ececec] max-w-[26rem] w-[26rem] h-[6rem] rounded-[.3rem] flex-col justify-center text-[#333] ">
      <div className="flex items-center gap-[1rem]">
        <div className="w-[1rem] h-[1rem] bg-green-500 rounded-full"></div>
        <span className="font-semibold text-[1.5rem]">
          {infoCall?.other?.user_email}
        </span>
      </div>
      <CountdownTimer initialSeconds={0} />
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

const VideoCallRemoteDebugger = () => {
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
        style={{ width: "34rem", background: "red" }}
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

const VideoCallMeDebugger = () => {
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
      <video
        ref={videoMeRef}
        autoPlay
        playsInline
        style={{ background: "#ccc" }}
      ></video>
    </div>
  );
};

const VideoCallController = () => {
  return (
    <>
      <div className={`${styles.videoCallController__container} bottom-[3rem]`}>
        <div
          className={`${styles.videoCallController__wrapper} pb-[4rem] md:pb-0 flex justify-center items-center min-h-[4rem]`}
        >
          <div className={`${styles.videoCallController__videoSetting}`}>
            <ButtonDisableMicro />
          </div>
          <div className="absolute right-[50%] translate-x-[50%] translate-y-[50%] md:translate-x-0  md:translate-y-0 md:right-[2rem] top-[50%]">
            <ButtonEndCall />
          </div>
        </div>
      </div>
    </>
  );
};

const VideoCallControllerDebugger = () => {
  return (
    <>
      <div className={`${styles.videoCallController__container} bottom-[3rem]`}>
        <div
          className={`${styles.videoCallController__wrapper} pb-[4rem] md:pb-0 flex justify-center items-center min-h-[4rem]`}
        >
          <div className={`${styles.videoCallController__videoSetting}`}>
            <ButtonDisableMicro />
          </div>
          <div className="absolute right-[50%] translate-x-[50%] translate-y-[50%] md:translate-x-0  md:translate-y-0 md:right-[2rem] top-[50%]">
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
