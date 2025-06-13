"use client";
import { Home, LogOut, Pen, Settings, VideoIcon } from "lucide-react";
import { useGetMe } from "../User/hooks/useGetMe";
import AccountMeStatus from "./components/AccountMeStatus";
import AccountOtherList from "./components/AccountOtherList";
import AccountSearch from "./components/AccountSearch";
import AppLogo from "./components/AppLogo";
import styles from "./styles/styles.module.scss";
import { Fragment } from "react";
import Link from "next/link";

const DashboardView = () => {
  useGetMe();

  return (
    <div id={`${styles.dashboard__container}`} className="flex-1">
      {/* <DashboardLeft /> */}
      <DashboardContent />
      <DashboardRight />
    </div>
  );
};

const DashboardRight = () => {
  return (
    <div id={`${styles.dashboard__right}`}>
      <AccountMeStatus />
      <AccountSearch />
      <AccountOtherList />
    </div>
  );
};

const DashboardContent = () => {
  return <div id={`${styles.dashboard__content}`}></div>;
};

export const DashboardLeft = () => {
  return (
    <div id={`${styles.dashboard__left}`} className="flex flex-col gap-[3rem]">
      <AppLogo />
      <NavigationApp />
      <div className="mt-auto">
        <LogoutComponent />
      </div>
    </div>
  );
};

const navs = [
  {
    icon: Home,
    route: "/",
    title: "Trang chủ",
    id: "home",
  },
  {
    icon: VideoIcon,
    route: "/stream",
    title: "Stream",
    id: "stream",
  },

  {
    icon: Pen,
    route: "/plant",
    title: "Lịch trình",
    id: "plant",
  },

  {
    icon: Settings,
    route: "/setting",
    title: "Thiết lập",
    id: "setting",
  },
];

const NavigationApp = () => {
  return (
    <nav className="flex flex-col gap-[2.6rem]">
      {navs?.map((nav) => {
        return <NavigationItem nav={nav} key={nav?.id} />;
      })}
    </nav>
  );
};

const NavigationItem = ({ nav }: { nav: (typeof navs)[number] }) => {
  return (
    <Link
      href={nav?.route}
      className="flex items-center gap-[2rem] text-[1.4rem]"
    >
      <nav.icon className="opacity-60" size={20} />

      <span className="font-semibold">{nav?.title}</span>
    </Link>
  );
};

const LogoutComponent = () => {
  return (
    <button className="w-full flex items-center gap-[2rem] text-[1.4rem]">
      <LogOut className="opacity-60" size={20} />
      <span className="font-semibold">Đăng xuất</span>
    </button>
  );
};

export default DashboardView;
