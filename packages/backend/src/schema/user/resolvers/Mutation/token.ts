import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || "electric-kitten",
);

export async function signToken(
	subject: string,
	claims: Record<string, unknown>,
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
