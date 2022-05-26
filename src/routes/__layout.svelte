<script>
	import '../app.css';
	let isPageLoaded = false;
	import { onMount } from 'svelte';
	import Loading from '../components/Loading.svelte';
	let visible = true;
	onMount(() => {
		isPageLoaded = true;
	});
</script>

<!-- {#if isPageLoaded === false}
	<Loading />
{/if} -->
<slot />
