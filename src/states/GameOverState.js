import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import LevelMaker from "../services/LevelMaker.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine
} from "../globals.js";

export default class GameOverState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to level 1.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.background = parameters.background;
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(),
			});
		}
	}

	render() {
		this.background.render();

		context.save();
		context.font = '300px AngryBirds';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 90);
		context.fillStyle = 'crimson';
		context.fillText('Game Over', CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT / 2 - 80);
		context.font = '100px AngryBirds';
		context.fillStyle = 'white';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
		context.restore();
	}
}
