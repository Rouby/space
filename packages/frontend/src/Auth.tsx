import "@mantine/core/styles.css";
import { decodeJwt } from "jose";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useMutation } from "urql";
import { graphql } from "./gql";

const AuthContext = createContext<{
	me: { id: string } | null;
	invalidate: () => void;
}>({ me: null, invalidate() {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [me, setMe] = useState<{ id: string } | null>(() => getMeFromToken());

	const [, refreshLogin] = useMutation(
		graphql(`mutation RefreshLogin {
    loginWithRefreshToken {
      id
    }
  }`),
	);

	const invalidate = useCallback(() => {
		const currentMe = getMeFromToken();

		if (currentMe) {
			setMe(currentMe);
		} else {
			refreshLogin({}).then(
				(d) => d.data?.loginWithRefreshToken.id && invalidate(),
			);
		}
	}, [refreshLogin]);

	useEffect(() => {
		invalidate();
		window.addEventListener("change", invalidate);
		return () => window.removeEventListener("change", invalidate);
	}, [invalidate]);

	return (
		<AuthContext.Provider value={{ me, invalidate }}>
			{children}
		</AuthContext.Provider>
	);
}

function getMeFromToken() {
	const accessToken = document.cookie
		.split("; ")
		.find((c) => c.startsWith("accessToken="))
		?.split("=")
		.at(1);

	if (accessToken) {
		const { sub } = decodeJwt(accessToken);
		if (sub) {
			return { id: sub };
		}
	}
	return null;
}

export function useAuth() {
	return useContext(AuthContext);
}
