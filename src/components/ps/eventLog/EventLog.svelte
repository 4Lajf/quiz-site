<script>
	import Log from './Log.svelte';
	import { onMount } from 'svelte';
	import { sleep } from '../../../stores/generalStore';
	let box,
		yHeight = 0;

	const parseScroll = () => {
		yHeight = box.clientHeight;
	};

	onMount(async () => {
		parseScroll();
		await sleep(300);
		box.scrollTo(0, yHeight);
	});
</script>

<main>
	<div class="w-[20vw] h-[50vh] overflow-scroll" bind:this={box} on:scroll={parseScroll}>
		<Log />
	</div>
</main>
