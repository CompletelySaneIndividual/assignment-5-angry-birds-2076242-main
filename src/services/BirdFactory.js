import Bird from "../entities/Bird.js";
import YellowBird from "../entities/YellowBird.js";
import BirdType from "../enums/BirdType.js";
import WhiteBird from "../entities/WhiteBird.js";

export default class BirdFactory {
	/**
	 * Encapsulates the instantiation logic for creating birds.
	 * This method should be extended when adding new birds.
	 *
	 * @param {object} type Uses the BirdType enum.
	 * @returns An instance of a Bird.
	 */
	 static createInstance(type, x, y) {
		switch (type) {
			case BirdType.Red:
				return new Bird(x, y);
			case BirdType.Yellow:
				return new YellowBird(x, y);
			case BirdType.White:
				return new WhiteBird(x, y);
		}
	}
}
