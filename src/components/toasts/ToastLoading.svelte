<script>
	export let title, id;
	let timer = 1;
	import { onMount } from 'svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { sleep } from '../../stores/generalStore';
	import { fly } from 'svelte/transition';
	const onClose = () => {
		toast.pop(id);
	};
</script>

<main>
	<div
		transition:fly
		id="toast-success"
		class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-400 bg-gray-700 rounded-lg shadow"
		role="alert"
	>
		<div
			class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-300 bg-gray-700 rounded-lg"
		>
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
					clip-rule="evenodd"
				/></svg
			>
		</div>
		<div class="ml-3 text-sm font-normal">{title}</div>
	</div>
</main>

<style>
</style>
