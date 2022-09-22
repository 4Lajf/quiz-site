<script>
	import { goto } from '$app/navigation';
	import { user } from '../stores/authStore.js';
	import Login from '../components/Login.svelte';
</script>

<main>
	<section
		class="flex flex-col justify-center w-full h-screen m-0 text-gray-100 bg-gray-800 homescreen "
	>
		<div class="container flex flex-col items-center justify-center px-5 py-24 mx-auto">
			<div class="w-full text-center lg:w-2/3">
				<h1 class="mb-4 font-mono text-3xl font-medium text-gray-300 title-font sm:text-4xl">
					4Lajf.com - Spis Projektów
				</h1>
				<p class="mb-8 font-normal leading-relaxed">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque nemo, illo quasi neque
					earum, ratione architecto sit voluptatibus, distinctio pariatur doloremque. Fugiat neque
					omnis corrupti dicta. Quia reiciendis suscipit dolorum!
				</p>
				<div class="flex justify-center">
					<button
						class="flex items-center px-6 py-4 mr-2 font-bold text-gray-300 transition ease-in-out border-2 border-gray-200 rounded-sm hover:bg-gray-200 hover:text-gray-800 duration-250"
						on:click={() => goto('todo')}
					>
						Todo
					</button>
					<button
						class="flex items-center px-6 py-4 mr-2 font-bold text-gray-300 transition ease-in-out border-2 border-gray-200 rounded-sm hover:bg-gray-200 hover:text-gray-800 duration-250"
						on:click={() => goto('quiz')}
					>
						Quiz
					</button>
					<button
						class="flex items-center px-6 py-4 mr-2 font-bold text-gray-300 transition ease-in-out border-2 border-gray-200 rounded-sm hover:bg-gray-200 hover:text-gray-800 duration-250"
						on:click={() => goto('/jakatomelodia')}
					>
						Jaka To Melodia?
					</button>
					<button
						class="flex items-center px-6 py-4 mr-2 font-bold text-gray-300 transition ease-in-out border-2 border-gray-200 rounded-sm hover:bg-gray-200 hover:text-gray-800 duration-250"
						on:click={() => goto('/amq')}
					>
						AMQ
					</button>
				</div>
			</div>
		</div>
	</section>
</main>
