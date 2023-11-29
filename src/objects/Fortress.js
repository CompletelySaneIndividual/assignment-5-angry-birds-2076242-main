import Block from "../entities/Block.js";
import GameEntity from "../entities/GameEntity.js";
import Pig from "../entities/Pig.js";
import BodyType from "../enums/BodyType.js";
import EventName from "../enums/EventName.js";
import {
	engine,
	matter,
	world
} from "../globals.js";

const {
	Composite,
	Events,
	Sleeping,
} = matter;

export default class Fortress {
	/**
	 * The container for the blocks and pigs that
	 * comprise the level. This class will check for
	 * any collisions, damage the appropriate blocks
	 * and pigs, and clean them up from the world.
	 *
	 * @param {array} blocks An array of Block objects
	 * @param {array} pigs An array of Pig objects
	 */
	constructor(blocks, pigs) {
		this.blocks = blocks;
		this.pigs = pigs;
		this.bodiesToRemove = [];

		this.registerCollisionEvents();
	}

	update(dt) {
		[...this.blocks, ...this.pigs].forEach((entity) => entity.update(dt));
		this.blocks = this.blocks.filter((block) => !block.shouldCleanUp);
		this.pigs = this.pigs.filter((pig) => !pig.shouldCleanUp);
	}

	render() {
		[...this.blocks, ...this.pigs].forEach((entity) => entity.render());
	}

	/**
	 * @returns Whether or not there are pigs left.
	 */
	areNoPigsLeft() {
		return this.pigs.length === 0;
	}

	/**
	 * @see https://brm.io/matter-js/docs/classes/Engine.html#events
	 */
	registerCollisionEvents() {
		Events.on(engine, EventName.CollisionStart, (event) => {
			this.onCollisionStart(event);
		});
	}

	/**
	 * Defines what should happen when Matter detects the start of a collision.
	 *
	 * @param {object} event
	 */
	onCollisionStart(event) {
		const { bodyA, bodyB } = event.pairs[0];

		/**
		 * Recall that in globals.js we enabled "sleeping bodies" which ensures
		 * that the blocks don't move when at rest. However, when there's a
		 * collision, then we want the blocks to "wake up" and start interacting
		 * with the world again, so we temporarily set sleeping for all bodies to
		 * false. Matter will take care of renabling sleep on its own.
		 */
		Composite.allBodies(world).forEach((body) => Sleeping.set(body, false));

		this.checkValidCollisions(bodyA, bodyB);
		this.removeBodies();
	}

	/**
	 * Given a pair of bodies, determines which
	 * body was damaged by which body.
	 *
	 * @param {object} bodyA A Matter.js body.
	 * @param {object} bodyB A Matter.js body.
	 * @returns The damaged body.
	 */
	checkValidCollisions(bodyA, bodyB) {
		if (this.didFirstBodyDamageSecond(bodyA, bodyB)) {
			this.bodiesToRemove.push(bodyB);
		}

		if (this.didFirstBodyDamageSecond(bodyB, bodyA)) {
			this.bodiesToRemove.push(bodyA);
		}
	}

	/**
	 * @param {object} firstBody
	 * @param {object} secondBody
	 * @returns Whether the first body damaged the second.
	 */
	didFirstBodyDamageSecond(firstBody, secondBody) {
		return firstBody.speed * firstBody.mass > secondBody.damageThreshold;
	}

	/**
	 * Iterates over all the bodies that were flagged for removal
	 * and sets their shouldCleanUp property to true which will
	 * remove them from the Matter world.
	 */
	removeBodies() {
		this.bodiesToRemove.forEach((body) => {
			body.entity.shouldCleanUp = true;
		})

		this.bodiesToRemove = [];
	}
}
