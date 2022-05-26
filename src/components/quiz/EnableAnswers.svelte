<script>
	import { enableAnswers } from '../../stores/quizStore';
	import { refresh } from '../../stores/generalStore';
</script>

<main>
	<button
		type="button"
		class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
		on:click={() => {
			enableAnswers();
			refresh();
		}}
	>
		Enable Answers
	</button>
</main>

<style>
</style>
