import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateMachine from "../lib/StateMachine.js";

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();
export const CANVAS_WIDTH = 1750;//2000;
export const CANVAS_HEIGHT = 720;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const sounds = new Sounds();

// If true, render all hitboxes.
export const DEBUG = true;

/**
 * The physics engine we're going to use for this game.
 * We're not importing it anywhere because it is declared globally in index.html.
 *
 * @see https://brm.io/matter-js
 */
// @ts-ignore
export const matter = Matter;

/**
 * The Matter.Engine module contains methods for creating and manipulating engines.
 * An engine is a controller that manages updating the simulation of the world.
 *
 * @see https://brm.io/matter-js/docs/classes/Engine.html
 */
export const engine = matter.Engine.create({
	/**
	 * Sleeping bodies do not detect collisions or move when at rest.
	 * This is required so that the fortress' blocks don't constantly
	 * shake and move when nothing is happening.
	 *
	 * To see the difference, set this to false, wait 1-2 minutes, and
	 * notice how all the blocks of the fortress have shifted/fallen.
	 *
	 * @see https://brm.io/matter-js/demo/#sleeping
	 * @see https://brm.io/matter-js/docs/classes/Sleeping.html
	 */
	enableSleeping: true
});

/**
 * The root Matter.Composite instance that will contain all bodies,
 * constraints and other composites to be simulated by this engine.
 *
 * @see https://brm.io/matter-js/docs/classes/Engine.html#property_world
 */
export const world = engine.world;
