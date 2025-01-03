<script lang="ts">
	import type { TransactionWithId } from '@dfinity/ledger-icp';
	import type { Principal } from '@dfinity/principal';
	import { isNullish, jsonReviver } from '@dfinity/utils';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { run } from 'svelte/legacy';
	import { type WalletWorker, initWalletWorker } from '$lib/services/worker.wallet.services';
	import type { PostMessageDataResponse } from '$lib/types/post-message';
	import { emit } from '$lib/utils/events.utils';

	interface Props {
		missionControlId: Principal;
		balance?: bigint | undefined;
		transactions?: TransactionWithId[];
		children: Snippet;
	}

	let {
		missionControlId,
		balance = $bindable(undefined),
		transactions = $bindable([]),
		children
	}: Props = $props();

	let worker: WalletWorker | undefined = $state();

	const syncState = (data: PostMessageDataResponse) => {
		if (isNullish(data.wallet)) {
			return;
		}

		balance = data.wallet.balance;
		transactions = [...JSON.parse(data.wallet.newTransactions, jsonReviver), ...transactions];

		emit({
			message: 'junoSyncBalance',
			detail: balance
		});
	};

	const initWorker = async () => {
		worker = await initWalletWorker();
	};

	run(() => {
		// @ts-expect-error TODO: to be migrated to Svelte v5
		worker,
			missionControlId,
			(() => {
				if (isNullish(missionControlId)) {
					worker?.stop();
					return;
				}

				worker?.start({
					missionControlId,
					callback: syncState
				});
			})();
	});

	onMount(async () => await initWorker());
	onDestroy(() => worker?.stop());
</script>

{@render children()}
