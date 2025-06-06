"use client";
import { createContext } from "react";
import useCall from "../hooks/useCall";

type TCallContext = {
  instanceHook: ReturnType<typeof useCall> | undefined;
};

export const CallContext = createContext<TCallContext>({instanceHook: undefined});

const CallProvier = ({
  children,
  instanceHook,
}: {
  children: React.ReactNode;
  instanceHook: ReturnType<typeof useCall>;
}) => {
  return <CallContext.Provider value={{instanceHook}}>{children}</CallContext.Provider>;
};

export default CallProvier;
