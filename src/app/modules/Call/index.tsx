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
  console.log({ userCurrent, compareId });
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
  const [channelActive, setChanelActive] = useState(false);
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
  console.log({ callHook });
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
    console.log('alo')
    const handler = (
      event: MessageEvent<ChannelCommonData<TSocketEventCall>>
    ) => {
      console.log("🎧 Nhận tin:", event.data);
      console.log({ event });
      const { data, type } = event;

      if (data?.type === "ON_ACCEPT_CALL") {
        setCreateCallInstance(true);
        setInfoCall(data?.payload);
      }


       if (data?.type === SocketVideoCallEvent.onOpenConnect) {
        console.log({data})
        setInfoCall(data?.payload);
      }

      if (data?.type === SocketVideoCallEvent.onWaitingConnect) {
        setInfoCall(data?.payload);
      }
    };
    videoCallChannel.addEventListener("message", handler);

    return () => {
      videoCallChannel.removeEventListener("message", handler);
    };
  }, [channelName, channelActive, user]);

  useEffect(() => {
    if (getMe.isSuccess && !getMe.isPending) {
      setTrigger(true);
    }
  }, [getMe.isPending, getMe.isSuccess]);

  if (!trigger) return <>...loading</>;

  return (
    <CallContext.Provider value={{ instanceHook: callHook, infoCall }}>
      <LayoutVideoCall />
    </CallContext.Provider>
  );
};

export default CallView;
