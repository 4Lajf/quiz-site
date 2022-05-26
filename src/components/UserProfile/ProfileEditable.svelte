<script>
	//TODO: move every element to separate form

	import { supabase } from '../../supabase';
	import { user } from '../../stores/authStore';
	import { updateBio, updateEmail, updatePassword } from '../../stores/userStore';
	import { onMount } from 'svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { success, loading, failure } from '../../stores/buttonStore';

	let email,
		passwordMail,
		oldPassword,
		newPassword,
		repNewPassword,
		avatarUrl,
		avatarUID,
		oldAvatar,
		renderAvatar,
		thinking = false,
		userAvatarUrl,
		testSomething = false,
		avatarFile,
		avatar,
		fileinput,
		bio,
		returnIsPasswordSame,
		invalidPassword;
	onMount(async () => {
		let { data: public_data, error } = await supabase
			.from('public_data')
			.select('bio, avatarUrl')
			.eq('id', $user.id);
		avatarUrl = public_data[0].avatarUrl;
		bio = public_data[0].bio ? public_data[0].bio : `I'm a very mysterious person`;

		avatarUID = Date.now();
		oldAvatar = avatarUrl ? avatarUrl : null;
		if (oldAvatar) {
			renderAvatar = oldAvatar;
		} else {
			renderAvatar = 'avatars/defaultAvatar.png';
		}
		userAvatarUrl = `https://rqloeyyjlygxvyauhomj.supabase.co/storage/v1/object/public/userdata/${renderAvatar}`;
	});

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const test = async () => {
		let { data, error: queryErr } = await supabase
			.from('username')
			.select('username')
			.eq('username', '4Lajf');
		console.log(data);
	};

	const test2 = async () => {
		const { data, error: errorUpdateUsername } = await supabase
			.from('username')
			.update({ username: $user.user_metadata.username })
			.eq('id', $user.id);
		console.log(data);
	};

	const checkSamePassword = () => {
		returnIsPasswordSame = 1;
		if (newPassword === repNewPassword) {
			invalidPassword = '';
			return 1;
		} else {
			invalidPassword = 'pink-500';
			return 0;
		}
	};

	const execBio = async (bio) => {
		try {
			thinking = true;
			await updateBio(bio);
		} finally {
			thinking = false;
		}
	};

	const execEmail = async (email, password) => {
		try {
			thinking = true;
			await updateEmail(email, password);
		} finally {
			thinking = false;
		}
	};

	const execPassword = async (oldPassword, newPassword) => {
		const isPasswordSame = checkSamePassword();
		if (isPasswordSame === 0) {
			returnIsPasswordSame = 0;
			return;
		}

		try {
			thinking = true;
			await updatePassword(oldPassword, newPassword);
		} finally {
			thinking = false;
		}
	};

	const onFileSelected = (e) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);

		if (image.size > 2000000) {
			failure('Image is larger than 2MB', 5000);
			return;
		}

		reader.onload = (e) => {
			avatar = e.target.result;
		};
		avatarFile = e.target.files[0];
	};

	const updateAvatar = async (avatarFile) => {
		const { data: fileData, error: fileError } = await supabase.storage
			.from('userdata')
			.upload(`avatars/avatar-${avatarUID}.png`, avatarFile, {});
		avatarUrl = `avatars/avatar-${avatarUID}.png`;
		const { data, error: emailError } = await supabase
			.from('public_data')
			.update({ avatarUrl: avatarUrl })
			.eq('id', $user.id);

		if (oldAvatar) {
			const { data: deleteData, error: deleteError } = await supabase.storage
				.from('userdata')
				.remove([oldAvatar]);

			if (fileError || deleteError) throw 'An internal error has occured. Please try again later';
		}
		if (fileError) throw 'An internal error has occured. Please try again later';
	};

	const execAvatar = async (avatarFile) => {
		try {
			thinking = true;
			loading('Updating your avatar...');
			await sleep(500);
			await updateAvatar(avatarFile);
			toast.pop();
			await sleep(500);
			success('Succesful avatar update', 5000);
		} catch (error) {
			await sleep(500);
			toast.pop();
			await sleep(500);
			failure(error);
		} finally {
			thinking = false;
		}
	};
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.js"></script>
</svelte:head>

<main>
	<SvelteToast options={{ reversed: true, pausable: true, duration: 2500, intro: { y: 192 } }} />
	<div class="flex items-center justify-center w-full h-full bg-gray-800">
		<form
			class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
			on:submit|preventDefault
		>
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img src={userAvatarUrl} alt="" class="w-20 h-20 mb-2 rounded-full" />
			<p class="mb-5 text-3xl text-center text-gray-600 uppercase">Your Profile</p>
			<p class="mb-5 text-sm text-center text-gray-600 uppercase">{$user.email}</p>

			<!-- Update Bio -->
			<textarea
				name="bio"
				id="bio"
				disabled={thinking}
				bind:value={bio}
				class="h-32 p-3 mb-5 border-2 rounded outline-none resize-none bg-zinc-100 w-96 focus:border-blue-500 disabled:bg-neutral-300"
			/>
			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="udpateBio"
				type="button"
				disabled={thinking}
				on:click={() => execBio(bio)}><span>Update Bio</span></button
			>

			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="1st"
				type="button"
				disabled={thinking}
				on:click={() => test()}><span>Test 1st</span></button
			>

			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="2rd"
				type="button"
				disabled={thinking}
				on:click={() => test2()}><span>Test 2rd</span></button
			>

			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="test2"
				type="button"
				on:click={() => success('Goodbye world!', 5000)}><span>test2</span></button
			>

			<!-- Update Email -->
			<input
				type="email"
				name="email"
				bind:value={email}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-neutral-300"
				autocomplete="off"
				placeholder="New email"
				disabled={thinking}
				required
			/>
			<input
				type="password"
				name="password"
				bind:value={passwordMail}
				class="p-3 mb-5 border-2 rounded outline-none w-80 focus:border-blue-500 bg-zinc-100 disabled:bg-neutral-300"
				autocomplete="off"
				placeholder="Current Password"
				disabled={thinking}
				required
			/>
			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="updateEmail"
				type="button"
				disabled={thinking}
				on:click={async () => execEmail(email, passwordMail)}><span>Update E-mail</span></button
			>
			<!-- Update password -->
			{#if returnIsPasswordSame === 0}
				<label for="repeatPassword" class="text-sm leading-4 mb-1 w-full m-0 text-red-500 font-bold"
					>Your password must be same in both fields</label
				>
			{/if}
			<input
				type="password"
				name="password"
				bind:value={oldPassword}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-neutral-300 border-{invalidPassword} text-{invalidPassword}"
				autocomplete="off"
				placeholder="Old Password"
				disabled={thinking}
				required
			/>
			<input
				type="password"
				name="password"
				bind:value={newPassword}
				class="p-3 mb-5 border-2 rounded outline-none w-80 focus:border-blue-500 bg-zinc-100 disabled:bg-neutral-300 border-{invalidPassword} text-{invalidPassword}"
				autocomplete="off"
				placeholder="New Password"
				disabled={thinking}
				required
			/>
			<input
				type="password"
				name="password"
				bind:value={repNewPassword}
				class="p-3 mb-5 border-2 rounded outline-none w-80 focus:border-blue-500 bg-zinc-100 disabled:bg-neutral-300 border-{invalidPassword} text-{invalidPassword}"
				autocomplete="off"
				placeholder="Repeat Password"
				disabled={thinking}
				required
			/>
			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="updatePassword"
				type="button"
				disabled={thinking}
				on:click={() => execPassword(oldPassword, newPassword)}><span>Update Password</span></button
			>
			<!-- Upload Avatar -->
			<h1>Upload Image</h1>
			{#if avatar}
				<img class="flex w-60 h-60" src={avatar} alt="d" />
			{:else}
				<img
					class="flex w-60 h-60"
					src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
					alt=""
				/>
			{/if}
			<img
				class="flex w-12 h-12 cursor-pointer"
				src="https://static.thenounproject.com/png/625182-200.png"
				alt=""
				on:click={() => {
					fileinput.click();
				}}
			/>
			<div
				class="chan"
				on:click={() => {
					fileinput.click();
				}}
			>
				Choose Image
			</div>
			<input
				style="display:none"
				type="file"
				accept=".jpg, .jpeg, .png"
				disabled={thinking}
				on:change={(e) => onFileSelected(e)}
				bind:this={fileinput}
			/>
			<button
				class="p-2 font-bold text-white bg-blue-400 rounded hover:bg-blue-500 w-80 disabled:bg-gray-500"
				id="updateAvatar"
				type="button"
				disabled={thinking}
				on:click={() => execAvatar(avatarFile)}><span>Update Avatar</span></button
			>
		</form>
	</div>
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
