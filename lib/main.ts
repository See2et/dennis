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
  gameLoop();
  inputLoop();
};

const gameLoop = async () => {
  let xCoord = 0.0;
  let speed = 0.01;
  let score = 0;
  while (true) {
    draw(xCoord, speed, score);

    const outOfCoat = 0 > xCoord || xCoord > 1.0;
    const aroundOutOfCoat = (0.0 < xCoord && xCoord < paddleReach) ||
      (1 - paddleReach < xCoord && xCoord < 1.0);
    if (aroundOutOfCoat && entered) {
      speed *= -1;
      if (Math.abs(speed) <= 0.1 && speed > 0) speed += 0.0005;
      if (Math.abs(speed) <= 0.1 && speed < 0) speed -= 0.0005;
      score += 100;
    } else if (outOfCoat && !entered) {
      console.log("Game Over");
      console.log(
        `\nDo you wanna tweet the score? Click the above url\nhttps://twitter.com/intent/tweet?text=${
          encodeURIComponent(
            `my score is ${score}!\nthe last speed is ${speed}!\n#dennis the tennis game made by @.See2et, with deno.`,
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
  for await (const _ of Deno.stdin.readable) {
    entered = true;
    await sleep(750);
  }
};

const draw = (xCoord: number, speed: number, score: number) => {
  const ballLocation = Math.round(coatSize * xCoord);
  const space = [...new Array(coatSize)]
    .map((_, i) => {
      if (i === 0 || i === coatSize - 1) return "|";
      if (i === ballLocation && entered) {
        return "@";
      }
      return " ";
    }).join("");
  //  const buffer = `|${space}|`;
  console.log(`\x1B[1;1H
  score:${score}
  speed:${Math.abs(Math.round(speed * 10000) / 100)}
  ${space}
    `);
};
