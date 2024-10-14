import { Button } from "@mantine/core";
import { useMutation } from "urql";
import { graphql } from "../../gql";

export function CommisionTaskForce({ starSystemId }: { starSystemId: string }) {
	const [{ fetching }, commisionTaskForce] = useMutation(
		graphql(`mutation CommisionTaskForce($starSystemId: ID!) {
    createTaskForceCommision(starSystemId: $starSystemId) {
      id
      progress
      total
    }
  }`),
	);

	return (
		<div>
			Commision a task force
			<Button
				onClick={() => commisionTaskForce({ starSystemId })}
				loading={fetching}
			>
				Commision
			</Button>
		</div>
	);
}
