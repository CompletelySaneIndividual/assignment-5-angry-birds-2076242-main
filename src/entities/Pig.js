import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import GameEntity from "./GameEntity.js";

export default class Pig extends Circle {
	static SPRITE_MEASUREMENTS = [
		{ x: 733, y: 856, width: 48, height: 46 },
	];
	static RADIUS = 20;

	/**
	 * A pig that sits smugly in its fortress.
	 * The pig is a dynamic (i.e. non-static) Matter body meaning it is affected
	 * by the world's physics. We've set the density to a value
	 * higher than the block's density so that the pig can knock
	 * blocks over. We've also given the pig a medium restitution
	 * value so that it is somewhat bouncy.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_density
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, Pig.RADIUS, {
			label: BodyType.Pig,
			density: 0.0015,
			restitution: 0.5,
		});

		this.sprites = GameEntity.generateSprites(Pig.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -24, y: -23 };
	}
}
