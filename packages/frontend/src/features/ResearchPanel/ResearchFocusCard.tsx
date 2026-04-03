import {
	Alert,
	Card,
	Chip,
	Group,
	SegmentedControl,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { CombinedError } from "urql";
import { ResearchCategory, ResearchMethodology } from "../../gql/graphql";
import {
	categoryMeta,
	researchCategoryOptions,
	researchMethodologyOptions,
} from "./ResearchPanel.shared";

type ResearchFocusCardProps = {
	primaryCategory: ResearchCategory;
	secondaryCategory: ResearchCategory;
	methodology: ResearchMethodology;
	hasUserEditedFocus: boolean;
	hasInvalidSelection: boolean;
	isSaving: boolean;
	error?: CombinedError;
	onPrimaryCategoryChange: (category: ResearchCategory) => void;
	onSecondaryCategoryChange: (category: ResearchCategory) => void;
	onMethodologyChange: (methodology: ResearchMethodology) => void;
};

export function ResearchFocusCard({
	primaryCategory,
	secondaryCategory,
	methodology,
	hasUserEditedFocus,
	hasInvalidSelection,
	isSaving,
	error,
	onPrimaryCategoryChange,
	onSecondaryCategoryChange,
	onMethodologyChange,
}: ResearchFocusCardProps) {
	return (
		<Card withBorder>
			<Stack gap="md">
				<Stack gap="xs">
					<Text size="sm" fw={600}>
						Primary Category
					</Text>
					<Chip.Group
						value={primaryCategory}
						onChange={(value) =>
							onPrimaryCategoryChange(
								(value as ResearchCategory) ?? ResearchCategory.Industry,
							)
						}
					>
						<Group gap="xs">
							{researchCategoryOptions.map((option) => {
								const meta = categoryMeta[option.value];
								const Icon = meta.icon;
								return (
									<Chip
										key={`primary-${option.value}`}
										value={option.value}
										disabled={option.value === secondaryCategory}
										color={meta.color}
									>
										<Group gap={6} wrap="nowrap">
											<Icon size={14} />
											<span>{option.label}</span>
										</Group>
									</Chip>
								);
							})}
						</Group>
					</Chip.Group>
				</Stack>

				<Stack gap="xs">
					<Text size="sm" fw={600}>
						Secondary Category
					</Text>
					<Chip.Group
						value={secondaryCategory}
						onChange={(value) =>
							onSecondaryCategoryChange(
								(value as ResearchCategory) ?? ResearchCategory.Discovery,
							)
						}
					>
						<Group gap="xs">
							{researchCategoryOptions.map((option) => {
								const meta = categoryMeta[option.value];
								const Icon = meta.icon;
								return (
									<Chip
										key={`secondary-${option.value}`}
										value={option.value}
										disabled={option.value === primaryCategory}
										color={meta.color}
									>
										<Group gap={6} wrap="nowrap">
											<Icon size={14} />
											<span>{option.label}</span>
										</Group>
									</Chip>
								);
							})}
						</Group>
					</Chip.Group>
				</Stack>

				<Stack gap="xs">
					<Text size="sm" fw={600}>
						Methodology
					</Text>
					<SegmentedControl
						fullWidth
						value={methodology}
						onChange={(value) =>
							onMethodologyChange(
								(value as ResearchMethodology) ??
									ResearchMethodology.Opportunistic,
							)
						}
						data={researchMethodologyOptions.map((option) => ({
							value: option.value,
							label: option.label,
						}))}
					/>
				</Stack>

				{hasInvalidSelection ? (
					<Alert color="yellow" title="Focus conflict">
						Primary and secondary categories must be different.
					</Alert>
				) : null}

				{error ? (
					<Alert color="red" title="Could not save research focus">
						{error.message}
					</Alert>
				) : null}

				{!hasInvalidSelection && hasUserEditedFocus ? (
					<Group gap="xs">
						{isSaving ? (
							<Text size="sm" c="dimmed">
								Saving focus...
							</Text>
						) : (
							<>
								<ThemeIcon size="sm" variant="light" color="teal">
									<IconCheck size={12} />
								</ThemeIcon>
								<Text size="sm" c="dimmed">
									Focus saves automatically
								</Text>
							</>
						)}
					</Group>
				) : null}
			</Stack>
		</Card>
	);
}
