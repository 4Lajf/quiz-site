<script>
	import { supabase } from '../supabase.js';
	import { user } from '../stores/authStore.js';
	import { goto } from '$app/navigation';
	import DiscordIcon from './Icons/DiscordIcon.svelte';
	import GoogleIcon from './Icons/GoogleIcon.svelte';
	import FacebookIcon from './Icons/FacebookIcon.svelte';

	let loading = false;
	let loginCred, password, invalidCredentials, invalidCredentialsBorder, email, username;

	const handleLogin = async () => {
		if (loginCred.length === 0 || password.length === 0) {
			return;
		}

		try {
			loading = true;
			invalidCredentials = 0;
			invalidCredentialsBorder = '';
			let isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginCred);
			if (isEmail === true) {
				email = loginCred;
			} else {
				username = loginCred;
				let { data: user_data, error } = await supabase
					.from('public_data')
					.select('email')
					.eq('username', username);
				if (!user_data[0]) {
					invalidCredentials = 1;
					invalidCredentialsBorder = 'pink-500';
					return;
				}
				email = user_data[0].email;
			}
			const {
				user: userDetails,
				session,
				error
			} = await supabase.auth.signIn({
				email: email,
				password: password,
				options: {
					redirectTo: 'http://localhost:3000/quiz'
				}
			});
			$user = userDetails;
			if (error) throw error;
			goto('/');
		} catch (error) {
			if (error.message === 'Invalid login credentials') {
				invalidCredentials = 1;
				invalidCredentialsBorder = 'pink-500';
			} else {
				alert(error);
				invalidCredentialsBorder = 'pink-500';
			}
		} finally {
			loading = false;
		}
	};
</script>

<main>
	<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
		<form
			class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
			on:submit|preventDefault={handleLogin}
		>
			<!-- svelte-ignore a11y-img-redundant-alt -->
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
			<p class="mb-5 text-3xl text-gray-600 uppercase">Login</p>
			{#if invalidCredentials === 1}
				<label for="email" class="text-sm leading-4 mb-1 w-full m-0 text-red-500 font-bold"
					>Invalid email or password</label
				>
			{/if}
			<input
				type="text"
				name="login"
				bind:value={loginCred}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 border-{invalidCredentialsBorder} text-{invalidCredentialsBorder}"
				autocomplete="off"
				placeholder="Username or Email"
				required
			/>
			<input
				type="password"
				name="password"
				bind:value={password}
				class="p-3 mb-5 border-2 rounded outline-none w-80 focus:border-blue-500 bg-zinc-100 border-{invalidCredentialsBorder} text-{invalidCredentialsBorder}"
				autocomplete="off"
				placeholder="Password"
				required
			/>
			<button
				class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
				id="login"
				type="submit"
				disabled={loading}
				><span>Login</span>
			</button>
			<h4 class="p-2 font-bold text-gray-500">Or login using...</h4>
			<div class="flex justify-evenly">
				<DiscordIcon />
				<GoogleIcon />
				<FacebookIcon />
			</div>
			<!-- Horizontal Line -->
			<br />
			<svg
				version="1.1"
				id="line_2"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				width="250px"
				height="5px"
				xml:space="preserve"
			>
				<path class="path2" fill="#000000" stroke-width="3" stroke="#000000" d="M0 0 l1120 0" />
			</svg>
			<br />
			<button
				class="p-2 font-bold text-white bg-gray-400 rounded hover:bg-gray-500 w-80"
				id="gotoRegister"
				type="button"
				on:click={() => goto('/register')}><span>Create an Account</span></button
			>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="/forgotpassword" class="svg">
				<h4 class="p-2 font-bold text-gray-500">Forgot password?</h4>
			</a>
		</form>
	</div>
</main>
