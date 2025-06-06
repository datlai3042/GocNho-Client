import { ResponseAuth } from "@/app/modules/RestfullAPI/response.schema"
import { request } from "."
import { AUTHORIZATION_ERROR_STATUS, OK, PERMISSION_ERROR_STATUS, REFRESH_TOKEN_URL } from "./http.constant"
import { RequestRetryParams, ResponseInstance } from "./http.type"
import AuthService from "@/app/modules/Account/Api/auth.service"

export const ResloveClientError = async <TResponse>(
    args: RequestRetryParams
) => {
    const { statusCode } = args
    switch (+statusCode) {
        case AUTHORIZATION_ERROR_STATUS: {
            return Client401<TResponse>(args)
        }

        case PERMISSION_ERROR_STATUS: {
            return Client403(args)
        }
        default: {
            console.log('Lỗi')
            // elementDom.createElementAlert({ title: 'Lỗi nội bộ', buttonText: 'Đăng xuất', callback: () => AuthService.logout() })
        }
    }
}
let refreshTokenPromise: Promise<ResponseInstance<ResponseAuth>> | null = null;

const Client401 = async <TResponse>(args: RequestRetryParams) => {
    const { httpInstance, method, options, url } = args
    if (!refreshTokenPromise) {
        refreshTokenPromise = AuthService.refreshTokenClient().finally(() => (refreshTokenPromise = null));
    }

    if (httpInstance.isPendingRefreshToken) {
        httpInstance.queue_faild.push(args)
    }
    httpInstance.isPendingRefreshToken = true

    return refreshTokenPromise?.then(async (res) => {
        if (+res.code === PERMISSION_ERROR_STATUS) {
            await AuthService.logoutNextClient();
        }
        if (+res.code === OK) {
            const { client_id, token } = res.metadata
            const { access_token, refresh_token } = token
            AuthService.syncNextToken({ access_token, client_id, refresh_token }).then(() => {
                const retry_request = request<TResponse>(method, url, options, httpInstance)
                if (httpInstance?.queue_faild.length > 0) {
                    const resloveQueue = httpInstance.queue_faild.map((request_faild) => {
                        const { httpInstance, options, url, method } = request_faild
                        return request(method, url, options, httpInstance)
                    })
                    Promise.all([retry_request, resloveQueue,])
                        .then(() => httpInstance.clearInstanceCache())
                        .catch(() => AuthService.logoutNextClient())
                        .finally(() => httpInstance.clearInstanceCache())
                }
            }).catch(() => AuthService.logoutNextClient())


        }

    })
}

const Client403 = (args: RequestRetryParams) => {
    console.log({ args })
    if (args.url === REFRESH_TOKEN_URL) {
        return AuthService.logoutNextClient()
    }


    const { httpInstance } = args
    if (httpInstance.queue_faild.length > 0) {
        httpInstance.queue_faild = []
    }

    return new Error(args.response.statusText +  args.response.status)
}