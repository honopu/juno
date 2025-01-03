<script lang="ts">
	import type { Principal } from '@dfinity/principal';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import MonitoringSettingsMissionControl from '$lib/components/monitoring/MonitoringSettingsMissionControl.svelte';
	import MonitoringSettingsOrbiter from '$lib/components/monitoring/MonitoringSettingsOrbiter.svelte';
	import MonitoringSettingsSatellites from '$lib/components/monitoring/MonitoringSettingsSatellites.svelte';
	import {
		missionControlMonitored,
		missionControlSettingsLoaded
	} from '$lib/derived/mission-control.derived';
	import { orbiterLoaded } from '$lib/derived/orbiter.derived';
	import { satellitesLoaded } from '$lib/derived/satellite.derived';
	import { openMonitoringModal } from '$lib/services/monitoring.services';
	import { loadOrbiters } from '$lib/services/orbiters.services';
	import { i18n } from '$lib/stores/i18n.store';

	interface Props {
		missionControlId: Principal;
	}

	let { missionControlId }: Props = $props();

	const openModal = (type: 'create_monitoring_strategy' | 'stop_monitoring_strategy') => {
		openMonitoringModal({
			type,
			missionControlId
		});
	};

	const openCreateModal = () => openModal('create_monitoring_strategy');
	const openStopModal = () => openModal('stop_monitoring_strategy');

	onMount(async () => await loadOrbiters({ missionControl: missionControlId }));

	let orbiterMonitored = $state(false);
	let hasSatellitesMonitored = $state(false);

	let monitored = $derived($missionControlMonitored || orbiterMonitored || hasSatellitesMonitored);
</script>

<div class="card-container with-title">
	<span class="title">{$i18n.core.settings}</span>

	<div class="columns-3 fit-column-1">
		<div>
			<MonitoringSettingsMissionControl />

			<MonitoringSettingsSatellites bind:hasSatellitesMonitored />

			<MonitoringSettingsOrbiter bind:orbiterMonitored />
		</div>
	</div>
</div>

{#if $missionControlSettingsLoaded && $satellitesLoaded && $orbiterLoaded}
	<div class="toolbar">
		<button in:fade onclick={openCreateModal}>
			{#if monitored}
				{$i18n.monitoring.update_monitoring}
			{:else}
				{$i18n.monitoring.start_monitoring}
			{/if}
		</button>

		{#if monitored}
			<button in:fade onclick={openStopModal}>
				{$i18n.monitoring.stop_monitoring}
			</button>
		{/if}
	</div>
{/if}
