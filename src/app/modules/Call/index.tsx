"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CallProvier from "./providers";
import LayoutVideoCall from "./layouts/LayoutVideoCall";
import {
  channelName,
  SocketCallVideoProvider,
  TSocketEventCall,
  videoCallChannel,
} from "./providers/socketCallVideo.provider";
import useCall from "./hooks/useCall";
import { UserType } from "../User/index.type";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { useGetMe } from "../User/hooks/useGetMe";
export type ChannelCommonData<T extends object = object> = {
  type: string;
  payload: T;
  tabId: string;
};

const isOwnerCall = (
  userCurrent: UserType | null | undefined,
  compareId: string
) => {
  console.log({ userCurrent, compareId });
  return !userCurrent ? false : userCurrent?._id === compareId;
};
const tabName = "call";
const CallView = () => {
  const [createCallInstance, setCreateCallInstance] = useState(false);
  const { getMe } = useGetMe();

  const qs = useSearchParams();
  const [channelActive, setChanelActive] = useState(false);
  const caller_id = qs.get("caller_id");
  const receiver_id = qs.get("receiver_id");
  const onwer_id = qs.get("onwer_id");
  const user = useSelector((state: RootState) => state.authStore.user);
  const [trigger, setTrigger] = useState(false);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const isOwner = useMemo(() => {
    return isOwnerCall(user, caller_id || "");
  }, [getMe.isPending, getMe])
  const callHook = useCall({
    triggerCreate: createCallInstance,
    peerCallId: isOwner ? caller_id || "" : receiver_id || "",
    peerReceiverId: isOwner ? receiver_id || "" : caller_id || "",
    stream: streamRef,
  });
  console.log({callHook})
  useEffect(() => {
    console.log({ caller_id, onwer_id, receiver_id, isOwner });
    if (!caller_id || !onwer_id || !receiver_id) return;
    if (isOwner) {
      videoCallChannel.postMessage({
        type: "CREATE_CALL_OF_SOCKET",
        payload: {
          caller_id,
          onwer_id,
          receiver_id,
          tabName,
        },
      });
    }
    if (receiver_id === onwer_id) {
      setCreateCallInstance(true);
    }
  }, [channelName, receiver_id, isOwner]);

  useEffect(() => {
    if (createCallInstance && isOwner) {
      callHook.onAcceptCallTrigger();
    }
  }, [createCallInstance, isOwner]);
  useEffect(() => {
    const handler = (event: MessageEvent<ChannelCommonData>) => {
      console.log("🎧 Nhận tin:", event.data);
      console.log({ event });
      const { data, type } = event;

      if (data?.type === "ON_ACCEPT_CALL") {
        setCreateCallInstance(true);
      }
    };
    videoCallChannel.addEventListener("message", handler);

    return () => {
      videoCallChannel.removeEventListener("message", handler);
    };
  }, [channelName, channelActive, user]);

  useEffect(() => {
    console.log({ getMe });
    if (getMe.isSuccess && !getMe.isPending) {
      setTrigger(true);
    }
  }, [getMe.isPending, getMe.isSuccess]);

  if (!trigger) return <>...loading</>;

  return (
    <CallProvier instanceHook={callHook}>
      <LayoutVideoCall />
    </CallProvier>
  );
};

export default CallView;
