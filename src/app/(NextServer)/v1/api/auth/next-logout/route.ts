import { cookies } from "next/headers";

export async function POST(res: Request) {
	cookies().delete("next_access_token");

	cookies().delete("next_client_id");
	cookies().delete("next_refresh_token");
	cookies().delete("next_code_verify_token");
	return Response.json({ message: "OK" });
}
