import * as aoconnect from "@permaweb/aoconnect";
import { promptModel, fetchImage } from "../lib";
import { AnimationHelper } from "../helpers/animation-helper";

function getImageB64() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAFjElEQVR4nO1b3ZGjMAyWb64A0gWluAWeaIFSXEJ4SgsuhS5SAvewJ0YISZaBTZadfDOZcbKWLEv+/eQF+OCDDz54GwIW5nk+XfntdluUPp/PYNU9U/Y7MY7jYlff96pdHvtDCPD3iAILVL5W3xHZIzJntin9LukRZ4CmyGsMlU8pAQDAMAyQUjJHzVFZSQdHrf21esZxnNFegC/bNbkQAvyxGk8pLYpSSlXGcwPwO53CZ8qebb8kP02TKYv2pZRWjqc6eB9WM4A6gHce4R3BXI7q03QckeXye+z3yOPvWjCtPuBvaEMIQQ+A1GjNMqCNVo/8XtkzAyjJI2qcn3Neyo/HYyW3CQDiiPP4+hljhJzzro2sVhZxxH5LfhgG0xZp78BgYCBoEMRTECrBzmOZR89rNNVLR4bkDOsUsfckgv2YpmmxsbQEUjla3nscprOAY7UJW7v/7XabPacDvlGllCDGCADbqawBNz+UnaYJuq4rti0NAuy85YRxHMW+od0556UMoPuJByjGCMMwQM5ZbX+1BGEHhmGAaZpWa2fbtkvZmsqao3D0t22rjiSUpaOPwpqFaLvlaE0eZdFh1GbqA3QmQPk423XdTG2RVpHNHlDqBI4CawrTkcLhMZ4H0NvhUvul4MUYoW1bsOyvsYcGgC5hdDlVN2GcYric4Oj33mB5tNGpXuO9U1xrG+DL4dYN1GpTCkJpD9TAZwK1RwwANYQHgAprOIPD4QHwOpDXq6U/sA4OmL1Ol3RLdhRnAMUrCbF3t2/BQ8Z5B1CRiuC/e05BvD79eOXe2b4lizxPSc7SZ1IRWBlgS4QB+C8ypc561vJ3t6+hdJehJ0mN00JZkYqweBCrYakTtU58d/sl2RIlId1DUJ6eiNCOVQCaphF5EG5EqRN7najxMK9qv0ZWIuSo8yX5nLN4D1ATMlxZiQXEDmDZYgNr8Kr2a2U1O7jz8XuMEbqumzdBwALdA86a+tyokvHvbN8ra+kA2M4EGgh6RwEw7gGcCvCQcbwze5yo8TG1RNh3BBHAnwugdkvUNA3AX02BpLyGDqBTjzZaAg8+74SnfYD11EcyLcaoMqK87zhiUbaGEkG7pe/cD0sAPOfkUhAkLoYaUqKDLR5mHMe5Jp+8FzydSFHiiaT6lAmVfCduwlJOE+kIKwiWgXRZKDmztqOokyc/0HY6Gyw2luZuUQeywtwmyQ9Itmn2S9zUUrjf78vokdhQqtRKplgzwHOUtHh/Dx3NKWXJjtIGKjlc0lWi1WlduhlTMm6ZAX3fB8+rA+9tlKJEY2vgl5eSXdogKEGS40mYGjwej0CDQAceOv9/m2G1BPGRTxXh3/q+dxsBYI9oTY5P4yPpQKrTW5+v3XsCwfuPuoZhKD9LAVhPLw+ta+0NtbQwr1tzAvO0oclxR59FR2s5AZGKoBW4gdLfPKiVP5JT2BOEmqT/Xkh9UvMBH7wGLi7oHfjJCZmz8eNmwBEu/2pwP08HeH3HjyRkroRVShLvAVpajdb5DtDbssSpj+O4SeldHUsAqPPplZyWvUHYk4/lfDx1vPdF3RWxoiKkN+0I/jfviwCOPc+6KbyZsSsgBGL+PM/QNM3cNM18v99nLEu/zfMM2ofWRxksW3JUnspKdnh1/fQPQGVGzPM8+2hSXUoIIX7TCQhAeRcEAKtHqABfPEbNOnxkDUc6gNICMcZf53zEiop4Pp9BolKpM5DY8uZVa/LBe6noq2IzA26320z5a0zj0USH9XINYEto0bf+tF4Ncs7VrOpVoF7E6MitXUIw84SYpgnatlXTfRaPf4SXvwKWANClQRttpXVYeoLBv9ck2K387G/BqVyQ9cbeSgmiHP+vHETN8/gr4VQ6mq/t/H/FqBMBtvkG65+gLdkrI4QA/wDlzpkal6Ku6QAAAABJRU5ErkJggg==";
}

function getGoodGuy() {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIABAAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOG0e0F7qMML7thOWCqWJA6gAc1xYurKlRlKO/Qxg0pJyV0WNfitYbry7aJonU/MvzYIIBBw3IPJBB9Kwy913G9aV09tr9b7aW7HRialColKlDlet1e68t/xL1npd9ot/Z3+6xm8mdG2RX0TMefZjj6111qHtoOm3a/VHMm4SjNK9mnbuU4dFvdQur2YfY4MzuSJr6IZyxOVyRkYI55rVQ5dE/6sZwjLW/8AWp//2Q==";
}

function getBadGuy() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAICAYAAADjoT9jAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABigAwAEAAAAAQAAAAgAAAAAce+PLAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KGV7hBwAAAPxJREFUKBVtUYsVgzAIBEeoulHtRHYJdaK2K7mC9O4Un8lTX4BwcHxiVn5+XFOXqFn6UxOvbd7zFPnXwDqxCKwumVeTpr8Ij3noAh6e+nN3iwU4Mu9wxt+SisjNkegil+1NkijJrbngLKBYYnnEc4gs5E16p+EBMwwdyjXrLlOFiMcFX4aWoBpSFARyMGEb86vbDl+cBdA1AjrIkK6n3fFejc8gMUsOTbCvDjtkHhuZFHOwsCpNwgRpUZJk/K5O3NkLtrYFEBFpMBs/xHt4w8bfCgL63ZYnN4IUCrjEBxYRUnPFISI+DgqCnP8bBak3PfW+6r3UOREp0QRPY38p+mVQ/Sf2pAAAAABJRU5ErkJggg==";
}

function getGuy() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA13RFWHRwYXJhbWV0ZXJzAHBpeGVsYXRlZCBtYXJpbyB3aXRoIG5vIGJhY2tncm91bmQKU3RlcHM6IDUwLCBTYW1wbGVyOiBEUE0rKyAyTSBLYXJyYXMsIENGRyBzY2FsZTogNy4wLCBTZWVkOiAyMTUyNjExOTY4LCBTaXplOiAxNngxNiwgTW9kZWwgaGFzaDogMzFlMzVjODBmYywgTW9kZWw6IHNkX3hsX2Jhc2VfMS4wLCBEZW5vaXNpbmcgc3RyZW5ndGg6IDAsIFZlcnNpb246IHYxLjYuMDKl5q4AAAFxSURBVHicJdLBlRtGEEPBD3ST633KSpk5Yx0kS0vOAD4ogzqUPr//uw8vFmtdUew0nXtVzbXO3HD/PHJ//fhvvz3afY6CIopbsrRgFXeoekcK9efuruVjAkAkVVJbggKHXhO3wePnjqbCuASMNOOkoqBSaJUIJJqFWhhJbotkGd9WLqHXh3usifTusb2yZaTaXZtGkVFTyVjSmBGSdqWh2AiqVqiWAAnZNAf5AjaWDTKosjyWBtnrqN6xxhoqIVKF7UViLNtFsKWN2Ka3k7xrLJNWzO44OvBXYYrluR8f74/tOcMXtzoBjLb7fsnPkSorlyrA44SqbVnYKk577evNGDWEttLLvX4d/X49f8ZfyW07r3l+PWhIlpROiU5VfWrIP777qXn7FZ2ehIp7k6Z7bscd8XZE41Op5qKXUHElYYTcx3Nf6+XwN48dUvc2b3grSj9cKSMn/B7v6/xaPaCprlTsK2mUPjC39Iu5NFFO/vwPHPEaQoHlWvYAAAAASUVORK5CYII=";
}

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
    const image = await fetchImage(
      aoconnect.createDataItemSigner(globalThis.arweaveWallet),
      promptText
    );
    return "data:image/png;base64," + image;
  } catch (e) {
    console.error("Failed to load image", e);
  }
}

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const prompts = {
  mainChars: ["mario", "godzilla", "monster"],
  enemyChars: ["frog", "", ""],
};

export class BootScene extends Phaser.Scene {
  // helpers
  private animationHelperInstance: AnimationHelper;

  // graphics
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "BootScene",
    });
  }

  async preload() {
    // set the background, create the loading and progress bar and init values
    // with the global data manager (= this.registry)
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();

    // pass value to change the loading bar fill
    this.load.on(
      "progress",
      function (value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88e453, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      "complete",
      function () {
        this.animationHelperInstance = new AnimationHelper(
          this,
          this.cache.json.get("animationJSON")
        );
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    this.load.pack("preload", "./assets/pack.json", "preload");

    this.load.image('mario', getGuy());
    // const mainCharImage = await fetchImg(getRandomItem(prompts.mainChars));
    // const enemyCharImage = await fetchImg(getRandomItem(prompts.enemyChars));
    // this.load.spritesheet("mario", getImageB64(), {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // });

    this.load.spritesheet("goomba", getBadGuy(), {
      frameWidth: 8,
      frameHeight: 8,
    });
  }

  update(): void {
    this.scene.start("MenuScene");
  }

  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
