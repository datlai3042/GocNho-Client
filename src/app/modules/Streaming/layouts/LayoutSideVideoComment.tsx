"use client";
import React, { useContext } from "react";
import styles from "../styles/styles.module.scss";
import ButtonActions from "../components/Buttons";
import ButtonShareScreen from "../components/Buttons/ButtonShareScreen";
import ButtonWebCam from "../components/Buttons/ButtonWebCam";
import ButtonCall from "../components/Buttons/ButtonCall";
import ButtonStopStream from "../components/Buttons/ButtonStopStream";
import { StreamingContext } from "../providers";
const LayoutSideVideoComment = () => {
  return (
    <div id={styles.layoutSideVideoComment}>
      <Side />
      <Content />
      <Comment />
    </div>
  );
};

const Side = () => {
  return (
    <div id={styles.side} className={styles.flex}>
      Side
    </div>
  );
};
const Comment = () => {
  return (
    <div id={styles.comment} className={styles.flex}>
      <VideoCallRemote />
      <VideoCallMe />
    </div>
  );
};

const VideoCallRemote = () => {
  const { refVideoRemote } = useContext(StreamingContext);
  console.log({refVideoRemote})
  return <video ref={refVideoRemote} className={`${styles.video__call}`}></video>;
};

const VideoCallMe = () => {
  const { refVideoCore } = useContext(StreamingContext);
  return <video ref={refVideoCore} className={`${styles.video__call}`}></video>;
};


const Content = () => {
  const { refVideoCore, heightVideo, handleEvent, peerId } = useContext(StreamingContext);
  return (
    <div id={styles.content}>
      <div className={styles.actions}>
        <input onBlur={(e) => handleEvent?.setPeerRemoteId(e.target.value)} />
        <span>{peerId}</span>
        <ButtonActions
          features={[
            ButtonShareScreen,
            ButtonWebCam,
            ButtonCall,
            ButtonStopStream,
          ]}
        />
      </div>
      <div className="h-[6rem] bg-red-300"></div>
      <div
        className={styles.stream}
        id="stream__video"
        style={{ height: heightVideo || "100%" }}
      >
        {/* <video ref={refVideoCore}></video> */}
      </div>
      <div className={styles.others}>I will belongs to you</div>
    </div>
  );
};
export default LayoutSideVideoComment;
