"use client";
import Portal from "@/app/core/Components/Store/Portal";
import Image from "next/image";
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
        className="relative flex z-[500] bg-[#1a1a68] w-full top-0 xl:top-0 left-0 min-h-screen  xl:p-[4rem_2rem]   "
      >
        <div className="min-w-[27vw] max-w-[90vw]   m-[auto]  overflow-auto flex-grow-[1] md:flex-grow-0 flex flex-col   p-[2.8rem_.8rem]">
          <div
            style={{ boxShadow: "1px 1px 5px 5px #d7d7d747" }}
            className="flex-1 flex bg-[#fff]  w-full text-text-theme  rounded-[3rem] py-[1.6rem] auth-scroll"
          >
            {children}
          </div>
          {/* <AuthorDat /> */}
        </div>

        <Image
          src={"/assets/images/themes/authentication/tree.svg"}
          width={100}
          height={100}
          alt="Hình authentication 1"
          className="absolute bottom-[2rem] left-[2vw] w-[30vw] object-cover hidden lg:inline-block"
        />

        <Image
          src={"/assets/images/themes/authentication/pair_programmer.svg"}
          width={100}
          height={100}
          alt="Hình authentication 3"
          className="absolute bottom-[2rem] right-[2vw] w-[30vw] object-cover hidden lg:inline-block"
        />
      </div>
    </Portal>
  );
};

export default AuthLayout;
