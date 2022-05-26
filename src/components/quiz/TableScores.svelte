<script>
	import Loading from '../../components/Loading.svelte';
	import { quizScores, loadQuizScores } from '../../stores/quizStore';
	import Grid from 'gridjs-svelte';
	let data,
		filterData,
		grid,
		scores,
		teams = [];

	const onGridReady = () => {
		filterData = data;

		filterData = filterData.filter((n) => n);
		if (filterData.length === 0) {
			return;
		}
	};

	const columns = [
		{
			id: 'team',
			name: 'Drużyna',
			width: '90%'
		},
		{
			id: 'points',
			name: 'Punkty',
			width: '10%'
		}
	];

	quizScores.subscribe((value) => {
		scores = value;
	});

	const fetchData = async () => {
		await loadQuizScores();
		if (scores.length === 0) {
			data = ['', '', '', ''];
			return data;
		}
		data = [];
		for (let i = 0; i < scores.length; i++) {
			data[i] = [scores[i].team, scores[i].points];
		}
		return data;
	};

	const runOnce = async () => {
		await fetchData();
		setTimeout(() => {
			onGridReady();
		}, '1000');
	};
</script>

<main>
	{#await runOnce()}
		<Loading />
	{:then}
		<Grid {data} {columns} sort={true} pagination={false} width="100vw" bind:this={grid} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

	<style global>
		@import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
	</style>
</main>

<style>
</style>
