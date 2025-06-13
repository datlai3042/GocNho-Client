import { RootState } from "@/lib/Redux/store";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const AccountMeStatus = () => {
  const user = useSelector((state: RootState) => state.authStore.user);

  return (
    // <div className="w-full h-[8rem]  flex-shrink-0 p-[2rem] flex items-center border-b-[.1rem] border-[var(--border-color-line-primarily)]">
    //   <Image
    //     src={user?.user_avatar_system || ""}
    //     width={80}
    //     height={80}
    //     alt="avatar"
    //     className="w-[5rem] h-[5rem] rounded-full"
    //   />
    //   <div>
    //     <span></span>
    //   </div>
    // </div>
    <div className="w-full h-[8rem]  flex-shrink-0 p-[2rem] flex items-center justify-between border-b-[.1rem] border-[var(--border-color-line-primarily)]">
      <div className="flex items-center space-x-3 gap-[.4rem]">
        <Image
          src={user?.user_avatar_system || ""}
          width={80}
          height={80}
          alt="avatar"
          className="w-[4.6rem] h-[4.6rem] rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900">X_AE_A-13</h3>
          <p className=" text-gray-500">@xtheobliterator</p>
        </div>
      </div>
      <button className="text-blue-500  font-medium hover:text-blue-600">
        Switch
      </button>
    </div>
  );
};

export default AccountMeStatus;
