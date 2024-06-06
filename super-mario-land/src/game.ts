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

import 'phaser';
import * as aoconnect from '@permaweb/aoconnect';
import { saveAs } from 'file-saver';
import { GameConfig } from './config';
import { promptModel } from './lib';

async function genImage(promptText: string) {
  try {
    const image = await promptModel(
      aoconnect.createDataItemSigner(globalThis.arweaveWallet),
      promptText
    );
    return image;
  } catch (e) {
    console.error('Failed to load image');
  }
}

function saveImage(base64Data: string, filename: string) {
  const byteString = atob(base64Data.split(',')[1]);
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  saveAs(blob, `${filename}.png`);
}

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const prompts = {
  mainChars: ['mario', 'godzilla', 'monster'],
  enemyChars: ['frog']
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', async () => {
  // const mainCharImage = await genImage(getRandomItem(prompts.mainChars));
  // saveImage(mainCharImage, 'mario');

  // const enemyCharImage = await genImage(getRandomItem(prompts.enemyChars));
  // saveImage(enemyCharImage, 'goomba');

  const game = new Game(GameConfig);
});
