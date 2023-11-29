import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";
import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";
import Egg from "./Egg.js";
import PlayState from "../states/PlayState.js"
import {
	context,
	DEBUG,
	images,
	matter,
	world
} from "../globals.js";

export default class WhiteBird extends Circle {
	static SPRITE_MEASUREMENTS = [
        { x: 410, y: 542, width: 80, height: 93 },
        { x: 410, y: 353, width: 80, height: 93 },
        { x: 410, y: 448, width: 80, height: 93 },
        { x: 493, y: 353, width: 85, height: 93 },
        { x: 667, y: 752, width: 50, height: 65 },
        { x: 668, y: 820, width: 45, height: 57 },
    ];
	static RADIUS = 35;
    static BOOST_AMOUNT = 2.0;
    static EGG_BOOST_AMOUNT = 2;

	constructor(x, y) {
		super(x, y, WhiteBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});
        this.currentFrame = 1;
        this.animation = undefined;

		this.sprites = GameEntity.generateSprites(WhiteBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -45, y: -60 };

		this.isWaiting = true;
		this.isJumping = false;
        //this.currentFrame
        this.hasUsedAbility = false;
        this.abilityDone = false;
	}

	update(dt) {
		super.update(dt);

        if(this.hasUsedAbility == true) {
            this.animation.update(dt);
            this.currentFrame = this.animation.getCurrentFrame();
            if(this.animation.isDone()){
                this.currentFrame = 4;
                this.ability()
            }
        }

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
            
            //frames, interval, cycles = 0
            this.animation = new Animation([0, 1, 2, 3], 0.1, 1);
        }
    }
    ability(){
        if(this.abilityDone === false) {
            this.abilityDone = true;
            matter.Body.applyForce(this.body, this.body.position, { x: 0.0, y: -1 * WhiteBird.BOOST_AMOUNT });
            this.radius = 25;
            this.body.radius = 25;
            this.renderOffset = { x: -45/2, y: -60/2 };
            PlayState.playstate.level.slingshot.egg = new Egg(this.body.position.x, this.body.position.y);
            matter.Body.applyForce(PlayState.playstate.level.slingshot.egg.body, PlayState.playstate.level.slingshot.egg.body.position,
                 { x: 0.0, y: WhiteBird.EGG_BOOST_AMOUNT });

        }
    }
}