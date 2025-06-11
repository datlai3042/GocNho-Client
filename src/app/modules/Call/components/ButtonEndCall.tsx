import { PhoneOff } from "lucide-react";
import React, { useContext } from "react";
import {
  SocketCallVideoContext,
  videoCallChannel,
} from "../providers/socketCallVideo.provider";
import { CallContext } from "..";

const ButtonEndCall = () => {
  const { instanceHook, infoCall } = useContext(CallContext);

  const onRejectCall = () => {
    instanceHook?.destroy();

    if (infoCall?.call_status === "COMPLETE") {
      window.close();
      return;
    } else {
      videoCallChannel.postMessage({
        type: "END_CALL_OF_SOCKET",
        payload: {
          call_id: infoCall?.call_id,
          caller_id: infoCall?.caller_id,
          receiver_id: infoCall?.receiver_id,
        },
      });
    }
  };
  return (
    <button
      onClick={onRejectCall}
      className=" bg-[#df3d3d] w-[4.4rem] flex items-center justify-center aspect-square rounded-full text-[#fff]"
    >
      <PhoneOff size={20} />
    </button>
  );
};

export default ButtonEndCall;
