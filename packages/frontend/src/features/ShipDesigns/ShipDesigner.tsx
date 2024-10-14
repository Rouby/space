import {
	Button,
	Input,
	InputWrapper,
	NumberInput,
	TextInput,
} from "@mantine/core";
import { useRef, useState } from "react";
import { useMutation } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import type { CreateShipDesignMutationVariables } from "../../gql/graphql";

export function ShipDesigner({ gameId }: { gameId: string }) {
	const [predicted, setPredicted] = useState({
		costs: 0,
		supplyNeed: 0,
	});

	const formRef = useRef<HTMLFormElement>(null);

	const [{ fetching }, createShipDesign] = useMutation(
		graphql(`mutation CreateShipDesign($gameId: ID!, $design: ShipDesignInput!) {
    createShipDesign(gameId: $gameId, design: $design) {
      id
      name
    }
  }`),
	);

	const auth = useAuth();

	return (
		<>
			<form
				ref={formRef}
				onSubmit={(evt) => {
					evt.preventDefault();

					const formData = new FormData(evt.currentTarget as HTMLFormElement);

					const design = {
						name: formData.get("name") as string,
						description: formData.get("description") as string,
						hullRating: +(formData.get("hullRating") as string),
						speedRating: +(formData.get("speedRating") as string),
						armorRating: +(formData.get("armorRating") as string),
						shieldRating: +(formData.get("shieldRating") as string),
						weaponRating: +(formData.get("weaponRating") as string),
						zoneOfControlRating: +(formData.get(
							"zoneOfControlRating",
						) as string),
						supplyCapacity: +(formData.get("supplyCapacity") as string),
					};

					createShipDesign({
						gameId,
						design,
						userId: auth.me?.id,
					} as CreateShipDesignMutationVariables);
				}}
			>
				<TextInput name="name" required label="Name" />
				<TextInput name="description" required label="Description" />
				<NumberInput
					onChange={refreshValues}
					required
					name="hullRating"
					label="Hull rating"
					min={1}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="speedRating"
					label="Speed rating"
					min={0}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="armorRating"
					label="Armor rating"
					min={0}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="shieldRating"
					label="Shield rating"
					min={0}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="weaponRating"
					label="Weapon rating"
					min={0}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="zoneOfControlRating"
					label="Zone of control rating"
					min={0}
				/>
				<NumberInput
					onChange={refreshValues}
					required
					name="supplyCapacity"
					label="Supply capacity"
					min={1}
				/>

				<InputWrapper label="Costs">
					<Input readOnly value={`${predicted.costs} titanium`} />
				</InputWrapper>
				<InputWrapper label="Supply need">
					<Input readOnly value={`${predicted.supplyNeed} units`} />
				</InputWrapper>

				<Button type="submit" loading={fetching}>
					Create
				</Button>
			</form>
		</>
	);

	function refreshValues() {
		const formData = new FormData(formRef.current as HTMLFormElement);

		const design = {
			hullRating: +(formData.get("hullRating") as string),
			speedRating: +(formData.get("speedRating") as string),
			armorRating: +(formData.get("armorRating") as string),
			shieldRating: +(formData.get("shieldRating") as string),
			weaponRating: +(formData.get("weaponRating") as string),
			zoneOfControlRating: +(formData.get("zoneOfControlRating") as string),
			supplyCapacity: +(formData.get("supplyCapacity") as string),
		};

		const supplyNeed =
			design.hullRating +
			design.shieldRating +
			design.armorRating +
			design.weaponRating +
			design.speedRating +
			design.zoneOfControlRating;

		const resourceCosts =
			100 * design.hullRating +
			10 * design.shieldRating +
			10 * design.armorRating +
			10 * design.weaponRating +
			10 * design.speedRating +
			50 * design.zoneOfControlRating +
			25 * design.supplyCapacity;

		setPredicted({
			costs: resourceCosts,
			supplyNeed,
		});
	}
}
