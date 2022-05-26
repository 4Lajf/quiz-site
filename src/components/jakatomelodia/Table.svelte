<script>
	import ManagePoints from './ManagePoints.svelte';
	import NewRound from './NewRound.svelte';
	import DisableAnswers from './DisableAnswers.svelte';
	import EnableAnswers from './EnableAnswers.svelte';
	import Loading from '../../components/Loading.svelte';
	import { quizScores, loadQuizScores } from '../../stores/JTMStore';
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
			width: '98%'
		},
		{
			id: 'notes',
			name: 'Nutki',
			width: '10%'
		},
		{
			id: 'points',
			name: '',
			width: '1%'
		}
	];

	quizScores.subscribe((value) => {
		scores = value;
	});

	const fetchData = async () => {
		await loadQuizScores();
		console.log(scores)
		if (scores.length === 0) {
			data = ['', '', '', ''];
			return data;
		}
		data = [];
		for (let i = 0; i < scores.length; i++) {
			data[i] = [scores[i].team, scores[i].notes ? scores[i].notes : ``, scores[i].points];
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
		<Grid {data} {columns} sort={true} pagination={false} width="60vw" bind:this={grid} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

	<style global>
		@import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
	</style>
	<div class="pt-10 flex items-center justify-center">
		<ManagePoints points="1" {teams} />
		<ManagePoints points="2" {teams} />
		<ManagePoints points="3" {teams} />
		<ManagePoints points="-1" {teams} />
		<ManagePoints points="-2" {teams} />
		<ManagePoints points="-3" {teams} />
		<ManagePoints points="0" {teams} />
	</div>
	<div class="pt-10 flex items-center justify-center">
		<NewRound />
	</div>
	<div class="pt-10 flex items-center justify-center">
		<DisableAnswers />
		<EnableAnswers />
	</div>
</main>

<style>
</style>
