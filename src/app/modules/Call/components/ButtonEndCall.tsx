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
      className=" bg-[#df3d3d] w-max flex items-center justify-center p-[.8rem] rounded-[.4rem] text-[#fff]"
    >
      <span className="text-[#fff]">Kết thúc cuộc gọi</span>
    </button>
  );
};

export default ButtonEndCall;
