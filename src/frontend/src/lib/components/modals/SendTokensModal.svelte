<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import SendTokensForm from '$lib/components/tokens/SendTokensForm.svelte';
	import SendTokensReview from '$lib/components/tokens/SendTokensReview.svelte';
	import Confetti from '$lib/components/ui/Confetti.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import SpinnerModal from '$lib/components/ui/SpinnerModal.svelte';
	import { missionControlStore } from '$lib/derived/mission-control.derived';
	import { i18n } from '$lib/stores/i18n.store';
	import type { JunoModalDetail, JunoModalSendTokensDetail } from '$lib/types/modal';

	interface Props {
		detail: JunoModalDetail;
	}

	let { detail }: Props = $props();

	let balance: bigint | undefined = $state();

	$effect(() => {
		balance = (detail as JunoModalSendTokensDetail).balance;
	});

	let destination = $state('');

	let steps: 'form' | 'review' | 'in_progress' | 'ready' | 'error' = $state('form');

	let amount: string | undefined = $state();

	const dispatch = createEventDispatcher();
	const close = () => dispatch('junoClose');
</script>

<svelte:window onjunoSyncBalance={({ detail: syncBalance }) => (balance = syncBalance)} />

{#if nonNullish($missionControlStore)}
	<Modal on:junoClose>
		{#if steps === 'ready'}
			<Confetti />

			<div class="msg" in:fade>
				<p>{$i18n.wallet.icp_on_its_way}</p>
				<button onclick={close}>{$i18n.core.close}</button>
			</div>
		{:else if steps === 'in_progress'}
			<SpinnerModal>
				<p>{$i18n.wallet.sending_in_progress}</p>
			</SpinnerModal>
		{:else if steps === 'review'}
			<div in:fade>
				<SendTokensReview
					missionControlId={$missionControlStore}
					{balance}
					bind:amount
					bind:destination
					onnext={(nextSteps) => (steps = nextSteps)}
				/>
			</div>
		{:else}
			<SendTokensForm {balance} bind:amount bind:destination onreview={() => (steps = 'review')} />
		{/if}
	</Modal>
{/if}

<style lang="scss">
	@use '../../styles/mixins/overlay';

	h2 {
		@include overlay.title;
	}

	.msg {
		@include overlay.message;

		p {
			margin: var(--padding-8x) 0 0;
		}
	}

	button {
		margin-top: var(--padding-2x);
	}
</style>
