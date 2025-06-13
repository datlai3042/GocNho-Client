"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGetAllUser } from "../../User/hooks/useGetAllUser";
import { UserType } from "../../User/index.type";
import { Phone } from "lucide-react";
import ButtonCall from "../../Streaming/components/Buttons/ButtonCall";
import Image from "next/image";

const UserBlock = ({ user }: { user: UserType }) => {
  return (
    <div className=" h-[8rem]  flex-shrink-0 p-[2rem] flex items-center justify-between border-b-[.1rem] border-[var(--border-color-line-primarily)]">
      <div className="flex items-center space-x-3 gap-[.4rem] w-[80%]">
        <Image
          src={user?.user_avatar_system || ""}
          width={80}
          height={80}
          alt="avatar"
          className="w-[4.6rem] h-[4.6rem] rounded-full"
        />
        <div className=" max-w-[100%]">
          <h3 className="font-semibold text-gray-900  truncate max-w-[80%]">{user?.user_email}</h3>
          <p className=" text-gray-500 truncate max-w-[80%]">@{user?.user_email}</p>
        </div>
      </div>
      <div className="text-blue-500  font-medium hover:text-blue-600">
        <ButtonCall userEvent={user} />
      </div>
    </div>
  );
};

const AccountOtherList = () => {
  const contaienrRef = useRef<HTMLDivElement | null>(null);
  const [heightContent, setHeightContent] = useState<string | number>("100%");
  const hookUserList = useGetAllUser({
    config: {},
  });

  useEffect(() => {
    const handleBrowserResize = () => {
      if (contaienrRef.current) {
        const windowHeight = window.innerHeight;
        const heightContent = windowHeight - contaienrRef.current.offsetTop;
        setHeightContent(heightContent);
      }
    };

    handleBrowserResize();
    window.addEventListener("resize", handleBrowserResize);

    return () => {
      window.removeEventListener("resize", handleBrowserResize);
    };
  }, []);

  return (
    <div
      className="flex flex-wrap gap-[2rem]  !pr-0 "
      ref={contaienrRef}
      style={{ height: heightContent }}
    >
      <div className="h-full w-full overflow-auto pr-[1rem]">
        {!hookUserList?.isPending &&
          hookUserList?.data?.metadata?.users?.map((user) => (
            <UserBlock user={user} key={user._id} />
          ))}
      </div>
    </div>
  );
};

export default AccountOtherList;
