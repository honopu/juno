<script lang="ts">
	import { fromNullable } from '@dfinity/utils';
	import type { Satellite } from '$declarations/mission_control/mission_control.did';
	import CanisterMonitoring from '$lib/components/canister/CanisterMonitoring.svelte';
	import CanisterOverview from '$lib/components/canister/CanisterOverview.svelte';
	import CanisterSubnet from '$lib/components/canister/CanisterSubnet.svelte';
	import Monitoring from '$lib/components/monitoring/Monitoring.svelte';
	import SatelliteActions from '$lib/components/satellites/SatelliteActions.svelte';
	import SatelliteName from '$lib/components/satellites/SatelliteName.svelte';
	import SatelliteOverviewCustomDomain from '$lib/components/satellites/SatelliteOverviewCustomDomain.svelte';
	import SatelliteOverviewVersion from '$lib/components/satellites/SatelliteOverviewVersion.svelte';
	import Identifier from '$lib/components/ui/Identifier.svelte';
	import Value from '$lib/components/ui/Value.svelte';
	import { satellitesNotLoaded } from '$lib/derived/satellite.derived';
	import { i18n } from '$lib/stores/i18n.store';
	import type { SatelliteIdText } from '$lib/types/satellite';

	interface Props {
		satellite: Satellite;
	}

	let { satellite }: Props = $props();

	let satelliteId: SatelliteIdText = $derived(satellite.satellite_id.toText());

	let monitoring = $derived(fromNullable(fromNullable(satellite.settings ?? [])?.monitoring ?? []));
</script>

<div class="card-container with-title">
	<span class="title">{$i18n.satellites.overview}</span>

	<div class="columns-3 fit-column-1">
		<div>
			<SatelliteName {satellite} />

			<Value>
				{#snippet label()}
					{$i18n.satellites.id}
				{/snippet}
				<Identifier identifier={satelliteId} shorten={false} small={false} />
			</Value>

			<CanisterSubnet canisterId={satellite.satellite_id} />

			<SatelliteOverviewCustomDomain {satellite} />
		</div>

		<div>
			<SatelliteOverviewVersion {satelliteId} />

			<div>
				<Monitoring {monitoring} loading={$satellitesNotLoaded} />
			</div>
		</div>
	</div>

	<SatelliteActions {satellite} />
</div>

<div class="card-container with-title">
	<span class="title">{$i18n.canisters.insight}</span>

	<div class="columns-3">
		<CanisterOverview
			canisterId={satellite.satellite_id}
			segment="satellite"
			heapWarningLabel={$i18n.canisters.warning_satellite_heap_memory}
		/>

		<CanisterMonitoring segment="satellite" canisterId={satellite.satellite_id} />
	</div>
</div>

<style lang="scss">
	.card-container:last-of-type {
		margin: var(--padding-4x) 0 0;
	}
</style>
