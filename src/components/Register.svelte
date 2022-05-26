<script>
	import { supabase } from '../supabase.js';
	import { user } from '../stores/authStore.js';
	import { goto } from '$app/navigation';
	import DiscordIcon from './Icons/DiscordIcon.svelte';
	import GoogleIcon from './Icons/GoogleIcon.svelte';
	import FacebookIcon from './Icons/FacebookIcon.svelte';
	let loading = false;
	let email,
		password,
		repeatPassword,
		returnIsPasswordSame,
		returnDoesUsernameExists,
		username,
		invalidUsername,
		invalidPassword,
		registrationStatus;

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const checkSamePassword = () => {
		returnDoesUsernameExists = 0;
		returnIsPasswordSame = 1;
		if (password === repeatPassword) {
			invalidPassword = '';
			return 1;
		} else {
			invalidPassword = 'pink-500';
			return 0;
		}
	};

	const checkUsernameExists = async () => {
		let { data: userData, error: queryErr } = await supabase
			.from('public_data')
			.select('username')
			.eq('username', username);
		if (userData.length === 0) {
			invalidUsername = '';
			return 0;
		} else {
			invalidUsername = 'pink-500';
			return 1;
		}
	};

	const handleRegister = async () => {
		if (
			password.length === 0 ||
			repeatPassword.length === 0 ||
			username.length === 0 ||
			email.length === 0
		) {
			return;
		}

		const isPasswordSame = checkSamePassword();
		const doesUsernameExists = await checkUsernameExists();
		if (isPasswordSame === 0) {
			returnIsPasswordSame = 0;
			return;
		} 
		if (doesUsernameExists === 1) {
			returnDoesUsernameExists = 1;
			return;
		}

		try {
			loading = true;
			const {
				user: userDetails,
				session,
				error: errorRegister
			} = await supabase.auth.signUp({
				email: email,
				password: password
			});
			if (errorRegister) throw 'user_already_registered';
			$user = userDetails;
			const { data, error: usernameError } = await supabase
				.from('public_data')
				.insert([{ id: $user.id, username: username, email: $user.email }]);
			registrationStatus = 1;
			window.location.reload();
		} catch (error) {
			switch (error) {
				case 'user_already_registered':
					alert('user already registered');
					break;
				default:
					alert(error);
					break;
			}
		} finally {
			loading = false;
		}
	};
</script>

<main>
	{#if registrationStatus === 1}
		<div class="relative flex justify-center items-center">
			<button
				class="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 focus:outline-none absolute z-0 top-48 py-2 px-7 bg-gray-800 text-white rounded text-base hover:bg-black"
				>Open</button
			>

			<div id="menu" class="w-full h-full bg-gray-900 bg-opacity-80 top-0 fixed sticky-0">
				<div class="2xl:mx-auto py-48 px-4 md:px-28 flex justify-center items-center">
					<div
						class="w-96 md:w-auto dark:bg-gray-800 relative flex flex-col justify-center items-center bg-white py-16 px-4 md:px-24 xl:py-24 xl:px-36"
					>
						<div role="banner" class="flex justify-center content-center w-32 h-32">
							<img src="/static/register.png" alt="" />
						</div>
						<div class="mt-12">
							<h1
								role="main"
								class="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-center text-gray-800"
							>
								You've been registered!
							</h1>
						</div>
						<div class="mt">
							<p class="mt-6 sm:w-80 text-base dark:text-white leading-7 text-center text-gray-800">
								Enjoy your stay :)
							</p>
						</div>
						<button
							class="w-full dark:text-gray-800 dark:hover:bg-gray-100 dark:bg-gray-200 sm:w-auto mt-14 text-base leading-4 text-center text-white py-6 px-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 bg-gray-800 hover:bg-black"
							on:click={() => goto('/')}>To the Homepage</button
						>
						<button
							class="text-gray-800 dark:text-gray-400 absolute top-8 right-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
							on:click={() => goto('/')}
							aria-label="close"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M18 6L6 18"
									stroke="currentColor"
									stroke-width="1.66667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M6 6L18 18"
									stroke="currentColor"
									stroke-width="1.66667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-center w-screen h-screen bg-gray-800">
		<form
			class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
			on:submit|preventDefault={handleRegister}
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
			<p class="mb-5 text-3xl text-gray-600 uppercase">Register</p>
			{#if returnDoesUsernameExists === 1}
				<label for="username" class="text-sm leading-4 mb-1 w-full m-0 text-red-500 font-bold"
					>Username is taken</label
				>
			{/if}
			<input
				type="text"
				name="username"
				bind:value={username}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500 border-{invalidUsername} text-{invalidUsername}"
				autocomplete="off"
				placeholder="Username"
				disabled={loading}
				required
			/>
			<input
				type="email"
				name="email"
				bind:value={email}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500"
				autocomplete="off"
				placeholder="Email"
				disabled={loading}
				required
			/>

			{#if returnIsPasswordSame === 0}
				<label for="repeatPassword" class="text-sm leading-4 mb-1 w-full m-0 text-red-500 font-bold"
					>Your password must be same in both fields</label
				>
			{/if}

			<input
				type="password"
				name="password"
				bind:value={password}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500"
				autocomplete="off"
				placeholder="Password"
				disabled={loading}
				required
			/>
			<input
				type="password"
				name="repeatPassword"
				bind:value={repeatPassword}
				class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500 border-{invalidPassword} text-{invalidPassword}"
				autocomplete="off"
				placeholder="Repeat Password"
				disabled={loading}
				required
			/>
			<button
				class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
				id="register"
				type="submit"
				disabled={loading}
				><span>Create an Account</span>
			</button>
			<h4 class="p-2 font-bold text-gray-500">Or register using...</h4>
			<div class="flex justify-evenly">
				<DiscordIcon />
				<GoogleIcon />
				<FacebookIcon />
			</div>
			<br />
			<svg
				version="1.1"
				id="line_2"
				xmlns="http://www.w3.org/2000/svg"
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
				class="p-2 font-bold text-white bg-gray-400 rounded hover:bg-gray-500 w-80 disabled:bg-gray-500"
				id="gotoLogin"
				type="button"
				disabled={loading}
				on:click={() => goto('/login')}><span>Login to an existing account</span></button
			>
		</form>
	</div>
</main>
