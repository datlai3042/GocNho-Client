"use client";
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
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { usePathname } from "next/navigation";
const URL =
  process.env.NEXT_PUBLIC_MODE === "PRO"
    ? process.env.NEXT_PUBLIC_BACK_END_URL
    : "http://localhost:4004";

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
  const user = useSelector((state: RootState) => state.authStore.user);
  const pathname = usePathname()

  const handleEvent = useMemo(() => {
    return {
      // onCallSocket,
    };
  }, [socketInstance]);

  useEffect(() => {
    if (!socketInstance) return;
  }, [socketInstance]);

  useEffect(() => {
    if (!user) return;
    if(['/call'].includes(pathname)) return
    if (!socketInstance) {
      setSocketInstance(io(URL, socketConfig));
      return;
    }

    const onConnect = () => {
      console.log('CONNECT', pathname)
      socketInstance.emit("init", "hi");
    };

    socketInstance.on("connect", onConnect);

    return () => {
      socketInstance.off("connect", onConnect);
    };
  }, [socketInstance, user]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, handleEvent }}>
      <SocketCallVideoProvider>{children}</SocketCallVideoProvider>
    </SocketContext.Provider>
  );
};

export { SocketProvider };
