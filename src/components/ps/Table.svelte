<script>
	import ManagePoints from './ManagePoints.svelte';
	import NewRound from './NewRound.svelte';
	import DeleteAnswer from './DeleteAnswer.svelte';
	import DisableAnswers from './DisableAnswers.svelte';
	import EnableAnswers from './EnableAnswers.svelte';
	import Loading from '../../components/Loading.svelte';
	import { quizScores, loadQuizScores } from '../../stores/psStore';
	import { RowSelection } from 'gridjs/plugins/selection';
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
		// find the plugin with the give plugin ID
		const checkboxPlugin = grid.instance.config.plugin.get('awesomeCheckboxes');

		// subscribe to the store events
		checkboxPlugin.props.store.on('updated', function (state, prevState) {
			selectTeams();
		});
	};

	const columns = [
		{
			id: 'awesomeCheckboxes',
			name: '',
			width: '1%',
			plugin: {
				component: RowSelection,
				props: {
					// use the "team" column as the row identifier
					id: (row) => row.cell(1).data
				}
			}
		},
		{
			id: 'team',
			name: 'Drużyna',
			width: '18%'
		},
		{
			id: 'answer',
			name: 'Odpowiedź',
			width: '40%'
		},
		{
			id: 'misc',
			name: 'Inne',
			width: '40%'
		},
		{
			id: 'points',
			name: 'P',
			width: '10%'
		},
		{
			id: 'isTurn',
			name: 'X',
			width: '10%'
		},
		{
			id: 'seconds',
			name: 'S',
			width: '10%'
		},
		{
			id: 'isTakeover',
			name: 'T',
			width: '10%'
		},
		{
			id: 'takeoverDate',
			name: '',
			width: '10%'
		}
	];

	quizScores.subscribe((value) => {
		scores = value;
	});

	const fetchData = async () => {
		await loadQuizScores();
		if (scores.length === 0) {
			data = ['', '', '', '', '', ''];
			return data;
		}
		data = [];
		for (let i = 0; i < scores.length; i++) {
			data[i] = [
				scores[i].team,
				scores[i].answer ? scores[i].answer : ``,
				scores[i].misc ? scores[i].misc : ``,
				scores[i].points,
				scores[i].isTurn ? scores[i].isTurn : ``,
				scores[i].seconds ? scores[i].seconds : ``,
				scores[i].isTakeover ? scores[i].isTakeover : ``,
				scores[i].takeoverDate ? scores[i].takeoverDate : ``
			];
		}
		return data;
	};

	const runOnce = async () => {
		await fetchData();
		setTimeout(() => {
			onGridReady();
		}, '1000');
	};

	export const selectTeams = () => {
		teams = [];
		const checkboxPlugin = grid.instance.config.plugin.get('awesomeCheckboxes');
		for (let i = 0; i < checkboxPlugin.props.store._state.rowIds.length; i++) {
			teams.push(checkboxPlugin.props.store._state.rowIds[i]);
		}
		return teams;
	};

	const test2 = async () => {};
</script>

<main>
	{#await runOnce()}
		<Loading />
	{:then}
		<Grid {data} {columns} sort={true} pagination={false} width="70vw" bind:this={grid} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

	<style global>
		@import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
	</style>
	<div class="flex items-center justify-center pt-10">
		<ManagePoints points="1" {teams} />
		<ManagePoints points="2" {teams} />
		<ManagePoints points="3" {teams} />
		<ManagePoints points="-1" {teams} />
		<ManagePoints points="-2" {teams} />
		<ManagePoints points="-3" {teams} />
		<ManagePoints points="0" {teams} />
	</div>
	<div class="flex items-center justify-center pt-10">
		<NewRound />
	</div>
	<div class="flex items-center justify-center pt-10">
		<DeleteAnswer {teams} />
		<DisableAnswers />
		<EnableAnswers />
	</div>
</main>

<style>
</style>
