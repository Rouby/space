const appOrigin = process.env.APP_ORIGIN;

const appOriginUrl = (() => {
	if (!appOrigin) {
		return null;
	}

	try {
		return new URL(appOrigin);
	} catch {
		return null;
	}
})();

const appHostname = appOriginUrl?.hostname ?? "localhost";

// Browsers can reject Domain=localhost cookies, so keep them host-only in dev.
export const cookieDomain =
	appHostname === "localhost" || appHostname === "127.0.0.1"
		? null
		: appHostname;

export const secureCookies = appOriginUrl?.protocol === "https:";

export async function generateUserClaims(_user: { id: string }) {
	return {
		"urn:space:claim": true,
	};
}
