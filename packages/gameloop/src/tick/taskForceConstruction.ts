import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceConstruction(
	_tx: Transaction,
	_ctx: Context,
) {
	// Construction orders are currently committed at command time; no deferred
	// per-turn construction queue exists yet.
}
