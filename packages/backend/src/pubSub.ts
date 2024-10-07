import { createPubSub } from "graphql-yoga";
import { eventTarget } from "./workers.ts";

export type PubSubPublishArgsByKey = {
	"taskForce:position": [{ id: string; position: { x: number; y: number } }];
	"taskForce:commisionProgress": [
		{ id: string; progress: number; total: number },
	];
	"taskForce:commisionFinished": [{ id: string; taskForceId: string }];
};

export const pubSub = createPubSub<PubSubPublishArgsByKey>({ eventTarget });
