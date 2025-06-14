"use client";
import Portal from "@/app/core/Components/Store/Portal";
import { RootState } from "@/lib/Redux/store";
import { motion } from "motion/react";
import Image from "next/image";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { ChannelCommonData } from "..";
import { SocketContext } from "../../Socket/providers";
import { UserType } from "../../User/index.type";
import ButtonAcceptCall from "../components/ButtonAcceptCall";
import ButtonRejectCall from "../components/ButtonRejectCall";
import { TCallSchema } from "../types/call.type";
export type TSocketEventCall = {
  caller_id: string;
  receiver_id: string;
  onwer_id: string;
  call_id?: string;
  call_status?: TCallSchema["call_status"];
  other?: UserType;
};

export type TSocketCallVideoInfo = {
  infoUserCall?: UserType;
  infoUserReceiver?: UserType;
  call_id: string;
  other: UserType;
} & TSocketEventCall;

export enum SocketVideoCallEvent {
  emitInitVideoCall = "emitInitVideoCall",
  emitRequestCall = "emitRequestCall",
  onWaitingConnect = "onWaitingConnect",
  onOpenConnect = "onOpenConnect",
  onCancelCall = "onCancelCall",
  emitRejectCall = "emitRejectCall",
  emitAccpetCall = "emitAccpetCall",
  emitCancelCall = "emitCancelCall",
  onAcceptCall = "onAcceptCall",
  onRejectCall = "onRejectCall",
  onPendingCall = "onPendingCall",
  onConnectStream = "onConnectStream",
  ON_CLOSE_WINDOW_CALL = "ON_CLOSE_WINDOW_CALL",
}

export const channelName = "call_video";
export const videoCallChannel = new BroadcastChannel(channelName);
type TSocketCallVideo = {
  infoUserCall: UserType | undefined;
};

const CallVideoNotificationUI = () => {
  const { infoUserCall } = useContext(SocketCallVideoContext);
  console.log({ infoUserCall });
  return (
    <Portal>
      <>
        {/* <div  className="fixed inset-0 w-full h-screen z-[100] bg-[#000c14e6]"></div> */}
        <motion.div
          initial={{ right: "-10rem" }}
          animate={{ right: "2rem" }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-[2rem] right-[2rem] z-[101]"
        >
          <div
            className="w-[20rem]  bg-[#15158a] p-[2rem_0rem]  flex flex-col items-center gap-[1.2rem] rounded-[1rem] text-[#fff]"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              // backgroundImage: `url("https://wallpapercat.com/w/full/0/9/3/177233-1125x2436-samsung-hd-clouds-background-image.jpg")`,
            }}
          >
            <div className="w-full  p-[1rem] flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                className="w-[8rem] aspect-square rounded-full object-cover"
                src={infoUserCall?.user_avatar_system || ""}
                alt="avatar user call"
              />
            </div>
            <span className="text-[1.8rem] font-bold">
              {" "}
              {infoUserCall?.user_atlas}
            </span>
            <div className="mt-auto flex gap-[1rem] justify-center">
              <ButtonRejectCall />
              <ButtonAcceptCall />
            </div>
          </div>
        </motion.div>
      </>
    </Portal>
  );
};
class SocketCallVideo {
  static async emitInitVideoCall(socket: Socket, args: TSocketEventCall) {
    socket.emit(SocketVideoCallEvent.emitInitVideoCall, args);
  }
  static async isRequestPending(
    socket: Socket,
    callback?: (args: TSocketCallVideoInfo) => void
  ) {
    socket.on(
      SocketVideoCallEvent.onPendingCall,
      (args: TSocketCallVideoInfo) => {
        if (callback) {
          callback(args);
        }
      }
    );
  }

  static async emitRejectCall(
    socket: Socket,
    args: TSocketEventCall,
    callback?: () => void
  ) {
    socket.emit(SocketVideoCallEvent.emitRejectCall, args);
    if (callback) {
      callback();
    }
  }

  static async emitCancelCall(
    socket: Socket,
    user_emitter: UserType,
    args: TSocketEventCall,
    callback?: () => void
  ) {
    console.log({args})
    socket.emit(SocketVideoCallEvent.emitCancelCall, {
      ...args,
      user_emitter_id: user_emitter?._id,
    });
    SocketCallVideo.clearEvent(socket);
    if (callback) {
      callback();
    }
  }

  static async onRejectCall(
    socket: Socket,
    args: TSocketEventCall,
    callback?: () => void
  ) {
    SocketCallVideo.clearEvent(socket);
  }

  static async emitAccpetCall(
    socket: Socket,
    args: TSocketEventCall,
    callback?: () => void
  ) {
    socket.emit(SocketVideoCallEvent.onAcceptCall, args);
  }
  static async onAcceptCall(
    socket: Socket,
    callback?: (args: TSocketCallVideoInfo) => void
  ) {
    socket.on(
      SocketVideoCallEvent.onAcceptCall,
      (args: TSocketCallVideoInfo) => {
        if (callback) {
          callback(args);
        }
      }
    );
  }
  static async onCancelCall(
    socket: Socket,
    callback?: (args: TSocketCallVideoInfo) => void
  ) {
    socket.on(
      SocketVideoCallEvent.onCancelCall,
      (args: TSocketCallVideoInfo) => {
        if (callback) {
          callback(args);
        }
      }
    );
  }

  static async onWaitingConnect(
    socket: Socket,

    callback?: (args: TSocketCallVideoInfo) => void
  ) {
    socket.on(
      SocketVideoCallEvent.onWaitingConnect,
      (args: TSocketCallVideoInfo) => {
        if (callback) {
          callback(args);
        }
      }
    );
  }
  static clearEvent(socket: Socket) {
    // socket.off(
    //   SocketVideoCallEvent.emitInitVideoCall,
    //   SocketCallVideo.emitInitVideoCall
    // );
    // socket.off(
    //   SocketVideoCallEvent.onPendingCall,
    //   SocketCallVideo.isRequestPending
    // );
  }
}

type TSocketCallVideoEvent = {
  handleEventCall: {
    createCall: (userEvent: UserType) => void;
    emitAccpetCall: (args: TSocketEventCall) => void;
    emitRejectCall: (args: TSocketEventCall) => void;
    emitCancelCall: (args: TSocketEventCall, user: UserType) => void;
  };
};

export const SocketCallVideoContext = createContext<
  TSocketCallVideoEvent &
    TSocketCallVideo & { infoCall: TSocketEventCall | undefined }
>({
  handleEventCall: {
    createCall: (userEvent) => {},
    emitAccpetCall: (args: TSocketEventCall) => {},
    emitRejectCall: (args: TSocketEventCall) => {},
    emitCancelCall: (args: TSocketEventCall, user: UserType) => {},
  },
  infoUserCall: undefined,
  infoCall: undefined,
});
const tabName = "wrapper";
const SocketCallVideoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useContext(SocketContext);
  const [infoUserCall, setInfoUserCall] = useState<UserType | undefined>(
    undefined
  );
  const user = useSelector((state: RootState) => state.authStore.user);
  const [infoCall, setInfoCall] = useState<TSocketEventCall | undefined>(
    undefined
  );
  const createCall = (userEvent: UserType) => {
    const url = `/call?caller_id=${user?._id}&receiver_id=${userEvent?._id}&onwer_id=${user?._id}`;

    const windowFeatures =
      "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no," +
      `width=${screen.width},height=${screen.height},top=0,left=0`;
    window.open(url, "_blank", windowFeatures);
  };

  useEffect(() => {
    const handler = (
      event: MessageEvent<ChannelCommonData<TSocketEventCall>>
    ) => {
      const { data } = event;
      if (data?.type === "CREATE_CALL_OF_SOCKET") {
        const { caller_id, onwer_id, receiver_id } = data?.payload;
        console.log({ message: "CREATE_CALL_OF_SOCKET" });
        emitCall({ caller_id, receiver_id, onwer_id });
      }

      if (data?.payload?.call_status !== 'COMPLETE' && data?.type === "END_CALL_OF_SOCKET") {
        const { caller_id, onwer_id, receiver_id } = data?.payload;
        console.log({ message: "END_CALL_OF_SOCKET" });
        console.log({data})
        handleEventCall.emitCancelCall(data?.payload, user as UserType);
      }

      if (data?.payload?.call_status !== 'COMPLETE' && data?.type === "ON_CLOSE_WINDOW_CALL") {
        const { caller_id, onwer_id, receiver_id, call_id } = data?.payload;
        console.log({ message: "ON_CLOSE_WINDOW_CALL" });
        console.log({data})

        handleEventCall.emitCancelCall(data?.payload, user as UserType);
      }
    };

    videoCallChannel.addEventListener("message", handler);

    return () => {
      videoCallChannel.removeEventListener("message", handler);
    };
  }, [channelName, socket, user]);
  useEffect(() => {
    if (!socket) return;
    socket.on(
      SocketVideoCallEvent.emitRejectCall,
      (args: TSocketCallVideoInfo) => {
        SocketCallVideo.onRejectCall(socket, args);
        const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;
        console.log("emitRejectCall received", args);

        setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
      }
    );
    SocketCallVideo.onAcceptCall(socket, (args: TSocketCallVideoInfo) => {
      console.log("onAcceptCall received", args);

      if (user?._id !== args.receiver_id) {
        videoCallChannel.postMessage({
          type: "ON_ACCEPT_CALL",
          payload: { ...args, other: args.infoUserReceiver },
        });
      }
    });

    SocketCallVideo.onWaitingConnect(socket, (args: TSocketEventCall) => {
      console.log("onWaitingConnect received", args);

      const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;
      setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
      videoCallChannel.postMessage({
        type: SocketVideoCallEvent.onWaitingConnect,
        payload: args,
      });
    });
    SocketCallVideo.isRequestPending(socket, (args: TSocketCallVideoInfo) => {
      console.log("isRequestPending received", args);

      const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;
      setInfoUserCall(args.infoUserCall);
      setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
    });
    socket.on(
      SocketVideoCallEvent.onOpenConnect,
      (args: TSocketCallVideoInfo) => {
        console.log({ args });
        setInfoCall(args);
        setTimeout(() => {
          videoCallChannel.postMessage({
            type: SocketVideoCallEvent.onOpenConnect,
            payload: { ...args, other: args?.infoUserCall },
          });
        }, 2500);
      }
    );
    socket.on(SocketVideoCallEvent.onCancelCall, (args: TSocketEventCall) => {
      console.log("onCancelCall", args);

      setInfoCall(args);
      videoCallChannel.postMessage({
        type: SocketVideoCallEvent.onCancelCall,
        payload: args,
      });
    });
  }, [socket]);
  const emitCall = useCallback(
    (args: TSocketEventCall) => {
      if (!socket) return;
      SocketCallVideo?.emitInitVideoCall(socket, args);
      setInfoCall(args);
    },
    [socket]
  );
  const emitAccpetCall = useCallback(
    (args: TSocketEventCall) => {
      if (!socket) return;

      SocketCallVideo.emitAccpetCall(socket, args);
      const { caller_id, onwer_id, receiver_id, call_id } = args;
      const url = `/call?caller_id=${caller_id}&receiver_id=${receiver_id}&onwer_id=${receiver_id}&daua=true`;
      const windowFeatures =
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no," +
        `width=${screen.width},height=${screen.height},top=0,left=0`;
      window.open(url, "_blank", windowFeatures);
    },
    [socket]
  );
  const emitRejectCall = useCallback(
    (args: TSocketEventCall) => {
      if (!socket) return;
      SocketCallVideo?.emitRejectCall(socket, args, () => {
        setInfoCall((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            call_status: "REJECT",
          };
        });
      });
    },
    [socket]
  );
  const emitCancelCall = useCallback(
    (args: TSocketEventCall, user: UserType) => {
      if (!socket || infoCall?.call_status === 'COMPLETE') return;
      console.log({args})
      SocketCallVideo?.emitCancelCall(socket, user as UserType, args, () => {
        const newInfoCall = {
          ...structuredClone(infoCall as TSocketEventCall),
          call_status: "COMPLETE" as const,
          ...args
        };
        setInfoCall(newInfoCall);
        videoCallChannel.postMessage({
          type: "CLOSE_CALL",
          payload: newInfoCall,
        });
      });
    },
    [socket, user]
  );

  const handleEventCall = useMemo(() => {
    return {
      createCall,
      emitAccpetCall,
      emitRejectCall,
      emitCancelCall,
    };
  }, [socket, user]);

  return (
    <SocketCallVideoContext.Provider
      value={{
        handleEventCall,
        infoUserCall,
        infoCall,
      }}
    >
      {children}
      {infoCall?.receiver_id === user?._id &&
        infoCall?.call_status === "CREATE" && <CallVideoNotificationUI />}
    </SocketCallVideoContext.Provider>
  );
};

export { SocketCallVideo, SocketCallVideoProvider };
