import Background from "./Background.js";
import Ground from "../entities/Ground.js";
import Slingshot from "./Slingshot.js";
import Fortress from "./Fortress.js";
import BirdQueue from "./BirdQueue.js";
import {
	context,
	DEBUG,
	matter,
	world
} from "../globals.js";

export default class Level {
	/**
	 * The Level contains all the pieces to play the game.
	 *
	 * @param {number} number The current level's number.
	 * @param {Fortress} fortress
	 * @param {BirdQueue} birdQueue
	 */
	constructor(number, fortress, birdQueue) {
		this.number = number;
		this.fortress = fortress;
		this.birdQueue = birdQueue;
		this.slingshot = new Slingshot(birdQueue);
		this.ground = new Ground();
		this.background = new Background();
	}

	update(dt) {
		this.fortress.update(dt);
		this.slingshot.update(dt);
		this.birdQueue.update();
	}

	render() {
		this.background.render();
		this.renderStatistics();
		this.birdQueue.render();
		this.slingshot.render();
		this.fortress.render();
		this.ground.render();
	}

	renderStatistics() {
		context.fillStyle = 'navy';
		context.font = '60px AngryBirds';
		context.fillText(`Level: ${this.number}`, 50, 100);

		if (DEBUG) {
			context.fillText(`Birds: ${this.birdQueue.birds.length + (this.slingshot.bird === null ? 0 : 1)}`, 50, 190);
			context.fillText(`Blocks: ${this.fortress.blocks.length}`, 50, 280);
			context.fillText(`Pigs: ${this.fortress.pigs.length}`, 50, 370);
			context.fillText(`Bodies: ${matter.Composite.allBodies(world).length - 1}`, 50, 460);
		}
	}

	didWin() {
		return this.fortress.areNoPigsLeft();
	}

	didLose() {
		return this.birdQueue.areNoBirdsLeft() && this.slingshot.isEmpty();
	}
}
