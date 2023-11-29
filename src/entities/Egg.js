import { matter } from "../globals.js";
import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";
import GameEntity from "./GameEntity.js";

export default class Egg extends Circle {
	static SPRITE_MEASUREMENTS = [
		{ x: 668, y: 820, width: 45, height: 57 },
	];
	static RADIUS = 25;

	
	constructor(x, y) {
		super(x, y, Egg.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(Egg.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -25, y: -23 };

		this.isWaiting = true;
		this.isJumping = false;
	}

	update(dt) {
		super.update(dt);

		if (this.isWaiting) {
			this.randomlyJump();
		}
	}

	randomlyJump() {
		if (!this.isJumping && oneInXChance(1000)) {
			this.jump();
		}

		if (this.isOnGround()) {
			this.isJumping = false;
		}
	}

	jump() {
		this.isJumping = true;

		// https://brm.io/matter-js/docs/classes/Body.html#method_applyForce
		matter.Body.applyForce(this.body, this.body.position, { x: 0.0, y: -0.2 });
	}
}