import { SignJWT, jwtVerify } from "jose";
import type { generateUserClaims } from "../../../../config.ts";

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || "electric-kitten",
);

export async function signToken(
	subject: string,
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	claims: Awaited<ReturnType<typeof generateUserClaims>> | {},
	expirationTime: Date,
) {
	return new SignJWT(claims)
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(subject)
		.setIssuedAt()
		.setIssuer("urn:space:issuer")
		.setAudience("urn:space:audience")
		.setExpirationTime(expirationTime)
		.sign(secret);
}

export async function verifyToken(token: string) {
	return jwtVerify(token, secret, {
		issuer: "urn:space:issuer",
		audience: "urn:space:audience",
	}).then((result) => result.payload);
}
