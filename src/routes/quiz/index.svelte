<script>
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { failure } from '../../stores/buttonStore';
	import { answerQuestion, chooseATeam } from '../../stores/quizStore';
	let thinking = false;
	let team = null,
		answer = null,
		status = 0,
		misc = null;

	const execChooseATeam = async (team) => {
		if (!team) {
			failure('Wprowadź nazwę drużyny', 5000);
			thinking = false;
			return;
		}

		try {
			thinking = true;
			await chooseATeam(team);
			status = 1;
		} finally {
			thinking = false;
		}
	};

	const execAnswerQuestion = async (team, answer, misc) => {
		try {
			thinking = true;
			await answerQuestion(team, answer, misc);
			answer = '';
			misc = '';
		} finally {
			thinking = false;
		}
	};
</script>

<main>
	<SvelteToast options={{ reversed: true, pausable: true, duration: 2500, intro: { y: 192 } }} />
	{#if status === 0}
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
				<p class="mb-5 text-3xl text-gray-600 uppercase">Choose A Team</p>
				<input
					type="text"
					name="team"
					bind:value={team}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
					autocomplete="off"
					placeholder="Drużyna"
				/>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="team"
					type="submit"
					disabled={thinking}
					on:click={() => execChooseATeam(team)}
					><span>Dalej</span>
				</button>
				<br />
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
				<p class="mb-5 text-3xl text-gray-600 uppercase">{team}</p>
				<input
					type="text"
					name="team"
					bind:value={answer}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500"
					autocomplete="off"
					placeholder="Odpowiedź"
					disabled={thinking}
				/>
				<input
					type="text"
					name="misc"
					bind:value={misc}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500 disabled:bg-gray-500"
					autocomplete="off"
					placeholder="Inne Dane"
					disabled={thinking}
				/>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="login"
					type="submit"
					disabled={thinking}
					on:click={() => execAnswerQuestion(team, answer, misc)}
					><span>Wyślij!</span>
				</button>
				<br />
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
