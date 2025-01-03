<script lang="ts">
	import type { TransactionWithId } from '@dfinity/ledger-icp';
	import type { Principal } from '@dfinity/principal';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { compare } from 'semver';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getCredits } from '$lib/api/console.api';
	import { getAccountIdentifier, getTransactions } from '$lib/api/icp-index.api';
	import ReceiveTokens from '$lib/components/tokens/ReceiveTokens.svelte';
	import Transactions from '$lib/components/transactions/Transactions.svelte';
	import TransactionsExport from '$lib/components/transactions/TransactionsExport.svelte';
	import Identifier from '$lib/components/ui/Identifier.svelte';
	import SkeletonText from '$lib/components/ui/SkeletonText.svelte';
	import Value from '$lib/components/ui/Value.svelte';
	import WalletLoader from '$lib/components/wallet/WalletLoader.svelte';
	import { PAGINATION } from '$lib/constants/constants';
	import { MISSION_CONTROL_v0_0_12 } from '$lib/constants/version.constants';
	import { authSignedIn, authSignedOut } from '$lib/derived/auth.derived';
	import { missionControlVersion } from '$lib/derived/version.derived';
	import { authStore } from '$lib/stores/auth.store';
	import { i18n } from '$lib/stores/i18n.store';
	import { toasts } from '$lib/stores/toasts.store';
	import { emit } from '$lib/utils/events.utils';
	import { formatE8sCredits, formatE8sICP } from '$lib/utils/icp.utils';
	import { last } from '$lib/utils/utils';

	interface Props {
		missionControlId: Principal;
	}

	let { missionControlId }: Props = $props();

	const accountIdentifier = getAccountIdentifier(missionControlId);
	let credits: bigint | undefined = $state();

	/**
	 * Credits
	 */

	const loadCredits = async () => {
		try {
			credits = await getCredits($authStore.identity);
		} catch (err: unknown) {
			toasts.error({
				text: $i18n.errors.load_credits,
				detail: err
			});
		}
	};

	/**
	 * Wallet
	 */
	let balance: bigint | undefined = $state(undefined);
	let transactions: TransactionWithId[] = $state([]);

	/**
	 * Scroll
	 */

	let disableInfiniteScroll = $state(false);

	const onIntersect = async () => {
		if ($authSignedOut) {
			toasts.error({
				text: $i18n.errors.no_identity
			});
			return;
		}

		const lastId = last(transactions)?.id;

		if (isNullish(lastId)) {
			// No transactions, we do nothing here and wait for the worker to post the first transactions
			return;
		}

		try {
			const { transactions: nextTransactions } = await getTransactions({
				owner: missionControlId,
				identity: $authStore.identity,
				maxResults: PAGINATION,
				start: lastId
			});

			if (nextTransactions.length === 0) {
				disableInfiniteScroll = true;
				return;
			}

			transactions = [...transactions, ...nextTransactions];
		} catch (err: unknown) {
			toasts.error({
				text: $i18n.errors.transactions_next,
				detail: err
			});

			disableInfiniteScroll = true;
		}
	};

	/**
	 * Lifecycle
	 */

	onMount(async () => await loadCredits());

	/**
	 * Actions
	 */

	let receiveVisible = $state(false);

	const openReceive = () => (receiveVisible = true);

	const openSend = () => {
		if (isNullish(balance)) {
			toasts.show({ text: $i18n.wallet.balance_not_loaded, level: 'info' });
			return;
		}

		if (balance <= 0n) {
			toasts.show({ text: $i18n.wallet.balance_zero, level: 'info' });
			return;
		}

		if (compare($missionControlVersion?.current ?? '0.0.0', MISSION_CONTROL_v0_0_12) <= 0) {
			toasts.warn($i18n.wallet.wallet_upgrade);
			return;
		}

		emit({
			message: 'junoModal',
			detail: {
				type: 'send_tokens',
				detail: {
					balance
				}
			}
		});
	};
</script>

{#if $authSignedIn}
	<WalletLoader {missionControlId} bind:balance bind:transactions>
		<div class="card-container with-title">
			<span class="title">{$i18n.wallet.overview}</span>

			<div class="columns-3 fit-column-1">
				<div>
					<Value>
						{#snippet label()}
							{$i18n.wallet.wallet_id}
						{/snippet}
						<Identifier shorten={false} small={false} identifier={missionControlId.toText()} />
					</Value>

					<Value>
						{#snippet label()}
							{$i18n.wallet.account_identifier}
						{/snippet}
						<Identifier identifier={accountIdentifier?.toHex() ?? ''} small={false} />
					</Value>
				</div>

				<div>
					<Value>
						{#snippet label()}
							{$i18n.wallet.balance}
						{/snippet}
						<p>
							{#if nonNullish(balance)}<span in:fade
									>{formatE8sICP(balance)} <small>ICP</small></span
								>{:else}<span class="skeleton"><SkeletonText /></span>{/if}
						</p>
					</Value>

					<div class="credits">
						<Value>
							{#snippet label()}
								{$i18n.wallet.credits}
							{/snippet}
							<p>
								{#if nonNullish(credits)}<span in:fade>{formatE8sCredits(credits)}</span>{/if}
							</p>
						</Value>
					</div>
				</div>
			</div>
		</div>

		<div class="toolbar">
			<button onclick={openReceive}>{$i18n.wallet.receive}</button>

			<button onclick={openSend}>{$i18n.wallet.send}</button>
		</div>

		<Transactions
			{transactions}
			{disableInfiniteScroll}
			{missionControlId}
			on:junoIntersect={onIntersect}
		/>

		<TransactionsExport {transactions} {missionControlId} />
	</WalletLoader>
{/if}

<ReceiveTokens bind:visible={receiveVisible} {missionControlId} />

<style lang="scss">
	p {
		min-height: 24px;
	}

	.skeleton {
		display: block;
		padding: var(--padding-0_5x) 0 0;
		max-width: 150px;
	}

	.credits {
		padding: var(--padding) 0 0;
	}
</style>
