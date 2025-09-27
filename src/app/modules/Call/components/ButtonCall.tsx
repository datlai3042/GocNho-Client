"use client";

import { useContext } from "react";
import { UserType } from "../../User/index.type";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";
import { Phone } from "lucide-react";


type TProps = {
  userEvent: UserType
}

const ButtonCall = (props: TProps) => {
  const {handleEventCall} = useContext(SocketCallVideoContext)

  return <button onClick={() => handleEventCall.createCall(props.userEvent)}>
    <Phone size={16} />
  </button>;
};

export default ButtonCall;
