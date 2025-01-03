<script lang="ts">
	import { Principal } from '@dfinity/principal';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import type { Satellite } from '$declarations/mission_control/mission_control.did';
	import CanisterAdvancedOptions from '$lib/components/canister/CanisterAdvancedOptions.svelte';
	import CreditsGuard from '$lib/components/guards/CreditsGuard.svelte';
	import Confetti from '$lib/components/ui/Confetti.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import SpinnerModal from '$lib/components/ui/SpinnerModal.svelte';
	import Value from '$lib/components/ui/Value.svelte';
	import { authSignedOut } from '$lib/derived/auth.derived';
	import { missionControlStore } from '$lib/derived/mission-control.derived';
	import {
		createSatellite,
		createSatelliteWithConfig,
		loadSatellites
	} from '$lib/services/satellites.services';
	import { wizardBusy } from '$lib/stores/busy.store';
	import { i18n } from '$lib/stores/i18n.store';
	import { toasts } from '$lib/stores/toasts.store';
	import type { PrincipalText } from '$lib/types/itentity';
	import type { JunoModalDetail } from '$lib/types/modal';
	import { navigateToSatellite } from '$lib/utils/nav.utils';

	interface Props {
		detail: JunoModalDetail;
		onclose: () => void;
	}

	let { detail, onclose }: Props = $props();

	let insufficientFunds = $state(true);

	let steps: 'init' | 'in_progress' | 'ready' | 'error' = $state('init');
	let satellite: Satellite | undefined = undefined;

	const onSubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		if (isNullish(satelliteName)) {
			toasts.error({
				text: $i18n.errors.satellite_name_missing
			});
			return;
		}

		wizardBusy.start();
		steps = 'in_progress';

		try {
			const fn = nonNullish(subnetId) ? createSatelliteWithConfig : createSatellite;

			satellite = await fn({
				missionControl: $missionControlStore,
				config: {
					name: satelliteName,
					...(nonNullish(subnetId) && { subnetId: Principal.fromText(subnetId) })
				}
			});

			// Reload list of satellites before navigation
			await loadSatellites({ missionControl: $missionControlStore, reload: true });

			steps = 'ready';
		} catch (err) {
			toasts.error({
				text: $i18n.errors.satellite_unexpected_error,
				detail: err
			});

			steps = 'error';
		}

		wizardBusy.stop();
	};

	const navigate = async () => {
		await navigateToSatellite(satellite?.satellite_id);
		onclose();
	};

	let satelliteName: string | undefined = $state(undefined);
	let subnetId: PrincipalText | undefined = $state();
</script>

<Modal on:junoClose={onclose}>
	{#if steps === 'ready'}
		<Confetti />

		<div class="msg">
			<p>{$i18n.satellites.ready}</p>
			<button onclick={navigate}>{$i18n.core.continue}</button>
		</div>
	{:else if steps === 'in_progress'}
		<SpinnerModal>
			<p>{$i18n.satellites.initializing}</p>
		</SpinnerModal>
	{:else}
		<h2>{$i18n.satellites.start}</h2>

		<p>
			{$i18n.satellites.description}
		</p>

		<CreditsGuard
			{onclose}
			bind:insufficientFunds
			{detail}
			priceLabel={$i18n.satellites.create_satellite_price}
		>
			<form onsubmit={onSubmit}>
				<Value>
					{#snippet label()}
						{$i18n.satellites.satellite_name}
					{/snippet}
					<input
						bind:value={satelliteName}
						type="text"
						name="satellite_name"
						placeholder={$i18n.satellites.enter_name}
						required
						autocomplete="off"
					/>
				</Value>

				<CanisterAdvancedOptions bind:subnetId />

				<button
					type="submit"
					disabled={$authSignedOut || isNullish($missionControlStore) || insufficientFunds}
					>{$i18n.satellites.create}</button
				>
			</form>
		</CreditsGuard>
	{/if}
</Modal>

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

	form {
		display: flex;
		flex-direction: column;

		padding: var(--padding-2x) 0 0;
	}

	button {
		margin-top: var(--padding-2x);
	}
</style>
