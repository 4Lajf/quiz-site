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
					score += parseInt(counterElement.$$.ctx[0]);
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

<main class="bg-zinc-400">
	<Counter bind:this={counterElement} />
	<h1 class="text-center text-5xl">Kategoria: {category}</h1>
	<h1 class="text-center text-3xl">Wynik: {score}</h1>
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
			class=" disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>A</button
		>
		<button
			type="button"
			on:click={() => submission('B')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>B</button
		>
		<button
			type="button"
			on:click={() => submission('C')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>C</button
		>
		<button
			type="button"
			on:click={() => submission('D')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>D</button
		>
		<button
			type="button"
			on:click={() => submission('E')}
			disabled={vowelsDisabled}
			class="disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>E</button
		>
		<br />
		<button
			type="button"
			on:click={() => submission('F')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>F</button
		>
		<button
			type="button"
			on:click={() => submission('G')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>G</button
		>
		<button
			type="button"
			on:click={() => submission('H')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>H</button
		>
		<button
			type="button"
			on:click={() => submission('I')}
			disabled={vowelsDisabled}
			class="disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>I</button
		>
		<button
			type="button"
			on:click={() => submission('J')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>J</button
		><br />
		<button
			type="button"
			on:click={() => submission('K')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>K</button
		>
		<button
			type="button"
			on:click={() => submission('L')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>L</button
		>
		<button
			type="button"
			on:click={() => submission('M')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>M</button
		>
		<button
			type="button"
			on:click={() => submission('N')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>N</button
		>
		<button
			type="button"
			on:click={() => submission('O')}
			disabled={vowelsDisabled}
			class="disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>O</button
		>
		<br />
		<button
			type="button"
			on:click={() => submission('P')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>P</button
		>
		<button
			type="button"
			on:click={() => submission('Q')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>Q</button
		>
		<button
			type="button"
			on:click={() => submission('R')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>R</button
		>
		<button
			type="button"
			on:click={() => submission('S')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>S</button
		>
		<button
			type="button"
			on:click={() => submission('T')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>T</button
		><br />
		<button
			type="button"
			on:click={() => submission('U')}
			disabled={vowelsDisabled}
			class="disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>U</button
		>
		<button
			type="button"
			on:click={() => submission('V')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>V</button
		>
		<button
			type="button"
			on:click={() => submission('W')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>W</button
		>
		<button
			type="button"
			on:click={() => submission('X')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>X</button
		>
		<button
			type="button"
			on:click={() => submission('Y')}
			disabled={vowelsDisabled}
			class="disabled:bg-red-800 disabled:text-gray-300 inline-block w-20 h-20 bg-red-600 text-white font-medium text-5xl leading-tight uppercase  shadow-md hover:bg-red-700 hover:shadow-lg  transition duration-150 ease-in-out"
			>Y</button
		><br />
		<button
			type="button"
			on:click={() => submission('Z')}
			disabled={consonantsDisabled}
			class="disabled:bg-blue-800 disabled:text-gray-300 inline-block w-20 h-20 bg-blue-600 text-white font-medium text-5xl leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out"
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
