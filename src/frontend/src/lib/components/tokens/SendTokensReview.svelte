<script lang="ts">
	import { AccountIdentifier } from '@dfinity/ledger-icp';
	import type { Principal } from '@dfinity/principal';
	import { nonNullish, type TokenAmountV2 } from '@dfinity/utils';
	import { getAccountIdentifier } from '$lib/api/icp-index.api';
	import IconArrowCircleDown from '$lib/components/icons/IconArrowCircleDown.svelte';
	import Identifier from '$lib/components/ui/Identifier.svelte';
	import Value from '$lib/components/ui/Value.svelte';
	import { IC_TRANSACTION_FEE_ICP } from '$lib/constants/constants';
	import { sendTokens } from '$lib/services/tokens.services';
	import { authStore } from '$lib/stores/auth.store';
	import { wizardBusy } from '$lib/stores/busy.store';
	import { i18n } from '$lib/stores/i18n.store';
	import { formatE8sICP } from '$lib/utils/icp.utils';
	import { amountToICPToken } from '$lib/utils/token.utils';

	interface Props {
		missionControlId: Principal;
		balance: bigint | undefined;
		destination?: string;
		amount: string | undefined;
		onnext: (steps: 'form' | 'in_progress' | 'ready' | 'error') => void;
	}

	let {
		missionControlId,
		balance,
		destination = $bindable(''),
		amount = $bindable(),
		onnext
	}: Props = $props();

	let accountIdentifier: AccountIdentifier | undefined = $derived(
		getAccountIdentifier(missionControlId)
	);

	let token: TokenAmountV2 | undefined = $derived(amountToICPToken(amount));

	const onSubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		wizardBusy.start();

		onnext('in_progress');

		try {
			await sendTokens({
				missionControlId,
				identity: $authStore.identity,
				destination,
				token
			});

			onnext('ready');
		} catch (err: unknown) {
			onnext('error');
		}

		wizardBusy.stop();
	};
</script>

<h2>{$i18n.wallet.send}</h2>

<p>{$i18n.wallet.review_and_confirm}</p>

<form onsubmit={onSubmit}>
	<div class="columns">
		<div class="card-container with-title from">
			<span class="title">{$i18n.wallet.tx_from}</span>

			<div class="content">
				<Value>
					{#snippet label()}
						{$i18n.wallet.wallet_id}
					{/snippet}
					<p class="identifier">
						<Identifier shorten={false} identifier={missionControlId.toText()} />
					</p>
				</Value>

				<Value>
					{#snippet label()}
						{$i18n.wallet.account_identifier}
					{/snippet}
					<p class="identifier">
						<Identifier identifier={accountIdentifier?.toHex() ?? ''} />
					</p>
				</Value>

				<Value>
					{#snippet label()}
						{$i18n.wallet.balance}
					{/snippet}
					<p>
						{#if nonNullish(balance)}<span>{formatE8sICP(balance)} <small>ICP</small></span>{/if}
					</p>
				</Value>
			</div>
		</div>

		<div class="arrow">
			<div class="arrow-icon">
				<IconArrowCircleDown />
			</div>
		</div>

		<div class="card-container with-title">
			<span class="title">{$i18n.wallet.tx_to}</span>

			<div class="content">
				<Value>
					{#snippet label()}
						{$i18n.wallet.destination}
					{/snippet}
					<p class="identifier">
						<Identifier identifier={destination} />
					</p>
				</Value>
			</div>
		</div>

		<div class="card-container with-title sending">
			<span class="title">{$i18n.wallet.sending}</span>

			<div class="content">
				<Value>
					{#snippet label()}
						{$i18n.wallet.tx_amount}
					{/snippet}
					<p>
						{#if nonNullish(token)}<span>{formatE8sICP(token.toE8s())} <small>ICP</small></span
							>{/if}
					</p>
				</Value>

				<Value>
					{#snippet label()}
						{$i18n.wallet.fee}
					{/snippet}
					<p>
						<span>{formatE8sICP(IC_TRANSACTION_FEE_ICP)} <small>ICP</small></span>
					</p>
				</Value>
			</div>
		</div>
	</div>

	<div class="toolbar">
		<button type="button" onclick={() => onnext('form')}>{$i18n.core.back}</button>
		<button type="submit">{$i18n.core.confirm}</button>
	</div>
</form>

<style lang="scss">
	@use '../../styles/mixins/media';

	.columns {
		@include media.min-width(large) {
			display: grid;
			--column-size: calc(
				(100% - var(--padding-2x) - var(--padding-2x) - var(--column-arrow-size)) / 2
			);
			--column-arrow-size: var(--padding-8x);
			grid-template-columns: var(--column-size) var(--column-arrow-size) var(--column-size);
			grid-column-gap: var(--padding-2x);
		}
	}

	.from {
		grid-row-start: 1;
		grid-row-end: 3;
	}

	.sending {
		grid-column-start: 3;
		grid-column-end: 4;
	}

	.identifier {
		margin: 0 0 var(--padding);
	}

	.arrow {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 0 var(--padding-3x);

		@include media.min-width(large) {
			grid-row: 1/3;
			grid-column: 2/3;

			.arrow-icon {
				transform: rotate(-90deg);
			}
		}
	}
</style>
