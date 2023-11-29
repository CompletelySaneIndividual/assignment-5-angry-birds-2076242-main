import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import Sprite from "../../lib/Sprite.js"
import ImageName from "../enums/ImageName.js"
import LevelMaker from "../services/LevelMaker.js";
import {
	engine,
	matter,
	sounds,
	stateMachine,
	world,
	images
} from "../globals.js";

const {
	Composite,
	Engine,
} = matter;

export default class PlayState extends State {
	static playstate;
	constructor() {
		super();
		PlayState.playstate = this;
	}

	enter(parameters = {}) {
		// sounds.play(SoundName.Music);
		this.level = parameters.level ?? LevelMaker.createLevel();
	}

	exit() {
		// Remove all Matter bodies from the world before exiting this state.
		Composite.allBodies(world).forEach((body) => Composite.remove(world, body));
	}

	update(dt) {
		/**
		 * Update the Matter world one step/frame. By calling it here,
		 * we can be sure that the Matter world will be updated at the
		 * same rate as our canvas animation.
		 *
		 * @see https://brm.io/matter-js/docs/classes/Engine.html#method_update
		 */
		Engine.update(engine);

		this.level.update(dt);

		this.checkWinOrLose();
	}

	render() {
		this.level.render();
	}

	checkWinOrLose() {
		//;
		
		

		if (this.level.didWin()) {
			let tmpLevel = LevelMaker.createLevel(this.level.number);
			let currentCount = this.level.slingshot.getBirdCount();
			let totalCount = tmpLevel.birdQueue.birds.length + 1;
			//console.log(tmpLevel)
			stateMachine.change(GameStateName.Victory, {
				background: this.level.background,
				level: this.level.number,
				birds: {currentCount, totalCount}
			});
		}
		else if (this.level.didLose()) {
			stateMachine.change(GameStateName.GameOver, {
				background: this.level.background,
			});
		}
	}
}
