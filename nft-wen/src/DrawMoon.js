import { Draw, Geom } from "alfrid";
import { random } from "./utils";
import Config from "./Config";
import vs from "shaders/moon.vert";
import fs from "shaders/moon.frag";

class DrawMoon extends Draw {
  constructor() {
    super();

    const s = 8;
    const { moonPosition, superMoon } = Config;
    const scale = superMoon ? 4 : 1;
    let y = superMoon ? -6 : 15;
    y += Config.maxHeight - 4;
    const fullMoon = superMoon ? 1 : random();
    const noiseDetail = superMoon ? 4 : 2;

    this.setMesh(Geom.plane(s, s, 1))
      .useProgram(vs, fs)
      .uniform("uColor", [1, 1, 0.86])
      .uniform("uSeed", random())
      .uniform("uFull", fullMoon)
      .uniform("uScale", scale)
      .uniform("uNoiseDetail", noiseDetail)
      .uniform("uTranslate", [moonPosition, y, -15]);
  }
}

export default DrawMoon;
