// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { RequestCustome, RequestMethod } from "./http.type";
// import { generateInfoRequest } from "./http.utils";

// const request = async <TResponse>(method: RequestMethod, url: string, options: RequestCustome = {}, HttpInstance: typeof Http, status: boolean, token: string) => {
//     const { baseHeader, body, fullUrl } = generateInfoRequest(url, options)
//     console.log('chay lai', url)
//     const optionsRequest: RequestInit = {
//         ...options,
//         headers: {
//             ...baseHeader,
//             ...options?.headers,
//         } as any,
//         body,
//         method,
//         credentials: "include",
//     };
//     console.log({ status, token, url })
//     // const response = await fetch(fullUrl, optionsRequest)
//     if (!status) {
//         console.log('call ref')
//         HttpInstance.errors.push({
//             method,
//             options,
//             url
//         })
//         Http.valid = true
//         Http.token = '304'
//         HttpInstance.errors.forEach((req) => request(req?.method, req?.url, options, HttpInstance, Http.valid, Http.token))
//     }
//     console.log({ error: HttpInstance.errors })
//     HttpInstance.errors = []

//     // const payload: TResponse = await response.json()

//     return true;



// }


// export class Http {
//     static errors: any[] = []
//     static token = '123'
//     static valid = true
//     static get<TResponse>(url: string, options: Omit<RequestCustome, "body">) {
//         const method: RequestMethod = 'GET'
//         return request<TResponse>(method, url, options, Http, Http.valid, Http.token,)
//     }

//     static post<TResponse>(url: string, body: any, options: Omit<RequestCustome, "body"> = {}) {
//         const method: RequestMethod = 'POST'
//         return request<TResponse>(method, url, { ...options, body }, Http, Http.valid, Http.token,)
//     }

//     static put<TResponse>(url: string, body: any, options: Omit<RequestCustome, 'body'> = {}) {
//         const method: RequestMethod = 'PUT'
//         Http.valid = false
//         return request<TResponse>(method, url, { ...options, body }, Http, Http.valid, Http.token,)
//     }

//     static delete<TResponse>(url: string, options: Omit<RequestCustome, 'body'> = {}) {
//         const method: RequestMethod = 'DELETE'
//         return request<TResponse>(method, url, options, Http, Http.valid, Http.token,)
//     }

// }

// const http = {
//     get: Http.get,
//     post: Http.post,
//     put: Http.put,
//     delete: Http.delete,
// }


// export default http