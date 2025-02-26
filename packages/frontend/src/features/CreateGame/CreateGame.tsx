import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "urql";
import { graphql } from "../../gql";
import type { CreateGameMutation } from "../../gql/graphql";

export function CreateGame() {
	const [opened, { open, close }] = useDisclosure(false);
	const [{ fetching }, createGame] = useMutation<CreateGameMutation>(
		graphql(`mutation CreateGame($name: String!) {
			createGame(name: $name) {
				id
				name
			}
		}`),
	);

	return (
		<>
			<Group justify="flex-end" mb="md">
				<Button onClick={open}>Create Game</Button>
			</Group>

			<Modal opened={opened} onClose={close} title="Create New Game">
				<form
					onSubmit={async (evt) => {
						evt.preventDefault();
						const form = evt.currentTarget;

						const name = (form.elements.namedItem("name") as HTMLInputElement)
							.value;

						const result = await createGame({ name });

						if (result.data) {
							form.reset();
							close();
						}
					}}
				>
					<TextInput
						name="name"
						label="Game Name"
						placeholder="Enter game name"
						required
						mb="md"
					/>
					<Button type="submit" loading={fetching} fullWidth>
						Create Game
					</Button>
				</form>
			</Modal>
		</>
	);
}
