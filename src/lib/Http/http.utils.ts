import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCustome } from "./http.type";
import { FETCH_FAILED } from "./http.constant";

export const generateInfoRequest = (url: string, options: RequestCustome) => {
    const body = options?.body ? (options.body instanceof FormData ? options.body : JSON.stringify(options.body)) : undefined;
    const baseHeader =
        options?.body instanceof FormData
            ? {}
            : {
                "Content-Type": "application/json",
            };

    let baseUrl = "http://localhost:4004";
    if (options?.baseUrl === undefined) {
        if (process.env.NEXT_PUBLIC_MODE === "DEV") {
            baseUrl = "http://localhost:4004";
        } else {
            baseUrl = process.env.NEXT_PUBLIC_BACK_END_URL as string;
        }
    } else {
        if (process.env.NEXT_PUBLIC_MODE === "DEV") {
            baseUrl = "http://localhost:5173";
        } else {
            baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string;
        }
    }

    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    return { body, baseHeader, baseUrl, fullUrl };
};


export const generateCookiesNextServer = (cookieInstance: ReadonlyRequestCookies) => {
    const client_id = cookieInstance.get('next_client_id')?.value
    const access_token = cookieInstance.get('next_access_token')?.value
    const refresh_token = cookieInstance.get('next_refresh_token')?.value
    const headers =
        `client_id=${client_id};access_token=${access_token};refresh_token=${refresh_token}`
    console.log({ headers })
    return headers
}


export const generateMessageError = (error: Error) => {
    let message = 'Lỗi không xác định'
    if (error?.message === FETCH_FAILED.type) {
        message = FETCH_FAILED.message
        console.log({ message })
        return message
    }
    console.log({ message, error })

    return message
}

export const generateFilesToStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array> | undefined
) => {
    if (!reader) return [];
    const files: { filename: string; content: string }[] = [];
    const boundary = 'boundary'; // Trùng với giá trị trên server
    let buffer = '';  // Chuỗi sẽ chứa dữ liệu giải mã

    const decoder = new TextDecoder('utf-8'); // Sử dụng TextDecoder để chuyển đổi Uint8Array thành chuỗi

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Giải mã dữ liệu và thêm vào buffer
        const decodedValue = decoder.decode(value, { stream: true });
        buffer += decodedValue;

        console.log("Current Buffer:", buffer); // Debug buffer sau khi thêm dữ liệu

        // Tìm và xử lý boundary
        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf(`--${boundary}`)) !== -1) {
            console.log(`Found boundary at index: ${boundaryIndex}`);

            const part = buffer.slice(0, boundaryIndex);  // Lấy phần dữ liệu trước boundary
            buffer = buffer.slice(boundaryIndex + boundary.length + 2); // Cắt bỏ phần dữ liệu đã xử lý
            console.log("Part to process:", part); // Debug dữ liệu phần đã tách

            if (part.length) {
                const match = parseMultipart(part); // Tách file từ dữ liệu
                if (match) {
                    console.log("Matched file:", match);
                    files.push(match);
                } else {
                    console.log("No match for part");
                }
            }
        }
    }

    // Trả về mảng file
    return files;
};

const parseMultipart = (part: string) => {
    // Tách các phần dữ liệu thành filename và content
    const match = part.match(/Content-Disposition: attachment; filename="([^"]+)"\r\n\r\n([\s\S]*)/);

    if (match) {
        const [, filename, content] = match;
        return { filename, content }; // Trả về filename và content dạng chuỗi
    }
    return null;
};

export const getCookieValueHeader = (CookieName: string, CookiesString: string) => {
    const cookieSplit = CookiesString?.split(";");
    let cookies: { [key: string]: string } = {};
    cookieSplit.forEach((pair) => {
        const [name, value] = pair.split("=").map((item) => item.trim());
        cookies[name] = value;
    });

    return cookies[CookieName];
};


export const removeValueLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const setValueLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};





