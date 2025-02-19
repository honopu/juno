<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import type { BuildType } from '@junobuild/admin';
	import { run } from 'svelte/legacy';
	import { fade } from 'svelte/transition';
	import Value from '$lib/components/ui/Value.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import { versionStore } from '$lib/stores/version.store';
	import type { SatelliteIdText } from '$lib/types/satellite';

	interface Props {
		satelliteId: SatelliteIdText;
	}

	let { satelliteId }: Props = $props();

	let currentBuild: string | undefined = $derived(
		$versionStore?.satellites[satelliteId]?.currentBuild
	);

	let extended = $state(true);
	run(() => {
		extended =
			nonNullish(currentBuild) && currentBuild !== $versionStore?.satellites[satelliteId]?.current;
	});

	let build: BuildType | undefined = $derived($versionStore?.satellites[satelliteId]?.build);
</script>

{#if !extended}
	<div>
		<Value>
			{#snippet label()}
				{$i18n.core.version}
			{/snippet}
			<p>v{$versionStore?.satellites[satelliteId]?.current ?? '...'}</p>
		</Value>
	</div>
{:else}
	<div>
		<Value>
			{#snippet label()}
				{$i18n.satellites.stock_version}
			{/snippet}
			<p>v{$versionStore?.satellites[satelliteId]?.current ?? '...'}</p>
		</Value>
	</div>

	<div>
		<Value>
			{#snippet label()}
				{$i18n.satellites.extended_version}
			{/snippet}
			<p>v{$versionStore?.satellites[satelliteId]?.currentBuild ?? '...'}</p>
		</Value>
	</div>
{/if}

<div>
	<Value>
		{#snippet label()}
			{$i18n.satellites.build}
		{/snippet}
		<p class="build">
			{#if nonNullish(build)}
				<span in:fade>{build}</span>
			{/if}
		</p>
	</Value>
</div>

<style lang="scss">
	.build {
		text-transform: capitalize;
	}

	div:not(:first-of-type) {
		padding: var(--padding) 0 0;
	}
</style>
