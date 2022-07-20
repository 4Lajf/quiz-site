<script>
	import { onMount } from 'svelte';
	export const add = () => {
		reward = statusLabel;
	};
	let reward = '';

	const TWO_PI = Math.PI * 2;
	const HALF_PI = Math.PI * 0.5;
	// canvas settings
	var viewWidth = 1536,
		viewHeight = 1536,
		viewCenterX = viewWidth * 1,
		viewCenterY = viewHeight * 1,
		drawingCanvas,
		ctx,
		timeStep = 1 / 60;

	var ppm = 24, // pixels per meter
		physicsWidth = viewWidth / ppm,
		physicsHeight = viewHeight / ppm,
		physicsCenterX = physicsWidth * 0.5;

	var world;
	var wheel, arrow, mouseBody, mouseConstraint;
	var arrowMaterial, pinMaterial, contactMaterial;
	var wheelSpinning = false,
		wheelStopped = true;

	var particles = [];
	let statusLabel = '';
	onMount(() => {
		initDrawingCanvas();
		initPhysics();
		requestAnimationFrame(loop);
	});

	function initDrawingCanvas() {
		drawingCanvas.width = viewWidth;
		drawingCanvas.height = viewHeight;
		ctx = drawingCanvas.getContext('2d');

		drawingCanvas.addEventListener('mousemove', updateMouseBodyPosition);
		drawingCanvas.addEventListener('mousedown', checkStartDrag);
		drawingCanvas.addEventListener('mouseup', checkEndDrag);
		drawingCanvas.addEventListener('mouseout', checkEndDrag);
	}

	function updateMouseBodyPosition(e) {
		var p = getPhysicsCoord(e);
		mouseBody.position[0] = p.x;
		mouseBody.position[1] = p.y;
	}

	function checkStartDrag(e) {
		if (wheelSpinning === false) {
			if (world.hitTest(mouseBody.position, [wheel.body])[0]) {
				mouseConstraint = new p2.RevoluteConstraint(mouseBody, wheel.body, {
					worldPivot: mouseBody.position,
					collideConnected: false
				});

				world.addConstraint(mouseConstraint);
			}
		}
	}

	function checkEndDrag(e) {
		if (mouseConstraint) {
			world.removeConstraint(mouseConstraint);
			mouseConstraint = null;

			if (wheelSpinning === false && wheelStopped === true) {
				if (Math.abs(wheel.body.angularVelocity) > 7.5) {
					wheelSpinning = true;
					wheelStopped = false;
					statusLabel = '...stuk stuk stuk stuk stuk stuk...';
				} else {
					statusLabel = 'Wiem, że umiesz zakręcić lepiej :).';
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
		world = new p2.World();
		world.solver.iterations = 100;
		world.solver.tolerance = 0;

		arrowMaterial = new p2.Material();
		pinMaterial = new p2.Material();
		contactMaterial = new p2.ContactMaterial(arrowMaterial, pinMaterial, {
			friction: 0.0,
			restitution: 0.1
		});
		world.addContactMaterial(contactMaterial);

		var wheelRadius = 16,
			wheelX = physicsCenterX,
			wheelY = wheelRadius + 4,
			arrowX = wheelX,
			arrowY = wheelY + wheelRadius + 1.25;

		wheel = new Wheel(wheelX, wheelY, wheelRadius, 32, 0.25, 16);
		wheel.body.angle = Math.PI / 32.5;
		wheel.body.angularVelocity = 0;
		arrow = new Arrow(arrowX, arrowY, 1, 3);
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

		// p2 does not support continuous collision detection :(
		// but stepping twice seems to help
		// considering there are only a few bodies, this is ok for now.
		world.step(timeStep * 0.5);
		world.step(timeStep * 0.5);

		if (
			wheelSpinning === true &&
			wheelStopped === false &&
			wheel.body.angularVelocity < 0.25 &&
			arrow.hasStopped()
		) {
			wheel.gotLucky();
			wheelStopped = true;
			wheelSpinning = false;

			wheel.body.angularVelocity = 0;
			add();
		}
	}

	function draw() {
		// ctx.fillStyle = '#fff';
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

		this.createBody();
		this.createPins();
	}
	Wheel.prototype = {
		createBody: function () {
			this.body = new p2.Body({ mass: 1, position: [this.x, this.y] });
			this.body.angularDamping = 0.0;
			this.body.addShape(new p2.Circle(this.radius));
			this.body.shapes[0].sensor = true; //TODO use collision bits instead

			var axis = new p2.Body({ position: [this.x, this.y] });
			var constraint = new p2.LockConstraint(this.body, axis);
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
			statusLabel = readRewards[rewardsIndex];
		},
		draw: function () {
			// TODO this should be cached in a canvas, and drawn as an image
			// also, more doodads
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

			let labelX = -300,
				labelY = 100,
				labelRotation = (46 * Math.PI) / 180,
				labelTranslateX = 0,
				labelTranslateY = 0;
			for (var i = 0; i < this.segments; i++) {
				ctx.save();

				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				ctx.translate(labelTranslateX, labelTranslateY);
				ctx.rotate(labelRotation);
				ctx.font = '30px verdana';
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
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>(Weeb) Wheel of Fortune</title>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/p2.js/0.6.0/p2.min.js"
		integrity="sha512-07h10NGs6z2Bh1dfcJ14CFNQkLz+xwOYRwHB4kXH00iNdedcnxOuF+9cxqGmY6tMw8BIUV2hik2GNLhCwELtUg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"></script>
</svelte:head>

<main>
	<div class="container z-50 !bg-zinc-400">
		<div class="opacity-0">Count: {reward}</div>
		<div id="container" class="centered">
			<canvas id="drawing_canvas" bind:this={drawingCanvas} />
			<div id="status_label">{statusLabel}</div>
		</div>
	</div>
</main>

<style>
	.centered {
		position: absolute;
		margin: auto;
		top: -33%;
		bottom: 0;
		left: 0;
		right: 0;
	}

	#container {
		width: 1536px;
		height: 1536px;
	}

	#status_label {
		position: relative;
		top: 415px;
		color: black;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 2em;
		text-align: center;
		pointer-events: none;
	}

	#drawing_canvas {
		position: absolute;
	}
</style>
