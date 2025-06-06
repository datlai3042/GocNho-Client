'use client'
import { Phone } from "lucide-react";
import React, { useContext } from "react";
import { SocketCallVideoContext } from "../providers/socketCallVideo.provider";

const ButtonAcceptCall = () => {
  const {handleEventCall,  infoCall} = useContext(SocketCallVideoContext)

  return (
    <button onClick={() =>handleEventCall.emitAccpetCall(infoCall!)} className="bg-[#1076fa]  animate-pulse w-[5rem] flex items-center justify-center aspect-square rounded-full text-[#fff]">
      <Phone />
    </button>
  );
};

export default ButtonAcceptCall;
