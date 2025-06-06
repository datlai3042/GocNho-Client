"use client";
const URL = "https://core-stream-call-video.vercel.app";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { UserType } from "../../User/index.type";
import {
  SocketCallVideo,
  SocketCallVideoProvider,
  TSocketCallVideoInfo,
  TSocketEventCall,
} from "../../Call/providers/socketCallVideo.provider";

export type TSocketContext = {
  socket: Socket | null;
  handleEvent: {
    // onCallSocket: (arg: TSocketEventCall) => void;
  };
};

const socketConfig = {
  withCredentials: true,
  transports: ["websocket", "polling", "flashsocket"],
};

export const SocketContext = createContext<TSocketContext>({
  socket: null,
  handleEvent: {
    // onCallSocket: (args: TSocketEventCall) => {},
  },
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  const handleEvent = useMemo(() => {
    return {
      // onCallSocket,
    };
  }, [socketInstance]);

  useEffect(() => {
    if (!socketInstance) return;
  }, [socketInstance]);

  useEffect(() => {
    if (!socketInstance) {
      setSocketInstance(io(URL, socketConfig));
      return;
    }

    const onConnect = () => {
      socketInstance.emit("init", "hi");
    };

    socketInstance.on("connect", onConnect);

    return () => {
      socketInstance.off("connect", onConnect);
    };
  }, [socketInstance]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, handleEvent }}>
      <SocketCallVideoProvider>{children}</SocketCallVideoProvider>
    </SocketContext.Provider>
  );
};

export { SocketProvider };
