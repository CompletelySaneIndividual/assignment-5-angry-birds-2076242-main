import Circle from "./Circle.js";
import GameEntity from "./GameEntity.js";
import { matter } from "../globals.js";
import BodyType from "../enums/BodyType.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";

export default class YellowBird extends Circle{
    static SPRITE_MEASUREMENTS = [
		{ x: 668, y: 879, width: 58, height: 54 },
	];
	static RADIUS = 20;
    static SPEED_BOOST_AMOUNT = 1.0;

    constructor(x, y) {
		super(x, y, YellowBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(YellowBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -25, y: -23 };

		this.isWaiting = true;
		this.isJumping = false;

        this.hasUsedAbility = false;
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

    useAbility(){
        if(this.hasUsedAbility === false) {
            this.hasUsedAbility = true;

            matter.Body.applyForce(this.body, this.body.position, { x: YellowBird.SPEED_BOOST_AMOUNT, y: 0.0 });
        }
    }
}