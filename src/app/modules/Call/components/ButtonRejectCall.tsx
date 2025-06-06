import { PhoneOff } from "lucide-react";
import React, { useContext } from "react";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";

const ButtonRejectCall = () => {
  const {handleEventCall,  infoCall} = useContext(SocketCallVideoContext)
  return (
    <button onClick={() => handleEventCall.emitRejectCall(infoCall!)} className="bg-[#df3d3d]  w-[5rem] flex items-center justify-center aspect-square rounded-full text-[#fff]">
      <PhoneOff />
    </button>
  );
};

export default ButtonRejectCall;
