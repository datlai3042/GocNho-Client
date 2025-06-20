import { PhoneOff } from "lucide-react";
import React, { useContext } from "react";
import {
  SocketCallVideoContext,
  videoCallChannel,
} from "../providers/socketCallVideo.provider";
import { CallContext } from "..";

const ButtonRejectCall = () => {
  const { handleEventCall, infoCall } = useContext(SocketCallVideoContext);
  const { instanceHook } = useContext(CallContext);

  const onRejectCall = () => {
    handleEventCall.emitRejectCall(infoCall!);
    videoCallChannel.postMessage({
      type: "REJECT_CALL_OF_SOCKET",
      payload: {
        call_id: infoCall?.call_id,
        caller_id: infoCall?.caller_id,
        receiver_id: infoCall?.receiver_id,
      },
    });
    instanceHook?.destroy();
  };

  

  return (
    <button
      onClick={onRejectCall}
      className="bg-[#df3d3d]  w-[4rem] flex items-center justify-center aspect-square rounded-full text-[#fff]"
    >
      <PhoneOff />
    </button>
  );
};

export default ButtonRejectCall;
