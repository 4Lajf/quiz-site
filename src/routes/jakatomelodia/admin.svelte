<script>
	import { user } from '../../stores/authStore';
	import Login from '../../components/Login.svelte';
	import Table from '../../components/jakatomelodia/Table.svelte';
	import EventLog from '../../components/jakatomelodia/eventLog/EventLog.svelte';
</script>

<main>
	{#if $user?.email === 'szymonkoziarz12@gmail.com'}
		<div class="bg-gray-800 w-screen h-screen">
			<div class="flex items-start justify-center">
				<div class="relative top-5"><Table /></div>
				<div class="relative top-5"><EventLog /></div>
			</div>
		</div>
	{:else}
		<Login />
	{/if}
</main>
