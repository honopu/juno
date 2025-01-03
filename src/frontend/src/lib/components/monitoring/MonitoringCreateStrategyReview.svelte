<script lang="ts">
	import type { Principal } from '@dfinity/principal';
	import { nonNullish } from '@dfinity/utils';
	import type {
		CyclesMonitoringStrategy,
		Orbiter,
		Satellite
	} from '$declarations/mission_control/mission_control.did';
	import MonitoringSelectedModules from '$lib/components/monitoring/MonitoringSelectedModules.svelte';
	import MonitoringStepReview from '$lib/components/monitoring/MonitoringStepReview.svelte';
	import Value from '$lib/components/ui/Value.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import { formatTCycles } from '$lib/utils/cycles.utils';

	interface Props {
		selectedSatellites: [Principal, Satellite][];
		selectedOrbiters: [Principal, Orbiter][];
		minCycles: bigint | undefined;
		fundCycles: bigint | undefined;
		missionControlMinCycles: bigint | undefined;
		missionControlFundCycles: bigint | undefined;
		missionControl: { monitored: boolean; strategy: CyclesMonitoringStrategy | undefined };
		onback: () => void;
		onsubmit: ($event: MouseEvent | TouchEvent) => Promise<void>;
	}

	let {
		selectedSatellites,
		selectedOrbiters,
		minCycles,
		fundCycles,
		missionControlMinCycles,
		missionControlFundCycles,
		missionControl,
		onback,
		onsubmit
	}: Props = $props();
</script>

<MonitoringStepReview {onback} {onsubmit}>
	<h2>{$i18n.monitoring.review_strategy}</h2>

	<p>{$i18n.monitoring.review_info}</p>

	{#if !missionControl.monitored || (nonNullish(missionControlFundCycles) && nonNullish(missionControlMinCycles))}
		<div class="card-container with-title">
			<span class="title">{$i18n.mission_control.title}</span>

			<div class="content">
				<Value>
					{#snippet label()}
						{$i18n.monitoring.remaining_threshold}
					{/snippet}

					<p>{formatTCycles(missionControlMinCycles ?? minCycles ?? 0n)}</p>
				</Value>

				<Value>
					{#snippet label()}
						{$i18n.monitoring.top_up_amount}
					{/snippet}

					<p class="no-margin">{formatTCycles(missionControlFundCycles ?? fundCycles ?? 0n)}</p>
				</Value>
			</div>
		</div>
	{/if}

	<div class="card-container with-title">
		<span class="title">{$i18n.monitoring.modules}</span>

		<div class="content">
			<MonitoringSelectedModules {selectedSatellites} {selectedOrbiters} />

			<Value>
				{#snippet label()}
					{$i18n.monitoring.remaining_threshold}
				{/snippet}

				<p>{formatTCycles(minCycles ?? 0n)}</p>
			</Value>

			<Value>
				{#snippet label()}
					{$i18n.monitoring.top_up_amount}
				{/snippet}

				<p>{formatTCycles(fundCycles ?? 0n)}</p>
			</Value>
		</div>
	</div>
</MonitoringStepReview>

<style lang="scss">
	.no-margin {
		margin: 0;
	}
</style>
