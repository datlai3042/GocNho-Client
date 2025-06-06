import { Http } from "."

export type ResponseTypeCustome = 'json' | 'stream'

export type RequestCustome = Omit<RequestInit, 'method'> & {
    baseUrl?: string
    pathname?: string
} & {
    responseType?: ResponseTypeCustome
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestInstance = {
    method: RequestMethod,
    url: string,
    options: RequestCustome,
    httpInstance: typeof Http
}

export type RequestRetryParams = {
    response: Response,
    statusCode: number,
    url: string,
    fullUrl: string,
    options: RequestInit,
    httpInstance: typeof Http,
    method: RequestMethod
}


export type ResponseInstance<Metadata> = {
    code: number;
    message: string;
    metadata: Metadata;
}