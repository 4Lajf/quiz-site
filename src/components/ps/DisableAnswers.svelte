<script>
	import { disableAnswers } from '../../stores/psStore';
	import { refresh } from '../../stores/generalStore';
</script>

<main>
	<button
		type="button"
		class="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
		on:click={() => {
			disableAnswers();
			refresh()
		}}
	>
		Disable Answers
	</button>
</main>

<style>

</style>
