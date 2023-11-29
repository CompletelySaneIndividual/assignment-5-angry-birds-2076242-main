import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import LevelMaker from "../services/LevelMaker.js";
import Sprite from "../../lib/Sprite.js"
import ImageName from "../enums/ImageName.js"
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine,
	images
} from "../globals.js";

export default class VictoryState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.background = parameters.background;
		this.level = parameters.level;
		this.birds = parameters.birds;
		this.starPlaceHolder = new Sprite(images.get(ImageName.StarPlaceHolder), 0, 0, 558, 210);
		this.star = new Sprite(images.get(ImageName.Star), 0, 0, 130, 120);
		this.stars;
		if(this.birds.currentCount === this.birds.totalCount -1){ //only used one bird, gets 3 stars
			this.stars = 3;
		}else if(this.birds.currentCount >= Math.floor(this.birds.totalCount /2)){
			this.stars = 2;
		}else{
			this.stars = 1;
		}
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(this.level + 1),
			});
		}
	}

	render() {
		//this.background.render();

		this.starPlaceHolder.render(CANVAS_WIDTH / 2 - (558 / 2), CANVAS_HEIGHT / 2);

		switch(this.stars){
			case 1:
				this.star.render(CANVAS_WIDTH / 2 - (260), CANVAS_HEIGHT / 2 - (-75));
				break;
			case 2:
				this.star.render(CANVAS_WIDTH / 2 - (260), CANVAS_HEIGHT / 2 - (-75));
				this.star.render(CANVAS_WIDTH / 2 - (85), CANVAS_HEIGHT / 2 - (-15), { x: 1.25, y: 1.25 });
				break;
			case 3:
				this.star.render(CANVAS_WIDTH / 2 - (260), CANVAS_HEIGHT / 2 - (-75));
				this.star.render(CANVAS_WIDTH / 2 - (85), CANVAS_HEIGHT / 2 - (-15), { x: 1.25, y: 1.25 });
				this.star.render(CANVAS_WIDTH / 2 - (-130), CANVAS_HEIGHT / 2 - (-75));
				break;
		}

		context.save();
		context.font = '300px AngryBirds';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Victory!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 90);
		context.fillStyle = 'limegreen';
		context.fillText('Victory!', CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT / 2 - 80);
		context.font = '100px AngryBirds';
		context.fillStyle = 'white';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
		context.restore();
	}
}
