import { cookies } from "next/headers"

const generateCookiesAuth = () => {
    const cookieStore = cookies()
    const client_id = cookieStore.get('client_id')?.value
    const access_token = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value
    return {client_id, access_token, refreshToken}
}

export {generateCookiesAuth}