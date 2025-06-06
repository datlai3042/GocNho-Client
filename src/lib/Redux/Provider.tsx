"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "./store";

type TProps = {
  children: React.ReactNode;
};

const ReduxProvider = (props: TProps) => {
  const { children } = props;

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
