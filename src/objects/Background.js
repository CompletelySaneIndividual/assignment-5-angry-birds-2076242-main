import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js";
import { pickRandomElement } from "../../lib/RandomNumberHelpers.js";

export default class Background {
	static WIDTH = 512;
	static HEIGHT = 512;
	static HILLS = 0;
	static HILLS_TREES = 1;

	/**
	 * Randomly generates a background from 2 sprites
	 * dynamically based on the width of the canvas.
	 */
	constructor() {
		this.sprites = Background.generateSprites();
		this.images = [];

		for (let i = 0; i < CANVAS_WIDTH / Background.WIDTH; i++) {
			const backgroundType = pickRandomElement([
				Background.HILLS,
				Background.HILLS_TREES,
			]);
			const backgroundSprite = this.sprites[backgroundType];

			this.images.push(backgroundSprite);
		}
	}

	render() {
		this.images.forEach((image, index) => {
			image.render(index * Background.WIDTH, CANVAS_HEIGHT - Background.HEIGHT);
		})
	}

	static generateSprites() {
		return [
			new Sprite(images.get(ImageName.Background), 0, 0, Background.WIDTH, Background.HEIGHT),
			new Sprite(images.get(ImageName.Background2), 0, 0, Background.WIDTH, Background.HEIGHT),
		];
	}
}
