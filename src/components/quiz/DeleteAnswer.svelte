<script>
	export let teams;
	import { deleteAnswer } from '../../stores/quizStore';
	import { refresh } from '../../stores/generalStore';
</script>

<main>
	<button
		type="button"
		class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
		on:click={() => {
			for (let i = 0; i < teams.length; i++) {
				deleteAnswer(teams[i]);
			}
			refresh();
		}}
	>
		Delete Answer
	</button>
</main>

<style>
</style>
