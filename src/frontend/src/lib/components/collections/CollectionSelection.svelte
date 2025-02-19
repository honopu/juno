<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { getContext } from 'svelte';
	import type { Rule } from '$declarations/satellite/satellite.did';
	import IconNew from '$lib/components/icons/IconNew.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import { RULES_CONTEXT_KEY, type RulesContext } from '$lib/types/rules.context';

	interface Props {
		start?: boolean;
		onstart?: () => void;
		onedit: (rule: [string, Rule]) => void;
	}

	let { start = false, onedit, onstart }: Props = $props();

	const { store }: RulesContext = getContext<RulesContext>(RULES_CONTEXT_KEY);

	const edit = (rule: [string, Rule]) => onedit(rule);

	let empty = $derived($store.rules?.length === 0);

	const startCollection = () => onstart?.();
</script>

<p class="title collections">Collections</p>

{#if start || !empty}
	<div class="collections">
		{#if start}
			<button class="text action start" onclick={startCollection}
				><IconNew size="12px" /> <span>{$i18n.collections.start_collection}</span></button
			>
		{/if}

		{#if nonNullish($store.rules)}
			{#each $store.rules as col}
				<button class="text action" class:offset={start} onclick={() => edit(col)}
					><span>{col[0]}</span></button
				>
			{/each}
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../../styles/mixins/media';
	@use '../../styles/mixins/collections';

	.collections {
		grid-column-start: 1;
		border-right: 1px solid var(--color-card-contrast);

		display: none;

		@include media.min-width(large) {
			display: block;

			height: 100%;
			overflow-y: auto;
		}
	}

	.title {
		@include collections.title;
	}

	.action {
		@include collections.action;

		&.offset {
			margin: var(--padding) 0 var(--padding) var(--padding-7x);
			box-sizing: border-box;
		}

		&:first-of-type {
			margin-top: var(--padding-2x);
		}

		&:last-of-type {
			margin-bottom: var(--padding-2x);
		}
	}

	.start {
		@include collections.start;
	}
</style>
