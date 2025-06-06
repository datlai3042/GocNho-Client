"use client";
import AuthService from "@/app/modules/Account/Api/auth.service";
import { differenceInMinutes } from "date-fns";
import { useEffect } from "react";

const TIME_CHECK_AGAIN = 30;
const timeCheck = 1000 * 60 * TIME_CHECK_AGAIN;

const CheckTimeToken = () => {
  console.log("render");
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const exprireToken = JSON.parse(
        localStorage.getItem("expire_token") || "0"
      );
      const exprireTokemTime = new Date(exprireToken);
      if (differenceInMinutes(exprireTokemTime, now) < TIME_CHECK_AGAIN) {
        try {
           await AuthService.refreshTokenClient();
        } catch (e: unknown) {
            console.log({error: e, scope: 'time-check-token'})
          await AuthService.logoutNextClient();
          window.location.href = "/";
        }
      }
    }, timeCheck);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <></>;
};

export default CheckTimeToken;
