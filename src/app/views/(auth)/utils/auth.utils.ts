export const getOAuthGoogleUrl = () => {
	const optionParams = {
		redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
		client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};

	const queryString = new URLSearchParams(optionParams);
	const fullUrl = `${process.env.NEXT_PUBLIC_GOOGLE_ROOT_URL}?${queryString.toString()}`;

	return fullUrl;
};
