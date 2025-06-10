"use client";
import { createContext, useState } from "react";
import useCall from "../hooks/useCall";
import { TSocketEventCall } from "./socketCallVideo.provider";

type TCallContext = {
  instanceHook: ReturnType<typeof useCall> | undefined;
  infoCall?: TSocketEventCall | undefined;
  setInfoCall?: React.Dispatch<
    React.SetStateAction<TSocketEventCall | undefined>
  >;
};

export const CallContext = createContext<TCallContext>({
  instanceHook: undefined,
  infoCall: undefined,
  setInfoCall: () => {},
});

const CallProvier = ({
  children,
  instanceHook,
  infoCall,
}: {
  children: React.ReactNode;
  instanceHook: ReturnType<typeof useCall>;
  infoCall?: TSocketEventCall | undefined;
}) => {
  return (
    <CallContext.Provider value={{ instanceHook, infoCall }}>
      {children}
    </CallContext.Provider>
  );
};

export default CallProvier;
