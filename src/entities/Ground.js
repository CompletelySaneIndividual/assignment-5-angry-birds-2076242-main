import Sprite from "../../lib/Sprite.js";
import BodyType from "../enums/BodyType.js";
import ImageName from "../enums/ImageName.js";
import Rectangle from "./Rectangle.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	images
} from "../globals.js";

export default class Ground extends Rectangle {
	static GRASS = {
		x: 0,
		y: 0,
		width: 70,
		height: 70
	};
	static SPRITE_MEASUREMENTS = {
		x: -CANVAS_WIDTH / 2,
		y: CANVAS_HEIGHT - Ground.GRASS.height,
		width: CANVAS_WIDTH * 2,
		height: Ground.GRASS.height
	};

	/**
	 * The ground is a large Matter static body
	 * where everything in the world sits upon.
	 */
	constructor() {
		super(
			Ground.SPRITE_MEASUREMENTS.x,
			Ground.SPRITE_MEASUREMENTS.y,
			Ground.SPRITE_MEASUREMENTS.width,
			Ground.SPRITE_MEASUREMENTS.height,
			{
				label: BodyType.Ground,
				isStatic: true
			});

		this.sprites = Ground.generateSprites();
	}

	render() {
		super.render();
		
		for (let i = 0; i < CANVAS_WIDTH / Ground.GRASS.width; i++) {
			this.sprites[0].render(i * Ground.GRASS.width, CANVAS_HEIGHT - Ground.GRASS.height);
		}
	}

	static generateSprites() {
		return [
			new Sprite(images.get(ImageName.Grass), Ground.GRASS.x, Ground.GRASS.y, Ground.GRASS.width, Ground.GRASS.height),
		];
	}
}
