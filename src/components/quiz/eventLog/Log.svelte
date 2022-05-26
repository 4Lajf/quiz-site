<script>
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { twoButtons, success, failure, loading } from '../../../stores/buttonStore';
	import { onMount } from 'svelte';
	let bgColors = [],
		eventData,
		colorIndex = -1;
	import Loading from '../../Loading.svelte';
	import { renderEvents } from '../../../stores/eventLogStore';
	import { supabase } from '../../../supabase';

	onMount(async () => {
		const mySubscription = supabase
			.from('quiz')
			.on('INSERT', async (payload) => {
				twoButtons('Nowa odpowiedź!', 'Czy chciałbyś odświeżyć?', 'reload', 'Tak', 'Nie');
			})
			.subscribe();
	});

	const runOnce = async () => {
		eventData = await renderEvents('quizEvents');

		for (let i = 0; i < eventData.length; i++) {
			let eventObject = Object.values(eventData)[i];
			let eventID = Object.keys(eventObject)[0];
			switch (eventID) {
				case 'AnswerReceived':
					bgColors.push('white');
					break;
				case 'PlusPoints':
					bgColors.push('green-500');
					break;
				case 'MinusPoints':
					bgColors.push('red-500');
					break;
				case 'AnswerDeleted':
					bgColors.push('pink-500');
					break;
				case 'NewRound':
					bgColors.push('blue-400');
					break;
				case 'AnswersEnabled':
					bgColors.push('green-500');
					break;
				case 'AnswersDisabled':
					bgColors.push('yellow-500');
					break;
				default:
					bgColors.push('white');
					break;
			}
		}
		return eventData;
	};

	const execColor = () => {
		colorIndex++;
		return bgColors[colorIndex];
	};
</script>

<SvelteToast options={{ reversed: true, pausable: true, duration: 2500, intro: { y: 192 } }} />
<main>
	<div class="container flex justify-start mx-auto">
		<div class="flex flex-col">
			{#await runOnce()}
				<Loading />
			{:then eventData}
				<table>
					<tbody class="bg-white">
						{#each Object.values(eventData) as row}
							<tr class="whitespace-nowrap border-2 border-gray-700">
								{#each Object.values(row) as cell}
									{#await execColor() then color}
										<td class="px-3 py-2 bg-{color} w-[30vw]">
											<div class="text-sm text-gray-900">{cell}</div>
										</td>
									{/await}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
	</div>
</main>

<style>
</style>
