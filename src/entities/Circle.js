import GameEntity from "./GameEntity.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	matter
} from "../globals.js";
import Ground from "./Ground.js";

export default class Circle extends GameEntity {
	static ANGULAR_SPEED_MINIMUM = 0.00001;
	static SPEED_MINIMUM = 0.3;

	/**
	 * A GameEntity that has a Matter circle as its body.
	 * Both Canvas and Matter use the center of their circles
	 * for the origin so we don't have to worry about offsetting.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Bodies.html#method_circle
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} radius
	 * @param {object} options
	 */
	constructor(x, y, radius, options) {
		super(matter.Bodies.circle(x, y, radius, options));

		this.radius = radius;
	}

	update(dt) {
		if (this.didGoOffScreen()) {
			this.shouldCleanUp = true;
		}

		super.update(dt);
	}

	render() {
		super.render(() => {
			context.beginPath();
			context.arc(0, 0, this.radius, 0, 2 * Math.PI);
			context.closePath();
			context.lineWidth = 4;
			context.strokeStyle = 'blue';
			context.stroke();
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(this.radius, 0)
			context.closePath();
			context.stroke();
		});
	}

	didStop() {
		return this.body.angularSpeed < Circle.ANGULAR_SPEED_MINIMUM && this.body.speed < Circle.SPEED_MINIMUM;
	}

	didGoOffScreen() {
		return this.body.position.x + this.radius < 0 || this.body.position.x - this.radius > CANVAS_WIDTH;
	}

	isOnGround() {
		return this.body.position.y > CANVAS_HEIGHT - Ground.GRASS.height - this.radius;
	}
}
