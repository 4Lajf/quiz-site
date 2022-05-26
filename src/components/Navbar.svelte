<script>
	import { supabase } from '../supabase.js';
	import { user } from '../stores/authStore.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	const logout = () => {
		goto('/login');
		supabase.auth.signOut();
		$user = false;
	};
	let username;
	onMount(async () => {
		let { data: public_data, error } = await supabase
			.from('public_data')
			.select('username')
			.eq('id', $user.id);
		username = public_data[0].username;
	});
</script>

<main>
	<div
		class="flex items-center justify-between px-6 py-4 bg-gradient-to-tr from-gray-700 to-gray-800"
	>
		<div class="flex items-center space-x-2">
			<h1 class="text-2xl font-bold text-white cursor-pointer">4Lajf.com</h1>
		</div>
		<div class="flex items-center space-x-6">
			<span
				class="text-lg font-semibold text-white cursor-pointer"
				on:click={() => goto(`/profile?user=${username}`)}
				>{username ? username + ' (Profile)' : ''}
			</span>
			<span class="text-lg font-semibold text-white cursor-pointer" on:click={() => logout()}
				>Logout</span
			>
		</div>
	</div>
</main>
