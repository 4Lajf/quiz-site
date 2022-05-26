<script>
	import { supabase } from '../../supabase';
	import { user } from '../../stores/authStore';
	import { goto } from '$app/navigation';

	let loading = false;
	let email,
		state = 0;

	const handleRestorePassword = async () => {
		try {
			loading = true;
			state = 1;
			const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
				redirectTo: 'http://localhost:3000/forgotpassword/reset'
			});
			if (error) {
				console.error(error);
			}
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};
</script>

<main>
	{#if state === 0}
		<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault={handleRestorePassword}
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
				<h4 class="p-2 font-bold text-gray-500">Type your e-mail in the box below to begin</h4>
				<input
					type="email"
					name="email"
					bind:value={email}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
					autocomplete="off"
					placeholder="Email"
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
	{:else}
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
				<p class="mb-5 text-3xl text-gray-600 uppercase">reset password</p>
				<h4 class="text-center p-2 font-bold text-red-500">Do not close this window</h4>
				<br />
				<h4 class="text-center p-2 font-bold text-gray-500">
					Check your inbox at <br />
					{email}<br />
					to restore your password
				</h4>
				<input
					type="email"
					name="email"
					bind:value={email}
					class="p-3 mb-5 border-2 rounded outline-none bg-gray-300 w-80 focus:border-blue-500"
					autocomplete="off"
					placeholder="Email"
					disabled="true"
					required
				/>
				<button
					class="p-2 font-bold text-white bg-gray-600 rounded w-80"
					id="login"
					type="submit"
					disabled="true"
					><span>Restore Password</span>
				</button>
			</form>
		</div>
	{/if}
</main>
