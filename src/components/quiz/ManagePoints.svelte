<script>
	export let points, teams;
	let _points = points;
	/* 	import Table, { selectTeams } from './Table.svelte'; */
	let customPoints;
	let buttonColor = 'bg-gray-600';
	let hoverColor = 'bg-gray-800';
	if (points > 0) {
		buttonColor = 'green-600';
		hoverColor = 'green-700';
	} else {
		buttonColor = 'red-500';
		hoverColor = 'red-600';
	}

	import { supabase } from '../../supabase';
	let pointsColor = 'gray-800';

	let plusPoints = async (team, fetchPoints) => {
		var today = new Date();
		var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

		const { data: pointData, error } = await supabase.from('quiz').select('*').eq('team', team);
		points = fetchPoints;
		fetchPoints += pointData[0].points;
		const { data: dbdata, error: dberror } = await supabase
			.from('quiz')
			.update([{ points: fetchPoints }])
			.eq('team', team);
		if (points > 0) {
			const { data, error } = await supabase
				.from('quizEvents')
				.insert([
					{ name: 'PlusPoints', event: `[${time}] ➕ "${team}" otrzymał ${points} puknt/ów` }
				]);
		} else {
			const { data, error } = await supabase
				.from('quizEvents')
				.insert([
					{ name: 'MinusPoints', event: `[${time}] ➖ "${team}" otrzymał ${points} punkt/ów` }
				]);
		}
		return fetchPoints;
	};
	import { refresh } from '../../stores/generalStore';
</script>

<main>
	{#if parseInt(_points) === 0}
		<form
			on:submit|preventDefault={() => {
				for (let i = 0; i < teams.length; i++) {
					plusPoints(teams[i], parseInt(customPoints));
				}
				refresh();
			}}
		>
			<input
				type="text"
				name="custom_number"
				class="rounded outline-none w-14 focus:border-blue-500 bg-zinc-100"
				placeholder="custom"
				autocomplete="off"
				bind:value={customPoints}
			/>
			<button
				type="submit"
				class=" font-medium focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 text-center text-base rounded-md px-3 py-1.5 mr-1 mb-1 w-8 h-8"
			>
				Go
			</button>
		</form>
	{:else}
		<button
			type="button"
			class="focus:outline-none font-medium text-white bg-{buttonColor} hover:bg-{hoverColor} focus:ring-4 text-center text-base text- rounded-md px-3 py-1.5 mr-1 mb-1 w-8 h-8"
			on:click={() => {
				for (let i = 0; i < teams.length; i++) {
					plusPoints(teams[i], parseInt(_points));
				}
				refresh();
			}}
		>
			{_points.toString()}
		</button>
	{/if}
</main>

<style>
</style>
