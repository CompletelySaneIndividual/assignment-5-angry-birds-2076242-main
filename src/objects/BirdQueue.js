import Bird from "../entities/Bird.js";
import BirdFactory from "../services/BirdFactory.js";
import Ground from "../entities/Ground.js";
import Slingshot from "./Slingshot.js";
import { CANVAS_HEIGHT } from "../globals.js";

export default class BirdQueue {
	/**
	 * Uses the Queue data structure to keep an
	 * ordered array of birds. The order is relevant
	 * since the bird at the front of the queue is
	 * the one that gets loaded into the slingshot.
	 *
	 * @param {array} birdTypes An array of BirdType enums.
	 */
	constructor(birdTypes) {
		this.birds = [];

		this.initializeQueue(birdTypes);
	}

	update(dt) {
		this.birds.forEach((bird) => {
			bird.update(dt);
		});
	}

	render() {
		this.birds.forEach((bird) => {
			bird.render();
		});
	}

	/**
	 * Lines the birds up in a nice orderly line behind
	 * the slingshot. The bird at the front of the queue
	 * is placed at the slingshot's location.
	 *
	 * @param {array} birdTypes An array of BirdType enums.
	 */
	initializeQueue(birdTypes) {
		birdTypes.forEach((type, index) => {
			const x = index === 0 ? Slingshot.LOCATION.x : Slingshot.LOCATION.x / birdTypes.length * (birdTypes.length - index);
			const y = index === 0 ? Slingshot.LOCATION.y : CANVAS_HEIGHT - Ground.GRASS.height;

			this.enqueue(BirdFactory.createInstance(type, x, y));
		});
	}

	/**
	 * @param {Bird} bird
	 * @returns The Bird that was just inserted into the array.
	 */
	enqueue(bird) {
		return this.birds.push(bird);
	}

	/**
	 * @returns The Bird that was just removed from the array.
	 */
	dequeue() {
		const removedBird = this.birds.shift();

		removedBird.isWaiting = false;

		return removedBird;
	}

	/**
	 * @returns The Bird at the first location of the array.
	 */
	peek() {
		return this.birds[0];
	}

	/**
	 * @returns Whether or not there are birds left in the array.
	 */
	areNoBirdsLeft() {
		return this.birds.length === 0;
	}
}
