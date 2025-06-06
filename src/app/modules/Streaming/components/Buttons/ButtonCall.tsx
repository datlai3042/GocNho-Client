"use client";
import React, { useContext } from "react";
import { StreamingContext } from "../../providers";
import { Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { UserType } from "@/app/modules/User/index.type";
import { CallContext } from "@/app/modules/Call/providers";
import { SocketCallVideoContext } from "@/app/modules/Call/providers/socketCallVideo.provider";

type TProps = {
  userEvent: UserType
}

const ButtonCall = (props: TProps) => {
  const {handleEventCall} = useContext(SocketCallVideoContext)

    console.log({props})
  return <button onClick={() => handleEventCall.createCall(props.userEvent)}>
    <Phone size={16} />
  </button>;
};

export default ButtonCall;
