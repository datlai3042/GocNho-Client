export async function GET() {
	return Response.json(
		{},
		{
			headers: { "Set-Cookie": `isAuthencation=${true};Path=/;httpOnly` },
		}
	);
}
