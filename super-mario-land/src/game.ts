/**
 * A remake of the famous and great Super Mario Land released in 1989 on the Game Boy.
 * I have used the original screen resolution of 160 x 144 Pixels.
 *
 * The creation of this remake took more time than expected.
 * Only the first level was implemented, with the following components to follow:
 *
 * - Enemy Nokobon
 * - Enemy Fly
 * - Platform at the end of the level is not working properly yet
 * - Currently you can go several times into the tubes
 * - Small details
 *
 * This is a remake of the original game for educational purposes.
 * The rights remain with Nintendo.
 *
 * References and Resources
 *
 * [1] [Spriters Resource](https://www.spriters-resource.com/game_boy_gbc/sml)
 * [2] [Super Mario Land Font by Patrick Lauke, CC BY 3.0 license](https://smartfonts.com/super-mario-land.font)
 * [3] [Nintendo Technical Data](https://www.nintendo.co.uk/Support/Game-Boy-Pocket-Color/Product-information/Technical-data/Technical-data-619585.html)
 * [4] [Generic Platformer and Phaser Bootstrap Project](https://github.com/nkholski/phaser3-es6-webpack)
 */

import "phaser";
import { GameConfig } from "./config";
import * as aoconnect from "@permaweb/aoconnect";
import { promptModel, fetchImage } from "./lib";

// {
//   "type": "spritesheet",
//   "key": "mario",
//   "url": "./assets/sprites/mario.png",
//   "frameConfig": {
//     "frameWidth": 16,
//     "frameHeight": 16
//   }
// },

// {
//   "type": "spritesheet",
//   "key": "goomba",
//   "url": "./assets/sprites/goomba.png",
//   "frameConfig": {
//     "frameWidth": 8,
//     "frameHeight": 8
//   }
// },

async function genImage(promptText: string): Promise<string | undefined> {
  try {
    const image = await promptModel(
      aoconnect.createDataItemSigner(globalThis.arweaveWallet),
      promptText
    );
    return "data:image/png;base64," + image;
  } catch (e) {
    console.error("Failed to load image", e);
  }
}

async function fetchImg(promptText: string): Promise<string | undefined> {
  try {
    console.log("Fetching", promptText);
    const image = await fetchImage(
      aoconnect.createDataItemSigner(globalThis.arweaveWallet),
      promptText
    );
    console.log(`data:image/png;base64,${image}`);
    return "data:image/png;base64," + image;
  } catch (e) {
    console.error("Failed to load image", e);
  }
}

// const mainCharImage = await fetchImg(getRandomItem(prompts.mainChars));
// const enemyCharImage = await fetchImg(getRandomItem(prompts.enemyChars));

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('walletConnected', async () => {
  const game = new Game(GameConfig);
});
