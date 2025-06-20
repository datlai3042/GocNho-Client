"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CallProvier from "./providers";
import LayoutVideoCall from "./layouts/LayoutVideoCall";
import {
  channelName,
  SocketCallVideoProvider,
  SocketVideoCallEvent,
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
  return !userCurrent ? false : userCurrent?._id === compareId;
};

type TCallContext = {
  instanceHook: ReturnType<typeof useCall> | undefined;
  infoCall?: TSocketEventCall | undefined;
  setInfoCall?: React.Dispatch<
    React.SetStateAction<TSocketEventCall | undefined>
  >;
};

export const CallContext = createContext<TCallContext>({
  instanceHook: undefined,
  infoCall: undefined,
  setInfoCall: () => {},
});
const tabName = "call";
const CallView = () => {
  const [createCallInstance, setCreateCallInstance] = useState(false);
  const { getMe } = useGetMe();

  const qs = useSearchParams();
  const caller_id = qs.get("caller_id");
  const receiver_id = qs.get("receiver_id");
  const onwer_id = qs.get("onwer_id");
  const user = useSelector((state: RootState) => state.authStore.user);
  const [trigger, setTrigger] = useState(false);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const isOwner = useMemo(() => {
    return isOwnerCall(user, caller_id || "");
  }, [getMe.isPending, getMe]);
  const callHook = useCall({
    triggerCreate: !!user && createCallInstance,
    peerCallId: isOwner ? caller_id || "" : receiver_id || "",
    peerReceiverId: isOwner ? receiver_id || "" : caller_id || "",
    stream: streamRef,
  });
  const [infoCall, setInfoCall] = useState<TSocketEventCall | undefined>(
    undefined
  );
  useEffect(() => {
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
    const handler = (
      event: MessageEvent<ChannelCommonData<TSocketEventCall>>
    ) => {
      console.log("🎧 Nhận tin:", event);
      const { data, type } = event;

      if (data?.type === "ON_ACCEPT_CALL") {
        setCreateCallInstance(true);
        setInfoCall(data?.payload);
      }

      if (data?.type === SocketVideoCallEvent.onOpenConnect) {
        setInfoCall(data?.payload);
      }

      if (data?.type === SocketVideoCallEvent.onWaitingConnect) {
        setInfoCall(data?.payload);
      }

      if (data?.type === SocketVideoCallEvent.onCancelCall) {
        setInfoCall(data?.payload);
      }

       if (data?.type === 'CLOSE_CALL') {
        setInfoCall(data?.payload);
        console.log({data})
      }
    };
    videoCallChannel.addEventListener("message", handler);

    return () => {
      videoCallChannel.removeEventListener("message", handler);
    };
  }, [channelName, user]);

  useEffect(() => {
    if (getMe.isSuccess && !getMe.isPending) {
      setTrigger(true);
    }
  }, [getMe.isPending, getMe.isSuccess]);

  useEffect(() => {
    const eventLeaving = (event: BeforeUnloadEvent) => {
      callHook?.destroy();
      if (infoCall?.call_status !== "COMPLETE") {
        videoCallChannel.postMessage({ type: "ON_CLOSE_WINDOW_CALL", payload: {...infoCall, call_status: 'COMLETE'} });
      }
    };
    window.addEventListener("beforeunload", eventLeaving);
    return () => {
      window.removeEventListener("beforeunload", eventLeaving);
    };
  }, [infoCall]);

  if (!trigger) return <>...loading</>;

  return (
    <CallContext.Provider value={{ instanceHook: callHook, infoCall }}>
      <LayoutVideoCall />
    </CallContext.Provider>
  );
};

export default CallView;
