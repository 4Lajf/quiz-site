<script>
	import { randomizeTeams } from '../../stores/JTMStore';
	import { refresh } from '../../stores/generalStore';
</script>

<main>
	<button
		type="button"
		class="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
		on:click={() => {
			randomizeTeams();
		}}
	>
		Randomize Teams
	</button>
</main>

<style>
</style>
