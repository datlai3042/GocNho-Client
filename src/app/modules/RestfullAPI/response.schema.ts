import { UserType } from "../User/index.type";

export type ResponseApi<Metadata> = {
	code: number;
	message: string;
	metadata: Metadata;
};

export type ResponseAuth = {
	user: UserType;
	token: {
		access_token: string;
		refresh_token: string;
		code_verify_token: string;
	};
	client_id: string;
	expireToken: string;
	expireCookie: string;

};
