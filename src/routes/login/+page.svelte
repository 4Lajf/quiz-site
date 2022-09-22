<script>
	import Login from '../../components/Login.svelte';
	import { user } from '../../stores/authStore';
	import { goto } from '$app/navigation';
</script>

<main>
	{#if $user}
		{goto('/')}
	{:else}
		<Login />
	{/if}
</main>
