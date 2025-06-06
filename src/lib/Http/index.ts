/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRedirectError, RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { API_SYNC_TOKEN, OK } from "./http.constant";
import { RequestCustome, RequestMethod, RequestRetryParams, ResponseInstance } from "./http.type";
import { generateFilesToStream, generateInfoRequest } from "./http.utils";
import { ResloveClientError } from "./useCaseClient";
import { ResloveServerError } from "./useCaseServer";
import AuthService from "@/app/modules/Account/Api/auth.service";
import { ResponseAuth } from "@/app/modules/RestfullAPI/response.schema";
import { Suspense } from "react";
export const normalizePath = (url: string) => {
      return url.startsWith("/") ? url.slice(1) : url;
};

export const request = async <TResponse>(method: RequestMethod, url: string, options: RequestCustome = {}, httpInstance: typeof Http) => {
    const { baseHeader, body, fullUrl } = generateInfoRequest(url, options)
    const optionsRequest: RequestInit = {
        ...options,
        headers: {
            ...baseHeader,
            ...options?.headers,
        } as any,
        body,
        method,

        credentials: "include",
    };
    let response: Response = {} as Response
    try {
        response = await fetch(fullUrl, optionsRequest)
    } catch (e: unknown) {
        try {
            if (typeof window === 'undefined') {
                redirect('/', RedirectType.push) // this will throw error

            } else {
                return { ok: false, code: false, metadata: {} } as unknown as TResponse
            }

        } catch (error) {
            if (isRedirectError(error)) { // Redirect error handle here
                return { ok: false, code: false, metadata: {} } as unknown as TResponse

            } else {
                console.log('other error')
                return { ok: false, code: false, metadata: {} } as unknown as TResponse

            }
        }


    }


    if (!response.ok || !response) {
        if (typeof window !== "undefined") {
            const props: RequestRetryParams = {
                fullUrl, options: optionsRequest, response, statusCode: response.status, url, httpInstance, method
            }
            await ResloveClientError<Response>(props);
            throw new Error(`HTTP error! status: ${response.status}`);


        } else {
            await ResloveServerError(+response.status, options as RequestCustome);
        }
    }

    const responseType = options.responseType || 'json'; // Mặc định là 'json'
    if (responseType === 'json') {
        const payload: TResponse = await response.json();
        if (["v1/api/auth/login", "v1/api/auth/register"].some((path) => path === normalizePath(url))) {
            // const expireTokenJSON = (payload as ResponseApi<ResponseAuth>).metadata.expireToken;
            // setValueLocalStorage("expireToken", expireTokenJSON);

            // const codeVerifyTokenJSON = (payload as ResponseApi<ResponseAuth>).metadata.token.code_verify_token;
            // setValueLocalStorage("code_verify_token", codeVerifyTokenJSON);


            // const expireCookieJSON = (payload as ResponseApi<ResponseAuth>).metadata.expireCookie;
            // setValueLocalStorage("expireCookie", expireCookieJSON);

            const { metadata } = payload as ResponseInstance<ResponseAuth>;
            const {
                client_id,
                expireToken,
                token: { access_token, code_verify_token, refresh_token },
                expireCookie
            } = metadata;
            const params = { access_token, code_verify_token, refresh_token, client_id, expireToken, expireCookie };

            await AuthService.syncNextToken(params);
        }
        // if (API_SYNC_TOKEN.includes(url)) {
        //     const { code, metadata } = payload as ResponseInstance<ResponseAuth>
        //     if (+code === OK) {

        //         const { metadata } = payload as ResponseInstance<ResponseAuth>;
        //         const {
        //             client_id,
        //             expireToken,
        //             token: { access_token, code_verify_token, refresh_token },
        //             expireCookie
        //         } = metadata;
        //         const params = { access_token, code_verify_token, refresh_token, client_id, expireToken, expireCookie };

        //         await AuthService.syncNextToken(params);
        //     }
        // }
        return payload;
    }

    if (responseType === 'stream') {
        const reader = response.body?.getReader();
        return generateFilesToStream(reader) as TResponse
    }
    return {} as TResponse;
}


export class Http {
    static queue_faild: RequestRetryParams[] = []
    static isPendingRefreshToken = false
    static get<TResponse>(url: string, options: Omit<RequestCustome, "body"> = {}): Promise<ResponseInstance<TResponse>> {
        const method: RequestMethod = 'GET'
        const responseType = options.responseType ? options.responseType : 'json'
        return request<ResponseInstance<TResponse>>(method, url, { ...options, responseType }, Http,)
    }

    static post<TResponse>(url: string, body: any, options: Omit<RequestCustome, "body"> = {}) {
        const method: RequestMethod = 'POST'
        const responseType = options.responseType ? options.responseType : 'json'

        return request<ResponseInstance<TResponse>>(method, url, { ...options, body, responseType }, Http,)
    }

    static put<TResponse>(url: string, body: any, options: Omit<RequestCustome, 'body'> = {}) {
        const method: RequestMethod = 'PUT'
        const responseType = options.responseType ? options.responseType : 'json'

        return request<ResponseInstance<TResponse>>(method, url, { ...options, body, responseType }, Http,)
    }

    static delete<TResponse>(url: string, options: Omit<RequestCustome, 'body'> = {}) {
        const method: RequestMethod = 'DELETE'
        const responseType = options.responseType ? options.responseType : 'json'

        return request<ResponseInstance<TResponse>>(method, url, { ...options, responseType }, Http,)
    }

    static clearInstanceCache() {
        Http.isPendingRefreshToken = false
        Http.queue_faild = []
    }

}

const http = {
    get: Http.get,
    post: Http.post,
    put: Http.put,
    delete: Http.delete,
}


export default http