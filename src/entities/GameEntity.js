import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import {
	context,
	DEBUG,
	images,
	matter,
	world
} from "../globals.js";

const {
	Bodies,
	Composite,
} = matter;

export default class GameEntity {
	static DAMAGE_THRESHOLD_SCALAR = 15;

	/**
	 * The base class that all entities in the game should extend.
	 *
	 * @param {object} body A Matter.js body.
	 */
	constructor(body) {
		this.body = body;
		this.shouldCleanUp = false;
		this.body.entity = this;
		this.body.damageThreshold = this.body.mass * GameEntity.DAMAGE_THRESHOLD_SCALAR;
		this.renderOffset = { x: 0, y: 0 };
		this.sprites = [];
		this.currentFrame = 0;

		Composite.add(world, body);
	}

	update(dt) {
		if (this.shouldCleanUp) {
			Composite.remove(world, this.body);
		}
	}

	render(renderDebug) {
		context.save();
		context.translate(this.body.position.x, this.body.position.y);
		context.rotate(this.body.angle);
		this.sprites[this.currentFrame].render(this.renderOffset.x, this.renderOffset.y);

		if (DEBUG) {
			renderDebug();
		}

		context.restore();
	}

	/**
	 * Utility to clone a body based on a set of vertices.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices
	 *
	 * @param {object} body A Matter.js body.
	 * @returns A cloned Matter.js body.
	 */
	static clone(body) {
		return Bodies.fromVertices(body.position.x, body.position.y, body.vertices, {
			collisionFilter: body.collisionFilter,
			render: body.render,
			plugin: body.plugin,
			label: body.label,
			friction: body.friction,
			restitution: body.restitution,
			angle: body.angle,
			slop: body.slop,
			isStatic: body.isStatic,
			density: body.density,
			mass: body.mass,
			isSensor: body.isSensor
		});
	}

	/**
	 * Utility to check if a body is of a given type.
	 *
	 * @param {object} body A Matter.js body.
	 * @param {string} type Uses an enum from the enums/ folder.
	 * @returns Whether the body is of the given type.
	 */
	static isBodyOfType(body, type) {
		return body.label === type;
	}

	/**
	 * Constructs an array of sprites given an array
	 * of measurements (x, y, width, height).
	 *
	 * @param {array} measurements
	 * @returns An array of Sprite objects.
	 */
	static generateSprites(measurements) {
		/**
		 * The map() method creates a new array populated with the results
		 * of calling a provided function on every element in the calling array.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
		 */
		return measurements.map(measurement =>
			new Sprite(
				images.get(ImageName.Sprites),
				measurement.x,
				measurement.y,
				measurement.width,
				measurement.height
			)
		);
	}
}
