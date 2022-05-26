<script>
	import Register from '../components/Register.svelte';
	import { user } from '../stores/authStore';
	import { goto } from '$app/navigation';
</script>

<main>
	{#if $user}
		{goto('/')}
	{:else}
		<Register />
	{/if}
</main>
