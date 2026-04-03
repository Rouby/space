import { Stack, Text, Title } from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { graphql } from "../../gql";
import { ResearchCategory, ResearchMethodology } from "../../gql/graphql";
import { EvidenceSignalDetailsModal } from "./EvidenceSignalDetailsModal";
import { ResearchFocusCard } from "./ResearchFocusCard";
import { ResearchMiniGameCard } from "./ResearchMiniGameCard";
import { ResearchOutcomesCard } from "./ResearchOutcomesCard";
import { ResearchStatesCard } from "./ResearchStatesCard";

export function ResearchPanel() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });
	const [primaryCategory, setPrimaryCategory] = useState<ResearchCategory>(
		ResearchCategory.Industry,
	);
	const [secondaryCategory, setSecondaryCategory] = useState<ResearchCategory>(
		ResearchCategory.Discovery,
	);
	const [methodology, setMethodology] = useState<ResearchMethodology>(
		ResearchMethodology.Opportunistic,
	);
	const [hasUserEditedFocus, setHasUserEditedFocus] = useState(false);
	const [selectedEvidenceCategory, setSelectedEvidenceCategory] =
		useState<ResearchCategory | null>(null);
	const [triangulationSupportCardId, setTriangulationSupportCardId] =
		useState("");
	const [triangulationConflictCardId, setTriangulationConflictCardId] =
		useState("");
	const [triangulationControlCardId, setTriangulationControlCardId] =
		useState("");
	const [incidentStepOneRisky, setIncidentStepOneRisky] = useState(false);
	const [incidentStepTwoRisky, setIncidentStepTwoRisky] = useState(false);
	const [incidentStepThreeRisky, setIncidentStepThreeRisky] = useState(false);

	const [{ data, fetching }, reexecuteResearchQuery] = useQuery({
		query: graphql(`
			query ResearchFocusPanel($gameId: ID!) {
				game(id: $gameId) {
					id
					turnNumber
					me {
						id
						researchMiniGamePrompt {
							miniGameType
							targetCategory
							promptSeed
							promptTitle
							promptDescription
							triangulationCards {
								id
								label
								relevance
								tag
							}
							incidentSteps {
								step
								title
								safeSuccessChance
								riskySuccessChance
							}
							submitted
							submittedBonus
							submittedQualityScore
							submittedConfidenceScore
							submittedRiskTag
						}
						currentResearchDirective {
							turnNumber
							primaryCategory
							secondaryCategory
							methodology
						}
						researchStates {
							category
							phase
							cumulativeMomentum
							recentEvidence
							breakthroughCount
							pendingOutcomeChoices {
								outcomeKey
								displayName
								outcomeMode
								stat
								modifier
							}
						}
						researchOutcomes(limit: 20) {
							id
							category
							turnNumber
							outcomeKey
							outcomeMode
							stat
							modifier
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const [setFocusResult, setResearchFocus] = useMutation(
		graphql(`
			mutation SetResearchFocus(
				$gameId: ID!
				$primaryCategory: ResearchCategory!
				$secondaryCategory: ResearchCategory!
				$methodology: ResearchMethodology!
			) {
				setResearchFocus(
					gameId: $gameId
					primaryCategory: $primaryCategory
					secondaryCategory: $secondaryCategory
					methodology: $methodology
				) {
					id
					currentResearchDirective {
						turnNumber
						primaryCategory
						secondaryCategory
						methodology
					}
				}
			}
		`),
	);

	const [submitMiniGameResult, submitResearchMiniGameAction] = useMutation(
		graphql(`
			mutation SubmitResearchMiniGameAction(
				$gameId: ID!
				$miniGameType: ResearchMiniGameType!
				$targetCategory: ResearchCategory!
				$triangulationSupportCardId: String
				$triangulationConflictCardId: String
				$triangulationControlCardId: String
				$incidentStepOneRisky: Boolean
				$incidentStepTwoRisky: Boolean
				$incidentStepThreeRisky: Boolean
			) {
				submitResearchMiniGameAction(
					gameId: $gameId
					miniGameType: $miniGameType
					targetCategory: $targetCategory
					triangulationSupportCardId: $triangulationSupportCardId
					triangulationConflictCardId: $triangulationConflictCardId
					triangulationControlCardId: $triangulationControlCardId
					incidentStepOneRisky: $incidentStepOneRisky
					incidentStepTwoRisky: $incidentStepTwoRisky
					incidentStepThreeRisky: $incidentStepThreeRisky
				) {
					id
					researchMiniGamePrompt {
						submitted
						submittedBonus
						submittedQualityScore
						submittedConfidenceScore
						submittedRiskTag
					}
				}
			}
		`),
	);

	const [chooseOutcomeResult, chooseResearchOutcome] = useMutation(
		graphql(`
			mutation ChooseResearchOutcome(
				$gameId: ID!
				$category: ResearchCategory!
				$outcomeKey: String!
				$outcomeMode: String!
			) {
				chooseResearchOutcome(
					gameId: $gameId
					category: $category
					outcomeKey: $outcomeKey
					outcomeMode: $outcomeMode
				) {
					id
					researchStates {
						category
						phase
						synthesisProgress
						breakthroughCount
					}
					researchOutcomes(limit: 20) {
						id
						category
						turnNumber
						outcomeKey
						outcomeMode
						stat
						modifier
					}
				}
			}
		`),
	);

	useEffect(() => {
		const directive = data?.game.me?.currentResearchDirective;
		if (!directive) {
			return;
		}

		setPrimaryCategory(directive.primaryCategory);
		setSecondaryCategory(directive.secondaryCategory);
		setMethodology(directive.methodology);
	}, [data?.game.me?.currentResearchDirective]);

	const researchMiniGamePrompt = data?.game.me?.researchMiniGamePrompt;

	useEffect(() => {
		const prompt = researchMiniGamePrompt;
		setTriangulationSupportCardId("");
		setTriangulationConflictCardId("");
		setTriangulationControlCardId("");
		setIncidentStepOneRisky(false);
		setIncidentStepTwoRisky(false);
		setIncidentStepThreeRisky(false);

		if (!prompt) {
			return;
		}
	}, [researchMiniGamePrompt]);

	const hasInvalidSelection = primaryCategory === secondaryCategory;

	useEffect(() => {
		if (!hasUserEditedFocus || hasInvalidSelection) {
			return;
		}

		const directive = data?.game.me?.currentResearchDirective;
		const hasSameValuesAsServer =
			directive != null &&
			directive.primaryCategory === primaryCategory &&
			directive.secondaryCategory === secondaryCategory &&
			directive.methodology === methodology;

		if (hasSameValuesAsServer) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			void setResearchFocus({
				gameId,
				primaryCategory,
				secondaryCategory,
				methodology,
			});
		}, 250);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [
		data?.game.me?.currentResearchDirective,
		gameId,
		hasInvalidSelection,
		hasUserEditedFocus,
		methodology,
		primaryCategory,
		secondaryCategory,
		setResearchFocus,
	]);

	const researchStates = data?.game.me?.researchStates ?? [];
	const researchOutcomes = data?.game.me?.researchOutcomes ?? [];
	const selectedEvidenceState = researchStates.find(
		(state) => state.category === selectedEvidenceCategory,
	);
	const maxMomentum = Math.max(
		1,
		...researchStates.map((state) => Number(state.cumulativeMomentum)),
	);
	const maxEvidence = Math.max(
		1,
		...researchStates.map((state) => Number(state.recentEvidence)),
	);

	return (
		<>
			<Stack gap="md">
				<div>
					<Title order={3}>Research</Title>
					<Text size="sm" c="dimmed">
						Set your strategic direction and monitor category health at a
						glance.
					</Text>
				</div>

				<ResearchFocusCard
					primaryCategory={primaryCategory}
					secondaryCategory={secondaryCategory}
					methodology={methodology}
					hasUserEditedFocus={hasUserEditedFocus}
					hasInvalidSelection={hasInvalidSelection}
					isSaving={setFocusResult.fetching}
					error={setFocusResult.error}
					onPrimaryCategoryChange={(category) => {
						setHasUserEditedFocus(true);
						setPrimaryCategory(category);
					}}
					onSecondaryCategoryChange={(category) => {
						setHasUserEditedFocus(true);
						setSecondaryCategory(category);
					}}
					onMethodologyChange={(value) => {
						setHasUserEditedFocus(true);
						setMethodology(value);
					}}
				/>

				<ResearchMiniGameCard
					prompt={researchMiniGamePrompt}
					triangulationSupportCardId={triangulationSupportCardId}
					triangulationConflictCardId={triangulationConflictCardId}
					triangulationControlCardId={triangulationControlCardId}
					incidentStepOneRisky={incidentStepOneRisky}
					incidentStepTwoRisky={incidentStepTwoRisky}
					incidentStepThreeRisky={incidentStepThreeRisky}
					submitError={submitMiniGameResult.error}
					isSubmitting={submitMiniGameResult.fetching}
					onTriangulationSupportCardIdChange={setTriangulationSupportCardId}
					onTriangulationConflictCardIdChange={setTriangulationConflictCardId}
					onTriangulationControlCardIdChange={setTriangulationControlCardId}
					onIncidentStepOneRiskyChange={setIncidentStepOneRisky}
					onIncidentStepTwoRiskyChange={setIncidentStepTwoRisky}
					onIncidentStepThreeRiskyChange={setIncidentStepThreeRisky}
					onSubmit={async () => {
						if (!researchMiniGamePrompt) {
							return;
						}

						await submitResearchMiniGameAction({
							gameId,
							miniGameType: researchMiniGamePrompt.miniGameType,
							targetCategory: researchMiniGamePrompt.targetCategory,
							triangulationSupportCardId,
							triangulationConflictCardId,
							triangulationControlCardId,
							incidentStepOneRisky,
							incidentStepTwoRisky,
							incidentStepThreeRisky,
						});
						await reexecuteResearchQuery({ requestPolicy: "network-only" });
					}}
				/>

				<ResearchStatesCard
					turnNumber={data?.game.turnNumber}
					fetching={fetching}
					researchStates={researchStates}
					primaryCategory={primaryCategory}
					secondaryCategory={secondaryCategory}
					maxMomentum={maxMomentum}
					maxEvidence={maxEvidence}
					chooseOutcomeError={chooseOutcomeResult.error}
					isChoosingOutcome={chooseOutcomeResult.fetching}
					onChooseOutcome={async ({ category, outcomeKey, outcomeMode }) => {
						await chooseResearchOutcome({
							gameId,
							category,
							outcomeKey,
							outcomeMode,
						});
						await reexecuteResearchQuery({ requestPolicy: "network-only" });
					}}
					onSelectEvidenceCategory={setSelectedEvidenceCategory}
				/>

				<ResearchOutcomesCard researchOutcomes={researchOutcomes} />
			</Stack>

			<EvidenceSignalDetailsModal
				selectedEvidenceState={selectedEvidenceState}
				primaryCategory={primaryCategory}
				secondaryCategory={secondaryCategory}
				methodology={methodology}
				maxMomentum={maxMomentum}
				maxEvidence={maxEvidence}
				onClose={() => setSelectedEvidenceCategory(null)}
			/>
		</>
	);
}
