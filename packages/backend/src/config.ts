export const domain = (process.env.APP_ORIGIN || "localhost").replace(
	"https://",
	"",
);

export async function generateUserClaims(user: { id: string }) {
	return {
		"urn:space:claim": true,
	};
}
