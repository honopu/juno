<script lang="ts">
	import type { Principal } from '@dfinity/principal';
	import { depositCycles } from '$lib/api/satellites.api';
	import CanisterTransferCyclesModal from '$lib/components/modals/CanisterTransferCyclesModal.svelte';
	import { authStore } from '$lib/stores/auth.store';
	import type { JunoModalCyclesSatelliteDetail, JunoModalDetail } from '$lib/types/modal';

	interface Props {
		detail: JunoModalDetail;
	}

	let { detail }: Props = $props();

	let { satellite, cycles: currentCycles } = $derived(detail as JunoModalCyclesSatelliteDetail);

	let transferFn: (params: { cycles: bigint; destinationId: Principal }) => Promise<void> =
		$derived(
			async (params: { cycles: bigint; destinationId: Principal }) =>
				await depositCycles({
					...params,
					satelliteId: satellite.satellite_id,
					identity: $authStore.identity
				})
		);
</script>

<CanisterTransferCyclesModal
	{transferFn}
	{currentCycles}
	canisterId={satellite.satellite_id}
	on:junoClose
	segment="satellite"
/>
