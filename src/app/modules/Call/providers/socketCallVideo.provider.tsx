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
  useState
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
    emitAccpetCall: (args: TSocketEventCall) => void;
        emitRejectCall: (args: TSocketEventCall) => void;

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
    console.log({userEvent, })

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
      console.log({data})
      if (data?.type === "CREATE_CALL_OF_SOCKET") {
        const { caller_id, onwer_id, receiver_id } = data?.payload;
        console.log({message: 'CREATE_CALL_OF_SOCKET'})
        emitCall({ caller_id, receiver_id, onwer_id });
      }
    };

    videoCallChannel.addEventListener("message", handler);

    return () => {
      videoCallChannel.removeEventListener("message", handler);
    };
  }, [channelName, socket]);
  useEffect(() => {
    if (!socket ) return;
    socket.on(
      SocketVideoCallEvent.emitRejectCall,
      (args: TSocketCallVideoInfo) => {
        SocketCallVideo.onRejectCall(socket, args);
        const { caller_id, onwer_id, receiver_id, call_id, call_status } = args;

        setInfoCall({ caller_id, onwer_id, receiver_id, call_id, call_status });
      }
    );
    SocketCallVideo.onAcceptCall(socket, (args: TSocketEventCall) => {
      if(user?._id !== args.receiver_id) {

        videoCallChannel.postMessage({ type: "ON_ACCEPT_CALL" });
      }
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
  const emitAccpetCall = useCallback(
    (args: TSocketEventCall) => {
      if (!socket) return;
      setInfoCall(args);
      SocketCallVideo.emitAccpetCall(socket,args)
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
  const handleEventCall = useMemo(() => {
    return {
      createCall,
      emitAccpetCall,
      emitRejectCall
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
      {infoCall?.call_status === "CREATE" && <CallVideoNotificationUI />}
    </SocketCallVideoContext.Provider>
  );
};

export { SocketCallVideo, SocketCallVideoProvider };
