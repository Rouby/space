export const domain = (process.env.APP_ORIGIN || "localhost").replace(
	"https://",
	"",
);

export async function generateUserClaims(_user: { id: string }) {
	return {
		"urn:space:claim": true,
	};
}
