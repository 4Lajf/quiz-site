<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { leaderboardData } from '../../stores/leaderboard';

	import Keystroke from 'svelte-keystroke';
	// *** Game Setup! ***
	let letters;
	let score = 0;
	let vowelsDisabled = true;
	let consonantsDisabled = false;
	let guessesCount = 0;
	let tmpCD;
	let tmpVD;
	let leaderboardEntries;
	let reward = '';
	let isLangChoosen = false;
	let isSidebarHidden = 'hidden';
	let clickedButtons = [];
	let isLetterChosen = true;

	function compare(a, b) {
		if (a.score > b.score) {
			return -1;
		}
		if (a.score < b.score) {
			return 1;
		}
		return 0;
	}

	leaderboardEntries = get(leaderboardData).sort(compare).slice(0, 10);

	onMount(() => {
		letters.innerHTML = answerArray.join(' ');
		initDrawingCanvas();
		initPhysics();
		requestAnimationFrame(loop);
	});

	// these are our words
	let quizData = [{ name: 'Kaguya sama wa Kokurasetai', category: 'anime' }];

	const chooseLang = async (lang) => {
		lang = lang;
		isLangChoosen = true;
		isSidebarHidden = 'shown';
		if (lang === 'JP') {
			quizData = [
				{ name: 'Kaguya sama wa Kokurasetai', category: 'anime' },
				{ name: 'Hagane no Renkinjutsushi', category: 'anime' }
				// ... (rest of JP quizData)
			];
		} else {
			quizData = [
				{ name: 'Kaguya-sama: Love is War', category: 'anime' },
				{ name: 'Fullmetal Alchemist Brotherhood', category: 'anime' }
				// ... (rest of EN quizData)
			];
		}
		// picks a word at random
		random = Math.floor(Math.random() * quizData.length);
		word = quizData[random].name.toUpperCase();

		// give me a list of empty letters for the word
		answerArray = [];
		remainingLettersCorrection = 0;
		word = word.split('');
		for (let i = 0; i < word.length; i++) {
			if (word[i] === ' ') {
				answerArray[i] = ' ';
				word[i] = ' ';
				remainingLettersCorrection++;
			} else {
				answerArray[i] = '_';
			}
		}
		// how many letters are left?
		remainingLetters = word.length - remainingLettersCorrection;
		letters.innerHTML = answerArray.join(' ');
		let wordWithoutVowels = word;
		wordWithoutVowels = wordWithoutVowels.filter(
			(letter) =>
				letter === 'B' ||
				letter === 'C' ||
				letter === 'D' ||
				letter === 'F' ||
				letter === 'G' ||
				letter === 'H' ||
				letter === 'J' ||
				letter === 'K' ||
				letter === 'L' ||
				letter === 'M' ||
				letter === 'N' ||
				letter === 'O' ||
				letter === 'P' ||
				letter === 'Q' ||
				letter === 'R' ||
				letter === 'S' ||
				letter === 'T' ||
				letter === 'V' ||
				letter === 'W' ||
				letter === 'X' ||
				letter === 'Z'
		);
		submission(wordWithoutVowels[Math.floor(Math.random() * wordWithoutVowels.length)]);
	};

	// picks a word at random
	let random = Math.floor(Math.random() * quizData.length);
	let word = quizData[random].name.toUpperCase();
	let category = quizData[random].category;

	// give me a list of empty letters for the word
	let answerArray = [];
	let remainingLettersCorrection = 0;
	word = word.split('');
	for (let i = 0; i < word.length; i++) {
		if (word[i] === ' ') {
			answerArray[i] = ' ';
			word[i] = ' ';
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
	let totalLetters;

	const submission = (guess) => {
		console.log(guessesCount);
		isLetterChosen = true;
		clickedButtons.push(guess);
		clickedButtons = clickedButtons;
		if (guess.length !== 1) {
			alert('Please enter a single letter');
		} else {
			//update the game state with the guess
			for (let j = 0; j < word.length; j++) {
				// if they were correct
				if (word[j] === guess && guess !== answerArray[j]) {
					answerArray[j] = guess;
					letters.innerHTML = answerArray.join(' ');
					if (typeof reward === 'number' && isNaN(reward) === false && guessesCount !== 0) {
						score += parseInt(reward);
					}
					remainingLetters--;
				}
			}
		}
		consonantsDisabled = true;
		vowelsDisabled = true;
		guessesCount++;
	};

	const TWO_PI = Math.PI * 2;
	const HALF_PI = Math.PI * 0.5;
	// canvas settings
	var viewWidth = 1024,
		viewHeight = 1024,
		viewCenterX = viewWidth * 0.66,
		viewCenterY = viewHeight * 0.66,
		drawingCanvas,
		ctx,
		timeStep = 1 / 60;

	var ppm = 24, // pixels per meter
		physicsWidth = viewWidth / ppm,
		physicsHeight = viewHeight / ppm,
		physicsCenterX = physicsWidth * 0.33;

	var world;
	var wheel, arrow, mouseBody, mouseConstraint;
	var arrowMaterial, pinMaterial, contactMaterial;
	var wheelSpinning = false,
		wheelStopped = true;

	var particles = [];
	let statusLabel = '';

	function initDrawingCanvas() {
		drawingCanvas.width = viewWidth;
		drawingCanvas.height = viewHeight;
		ctx = drawingCanvas.getContext('2d');

		drawingCanvas.addEventListener('mousemove', updateMouseBodyPosition);
		drawingCanvas.addEventListener('mousedown', checkStartDrag);
	}

	function updateMouseBodyPosition(e) {
		var p = getPhysicsCoord(e);
		mouseBody.position[0] = p.x;
		mouseBody.position[1] = p.y;
	}

	function checkStartDrag(e) {
		if (wheelSpinning === false) {
			if (world.hitTest(mouseBody.position, [wheel.body])[0]) {
				if (isLetterChosen === true) {
					wheel.body.angularVelocity = Math.floor(Math.random() * 100) + 100; // Reduced initial velocity
					wheelSpinning = true;
					wheelStopped = false;
					tmpCD = consonantsDisabled;
					tmpVD = vowelsDisabled;
					consonantsDisabled = true;
					vowelsDisabled = true;
				}
			}
		}
	}

	function getPhysicsCoord(e) {
		var rect = drawingCanvas.getBoundingClientRect(),
			x = (e.clientX - rect.left) / ppm,
			y = physicsHeight - (e.clientY - rect.top) / ppm;

		return { x: x, y: y };
	}

	function initPhysics() {
		world = new p2.World({
			gravity: [0, 90.82] // Add gravity to make it feel more realistic
		});
		world.solver.iterations = 100;
		world.solver.tolerance = 0;

		arrowMaterial = new p2.Material();
		pinMaterial = new p2.Material();
		contactMaterial = new p2.ContactMaterial(arrowMaterial, pinMaterial, {
			friction: 0.3, // Increase friction for more gradual slowdown
			restitution: 0.2 // Increase restitution for more bounce
		});
		world.addContactMaterial(contactMaterial);

		var wheelRadius = 10.6,
			wheelX = physicsCenterX,
			wheelY = wheelRadius + 2.6,
			arrowX = wheelX,
			arrowY = wheelY + wheelRadius + 0.83;

		wheel = new Wheel(wheelX, wheelY, wheelRadius, 32, 0.25, 10.6);
		wheel.body.angle = Math.PI / 32.5;
		wheel.body.angularVelocity = 0;
		arrow = new Arrow(arrowX, arrowY, 0.75, 1.5);
		mouseBody = new p2.Body();

		world.addBody(mouseBody);
	}

	function update() {
		particles.forEach(function (p) {
			p.update();
			if (p.complete) {
				particles.splice(particles.indexOf(p), 1);
			}
		});

		world.step(timeStep * 0.5);
		world.step(timeStep * 0.5);

		if (wheelSpinning === true && wheelStopped === false) {
			wheel.applyConstantPower(); // Apply constant power

			// Apply a small, variable braking torque
			var brakingTorque = -Math.sign(wheel.body.angularVelocity) * (0.01 + Math.random() * 0.01);
			wheel.body.angularForce += brakingTorque;

			if (Math.abs(wheel.body.angularVelocity) < 0.05 && arrow.hasStopped()) {
				wheel.gotLucky();
				wheelStopped = true;
				wheelSpinning = false;
				isLetterChosen = false;
				console.log(guessesCount);
				if (guessesCount === 5) {
					consonantsDisabled = true;
					vowelsDisabled = false;
				}
				if (guessesCount === 6) {
					consonantsDisabled = true;
					vowelsDisabled = true;
				}
				if (guessesCount <= 4) {
					consonantsDisabled = false;
					vowelsDisabled = true;
				}

				wheel.body.angularVelocity = 0;
			}
		}
	}

	function draw() {
		ctx.clearRect(0, 0, viewWidth, viewHeight);

		wheel.draw();
		arrow.draw();

		particles.forEach(function (p) {
			p.draw();
		});
	}

	function loop() {
		update();
		draw();

		requestAnimationFrame(loop);
	}

	/////////////////////////////
	// wheel of fortune
	/////////////////////////////
	let rewards = [
		'200',
		'300',
		'200',
		'100',
		'500',
		'100',
		'100',
		'200',
		'200',
		'100',
		'300',
		'100',
		'700',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'200',
		'300',
		'100',
		'200',
		'100',
		'100',
		'100',
		'300',
		'200',
		'800',
		'Bankrut',
		'100',
		'100'
	];
	let readRewards = [
		'100',
		'200',
		'200',
		'100',
		'300',
		'100',
		'700',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'200',
		'300',
		'100',
		'200',
		'100',
		'100',
		'100',
		'300',
		'200',
		'800',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'100',
		'500',
		'100'
	];

	function Wheel(x, y, radius, segments, pinRadius, pinDistance) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.segments = segments;
		this.pinRadius = pinRadius;
		this.pinDistance = pinDistance;

		this.pX = this.x * ppm;
		this.pY = (physicsHeight - this.y) * ppm;
		this.pRadius = this.radius * ppm;
		this.pPinRadius = this.pinRadius * ppm;
		this.pPinPositions = [];

		this.deltaPI = TWO_PI / this.segments;

		this.constantPower = 0.05; // Small constant power

		this.createBody();
		this.createPins();
	}

	Wheel.prototype = {
		createBody: function () {
			this.body = new p2.Body({
				mass: 1,
				position: [this.x, this.y],
				angularDamping: 0.1 // Add angular damping for more gradual slowdown
			});
			this.body.addShape(new p2.Circle(this.radius));
			this.body.shapes[0].sensor = true;

			var axis = new p2.Body({ position: [this.x, this.y] });
			var constraint = new p2.RevoluteConstraint(this.body, axis, {
				worldPivot: [this.x, this.y]
			});
			constraint.collideConnected = false;

			world.addBody(this.body);
			world.addBody(axis);
			world.addConstraint(constraint);
		},
		createPins: function () {
			var l = this.segments,
				pin = new p2.Circle(this.pinRadius);

			pin.material = pinMaterial;

			for (var i = 0; i < l; i++) {
				var x = Math.cos((i / l) * TWO_PI) * this.pinDistance,
					y = Math.sin((i / l) * TWO_PI) * this.pinDistance;

				this.body.addShape(pin, [x, y]);
				this.pPinPositions[i] = [x * ppm, -y * ppm];
			}
		},
		gotLucky: function () {
			var currentRotation = wheel.body.angle % TWO_PI,
				currentSegment = Math.floor(currentRotation / this.deltaPI);
			let rewardsIndex;
			if (currentSegment < 0) {
				rewardsIndex = currentSegment + 32;
			} else {
				rewardsIndex = currentSegment;
			}
			reward = parseInt(readRewards[rewardsIndex]);
			if (isNaN(reward)) {
				score = 0;
			}
		},
		draw: function () {
			ctx.save();
			ctx.translate(this.pX, this.pY);

			ctx.beginPath();
			ctx.fillStyle = '#DB9E36';
			ctx.arc(0, 0, this.pRadius + 24, 0, TWO_PI);
			ctx.fill();
			ctx.fillRect(-12, 0, 24, 400);

			ctx.rotate(-this.body.angle);

			for (var i = 0; i < this.segments; i++) {
				if (i === 15 || i === 31) {
					ctx.fillStyle = '#000000';
				} else if (i === 14 || i === 30 || i === 22) {
					ctx.fillStyle = '#daa520';
				} else if (i % 2 === 0) {
					ctx.fillStyle = '#BD4932';
				} else {
					ctx.fillStyle = '#FFFAD5';
				}
				ctx.beginPath();
				ctx.arc(0, 0, this.pRadius, i * this.deltaPI, (i + 1) * this.deltaPI);
				ctx.lineTo(0, 0);
				ctx.closePath();
				ctx.fill();
			}

			ctx.fillStyle = '#401911';

			this.pPinPositions.forEach(function (p) {
				ctx.beginPath();
				ctx.arc(p[0], p[1], this.pPinRadius, 0, TWO_PI);
				ctx.fill();
			}, this);

			let labelX = -200,
				labelY = 66.6,
				labelRotation = (46 * Math.PI) / 180,
				labelTranslateX = 0,
				labelTranslateY = 0;
			for (var i = 0; i < this.segments; i++) {
				ctx.save();

				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				ctx.translate(labelTranslateX, labelTranslateY);
				ctx.rotate(labelRotation);
				ctx.font = '20px verdana';
				if (i === 29 || i === 13) {
					ctx.fillStyle = 'white';
				} else {
					ctx.fillStyle = 'black';
				}

				ctx.fillText(rewards[i], labelX, labelY);

				ctx.restore();
				labelRotation += 0.197;
			}

			ctx.restore();
		},
		applyConstantPower: function () {
			if (wheelSpinning && !wheelStopped) {
				// Apply constant power in the direction of rotation
				var powerDirection = Math.sign(this.body.angularVelocity);
				this.body.angularForce += powerDirection * this.constantPower;
			}
		}
	};

	/////////////////////////////
	// arrow on top of the wheel of fortune
	/////////////////////////////
	function Arrow(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.verts = [];

		this.pX = this.x * ppm;
		this.pY = (physicsHeight - this.y) * ppm;
		this.pVerts = [];

		this.createBody();
	}

	Arrow.prototype = {
		createBody: function () {
			this.body = new p2.Body({ mass: 1, position: [this.x, this.y] });
			this.body.addShape(this.createArrowShape());

			var axis = new p2.Body({ position: [this.x, this.y] });
			var constraint = new p2.RevoluteConstraint(this.body, axis, {
				worldPivot: [this.x, this.y]
			});
			constraint.collideConnected = false;

			var left = new p2.Body({ position: [this.x - 2, this.y] });
			var right = new p2.Body({ position: [this.x + 2, this.y] });
			var leftConstraint = new p2.DistanceConstraint(this.body, left, {
				localAnchorA: [-this.w * 2, this.h * 0.25],
				collideConnected: false
			});
			var rightConstraint = new p2.DistanceConstraint(this.body, right, {
				localAnchorA: [this.w * 2, this.h * 0.25],
				collideConnected: false
			});
			var s = 32,
				r = 4;

			leftConstraint.setStiffness(s);
			leftConstraint.setRelaxation(r);
			rightConstraint.setStiffness(s);
			rightConstraint.setRelaxation(r);

			world.addBody(this.body);
			world.addBody(axis);
			world.addConstraint(constraint);
			world.addConstraint(leftConstraint);
			world.addConstraint(rightConstraint);
		},

		createArrowShape: function () {
			this.verts[0] = [0, this.h * 0.25];
			this.verts[1] = [-this.w * 0.5, 0];
			this.verts[2] = [0, -this.h * 0.75];
			this.verts[3] = [this.w * 0.5, 0];

			this.pVerts[0] = [this.verts[0][0] * ppm, -this.verts[0][1] * ppm];
			this.pVerts[1] = [this.verts[1][0] * ppm, -this.verts[1][1] * ppm];
			this.pVerts[2] = [this.verts[2][0] * ppm, -this.verts[2][1] * ppm];
			this.pVerts[3] = [this.verts[3][0] * ppm, -this.verts[3][1] * ppm];

			var shape = new p2.Convex(this.verts);
			shape.material = arrowMaterial;

			return shape;
		},
		hasStopped: function () {
			var angle = Math.abs(this.body.angle % TWO_PI);

			return angle < 1e-3 || TWO_PI - angle < 1e-3;
		},
		update: function () {},
		draw: function () {
			ctx.save();
			ctx.translate(this.pX, this.pY);
			ctx.rotate(-this.body.angle);

			ctx.fillStyle = '#401911';

			ctx.beginPath();
			ctx.moveTo(this.pVerts[0][0], this.pVerts[0][1]);
			ctx.lineTo(this.pVerts[1][0], this.pVerts[1][1]);
			ctx.lineTo(this.pVerts[2][0], this.pVerts[2][1]);
			ctx.lineTo(this.pVerts[3][0], this.pVerts[3][1]);
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		}
	};

	// Export any necessary functions or variables if needed
	export { initDrawingCanvas, initPhysics, loop, submission, chooseLang };
</script>

<svelte:head>
	<title>Hyperspace by HTML5 UP</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="/assets/css/main.css" />
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/p2.js/0.6.0/p2.min.js"
		integrity="sha512-07h10NGs6z2Bh1dfcJ14CFNQkLz+xwOYRwHB4kXH00iNdedcnxOuF+9cxqGmY6tMw8BIUV2hik2GNLhCwELtUg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</svelte:head>

<Keystroke
	on:combo={({ detail }) => {
		console.log(detail)
		switch (detail) {
			case 'Alt+x':
				for (let j = 0; j < word.length; j++) {
					answerArray[j] = word[j];
					letters.innerHTML = answerArray.join(' ');
				}
				break;
			case 'Alt+z':
				clickedButtons = [];
				letters.innerHTML = answerArray.join(' ');
				random = Math.floor(Math.random() * quizData.length);
				word = quizData[random].name.toUpperCase();
				category = quizData[random].category;

				// give me a list of empty letters for the word
				answerArray = [];
				remainingLettersCorrection = 0;
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
				remainingLetters = word.length - remainingLettersCorrection;

				// *** Game Loop! ***
				// while there are still letters to guess

				guess;
				answer;
				consonantsDisabled = false;
				vowelsDisabled = true;
				letters.innerHTML = answerArray.join(' ');
				let wordWithoutVowels = word;
				wordWithoutVowels = wordWithoutVowels.filter(
					(letter) =>
						letter === 'B' ||
						letter === 'C' ||
						letter === 'D' ||
						letter === 'F' ||
						letter === 'G' ||
						letter === 'H' ||
						letter === 'J' ||
						letter === 'K' ||
						letter === 'L' ||
						letter === 'M' ||
						letter === 'N' ||
						letter === 'P' ||
						letter === 'Q' ||
						letter === 'R' ||
						letter === 'S' ||
						letter === 'T' ||
						letter === 'V' ||
						letter === 'W' ||
						letter === 'X' ||
						letter === 'Z'
				);
				guessesCount = 0;
				submission(wordWithoutVowels[Math.floor(Math.random() * wordWithoutVowels.length)]);
				break;
			case 'Alt+v':
				let name = prompt('Wprowadź nick');
				if (name) {
					leaderboardEntries = get(leaderboardData);
					leaderboardData.set([...leaderboardEntries, { score: score, name: name }]);
				}
				break;
			case 'Alt+Delete':
				leaderboardData.set([]);
				break;
		}
	}}
/>

<body>
	{#if isLangChoosen === false}
		<div class="flex items-center justify-center w-screen h-screen">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<p class="mb-5 text-3xl text-gray-600 uppercase">Wybierz język</p>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="login"
					type="submit"
					on:click={() => chooseLang('JP')}
					><span>Japoński</span>
				</button>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="login"
					type="submit"
					on:click={() => chooseLang('ENG')}
					><span>Angielski</span>
				</button>
				<br />
			</form>
		</div>
	{/if}
	<!-- Sidebar -->
	<section id="sidebar" class="select-none">
		<div class="inner">
			<nav>
				<ul class="relative bottom-[22vh] {isSidebarHidden}">
					<li><a href="#lorem">Tablica Wyników:</a></li>
					{#each leaderboardEntries as { score, name }, i}
						<a href="#ipsum">{name}: {score}</a>
					{/each}
				</ul>
				<div class="absolute bottom-[5vh] {isSidebarHidden}">
					<button
						type="button"
						on:click={() => submission('A')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>A</button
					>
					<button
						type="button"
						on:click={() => submission('B')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>B</button
					>
					<button
						type="button"
						on:click={() => submission('C')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>C</button
					>
					<button
						type="button"
						on:click={() => submission('D')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>D</button
					>
					<button
						type="button"
						on:click={() => submission('E')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>E</button
					>
					<button
						type="button"
						on:click={() => submission('F')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>F</button
					>
					<button
						type="button"
						on:click={() => submission('G')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>G</button
					>
					<button
						type="button"
						on:click={() => submission('H')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>H</button
					>
					<button
						type="button"
						on:click={() => submission('I')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>I</button
					>
					<button
						type="button"
						on:click={() => submission('J')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>J</button
					>
					<button
						type="button"
						on:click={() => submission('K')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>K</button
					>
					<button
						type="button"
						on:click={() => submission('L')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>L</button
					>
					<button
						type="button"
						on:click={() => submission('M')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>M</button
					>
					<button
						type="button"
						on:click={() => submission('N')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>N</button
					>
					<button
						type="button"
						on:click={() => submission('O')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>O</button
					>

					<button
						type="button"
						on:click={() => submission('P')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>P</button
					>
					<button
						type="button"
						on:click={() => submission('Q')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>Q</button
					>
					<button
						type="button"
						on:click={() => submission('R')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>R</button
					>
					<button
						type="button"
						on:click={() => submission('S')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>S</button
					>
					<button
						type="button"
						on:click={() => submission('T')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>T</button
					>
					<button
						type="button"
						on:click={() => submission('U')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>U</button
					>
					<button
						type="button"
						on:click={() => submission('V')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>V</button
					>
					<button
						type="button"
						on:click={() => submission('W')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>W</button
					>
					<button
						type="button"
						on:click={() => submission('X')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>X</button
					>
					<button
						type="button"
						on:click={() => submission('Y')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>Y</button
					>
					<button
						type="button"
						on:click={() => submission('Z')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>Z</button
					>
					<a href="#anime">Użyte litery: {clickedButtons}</a>
				</div>
			</nav>
		</div>
	</section>

	<!-- Wrapper -->
	<div id="wrapper" class="select-none">
		<!-- Intro -->
		<section id="intro" class="relative wrapper style1 fullscreen">
			<div class="relative bottom-[20vh]">
				<center>
					<h2 class="opacity-[90%] text-4xl font-bold py-5 text-white">DARMOWE ;)</h2>
					<h2 class="opacity-[90%] text-4xl font-bold py-5 text-white">Kategoria: {category}</h2>
					<h2 class="opacity-[90%] text-4xl font-bold py-5 text-white">Wynik: {score}</h2>
					<!-- svelte-ignore a11y-missing-content -->
					<h1 id="letters" class="text-2xl text-white" bind:this={letters} />
				</center>
			</div>
			<div class="inner">
				<div class="opacity-0">Count: {score}</div>
				<div id="container" class="centered">
					<canvas id="drawing_canvas" bind:this={drawingCanvas} />
					<div
						id="status_label"
						class="opacity-[90%] text-4xl font-bold py-5 text-white text-center"
					>
						{statusLabel}
					</div>
				</div>
			</div>
		</section>
	</div>
</body>

<style>
	#letters {
		font-size: 50px;
	}
	.centered {
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		left: 23%;
		right: 0;
	}

	#container {
		width: 1024px;
		height: 1024px;
	}

	#drawing_canvas {
		position: absolute;
	}
</style>
