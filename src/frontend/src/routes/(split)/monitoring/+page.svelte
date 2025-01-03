<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { onMount, setContext, untrack } from 'svelte';
	import { writable } from 'svelte/store';
	import IdentityGuard from '$lib/components/guards/IdentityGuard.svelte';
	import MissionControlGuard from '$lib/components/guards/MissionControlGuard.svelte';
	import OrbitersLoader from '$lib/components/loaders/OrbitersLoader.svelte';
	import SatellitesLoader from '$lib/components/loaders/SatellitesLoader.svelte';
	import MissionControlSettingsLoader from '$lib/components/mission-control/MissionControlSettingsLoader.svelte';
	import MonitoringDashboard from '$lib/components/monitoring/MonitoringDashboard.svelte';
	import MonitoringSettings from '$lib/components/monitoring/MonitoringSettings.svelte';
	import ObservatorySettings from '$lib/components/observatory/ObservatorySettings.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import {
		missionControlMonitored,
		missionControlStore
	} from '$lib/derived/mission-control.derived';
	import {
		type Tab,
		TABS_CONTEXT_KEY,
		type TabsContext,
		type TabsStore
	} from '$lib/types/tabs.context';
	import { initTabId } from '$lib/utils/tabs.utils';

	const tabDashboard = {
		id: Symbol('1'),
		labelKey: 'analytics.dashboard'
	};

	let tabs: Tab[] = $derived([
		tabDashboard,
		...($missionControlMonitored
			? [
					{
						id: Symbol('2'),
						labelKey: 'core.setup'
					}
				]
			: [])
	]);

	const store = writable<TabsStore>({
		tabId: untrack(() => initTabId(tabs)),
		tabs: untrack(() => tabs)
	});

	setContext<TabsContext>(TABS_CONTEXT_KEY, {
		store
	});

	onMount(() => {
		store.set({
			tabId: initTabId(tabs),
			tabs
		});
	});
</script>

<IdentityGuard>
	<Tabs help="https://juno.build/docs/miscellaneous/monitoring">
		<SatellitesLoader>
			<OrbitersLoader>
				<MissionControlGuard>
					{#if nonNullish($missionControlStore)}
						<MissionControlSettingsLoader missionControlId={$missionControlStore}>
							{#if $store.tabId === $store.tabs[0].id}
								<MonitoringDashboard missionControlId={$missionControlStore} />
							{:else if $store.tabId === $store.tabs[1].id && $missionControlMonitored}
								<MonitoringSettings missionControlId={$missionControlStore} />

								<ObservatorySettings missionControlId={$missionControlStore} />
							{/if}
						</MissionControlSettingsLoader>
					{/if}
				</MissionControlGuard>
			</OrbitersLoader>
		</SatellitesLoader>
	</Tabs>
</IdentityGuard>
