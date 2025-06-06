import { CustomRequest, MessageResponse, TokenNextSync } from "@/type";
import { redirect } from "next/navigation";
import { object } from "zod";
import { Http } from "@/lib/Http";
import { getCookieValueHeader, removeValueLocalStorage, setValueLocalStorage } from "@/lib/Http/http.utils";
import { ResponseApi, ResponseAuth } from "../../RestfullAPI/response.schema";
import { ConstructorError, ErrorPayload, PermissionError } from "../../RestfullAPI/http.error";
import { ResponseInstance } from "@/lib/Http/http.type";

type FuncAuth = () => ResponseApi<ResponseAuth>;

class AuthService {
      static async register<Body, Response>(body: Body) {
            return Http.post<Response>("/v1/api/auth/register", body, {});
      }

      static async login<Body, Response>(body: Body) {
            return Http.post<Response>("/v1/api/auth/login", body);
      }

      static async logoutNextClient() {
            const urlRequestBackEnd = "v1/api/auth/logout";
            const urlRequestNextServer = "v1/api/auth/next-logout";
            const options = { baseUrl: "" };
            try {
                  const a = await Http.post<ResponseApi<MessageResponse>>(urlRequestBackEnd, { force: true }, {});
                  await Http.post<ResponseApi<MessageResponse>>(urlRequestNextServer, object, options);

                  if (typeof window !== "undefined") {
                        return (window.location.href = "/login");
                  }
            } catch (e) {
                  await Http.post<ResponseApi<MessageResponse>>(urlRequestNextServer, object, options);
                  if (typeof window !== "undefined") {
                        removeValueLocalStorage("expireToken");
                        removeValueLocalStorage("code_verify_token");

                        return window.location.href = "/login?token_expire=true"
                  }
            }

            return null;
      }

      static async logoutNextServer(options: CustomRequest) {
            const cookies = (options?.headers as any)["Cookie"];

            const code_verify_token = getCookieValueHeader("code_verify_token", cookies);
            const force = getCookieValueHeader("force", cookies);

            return redirect(`/logout?code_verify_token=${code_verify_token}&force=${force}`);
      }

      static async refreshTokenServer(signal?: AbortSignal) {
            const res = await Http.get<ResponseAuth>("/v1/api/auth/refresh-token", {
                  credentials: "include",
                  signal,
            });
            const { access_token, refresh_token, code_verify_token } = res.metadata.token;
            const { client_id, expireToken, expireCookie } = res.metadata;

            const body = {
                  access_token,
                  refresh_token,
                  client_id,
                  expireToken,
                  code_verify_token,
                  expireCookie,
            };

            const syncToken = await Http.post<TokenNextSync>("/v1/api/auth/set-token", body, { baseUrl: "", signal });

            return syncToken;
      }

      static async refreshTokenClient(signal?: AbortSignal) {
            const option: RequestInit = {
                  credentials: "include",
            };

            const urlRequest = process.env.NEXT_PUBLIC_MODE === "DEV" ? "http://localhost:4000" : process.env.BACK_END_URL;
            const callRefreshToken: ResponseInstance<ResponseAuth> = await Http.get<ResponseAuth>(`/v1/api/auth/refresh-token`, {});
            return callRefreshToken;
      }

      static async syncNextToken({
            access_token,
            refresh_token,
            code_verify_token = '',
            client_id,
            expireToken = '',
            expireCookie = '',
      }: {
            access_token: string;
            refresh_token: string;
            code_verify_token?: string;
            client_id: string;
            expireToken?: string;
            expireCookie?: string;
      }) {
            const bodySyncTokenAPI = {
                  access_token,
                  refresh_token,
                  client_id,
                  code_verify_token,
                  expireToken,
                  expireCookie,
            };

            const urlRequest ='https://core-stream-call-video.vercel.app';

            const syncToken = await fetch(`${urlRequest}/v1/api/auth/set-token`, {
                  body: JSON.stringify(bodySyncTokenAPI),
                  method: "POST",
            });
            setValueLocalStorage("expireToken", expireToken);

            setValueLocalStorage("code_verify_token", code_verify_token);
            setValueLocalStorage("expireCookie", expireCookie);
      }

      static async tokenExpireRedrict(options: CustomRequest) {
            const pathName = options?.pathName;
            const cookies = (options?.headers as any)["Cookie"];

            const code_verify_token = getCookieValueHeader("code_verify_token", cookies);

            return redirect(`/v1/api/token/refresh-token?code_verify_token=${code_verify_token}&pathName=${pathName}`);
      }

      static async tokenPermission(statusCode: number, payload: ErrorPayload) {
            const payloadError: ConstructorError = {
                  status: +statusCode,
                  payload: payload as ErrorPayload,
            };
            throw new PermissionError(payloadError);
      }
}

export default AuthService;
