import { NextRequest, NextResponse } from "next/server";
const pathAuthentication = ['/login', '/register']
export const middleware = (request: NextRequest) => {
    const clientId = request.cookies.get('client_id')?.value

    const access_token = request.cookies.get("next_access_token")?.value;
    const refresh_token = request.cookies.get("next_refresh_token")?.value;
    const client_id = request.cookies.get("next_client_id")?.value;
    const expire_token = request.cookies.get("next_expire_token")?.value;
    const expire_cookie = request.cookies.get("next_expire_cookie")?.value;
    const code_verify_token = request.cookies.get("next_code_verify_token")?.value;

    const { pathname } = request.nextUrl
    if (pathAuthentication.includes(pathname)) {
        return NextResponse.next()
    }
    console.log({client_id})
    if (!client_id) {
        return NextResponse.redirect(new URL('/login', request.url))
    }


    return NextResponse.next();


}




export const config = {
    matcher: ["/", '/login', '/register', '/dashboard', '/call'], // tránh apply middleware lên static file
}