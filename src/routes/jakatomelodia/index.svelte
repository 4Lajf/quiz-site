<script>
	import { supabase } from '../../supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { handleNotes, chooseATeam, renderNotes } from '../../stores/JTMStore';
	import { failure } from '../../stores/buttonStore';

	let thinking = false,
		status = 0,
		showNotes,
		test;

	let team = null,
		notes = null,
		mode = 0;

	$: showNotes = '';

	const execRenderNotes = async () => {
		showNotes = await renderNotes();
	};

	const execChooseATeam = async (team) => {
		if (!team) {
			failure('Podaj nazwę drużyny', 5000);
			thinking = false;
			return;
		}

		try {
			const mySubscription = supabase
				.from('JTM')
				.on('UPDATE', (payload) => {
					execRenderNotes();
				})
				.subscribe();

			thinking = true;
			await chooseATeam(team);
			showNotes = await renderNotes();
			status = 1;
		} finally {
			thinking = false;
		}
	};

	const execHandleNotes = async (team, mode, notes) => {
		try {
			thinking = true;
			await handleNotes(team, mode, notes);
			showNotes = await renderNotes();
			console.log(showNotes)
			notes = '';
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
				<p class="mb-5 text-3xl text-gray-600 uppercase">Nazwa Drużyny</p>
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
				<p class="mb-5 text-3xl text-gray-600 uppercase">Po ilu nutkach?</p>
				{#if showNotes[0]}
					<span class="p-2 text-2xl text-gray-500">
						{showNotes[0].notes !== 9999 ? '1: ' + showNotes[0].team : ''}
					</span>
					<span class="p-2 text-2xl font-bold text-gray-500">
						{showNotes[0].notes !== 9999 ? showNotes[0].notes + ' nutek' : ''}
					</span>
				{/if}
				{#if showNotes[1]}
					<br />
					<span class="p-2 text-xl text-gray-500">
						{showNotes[1].notes !== 9999 ? '2: ' + showNotes[1].team + ' ->' : ''}
						{showNotes[1].notes !== 9999 ? showNotes[1].notes + ' nutek' : ''}
					</span>
				{/if}
				{#if showNotes[2]}
					<span class="p-2 text-lg text-gray-500">
						{showNotes[2].notes !== 9999 ? '3: ' + showNotes[2].team + ' ->' : ''}
						{showNotes[2].notes !== 9999 ? showNotes[2].notes + ' nutek' : ''}
					</span>
				{/if}
				<input
					type="text"
					name="notes"
					bind:value={notes}
					class="p-3 mb-5 border-2 rounded outline-none bg-zinc-100 w-80 focus:border-blue-500"
					disabled={thinking}
					placeholder="Notes"
					autocomplete="off"
				/>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80"
					id="JTMSubmit"
					type="submit"
					disabled={thinking}
					on:click={() => execHandleNotes(team, 0, notes)}
					><span>Wyślij!</span>
				</button>
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
