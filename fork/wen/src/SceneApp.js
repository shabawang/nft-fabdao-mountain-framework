import {
  GL,
  FrameBuffer,
  Object3D,
  CameraOrtho,
  DrawCopy,
  Scene,
} from "alfrid";
import Assets from "./Assets";
import resize from "./utils/resize";
import { getColorTheme } from "./utils/ColorTheme";
import { random, saveImage, getDateString } from "./utils";
import { getStartEnd } from "./utils/heightUtils";
import generateHeightMap from "./generateHeightMap";
import generateHexTexture from "./generateHexTexture";
import getHighlightMap from "./getHighlightMap";

// draw calls
import DrawPlane from "./DrawPlane";
import DrawFrame from "./DrawFrame";
import DrawCombine from "./DrawCombine";
import DrawCompose from "./DrawCompose";
import DrawStrokes from "./DrawStrokes";
import DrawMountain from "./DrawMountain";
import DrawSnow from "./DrawSnow";
import DrawPetals from "./DrawPetals";
import DrawMoon from "./DrawMoon";
import DrawStars from "./DrawStars";
import DrawShootingStar from "./DrawShootingStar";

// interactions
import DrawMonolith from "./DrawMonolith";
import DrawFirework from "./DrawFirework";
import DrawMilkyway from "./DrawMilkyway";

import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    this.orbitalControl.rx.setTo(0.1);
    this.orbitalControl.radius.setTo(10);
    this.container = new Object3D();
    this.container.y = -7;
    this.container.z = -5;
    this.camera.setPerspective((75 * Math.PI) / 180, GL.aspectRatio, 0.1, 100);

    // camera ortho
    const { width: w, height: h } = GL;
    this.cameraOrtho = new CameraOrtho(-w / 2, w / 2, h / 2, -h / 2);
    this.cameraOrtho.lookAt([0, 0, 5], [0, 0, 0]);

    // seeds
    this._seedPixelated = random();
    this._seedStretch = random();

    this._generateMountain();
    this._sendCoordinate();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _sendCoordinate() {
    // get left Y / right Y
    const { startY, endY } = getStartEnd(this._fboRenderBg);
    let search = new URLSearchParams(window.location.search);
    let NY_mountainIndex = search.get("mountainIndex");

    let message = {
      event: "ready",
      args: {
        mountainIndex: NY_mountainIndex,
        startY,
        endY,
      },
    };
    window.top.postMessage(message, "*");

    window.onmessage = (e) => {
      let eventName = e.data.event;
      let args = e.data.args;

      if (eventName == "DrawMountainsWithOffset") {
        // to render
      }
    };
  }

  _initTextures() {
    this.resize();
    const { width, height } = GL;
    this._textureHeight = generateHeightMap();

    const fboSize = 2048;
    this._fboRender = new FrameBuffer(fboSize, fboSize);
    this._fboCombined = new FrameBuffer(fboSize, fboSize);
    this._fboRenderBg = new FrameBuffer(width, height);
    this._fboOutput = new FrameBuffer(fboSize, fboSize);
    this._fboDecoration = new FrameBuffer(fboSize, fboSize);
    this._fboDecoration2 = new FrameBuffer(fboSize, fboSize);

    const colors = [[255, 255, 255]];
    this._textureHex = generateHexTexture(width, height, colors, 0);

    // color lookup table
    this._textureLookup = Assets.get(`lookup${Config.colorTheme}`);
    this._textureLookup.minFilter = this._textureLookup.magFilter = GL.NEAREST;
  }

  _initViews() {
    const { fogColor, fogStrength, moonPosition } = Config;

    this._dCopy = new DrawCopy();

    const colors = getColorTheme();
    let colorUniforms = colors.reduce((a, b) => {
      a = a.concat(b);
      return a;
    }, []);
    colorUniforms = colorUniforms.map((v) => v / 255);
    const fog = fogColor.map((v) => v / 255);

    this._drawPlane = new DrawPlane()
      .uniform("uColors", "vec3", colorUniforms)
      .uniform("uMoonPos", moonPosition)
      .uniform("uFogStrength", fogStrength)
      .uniform("uFogColor", fog);

    this._drawFrame = new DrawFrame();
    this._drawCombine = new DrawCombine();
    this._drawCompose = new DrawCompose();
    this._drawStrokes = new DrawStrokes();
    this._drawMountain = new DrawMountain();
    this._drawMoon = new DrawMoon();
    this._drawSnow = new DrawSnow();
    this._drawShootingStar = new DrawShootingStar();
    this._drawStars = new DrawStars();
    // interactions
    this._drawPetals = new DrawPetals()
      .uniform("uColors", "vec3", colorUniforms)
      .uniform("uScale", 1 / Config.pixelRatio);
    this._drawMilkyway = new DrawMilkyway();
    this._drawMonolith = new DrawMonolith().uniform(
      "uColors",
      "vec3",
      colorUniforms
    );
    this._drawFirework = new DrawFirework().uniform(
      "uColors",
      "vec3",
      colorUniforms
    );
  }

  _generateMountain() {
    const { maxHeight } = Config;
    GL.setMatrices(this.camera);
    GL.setModelMatrix(this.container.matrix);

    const bg = Config.bgColor.map((v) => v / 255);

    const dir = random() > 0.5 ? 1 : -1;
    this._fboRender.bind();
    GL.clear(0, 0, 0, 0);
    this._drawPlane
      .bindTexture("uHeightMap", this._textureHeight, 0)
      .uniform("uMaxHeight", maxHeight)
      .uniform("uDir", dir)
      .draw();

    // interaction
    Config.withMonolith && this._drawMonolith.uniform("uDir", dir).draw();

    this._fboRender.unbind();

    this._fboDecoration.bind();
    GL.clear(0, 0, 0, 0);
    GL.setModelMatrix(this.container.matrix);

    Config.withMilkyway && this._drawMilkyway.draw();
    Config.withFireworks && this._drawFirework.draw();
    Config.withMoon && this._drawMoon.draw();
    Config.withShooringStar && this._drawShootingStar.draw();

    this._fboDecoration.unbind();

    // overlay decoration
    this._fboDecoration2.bind();
    GL.clear(0, 0, 0, 0);
    GL.setModelMatrix(this.container.matrix);
    this._drawStars.draw();
    Config.withSnow && this._drawSnow.draw();

    this._drawPetals
      .uniform("uViewport", [GL.width, GL.height])
      .uniform("uRatio", GL.aspectRatio)
      .bindTexture("uLookupMap", this._textureLookup, 0)
      .draw();
    this._fboDecoration2.unbind();

    GL.disable(GL.CULL_FACE);
    this._fboRenderBg.bind();
    GL.clear(0, 0, 0, 0);
    GL.setModelMatrix(this.container.matrix);
    this._drawMountain
      .bindTexture("uHeightMap", this._textureHeight, 0)
      .uniform("uMaxHeight", maxHeight)
      .uniform("uBgColor", bg)
      .draw();

    this._fboRenderBg.unbind();
    GL.enable(GL.CULL_FACE);

    GL.disable(GL.DEPTH_TEST);

    this._fboCombined.bind();
    GL.clear(bg[0], bg[1], bg[2], 1);

    this._drawCombine
      .bindTexture("uMap", this._fboRender.texture, 0)
      .bindTexture("uDecorationMap", this._fboDecoration.texture, 1)
      .bindTexture("uBackgroundMap", this._fboRenderBg.texture, 2)
      .uniform("uRatio", GL.aspectRatio)
      .uniform("uBgColor", bg)
      .uniform("uWithSnow", 1.0)
      .uniform("uShade", Config.mountainShade ? 1.0 : 0.0)
      .draw();

    Config.withFrame &&
      this._drawFrame
        .uniform("uWidth", 0.03)
        .uniform("uColor", bg)
        .uniform("uRatio", GL.aspectRatio)
        .draw();
    this._fboCombined.unbind();

    this._fboOutput.bind();
    GL.clear(bg[0], bg[1], bg[2], 1);

    GL.setMatrices(this.cameraOrtho);
    while (!this._drawStrokes.finished) {
      this._drawStrokes
        .bindTexture("uMap", this._fboCombined.texture, 0)
        .uniform("uViewport", [GL.width, GL.height])
        .draw();
    }
    this._fboOutput.unbind();
    this._textureHighlight = getHighlightMap(this._fboOutput, 1.275);
  }

  update() {}

  render() {
    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }

    if (canSave) {
      return;
    }

    const bg = Config.bgColor.map((v) => v / 255);
    GL.clear(bg[0], bg[1], bg[2], 1);

    GL.setMatrices(this.camera);
    GL.setModelMatrix(this.container.matrix);
    this._drawCompose
      .bindTexture("uMap", this._fboOutput.texture, 0)
      .bindTexture("uHighlightMap", this._textureHighlight, 1)
      .bindTexture("uLookupMap", this._textureLookup, 2)
      .bindTexture("uHexMap", this._textureHex, 3)
      .bindTexture("uDecorationMap", this._fboDecoration2.texture, 4)
      .uniform("uRatio", GL.aspectRatio)
      .uniform("uSeedPixelated", this._seedPixelated)
      .uniform("uSeedStretch", this._seedStretch)
      .uniform("uStretchLine", Config.withStretchLine ? 1.0 : 0.0)
      .uniform("uPixelated", Config.pixelated ? 1.0 : 0.0)
      .uniform("uHighlightStrength", 1)
      .draw();

    // this._dCopy.draw(this._fboRenderBg.texture);
    // this._dCopy.draw(this._fboOutput.texture);
    // this._dCopy.draw(this._fboRender.texture);
    // this._dCopy.draw(this._fboDecoration.texture);
  }

  resize() {
    let s = Config.pixelRatio;
    const width = 1080;
    const height = 1920;
    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
