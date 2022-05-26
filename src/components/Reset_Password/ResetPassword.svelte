<script>
	import { supabase } from '../../supabase';
	import { user } from '../../stores/authStore';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	let loading = false;
	let password, repeatPassword, resetPasswordStatus, errorDesc, access_token;

	const checkSamePassword = () => {
		if (password === repeatPassword) {
			return 1;
		} else {
			return 0;
		}
	};

	const resetPassword = async () => {
		const isPasswordSame = checkSamePassword();
		console.log(isPasswordSame);
		if (isPasswordSame === 0) {
			resetPasswordStatus = 0;
			return 0;
		}

		try {
			const session = supabase.auth.session();
			access_token = session.access_token;
			loading = true;
			const { error, data } = await supabase.auth.api.updateUser(access_token, {
				password: password
			});
			console.error(error);

			if (error) {
				resetPasswordStatus = 2;
				errorDesc = error.error_description || error.message;
				return 2;
			} else {
				resetPasswordStatus = 1;
			}
			return 1;
		} catch (error) {
			resetPasswordStatus = 2;
			errorDesc = error.error_description || error.message;
			return 2;
		} finally {
			loading = false;
		}
	};
</script>

<main>
	{#if resetPasswordStatus === 0}
		<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault={resetPassword}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-20 h-20 mb-2 text-gray-600"
					viewbox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
						clip-rule="evenodd"
					/>
				</svg>
				<p class="mb-5 text-3xl text-gray-600 uppercase">restore password</p>
				<h4 class="p-2 font-bold text-red-500">Your password must match</h4>
				<input
					type="password"
					name="password"
					bind:value={password}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
					autocomplete="off"
					placeholder="New Password"
					required
				/>
				<input
					type="password"
					name="repeatPassword"
					bind:value={repeatPassword}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
					autocomplete="off"
					placeholder="Confirm Password"
					required
				/>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
					id="login"
					type="submit"
					disabled={loading}
					><span>Restore Password</span>
				</button>
			</form>
		</div>
	{:else if resetPasswordStatus === 1}
		<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-20 h-20 mb-2 text-gray-600"
					viewbox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
						clip-rule="evenodd"
					/>
				</svg>
				<p class="mb-5 text-3xl text-gray-600 uppercase">restore password</p>
				<h4 class="p-2 font-bold text-green-500 text-center">
					You've succesfuly recovered your password<br />Click the button below to login
				</h4>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
					id="login"
					type="submit"
					on:click={() => goto('/')}
					><span>Login</span>
				</button>
			</form>
		</div>
	{:else if resetPasswordStatus === 2}
		<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-20 h-20 mb-2 text-gray-600"
					viewbox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
						clip-rule="evenodd"
					/>
				</svg>
				<p class="mb-5 text-3xl text-gray-600 uppercase">restore password</p>
				<h4 class="p-2 font-bold text-red-500 text-center">
					An error has occured, please try again later<br />
					{errorDesc}
				</h4>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
					id="login"
					type="submit"
					on:click={() => goto('/')}
					><span>Back to Homepage</span>
				</button>
			</form>
		</div>
	{/if}
	<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
		<form
			class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
			on:submit|preventDefault={resetPassword}
		>
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img src="img/defaultAvatar.png" alt="Default Avatar" class="w-20 h-20 mb-2" />
			<p class="mb-5 text-3xl text-gray-600 uppercase">restore password</p>
			<h4 class="p-2 font-bold text-gray-500">Type your new password in the box below</h4>
			<input
				type="password"
				name="password"
				bind:value={password}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
				autocomplete="off"
				placeholder="New Password"
				required
			/>
			<input
				type="password"
				name="repeatPassword"
				bind:value={repeatPassword}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
				autocomplete="off"
				placeholder="Confirm Password"
				required
			/>
			<button
				class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
				id="login"
				type="submit"
				disabled={loading}
				><span>Restore Password</span>
			</button>
		</form>
	</div>
</main>
