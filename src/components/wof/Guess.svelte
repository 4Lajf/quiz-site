<script>
	import { onMount } from 'svelte';

	let counterElement;
	import Counter from '../../components/wof/Wheel.svelte';

	// *** Game Setup! ***
	let letters;
	let score = 0;

	onMount(() => {
		letters.innerHTML = answerArray.join(' ');
	});

	const test = () => {
		console.log(counterElement.$$.ctx[0]);
	};

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

			// after you're done with everything, remove the letter from the input
			if (remainingLetters <= 0) {
				letters.innerHTML = answerArray.join(' ');
				alert('Good job! The answer was ' + word);
			}
		}
	};
</script>

<main class="bg-zinc-500">
	<Counter bind:this={counterElement} />
	<h1 class="text-center text-5xl">Kategoria: {category}</h1>
	<h1 class="text-center text-3xl">Wynik: {score}</h1>

	<div id="text">
		<div id="letters" class="flex justify-center" bind:this={letters} />
		<div id="prompt">
			<span id="guess">
				<br /><button
					type="button"
					on:click={() => submission('A')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>A</button
				>
				<button
					type="button"
					on:click={() => submission('B')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>B</button
				>
				<button
					type="button"
					on:click={() => submission('C')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>C</button
				>
				<button
					type="button"
					on:click={() => submission('D')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>D</button
				>
				<button
					type="button"
					on:click={() => submission('E')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>E</button
				>
				<br />
				<button
					type="button"
					on:click={() => submission('F')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>F</button
				>
				<button
					type="button"
					on:click={() => submission('G')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>G</button
				>
				<button
					type="button"
					on:click={() => submission('H')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>H</button
				>
				<button
					type="button"
					on:click={() => submission('I')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>I</button
				>
				<button
					type="button"
					on:click={() => submission('J')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>J</button
				><br />
				<button
					type="button"
					on:click={() => submission('K')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>K</button
				>
				<button
					type="button"
					on:click={() => submission('L')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>L</button
				>
				<button
					type="button"
					on:click={() => submission('M')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>M</button
				>
				<button
					type="button"
					on:click={() => submission('N')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>N</button
				>
				<button
					type="button"
					on:click={() => submission('O')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>O</button
				>
				<br />
				<button
					type="button"
					on:click={() => submission('P')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>P</button
				>
				<button
					type="button"
					on:click={() => submission('Q')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>Q</button
				>
				<button
					type="button"
					on:click={() => submission('R')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>R</button
				>
				<button
					type="button"
					on:click={() => submission('S')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>S</button
				>
				<button
					type="button"
					on:click={() => submission('T')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>T</button
				><br />
				<button
					type="button"
					on:click={() => submission('U')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>U</button
				>
				<button
					type="button"
					on:click={() => submission('V')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>V</button
				>
				<button
					type="button"
					on:click={() => submission('W')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>W</button
				>
				<button
					type="button"
					on:click={() => submission('X')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>X</button
				>
				<button
					type="button"
					on:click={() => submission('Y')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>Y</button
				><br />
				<button
					type="button"
					on:click={() => submission('Z')}
					class="inline-block w-10 h-10 bg-blue-600 text-white font-medium text-3xl leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					>Z</button
				>
			</span>
		</div>
	</div>
</main>

<style>
	main {
		margin: 50px;
		font-family: arial;
	}

	#text {
		height: 200px;
		min-width: 700px;
		padding: 50px;
	}
	#letters {
		font-size: 50px;
	}

	#prompt {
		font-size: 25px;
		margin-top: 50px;
	}
</style>
