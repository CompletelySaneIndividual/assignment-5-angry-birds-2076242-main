import BirdQueue from "./BirdQueue.js";
import Sprite from "../../lib/Sprite.js";
import BodyType from "../enums/BodyType.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import GameEntity from "../entities/GameEntity.js";
import YellowBird from "../entities/YellowBird.js";
import WhiteBird from "../entities/WhiteBird.js";
import Egg from "../entities/Egg.js"
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	engine,
	images,
	matter,
	world,
	keys
} from "../globals.js";

const {
	Body,
	Composite,
	Constraint,
	Events,
	Mouse,
	MouseConstraint,
	Vector,
} = matter;

export default class Slingshot {
	static BACK_SPRITE = { x: 0, y: 0, width: 40, height: 200, index: 0 };
	static FRONT_SPRITE = { x: 833, y: 0, width: 43, height: 124, index: 1 };
	static LOCATION = { x: 300, y: 500 };
	static TRAJECTORY = { radius: 6, points: 30 };
	static SLING_COLOUR = 'rgb(48, 23, 8)';

	/**
	 * The Slingshot's mechanism is implemented by using a Matter
	 * Constraint object. Constraints are used for specifying that
	 * a fixed distance must be maintained between two bodies
	 * (or a body and a fixed world-space position). The stiffness
	 * of constraints can be modified to create springs or elastic.
	 *
	 * @see https://brm.io/matter-js/demo/#constraints
	 * @see https://brm.io/matter-js/docs/classes/Constraint.html
	 *
	 * @param {BirdQueue} birdQueue
	 */
	constructor(birdQueue) {
		this.birdQueue = birdQueue;
		this.bird = birdQueue.dequeue();
		this.sprites = Slingshot.generateSprites();
		this.wasLaunched = false;
		this.trajectoryPoints = [];
		this.egg = undefined;

		this.initializeSling();
		this.initializeTrajectory();
		this.initializeMouseConstraint();
	}

	update(dt) {
		this.bird.update(dt);

		if(this.egg !== undefined) {
			this.egg.update(dt);
			if(this.egg !== undefined) {
				if(this.egg.shouldCleanUp){
					this.egg = undefined;
				}
			}
		}

		this.checkSpecialAbility();

		if (this.shouldCalculateTrajectory) {
			this.calculateTrajectory();
		}

		if (this.isReadyToLaunch()) {
			this.launch();
		}

		if (this.shouldUnload()) {
			this.unload();
		}

		if (this.shouldLoad()) {
			this.load(this.birdQueue.dequeue());
		}
	}

	render() {
		this.renderSlingBack();

		this.bird.render();

		if(this.egg !== undefined) {
			this.egg.render();
		}

		if (this.shouldCalculateTrajectory) {
			this.renderTrajectory();
		}

		this.renderSlingFront();
	}

	checkSpecialAbility(){
		if (keys[' ']){
			if(this.bird instanceof YellowBird){
				this.bird.useAbility();
			}
			if(this.bird instanceof WhiteBird){
				this.bird.useAbility();
			}
		}
	}

	/**
	 * The "back" of the sling is comprised of the back wood piece
	 * and the part of the elastic that goes behind the bird.
	 */
	renderSlingBack() {
		context.save();
		context.beginPath();
		context.moveTo(this.sling.pointA.x + 30, this.sling.pointA.y - 20);
		context.lineTo(this.sling.bodyB?.position.x - this.bird.radius * 0.7, this.sling.bodyB?.position.y + this.bird.radius * 0.7);
		context.closePath();
		context.strokeStyle = Slingshot.SLING_COLOUR;
		context.lineWidth = 10;
		context.stroke();
		context.restore();

		this.sprites[Slingshot.BACK_SPRITE.index].render(this.sling.pointA.x, this.sling.pointA.y - 50);
	}

	/**
	 * The "front" of the sling is comprised of the front wood piece
	 * and the part of the elastic that goes in front of the bird.
	 */
	renderSlingFront() {
		context.save();
		context.beginPath();
		context.moveTo(this.sling.pointA.x - 20, this.sling.pointA.y - 20);
		context.lineTo(this.sling.bodyB?.position.x - this.bird.radius * 0.7, this.sling.bodyB?.position.y + this.bird.radius * 0.7);
		context.closePath();
		context.strokeStyle = Slingshot.SLING_COLOUR;
		context.lineWidth = 10;
		context.stroke();
		context.restore();

		this.sprites[Slingshot.FRONT_SPRITE.index].render(this.sling.pointA.x - 28, this.sling.pointA.y - 55);
	}

	/**
	 * Renders the white dots that help the player line up their shot.
	 */
	renderTrajectory() {
		this.trajectoryPoints.forEach((marker, index) => {
			// Fade the dots further away from the slingshot.
			const alpha = 1 - (index / this.trajectoryPoints.length);

			context.save();
			context.translate(marker.x, marker.y);
			context.beginPath();
			context.arc(0, 0, Slingshot.TRAJECTORY.radius, 0, 2 * Math.PI);
			context.closePath();
			context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			context.fill();
			context.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
			context.stroke();
			context.restore();
		});
	}

	static generateSprites() {
		return [
			new Sprite(images.get(ImageName.Sprites), Slingshot.BACK_SPRITE.x, Slingshot.BACK_SPRITE.y, Slingshot.BACK_SPRITE.width, Slingshot.BACK_SPRITE.height),
			new Sprite(images.get(ImageName.Sprites), Slingshot.FRONT_SPRITE.x, Slingshot.FRONT_SPRITE.y, Slingshot.FRONT_SPRITE.width, Slingshot.FRONT_SPRITE.height),
		];
	}

	/**
	 * @returns True if the mouse was released and if the bird is on the
	 * opposite side of the slingshot from where the mouse currently is.
	 */
	isReadyToLaunch() {
		return this.mouseWasReleased
			&& ((this.mouse.position.x < this.sling.pointA.x && this.sling.bodyB?.position.x > this.sling.pointA.x + 3)
				|| (this.mouse.position.x > this.sling.pointA.x && this.sling.bodyB?.position.x < this.sling.pointA.x - 3));
	}

	launch() {
		this.wasLaunched = true;
		this.sling.bodyB = null;
		this.mouseWasReleased = false;
	}

	isEmpty() {
		return this.bird === null;
	}

	shouldLoad() {
		return this.isEmpty() && !this.birdQueue.areNoBirdsLeft();
	}

	load(bird) {
		this.bird = bird;
		if(this.egg !== undefined) {
			this.egg.shouldCleanUp = true;
		}
		this.sling.bodyB = bird.body;
		Body.setPosition(bird.body, Slingshot.LOCATION);
		this.wasLaunched = false;
	}

	getBirdCount(){
		let total = this.birdQueue.birds.length;
		if(this.bird !== undefined && !this.wasLaunched){
			total++;
		}
		return total;
	}

	shouldUnload() {
		return this.wasLaunched && (this.bird.didStop() || this.bird.didGoOffScreen());
	}

	unload() {
		this.bird.shouldCleanUp = true;
		this.bird.update();
		this.bird = null;
	}

	/**
	 * Calculates the white dots that help the player line up their shot.
	 * This is done by creating a dummy clone of the bird and running the
	 * Matter world simulation only on the cloned bird. We can then record
	 * the positions of the bird as it gets updated in its "mock flight" and
	 * use those points to render the white dots later.
	 */
	calculateTrajectory() {
		// Clone the bird to used as an invisible dummy.
		const bird = GameEntity.clone(this.sling.bodyB);

		/**
		 * Calculate an *approximate* velocity to mimic the force
		 * that will be applied to the bird when the sling is released.
		 * This value uses the distance differential between the bird's
		 * position and the center point of the Matter Constraint
		 * (i.e. the slingshot).
		 *
		 * Since this is only an approximation, we have to fiddle with
		 * the value to get it to be as accurate as we can. I found that
		 * scaling the value by 0.8 to result in an accurate trajectory.
		 */
		const [velocityX, velocityY] = [
			(this.sling.pointA.x - bird.position.x) * 0.8,
			(this.sling.pointA.y - bird.position.y) * 0.8
		];

		/**
		 * Set the velocity of the dummy bird using the approximated velocities.
		 * @see https://github.com/liabru/matter-js/issues/603#issuecomment-385249712
		 */
		Body.setVelocity(bird, Vector.create(velocityX, velocityY));

		// Iterate over our predicted trajectory points pool and update their position.
		this.trajectoryPoints.forEach((trajectoryPoint) => {
			/**
			 * We have to manually apply gravity to the bird since we're
			 * not running the Matter engine itself right now. This value
			 * is the default value the Matter engine uses for gravity.
			 *
			 * @see https://brm.io/matter-js/docs/classes/Engine.html#property_gravity.scale
			 */
			bird.force.y += bird.mass * engine.gravity.scale;

			// Run the Matter engine's update only on the dummy bird body.
			Body.update(bird, engine.timing.lastDelta, 1, 1);

			// Set the trajectory point to the current position of the dummy bird.
			trajectoryPoint.x = bird.position.x;
			trajectoryPoint.y = bird.position.y;
		});
	}

	/**
	 * The Slingshot's mechanism is implemented by using a Matter
	 * Constraint object. Constraints are used for specifying that
	 * a fixed distance must be maintained between two bodies
	 * (or a body and a fixed world-space position). The stiffness
	 * of constraints can be modified to create springs or elastic.
	 *
	 * @see https://brm.io/matter-js/demo/#constraints
	 * @see https://brm.io/matter-js/docs/classes/Constraint.html
	 */
	initializeSling() {
		this.sling = Constraint.create({
			pointA: Slingshot.LOCATION,
			bodyB: this.bird.body,
			stiffness: 0.1,
			length: 0,
		});

		Composite.add(world, this.sling);
	}

	/**
	 * To implement mouse interaction, Matter provides a dedicated mechanism
	 * to apply a Constraint to the mouse location. Mouse constraints are used
	 * for allowing user interaction, providing the ability to move bodies via
	 * the mouse or touch.
	 *
	 * @see https://brm.io/matter-js/docs/classes/MouseConstraint.html
	 */
	initializeMouseConstraint() {
		this.mouseWasReleased = false;
		this.mouse = Mouse.create(canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse: this.mouse,
		});

		Composite.add(world, mouseConstraint);

		this.registerMouseEvents(mouseConstraint);
	}

	/**
	 * Prefill an array with empty vectors that will later
	 * be used to display the bird's approximate trajectory.
	 */
	initializeTrajectory() {
		this.shouldCalculateTrajectory = false;

		for (let i = 0; i < Slingshot.TRAJECTORY.points; i++) {
			this.trajectoryPoints.push(Vector.create());
		}
	}

	/**
	 * @see https://brm.io/matter-js/docs/classes/MouseConstraint.html#events
	 */
	registerMouseEvents(mouseConstraint) {
		Events.on(mouseConstraint, EventName.MouseDragStart, (event) => {
			this.onMouseDragStart(event);
		});

		Events.on(mouseConstraint, EventName.MouseDragEnd, (event) => {
			this.onMouseDragEnd(event);
		});
	}

	/**
	 * Defines what should happen when Matter
	 * detects the start of the mouse being dragged.
	 *
	 * @param {object} event
	 */
	onMouseDragStart(event) {
		if (GameEntity.isBodyOfType(event.body, BodyType.Bird)) {
			this.mouseWasReleased = false;
			this.shouldCalculateTrajectory = true;
		}
	}

	/**
	 * Defines what should happen when Matter
	 * detects the end of the mouse being dragged.
	 *
	 * @param {object} event
	 */
	onMouseDragEnd(event) {
		if (GameEntity.isBodyOfType(event.body, BodyType.Bird)) {
			this.mouseWasReleased = true;
			this.shouldCalculateTrajectory = false;
		}
	}
}
