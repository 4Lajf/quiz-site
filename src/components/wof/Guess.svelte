<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { leaderboardData } from '../../stores/leaderboard';

	import Keystroke from 'svelte-keystroke';
	let combos = [];
	let counterElement;
	import Counter from '../../components/wof/Wheel.svelte';

	// *** Game Setup! ***
	let letters;
	let score = 0;
	let vowelsDisabled = true;
	let consonantsDisabled = false;
	let guessesCount = 0;
	let leaderboardEntries;

	console.log($leaderboardData);
	leaderboardEntries = get(leaderboardData);

	onMount(() => {
		letters.innerHTML = answerArray.join(' ');
	});

	// these are our words
	let quizData = [
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' },
		{ name: 'DATE A LIVE', category: 'anime' }
	];

	let parts = ['head', 'torso', 'arm-l', 'arm-r', 'leg-l', 'leg-r'];

	// picks a word at random
	let word = quizData[Math.floor(Math.random() * quizData.length)].name;
	let category = quizData[Math.floor(Math.random() * quizData.length)].category;

	// give me a list of empty letters for the word
	let answerArray = [];
	let remainingLettersCorrection = 0;
	word = word.split('');
	for (let i = 0; i < word.length; i++) {
		if (word[i] === ' ') {
			answerArray[i] = ' ';
			word[i] = ' ';
			remainingLettersCorrection++;
		} else {
			answerArray[i] = '_';
		}
	}
	// how many letters are left?
	let remainingLetters = word.length - remainingLettersCorrection;

	// *** Game Loop! ***
	// while there are still letters to guess

	let guess;
	let answer;

	const submission = (guess) => {
		console.log(guessesCount);

		console.log(remainingLetters);
		if (guess.length !== 1) {
			alert('Please enter a single letter');
		} else {
			//update the game state with the guess
			for (let j = 0; j < word.length; j++) {
				// if they were correct
				if (word[j] === guess) {
					answerArray[j] = guess;
					letters.innerHTML = answerArray.join(' ');
					remainingLetters--;
					if (typeof counterElement.$$.ctx[0] === 'number') {
						score += parseInt(counterElement.$$.ctx[0]);
					}
				}
			}
		}

		if (guessesCount === 4) {
			consonantsDisabled = true;
			vowelsDisabled = false;
		} else if (guessesCount === 5) {
			consonantsDisabled = true;
			vowelsDisabled = true;
		}
		guessesCount++;
	};
</script>

<Keystroke
	on:combo={({ detail }) => {
		console.log(detail);

		switch (detail) {
			case 'Alt+a':
				score = 0;
				break;
			case 'Alt+s':
				for (let j = 0; j < word.length; j++) {
					answerArray[j] = word[j];
					letters.innerHTML = answerArray.join(' ');
				}
				break;
			case 'Alt+d':
				let name = prompt('Wprowadź nick');
				if (name) {
					leaderboardEntries = get(leaderboardData);
					leaderboardData.set([...leaderboardEntries, { score: score, name: name }]);
				}
				break;
			case 'Control+Alt+Shift+Delete':
				leaderboardData.set([]);
				break;
		}
	}}
/>

<main class="select-none bg-zinc-400">
	<Counter bind:this={counterElement} />
	<h1 class="text-5xl text-center">Kategoria: {category}</h1>
	<h1 class="text-3xl text-center">Wynik: {score}</h1>
	<div id="letters" class="flex justify-center" bind:this={letters} />
	<div class="text-3xl">
		<p>Tablica Wyników:</p>
		{#each leaderboardEntries as { score, name }, i}
			<p>{name}:{score}</p>
		{/each}
	</div>
	<div id="guess" class="absolute top-[37%] right-[50px]">
		<br /><button
			type="button"
			on:click={() => submission('A')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>A</button
		>
		<button
			type="button"
			on:click={() => submission('B')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>B</button
		>
		<button
			type="button"
			on:click={() => submission('C')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>C</button
		>
		<button
			type="button"
			on:click={() => submission('D')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>D</button
		>
		<button
			type="button"
			on:click={() => submission('E')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>E</button
		>
		<br />
		<button
			type="button"
			on:click={() => submission('F')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>F</button
		>
		<button
			type="button"
			on:click={() => submission('G')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>G</button
		>
		<button
			type="button"
			on:click={() => submission('H')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>H</button
		>
		<button
			type="button"
			on:click={() => submission('I')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>I</button
		>
		<button
			type="button"
			on:click={() => submission('J')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>J</button
		><br />
		<button
			type="button"
			on:click={() => submission('K')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>K</button
		>
		<button
			type="button"
			on:click={() => submission('L')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>L</button
		>
		<button
			type="button"
			on:click={() => submission('M')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>M</button
		>
		<button
			type="button"
			on:click={() => submission('N')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>N</button
		>
		<button
			type="button"
			on:click={() => submission('O')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>O</button
		>
		<br />
		<button
			type="button"
			on:click={() => submission('P')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>P</button
		>
		<button
			type="button"
			on:click={() => submission('Q')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>Q</button
		>
		<button
			type="button"
			on:click={() => submission('R')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>R</button
		>
		<button
			type="button"
			on:click={() => submission('S')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>S</button
		>
		<button
			type="button"
			on:click={() => submission('T')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>T</button
		><br />
		<button
			type="button"
			on:click={() => submission('U')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>U</button
		>
		<button
			type="button"
			on:click={() => submission('V')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>V</button
		>
		<button
			type="button"
			on:click={() => submission('W')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>W</button
		>
		<button
			type="button"
			on:click={() => submission('X')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>X</button
		>
		<button
			type="button"
			on:click={() => submission('Y')}
			disabled={vowelsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 shadow-md disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
			>Y</button
		><br />
		<button
			type="button"
			on:click={() => submission('Z')}
			disabled={consonantsDisabled}
			class="inline-block w-20 h-20 text-5xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 shadow-md disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
			>Z</button
		>
	</div>
</main>

<style>
	main {
		font-family: arial;
	}
	#letters {
		font-size: 50px;
	}
</style>
