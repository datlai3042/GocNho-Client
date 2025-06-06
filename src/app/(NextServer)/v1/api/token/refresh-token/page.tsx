import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const RefreshTokenPageServer = () => {
	const cookieStore = cookies();
	const code_verify_token = cookieStore.get("next_code_verify_token")?.value;

	return redirect(`/refresh-token?code_verify_token=${code_verify_token}&pathName=/v1/api`);
};

export default RefreshTokenPageServer;
