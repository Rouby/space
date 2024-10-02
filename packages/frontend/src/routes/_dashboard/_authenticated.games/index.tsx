import { Button, TextInput } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useMutation } from "urql";
import { GamesList } from "../../../features/GamesList/GamesList";
import { graphql } from "../../../gql";

export const Route = createFileRoute("/_dashboard/_authenticated/games/")({
	component: () => <GamesPage />,
});

function GamesPage() {
	const [{ fetching }, createGame] = useMutation(
		graphql(`mutation CreateGame($name: String!) {
		createGame(name: $name) {
			id
			name
		}}`),
	);

	return (
		<div>
			<Suspense fallback="loading...">
				<GamesList />
			</Suspense>
			<form
				onSubmit={(evt) => {
					evt.preventDefault();

					const name = (
						evt.currentTarget.elements.namedItem("name") as HTMLInputElement
					).value;

					createGame({ name });
				}}
			>
				<TextInput
					name="name"
					label="Game Name"
					placeholder="Enter game name"
					required
				/>
				<Button type="submit">Create Game</Button>
			</form>
		</div>
	);
}
