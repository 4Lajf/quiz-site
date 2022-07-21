<script>
	export let quizScore;
	import { deleteAnswer } from '../stores/psStore';
	import { supabase } from '../supabase.js';
	let customPoints,
		pointsColor = 'gray-800';
	let points = quizScore.points;

	let plusPoints = async (id, fetchPoints) => {
		if (fetchPoints > 0) {
			pointsColor = 'green-500';
		} else {
			pointsColor = 'red-400';
		}
		const { data: pointData, error } = await supabase.from('ps').select('*').eq('id', id);
		fetchPoints += pointData[0].points;
		points = fetchPoints;
		const { data: dbdata, error: dberror } = await supabase
			.from('ps')
			.update([{ points: fetchPoints }])
			.eq('id', id);
		return fetchPoints;
	};
</script>

<li
	class="flex items-center w-full h-full px-4 py-2 my-2 bg-gray-200 border border-gray-200 rounded-lg shadow-sm"
>
	<span class="flex-1 text-{pointsColor} pr-10">
		{quizScore.id}. Team: {quizScore.team}<br />
		Points: {points}
	</span>

	<span class="flex-1 text-{pointsColor} px-10">
		Answer: {quizScore.answer}<br />
		Misc: {quizScore.misc}
	</span>
	<div class="flex justify-center">
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, 1)}
		>
			+1
		</button>
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, 2)}
		>
			+2
		</button>
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, 3)}
		>
			+3
		</button>
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, -1)}
		>
			-1
		</button>
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, -2)}
		>
			-2
		</button>
		<button
			type="button"
			class="px-2 py-1 text-xl text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
			on:click={() => plusPoints(quizScore.id, -3)}
		>
			-3
		</button>
	</div>
	<form on:submit|preventDefault={plusPoints(quizScore.id, parseInt(customPoints))}>
		<input
			type="text"
			name="custom_number"
			class="rounded outline-none w-14 focus:border-blue-500 bg-zinc-100"
			placeholder="custom"
			bind:value={customPoints}
		/>
		<button
			type="submit"
			class="px-2 py-1 text-sm text-white bg-gray-400 rounded hover:bg-gray-500 focus:outline-none focus:shadow-outline"
		>
			Go
		</button>
	</form>
	<button
		type="button"
		class="px-2 py-1 text-sm text-white bg-red-700 rounded hover:bg-rose-800 focus:outline-none focus:shadow-outline"
		on:click={() => deleteAnswer(quizScore.id)}
	>
		Delete
	</button>
</li>
