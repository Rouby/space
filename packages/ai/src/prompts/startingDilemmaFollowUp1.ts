export const startingDilemmaFollowUp1 = {
	prompt: (replacements: {
		previousDilemmaQuestion: string;
		previousDilemmaChoice: string;
	}) => `
You are a narrative designer for a 4X massive space opera strategy game called "Astra Mortalis". Your task is to generate a single, compelling starting dilemma for the player.

---
**[START] Game Context Bible**

* **Game Name:** Astra Mortalis
* **Core Theme:** The universe is ancient, dying, and full of terrifying secrets. Entropy is winning. The mood is melancholic and epic.

**[END] Game Context Bible**
---

---
**[START] Starting Dilemma Structure**

The player begins the game by facing three sequential dilemmas. Each dilemma belongs to one of three categories, which narrow in scope from the ancient past to the immediate present.

* **Category 1: The Distant Past (The Origin):** Defines the fundamental, almost mythological, nature of the species (biology, core philosophy). Gameplay effects should be broad, persistent, and societal (e.g., affecting population growth, unity, research leanings, species traits).
* **Category 2: The Recent Past (The Crucible):** Defines a major, society-shaping event that propelled the species toward the stars (e.g., a great war, an ecological disaster, a profound discovery). Effects should shape the homeworld's condition, starting technologies, and political mindset.
* **Category 3: The Immediate Present (The Launch):** Defines the specific FTL project that broke the species out of their solar system. Effects should be concrete and immediate (e.g., the exact starting ships, a bonus to initial resource stockpiles, a unique starbase module).

**[END] Starting Dilemma Structure**
---

Today, you are generating a dilemma for the **The Crucible** category.

The dilemma must have the following structure:
- **Title:** A short, evocative title for the event.
- **Description:** 1-2 paragraphs of story text describing the historical event.
- **Question:** A single, clear question for the player to answer.
- **Choices:** An array of 2 or 3 mutually exclusive choices.
  - For each choice:
	  - **Id:** A unique identifier for the choice.
    - **Choice Title:** A short, punchy title for the choice button.
    - **Choice Description:** A sentence explaining the philosophical or practical meaning of the choice.
    - **Gameplay Effects:** A bulleted list of specific, tangible in-game bonuses and maluses. Use placeholders like "+X% [Resource]", "Starts with [Technology]", "Grants [Special Trait]".

The tone should be epic, serious, and slightly melancholic. The consequences of the choice should be meaningful and balanced.

Your output MUST be a single JSON object matching the following schema. Do NOT output any text before or after the JSON block.

**JSON Schema:**

{
  "dilemma": {
    "title": "string",
    "description": "string",
    "question": "string",
    "choices": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "effectScript": "string"
      }
    ]
  }
}

---

**Example of a good "Crucible" Dilemma:**

{
	"dilemma": {
		"title": "The Great Calamity",
		"description": "Before the written word, before the first city, our ancestors gazed at one another and saw not an individual, but a reflection. Was the self a singular spark of light, or was it a single drop in a vast, shared ocean of consciousness? This foundational schism in our philosophy defined our path.",
		"question": "How did your people first understand the nature of consciousness?",
		"choices": [
			{
				"id": "the_dying_sun",
				"title": "The Dying Sun",
				"description": "Our star is failing; we fled out of desperation. Effects: Homeworld has a \\"Depleting Resources\\" modifier.",
				"effectScript": \`
	Start with a fully functional Colony Ship. +50 colonization speed for the first 3 colonies.\`
			},
			{
				"id": "the_great_war",
				"title": "The Great War",
				"description": "A global conflict nearly destroyed us, and unity was forged in the ashes. Effects: Homeworld has \\"Ruined\\" districts that must be repaired.",
				"effectScript": \`
	Start with advanced weapon and armor technology.
	Population starts lower but has a "Veteran" trait (stronger armies).\`
			}
		]
	}
}

---

Consider the player had previously the question

${replacements.previousDilemmaQuestion}

and choose

${replacements.previousDilemmaChoice}

---

Now, please generate a new dilemma for the **The Crucible** category. The effects should be "medium" impact, shaping your starting homeworld, early-game technologies, and political standing.
`,
	parse: (input: string) =>
		JSON.parse(input) as {
			dilemma: {
				title: string;
				question: string;
				description: string;
				choices: {
					id: string;
					title: string;
					description: string;
					effectScript: string;
				}[];
			};
		},
};
