<script>
	import { supabase } from '../../supabase';
	import { user } from '../../stores/authStore';
	import { onMount } from 'svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { success, loading, failure } from '../../stores/buttonStore';

	let oldAvatar, renderAvatar, userAvatarUrl, profileUrl, url, validUsername, bio, username;

	onMount(async () => {
		url = window.location.href;
		url = url.match(/[^\/]*$/g);
		url = url[0];
		profileUrl = url.match(/[^=]*$/g);
		profileUrl = profileUrl[0];

		let { data: userData, error: queryErr } = await supabase
			.from('public_data')
			.select('username')
			.eq('username', profileUrl);
		if (userData.length === 0) {
			validUsername = 0;
		} else {
			validUsername = 1;
		}

		let { data: public_data, error } = await supabase
			.from('public_data')
			.select('username, bio, avatarUrl')
			.eq('username', profileUrl);
		username = public_data[0]?.username;
		bio = public_data[0]?.bio ? public_data[0].bio : `I'm a very mysterious person`;
		oldAvatar = public_data[0]?.avatarUrl ? public_data[0].avatarUrl : null;
		if (oldAvatar) {
			renderAvatar = oldAvatar;
		} else {
			renderAvatar = 'avatars/defaultAvatar.png';
		}
		userAvatarUrl = `https://rqloeyyjlygxvyauhomj.supabase.co/storage/v1/object/public/userdata/${renderAvatar}`;
	});
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.js"></script>
</svelte:head>

<main>
	{#if validUsername === 1}
		<SvelteToast options={{ reversed: true, pausable: true, duration: 2500, intro: { y: 192 } }} />
		<div class="flex items-center justify-center w-full h-full bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<!-- svelte-ignbazaore a11y-img-redundant-alt -->
				<img src={userAvatarUrl} alt="" class="w-20 h-20 mb-2 rounded-full" />
				<p class="mb-5 text-3xl text-center text-gray-600 uppercase">
					{profileUrl}'s profile
				</p>

				<textarea
					name="bio"
					id="bio"
					value={bio}
					disabled="true"
					class="h-32 p-3 mb-5 border-2 rounded outline-none resize-none bg-zinc-100 w-96 focus:border-blue-500 disabled:bg-neutral-300"
				/>
			</form>
		</div>
	{:else}
		<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<h4 class="p-2 font-bold text-gray-500">This user dosen't exist</h4>
			</form>
		</div>
	{/if}
</main>

<style>
	:root {
		--toastContainerBottom: 1rem;
		--toastContainerTop: auto;
		--toastContainerRight: 1.6rem;
	}

	@media (orientation: landscape) {
		:root {
			--toastContainerBottom: 1rem;
			--toastContainerTop: auto;
			--toastContainerRight: 1.6rem;
		}
	}
</style>
