"use client";
import Portal from "@/app/core/Components/Store/Portal";
import { motion } from "motion/react";
import Image from "next/image";
import React, {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../Socket/providers";
import { UserType } from "../../User/index.type";
import ButtonAcceptCall from "../components/ButtonAcceptCall";
import ButtonRejectCall from "../components/ButtonRejectCall";
import useCall from "../hooks/useCall";
import { TCallSchema } from "../types/call.type";
import { useSearchParams } from "next/navigation";
import { channel } from "diagnostics_channel";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { ChannelCommonData } from "..";
export type TSocketEventCall = {
  caller_id: string;
  receiver_id: string;
  onwer_id: string;
  call_id?: string;
  call_status?: TCallSchema["call_status"];
};

export type TSocketCallVideoInfo = {
  infoUserCall: UserType;
  call_id: string;
} & TSocketEventCall;

enum SocketVideoCallEvent {
  emitInitVideoCall = "emitInitVideoCall",
  emitRejectCall = "emitRejectCall",
  emitAccpetCall = "emitAccpetCall",

  onRejectCall = "onRejectCall",
  onPendingCall = "onPendingCall",
  onAcceptCall = "onAcceptCall",
}

export const channelName = "call_video";
export const videoCallChannel = new BroadcastChannel(channelName);
type TSocketCallVideo = {
  infoUserCall: UserType | undefined;
};

const CallVideoNotificationUI = () => {
  const { infoUserCall } = useContext(SocketCallVideoContext);

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
            className="w-[22rem] h-[34rem]  flex flex-col items-center gap-[1.2rem] rounded-[1rem] text-[rgb(7_32_106)]"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              // backgroundImage: `url("https://wallpapercat.com/w/full/0/9/3/177233-1125x2436-samsung-hd-clouds-background-image.jpg")`,
            }}
          >
            <div className="w-full  p-[1rem] flex justify-center items-center bg-[#1e1e84]">
              <Image
                width={100}
                height={100}
                className="w-[10rem] aspect-square rounded-full object-cover"
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSudatOj4-AKUkVt9L1o3dQ3PfIuQGf0mUThg&s"
                }
                alt="avatar user call"
              />
            </div>
            <span className="text-[1.8rem] font-bold">
              {" "}
              {infoUserCall?.user_email || 123}
            </span>
            <div className="mt-auto flex gap-[2rem] justify-center">
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
        console.log("Có tín hiệu");
        if (callback) {
          callback(args);
        }
      }
    );
  }
  static clearEvent(socket: Socket) {
    socket.off(
      SocketVideoCallEvent.emitInitVideoCall,
      SocketCallVideo.emitInitVideoCall
    );
    socket.off(
      SocketVideoCallEvent.onPendingCall,
      SocketCallVideo.isRequestPending
    );
  }
}

type TSocketCallVideoEvent = {
  handleEventCall: {
    createCall: (userEvent: UserType) => void;
  };
};

export const SocketCallVideoContext = createContext<
  TSocketCallVideoEvent & TSocketCallVideo
>({
  handleEventCall: {
    createCall: (userEvent) => {},
  },
  infoUserCall: undefined,
});

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
    videoCallChannel.postMessage({ type: "CREATE_CALL" });
    const windowFeatures =
      "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no," +
      `width=${screen.width},height=${screen.height},top=0,left=0`;
    window.open(url, "_blank", windowFeatures);
  };

  useEffect(() => {
    videoCallChannel.onmessage = (
      event: MessageEvent<ChannelCommonData<TSocketEventCall>>
    ) => {
      const { data, type } = event;
      if (data?.type === "CREAL_CALL_OF_SOCKET") {
        const { caller_id, onwer_id, receiver_id } = data?.payload;
        emitCall({ caller_id, receiver_id, onwer_id });
      }
    };
  }, [channelName]);
  useEffect(() => {
    if (!socket) return;
    socket.on(
      SocketVideoCallEvent.emitRejectCall,
      (args: TSocketCallVideoInfo) => {
        SocketCallVideo.onRejectCall(socket, args);
        const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;

        setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
      }
    );
    SocketCallVideo.onAcceptCall(socket, (args: TSocketEventCall) => {
        videoCallChannel.postMessage({type: 'ON_ACCEPT_CALL'})
    });

    SocketCallVideo.isRequestPending(socket, (args: TSocketCallVideoInfo) => {
      const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;
      setInfoUserCall(args.infoUserCall);
      setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
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

  const handleEventCall = useMemo(() => {
    return {
      createCall,
    };
  }, [socket]);

  return (
    <SocketCallVideoContext.Provider
      value={{
        handleEventCall,
        infoUserCall,
      }}
    >
      {children}
      {infoCall?.call_status === "CREATE" && <CallVideoNotificationUI />}
    </SocketCallVideoContext.Provider>
  );
};

export { SocketCallVideo, SocketCallVideoProvider };
