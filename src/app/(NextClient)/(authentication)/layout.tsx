"use client";
import Portal from "@/app/core/Components/Store/Portal";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [loader, setLoader] = useState<boolean>(false);
  //   const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoader(true);
  }, []);

  if (!loader) return null;

  return (
    <Portal>
      <div
        style={{ lineHeight: 1.6 }}
        className="relative flex z-[500] w-full top-0 xl:top-0 left-0 min-h-screen  xl:pt-0    bg-color-section-theme  "
      >
        <div className="min-w-[28vw] m-auto  overflow-auto flex-grow-[1] md:flex-grow-0 flex flex-col   px-[20px] py-[1rem]">
          {/* <header className="w-full flex   justify-end items-center ">
                                    <ButtonDarkMode />
                              </header> */}
          <div className="flex-1 flex   w-full text-text-theme   auth-scroll">
            {children}
          </div>
          {/* <AuthorDat /> */}
        </div>
        {/* <div className="wrapper hidden bg-[var(--color-main)]  flex-1 relative  overflow-auto min-h-full h-screen  gap-[1rem]  md:flex justify-end ">
                              <div className="min-h-full w-full">
                                    <EditFormPage params={{ id: "profile" }} />
                              </div>
                        </div> */}
      </div>
    </Portal>
  );
};

export default AuthLayout;
