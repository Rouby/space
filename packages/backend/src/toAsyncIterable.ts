import { type Observable, Subscription } from "rxjs";

export function toAsyncIterable<T>(
	obs: Observable<T>,
	promiseCtor?: PromiseConstructorLike,
): AsyncIterable<T> {
	return {
		[Symbol.asyncIterator]() {
			return new ObservableAsyncIterator(obs);
		},
	};
}

class ObservableAsyncIterator<T> {
	private pendingPromises: Array<PendingPromise<T>> = [];
	private subscription = new Subscription();

	constructor(obs: Observable<T>) {
		const subscription = obs.subscribe({
			next: (value: T) => this.settlePending("resolve", value),
			error: (error: unknown) => this.settlePending("reject", error),
			complete: () => {
				this.subscription.unsubscribe();
				this.pendingPromises.push(PendingPromise.resolve<T>());
			},
		});

		this.subscription.add(subscription);
	}

	[Symbol.asyncIterator](): AsyncIterableIterator<T> {
		return this;
	}

	next(): Promise<IteratorResult<T>> {
		const pending = this.poll();
		this.discardIfNeeded(pending);
		return pending.promise;
	}

	return(): Promise<IteratorResult<T>> {
		this.subscription.unsubscribe();
		this.pendingPromises = [];
		return PendingPromise.resolve<T>().promise;
	}

	private poll(): PendingPromise<T> {
		const pending = this.pendingPromises[0] || this.queue();
		pending.polled = true;
		return pending;
	}

	private queue(): PendingPromise<T> {
		const pending = new PendingPromise<T>();
		this.pendingPromises.push(pending);
		return pending;
	}

	private settlePending(method: "resolve", value: T): void;
	private settlePending(method: "reject", error: unknown): void;
	private settlePending(
		method: "resolve" | "reject",
		value: T | unknown,
	): void {
		const { pendingPromises } = this;
		const lastPending = pendingPromises[pendingPromises.length - 1];
		const pending =
			lastPending && !lastPending.settled ? lastPending : this.queue();
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		this.discardIfNeeded(pending[method](value as any));
	}

	private discardIfNeeded(pending: PendingPromise<T>): void {
		if (pending.settled && pending.polled) {
			const index = this.pendingPromises.indexOf(pending);
			this.pendingPromises.splice(index, 1);
		}
	}
}

class PendingPromise<T> {
	static resolve<U>(): PendingPromise<U> {
		const pending = new PendingPromise<U>();
		pending.settled = true;
		pending.resolveFn({ done: true, value: undefined });
		return pending;
	}

	static reject<U>(reason?: unknown): PendingPromise<U> {
		return new PendingPromise<U>().reject(reason);
	}

	readonly promise: Promise<IteratorResult<T>>;

	polled = false;
	settled = false;

	private resolveFn!: (
		value: IteratorResult<T> | PromiseLike<IteratorResult<T>>,
	) => void;
	private rejectFn!: (reason?: unknown) => void;

	constructor() {
		this.promise = new Promise<IteratorResult<T>>((resolve, reject) => {
			this.resolveFn = resolve;
			this.rejectFn = reject;
		});
	}

	resolve(value: T): this {
		this.settled = true;
		this.resolveFn({ done: false, value });
		return this;
	}

	reject(reason?: unknown): this {
		this.settled = true;
		this.rejectFn(reason);
		return this;
	}
}
