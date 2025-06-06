'use client'
import React from "react";
import LayoutSideVideoComment from "../layouts/LayoutSideVideoComment";
import StreamProvider from "../providers";

const StreamView = () => {
  return (
    <>
      <StreamProvider>
        <LayoutSideVideoComment />
      </StreamProvider>
    </>
  );
};

export default StreamView;
