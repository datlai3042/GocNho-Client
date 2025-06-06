import { redirect } from "next/navigation";
import { AUTHORIZATION_ERROR_STATUS, PERMISSION_ERROR_STATUS } from "./http.constant";
import { RequestCustome } from "./http.type";

export const ResloveServerError = async (statusCode: number, options: RequestCustome) => {
    switch (statusCode) {
        case AUTHORIZATION_ERROR_STATUS:
            return await nextServer401(options);

        case PERMISSION_ERROR_STATUS:
            return await nextServer403(options);

        default:
            console.log({statusCode})
            redirect("/errors");
    }
};

export const nextServer401 = async (options: RequestCustome) => {
    redirect(`/verify-session`)
    // return AuthService.tokenExpireRedrict(options as CustomRequest);
};

export const nextServer403 = async (options: RequestCustome) => {
    redirect(`/verify-session`)


    // return await AuthService.logoutNextServer(options as CustomRequest);
};


export const nextServer404 = async (options: RequestCustome) => {
    redirect(`/verify-session`)


    // return await AuthService.logoutNextServer(options as CustomRequest);
};

