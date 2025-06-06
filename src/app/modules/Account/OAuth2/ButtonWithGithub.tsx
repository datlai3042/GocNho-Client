"use client";
import Image from "next/image";
import React from "react";

const ButtonLoginGithub = () => {
      const onLoginGithub = () => {
            window.location.assign(`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email`);
      };

      return (
            <button
                  onClick={onLoginGithub}
                  className="w-full h-full flex items-center justify-center gap-[1.4rem] border-[.1rem] border-line-color rounded-xl p-[.8rem_1rem] bg-[#fff] text-[#000]"
            >
                  <Image src={"/assets/images/social/github.png"} width={50} height={50} alt="toast success" className="w-[3rem] h-[3rem]" />
                  <span className="text-[1.5rem]">Github</span>
            </button>
      );
};

export default ButtonLoginGithub;
