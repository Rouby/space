import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useMutation } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

export function SignInForm({
	onSignedIn,
	onNavigateToSignUp,
}: {
	onSignedIn: () => void;
	onNavigateToSignUp: () => void;
}) {
	const [{ fetching: signingIn, error: signInError }, signIn] = useMutation(
		graphql(`
    mutation SignIn($email: String!, $password: String!) {
      loginWithPassword(email: $email, password: $password) {
        id
        name
      }
    }`),
	);

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

					onSignedIn();
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
				<Group justify="space-between" pt="md">
					<Button type="submit" loading={signingIn}>
						Sign In
					</Button>
					<Button onClick={onNavigateToSignUp} variant="subtle">
						Create an account
					</Button>
				</Group>
				<Text c="red">{signInError?.message}</Text>
			</form>
		</>
	);
}
