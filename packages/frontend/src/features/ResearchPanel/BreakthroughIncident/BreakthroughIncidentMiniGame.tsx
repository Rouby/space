import { Button, ButtonGroup, Card, Stack, Text } from "@mantine/core";
import { IconShieldCheck, IconSkull } from "@tabler/icons-react";
import type { ResearchMiniGamePromptData } from "../ResearchPanel.shared";

type BreakthroughIncidentMiniGameProps = {
	prompt: ResearchMiniGamePromptData;
	incidentStepOneRisky: boolean;
	incidentStepTwoRisky: boolean;
	incidentStepThreeRisky: boolean;
	onIncidentStepOneRiskyChange: (value: boolean) => void;
	onIncidentStepTwoRiskyChange: (value: boolean) => void;
	onIncidentStepThreeRiskyChange: (value: boolean) => void;
};

function stepRiskValue(args: {
	step: number;
	stepOne: boolean;
	stepTwo: boolean;
	stepThree: boolean;
}) {
	if (args.step === 1) {
		return args.stepOne;
	}

	if (args.step === 2) {
		return args.stepTwo;
	}

	return args.stepThree;
}

function setStepRisk(args: {
	step: number;
	value: boolean;
	onStepOne: (value: boolean) => void;
	onStepTwo: (value: boolean) => void;
	onStepThree: (value: boolean) => void;
}) {
	if (args.step === 1) {
		args.onStepOne(args.value);
	}

	if (args.step === 2) {
		args.onStepTwo(args.value);
	}

	if (args.step === 3) {
		args.onStepThree(args.value);
	}
}

export function BreakthroughIncidentMiniGame({
	prompt,
	incidentStepOneRisky,
	incidentStepTwoRisky,
	incidentStepThreeRisky,
	onIncidentStepOneRiskyChange,
	onIncidentStepTwoRiskyChange,
	onIncidentStepThreeRiskyChange,
}: BreakthroughIncidentMiniGameProps) {
	return (
		<Stack gap="sm">
			{prompt.incidentSteps.map((step) => (
				<Card key={step.step} withBorder p="xs">
					<Stack gap={4}>
						<Text size="sm" fw={600}>
							Decision {step.step}: {step.title}
						</Text>
						<Text size="xs" c="dimmed">
							Safe {Math.round(step.safeSuccessChance * 100)}% | Risky{" "}
							{Math.round(step.riskySuccessChance * 100)}%
						</Text>
						<ButtonGroup>
							<Button
								leftSection={<IconShieldCheck size={14} />}
								color="teal"
								variant={
									stepRiskValue({
										step: step.step,
										stepOne: incidentStepOneRisky,
										stepTwo: incidentStepTwoRisky,
										stepThree: incidentStepThreeRisky,
									})
										? "light"
										: "filled"
								}
								onClick={() => {
									setStepRisk({
										step: step.step,
										value: false,
										onStepOne: onIncidentStepOneRiskyChange,
										onStepTwo: onIncidentStepTwoRiskyChange,
										onStepThree: onIncidentStepThreeRiskyChange,
									});
								}}
							>
								Conservative approach
							</Button>
							<Button
								leftSection={<IconSkull size={14} />}
								color="red"
								variant={
									stepRiskValue({
										step: step.step,
										stepOne: incidentStepOneRisky,
										stepTwo: incidentStepTwoRisky,
										stepThree: incidentStepThreeRisky,
									})
										? "filled"
										: "light"
								}
								onClick={() => {
									setStepRisk({
										step: step.step,
										value: true,
										onStepOne: onIncidentStepOneRiskyChange,
										onStepTwo: onIncidentStepTwoRiskyChange,
										onStepThree: onIncidentStepThreeRiskyChange,
									});
								}}
							>
								High-risk gamble
							</Button>
						</ButtonGroup>
					</Stack>
				</Card>
			))}
		</Stack>
	);
}
