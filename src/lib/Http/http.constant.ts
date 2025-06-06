
export const AUTHORIZATION_ERROR_STATUS = 401;
export const PERMISSION_ERROR_STATUS = 403;
export const NOTFOUND_ERROR_STATUS = 404;
export const BADREQUEST_ERROR_STATUS = 400;
export const OK = 200

export const LOGIN_URL = '/v1/api/auth/login'
export const REGISTER_URL = '/v1/api/auth/register'
export const LOGOUT_URL = '/v1/api/auth/logout'
export const REFRESH_TOKEN_URL = '/v1/api/auth/refresh-token'


//NEXT
const REQUEST_NEXT_LOGOUT = '/v1/api/authentication/sync-logout'


const AUTH_CONSTANT = {
    LOGIN_URL, REGISTER_URL, REFRESH_TOKEN_URL, LOGOUT_URL, REQUEST_NEXT_LOGOUT
}

export default AUTH_CONSTANT

export const API_SYNC_TOKEN = [LOGIN_URL, REGISTER_URL, REFRESH_TOKEN_URL]


export const FETCH_FAILED = {
    type: 'Failed to fetch',
    message: 'Tìm dữ liệu thất bại'
}