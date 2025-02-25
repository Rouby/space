import { useToggle } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../../Auth";
import { SignInForm } from "../../features/SignInForm/SignInForm";
import { SignUpForm } from "../../features/SignUpForm/SignUpForm";

export const Route = createFileRoute("/_dashboard/signin")({
	component: () => <SignInPage />,
	validateSearch: (search) => {
		return {
			redirect:
				typeof search.redirect === "string" ? search.redirect : undefined,
		};
	},
});

function SignInPage() {
	const { redirect: redirectTo } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { me } = useAuth();

	const [showSignIn, toggleSignIn] = useToggle();

	// biome-ignore lint/correctness/useExhaustiveDependencies: only redirect if me changes
	useEffect(() => {
		if (me) {
			navigate({ to: (redirectTo as never) ?? "/" });
		}
	}, [me]);

	return (
		<>
			{showSignIn ? (
				<SignInForm
					onSignedIn={() => {
						if (redirectTo) {
							navigate({ to: redirectTo as never });
						}
					}}
					onNavigateToSignUp={toggleSignIn}
				/>
			) : (
				<SignUpForm
					onSignedUp={() => {
						if (redirectTo) {
							navigate({ to: redirectTo as never });
						}
					}}
					onNavigateToSignIn={toggleSignIn}
				/>
			)}
		</>
	);
}
