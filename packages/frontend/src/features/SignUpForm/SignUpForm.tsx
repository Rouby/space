import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useMutation } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

export function SignUpForm({
	onSignedUp,
	onNavigateToSignIn,
}: {
	onSignedUp: () => void;
	onNavigateToSignIn: () => void;
}) {
	const [{ fetching: signingUp, error: signUpError }, signUp] = useMutation(
		graphql(`
		mutation SignUp($email: String!, $password: String!, $name:String!) {
			registerWithPassword(email: $email, password: $password, name: $name) {
				id
				name
			}
		}`),
	);

	const { invalidate } = useAuth();

	return (
		<>
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

					const result = await signUp({ email, password, name });

					if (result.error) {
						return;
					}

					invalidate();

					onSignedUp();
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
				<Group justify="space-between" pt="md">
					<Button type="submit" loading={signingUp}>
						Sign Up
					</Button>
					<Button onClick={onNavigateToSignIn} variant="subtle">
						Already have an account? Sign in
					</Button>
				</Group>
				<Text c="red">{signUpError?.message}</Text>
			</form>
		</>
	);
}
