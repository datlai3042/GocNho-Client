import React, {
  createContext,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { UserType } from "../../User/index.type";
import { useGetMe } from "../../User/hooks/useGetMe";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";

type TAccountContext = {
  user: UserType | undefined | null;
};

const AccountContext = createContext<TAccountContext>({
  user: undefined,
});

const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  useGetMe();
  const user = useSelector((state: RootState) => state.authStore.user);

  return (
    <AccountContext.Provider value={{ user }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
