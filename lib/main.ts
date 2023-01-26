import type { ConfigJson } from "../lib/interfaces.ts";
import { sleep } from "../lib/sleep.ts";
import configJson from "../config.json" assert { type: "json" };

const isConfigJson = (item: unknown): item is ConfigJson => {
  const value = item as ConfigJson;
  if (typeof value.coatSize !== "number") return false;
  if (typeof value.paddleReach !== "number") return false;
  return true;
};
const config = isConfigJson(configJson) ? configJson : null;
if (config === null) throw new Error("config.json inclueds invalid values.");
const coatSize = config.coatSize;
const paddleReach = config.paddleReach;
let entered = false;

export const main = () => {
  if (Deno.args[0] === "--version" || Deno.args[0] === "-V") {
    console.log("v1.0");
    Deno.exit();
  }
  console.clear();
  gameLoop();
  inputLoop();
};

const gameLoop = async () => {
  let xCoord = 0.0;
  let speed = 0.01;
  let score = 0;
  let combo = 0;
  while (true) {
    draw(xCoord, speed, score, combo);

    const outOfCoat = 0 > xCoord || xCoord > 1.0;
    const aroundOutOfCoat = (0.0 < xCoord && xCoord < paddleReach) ||
      (1 - paddleReach < xCoord && xCoord < 1.0);
    if (aroundOutOfCoat && entered) {
      speed *= -1;
      if (Math.abs(speed) <= 0.1 && speed > 0) speed += 0.0005;
      if (Math.abs(speed) <= 0.1 && speed < 0) speed -= 0.0005;
      score += 100;
      combo += 1;
    } else if (outOfCoat && !entered) {
      console.log("Game Over");
      console.log(
        `\nDo you wanna tweet the score? Click the above url\nhttps://twitter.com/intent/tweet?text=${
          encodeURIComponent(
            `my score is ${score}, combo is ${combo}!\nthe last speed is ${Math.abs(Math.round(speed * 10000) / 100)}!\n#dennis the tennis game made with deno.\nhttps://github.com/See2et/dennis`,
          )
        }`,
      );
      Deno.exit();
    }

    xCoord += speed;
    entered = false;
    score += Math.round(Math.abs(speed) * 100);

    await sleep(50);
  }
};

const inputLoop = async () => {
  await Deno.stdin.read(new Uint8Array(1));
  entered = true;
  for (;;) {
    await waitForInput(Date.now(), 850);
    entered = true;
  }
};

const waitForInput = async (current: number, ignoreTime: number) => {
  for (;;) {
    await Deno.stdin.read(new Uint8Array(1));
    if (Date.now() - current > ignoreTime) return;
  }
};

const draw = (xCoord: number, speed: number, score: number, combo: number) => {
  const ballLocation = Math.round(coatSize * xCoord);
  const space = [...new Array(coatSize)]
    .map((_, i) => {
      if (i === 0 || i === coatSize - 1) return "|";
      if (i === ballLocation) {
        return "@";
      }
      if ((speed > 0 && i === ballLocation-2)||(speed < 0 && i === ballLocation+2)) {
        return '='
      } else if (speed > 0 && i === ballLocation-3) {
        return "ε"
      } else if (speed < 0 && i === ballLocation+3) {
        return "з"
      }
      return " ";
    }).join("");
  //  const buffer = `|${space}|`;
  console.log(`\x1B[1;1H
  score:${score}
  combo:${combo}
  speed:${Math.abs(Math.round(speed * 10000) / 100)}
  ${space}
    `);
};
