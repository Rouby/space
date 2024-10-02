import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

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
	const [{ fetching: signingIn, error: signInError }, signIn] = useMutation(
		graphql(`
    mutation SignIn($email: String!, $password: String!) {
      loginWithPassword(email: $email, password: $password) {
        id
        name
      }
    }`),
	);

	const [{ fetching: signingUp, error: signUpError }, signUp] = useMutation(
		graphql(`
    mutation SignUp($email: String!, $password: String!, $name:String!) {
      registerWithPassword(email: $email, password: $password, name: $name) {
        id
        name
      }
    }`),
	);

	const { redirect: redirectTo } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { invalidate } = useAuth();

	return (
		<>
			<h1>Sign In</h1>
			<form
				onSubmit={async (evt) => {
					evt.preventDefault();

					const email = (
						evt.currentTarget.elements.namedItem("email") as HTMLInputElement
					).value;
					const password = (
						evt.currentTarget.elements.namedItem("password") as HTMLInputElement
					).value;

					await signIn({ email, password });

					invalidate();

					if (redirectTo) {
						navigate({ to: redirectTo as never });
					}
				}}
			>
				<TextInput
					name="email"
					label="Email"
					autoComplete="email"
					type="email"
				/>
				<PasswordInput
					name="password"
					label="Password"
					autoComplete="current-password"
				/>
				<Button type="submit" loading={signingIn}>
					Sign In
				</Button>
				<Text>{signInError?.message}</Text>
			</form>

			<h1>Sign Up</h1>
			<form
				onSubmit={async (evt) => {
					evt.preventDefault();

					const email = (
						evt.currentTarget.elements.namedItem("email") as HTMLInputElement
					).value;
					const password = (
						evt.currentTarget.elements.namedItem("password") as HTMLInputElement
					).value;
					const name = (
						evt.currentTarget.elements.namedItem("name") as HTMLInputElement
					).value;

					await signUp({ email, password, name });

					invalidate();
				}}
			>
				<TextInput
					name="email"
					label="Email"
					autoComplete="email"
					type="email"
					required
				/>
				<PasswordInput
					name="password"
					label="Password"
					autoComplete="new-password"
					required
				/>
				<TextInput name="name" label="Name" autoComplete="name" required />
				<Button type="submit" loading={signingUp}>
					Sign Up
				</Button>
				<Text>{signUpError?.message}</Text>
			</form>
		</>
	);
}
