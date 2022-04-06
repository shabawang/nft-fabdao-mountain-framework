import {
  GL,
  FrameBuffer,
  CameraOrtho,
  Object3D,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import Config from "./Config";
import Assets from "./Assets";
import Scheduler from "scheduling";
import { getColorTheme } from "./utils/ColorTheme";
import { rgb, rgba, random, saveImage, getDateString } from "./utils";
import { getStartEnd } from "./utils/heightUtils";

import generateHeightMap from "./utils/generateHeightMap";
import getHighlightMap from "./utils/getHighlightMap";
import generateHexTexture from "./generateHexTexture";

// draw calls
import DrawFrame from "./DrawFrame";
import DrawStrokes from "./DrawStrokes";
import DrawCombine from "./DrawCombine";
import DrawCompose from "./DrawCompose";
import DrawBelts from "./DrawBelts";
import DrawSnow from "./DrawSnow";
import DrawMountain from "./DrawMountain";

let hasSaved = false;
let hasRendered = false;
let canSave = false;

let screenOffset;

class SceneApp extends Scene {
  constructor() {
    super();

    this.stage = 0;

    let r = random(0.5, 0.7) * (random() > 0.5 ? 1 : -1);
    this.orbitalControl.rx.setTo(0.8);
    this.orbitalControl.ry.setTo(r);
    this.orbitalControl.radius.setTo(1.5);
    this.orbitalControl.lock();

    // force update
    this.orbitalControl.update();
    this.orbitalControl._updateCamera();

    this.updateFov();

    // camera ortho
    const { width: w, height: h } = GL;
    this.cameraOrtho = new CameraOrtho(-w / 2, w / 2, h / 2, -h / 2);
    this.cameraOrtho.lookAt([0, 0, 5], [0, 0, 0]);

    r = 1.5 * 2;
    const { mountainHeight: yRange } = Config;
    const y = -random(0.4, 0.8) * yRange;
    this.containerMountain = new Object3D();
    this.containerMountain.z = -r;
    this.containerMountain.y = y;

    this.containerDecoration = new Object3D();
    this.containerDecoration.z = -r;
    this.containerDecoration.y = y;

    const ryRange = 0.05;
    this.rotation0 = random(-ryRange, ryRange);
    this.rotation1 = random(-ryRange, ryRange);

    // seed
    this._seedPixelated = random();
    this.resize();
    this._generateMountain();

    setTimeout(() => {
      canSave = true;
    }, 1000 / 60);
  }

  _generateMountain() {
    // draw mountain bg
    GL.disable(GL.CULL_FACE);

    // first draw mountain to get startY / endY
    this.drawBgMountain();

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

    if (!NY_mountainIndex) {
      GL.enable(GL.CULL_FACE);
      screenOffset = 0;
      this.stage = 1;
      return;
    }

    window.top.postMessage(message, "*");

    window.onmessage = (e) => {
      let eventName = e.data.event;
      let args = e.data.args;

      if (eventName == "DrawMountainsWithOffset") {
        screenOffset = args.offset * 2;

        this.drawBgMountain();
        GL.enable(GL.CULL_FACE);

        this.stage = 1;
      }
    };
  }

  drawBgMountain() {
    const bg = Config.bgColor.map((v) => v / 255);
    GL.setMatrices(this.camera);

    this._fboRenderBg.bind();
    GL.viewport(0, -screenOffset, GL.width, GL.height);
    GL.clear(0, 0, 0, 0);
    this.containerMountain.rotationY = this.rotation0;
    GL.setModelMatrix(this.containerMountain.matrix);
    this._drawMountain.uniform("uBgColor", bg).draw();
    this._fboRenderBg.unbind();
  }

  updateFov() {
    const RAD = Math.PI / 180;
    this.camera.setPerspective(Config.fov * RAD, GL.aspectRatio, 0.1, 100);
  }

  _initTextures() {
    this.resize();
    screenOffset = 0;

    // height maps
    this._textureHeight0 = generateHeightMap(2048);
    this._textureHeight1 = generateHeightMap(2048);

    // color lookup table
    this._textureLookup = Assets.get(`lookup${Config.colorTheme}`);
    this._textureLookup.minFilter = this._textureLookup.magFilter = GL.NEAREST;

    // rendering fbos
    const { width, height } = GL;
    this._fboRender = new FrameBuffer(width, height, {
      minFilter: GL.LINEAR,
      magFilter: GL.LINEAR,
    });
    this._fboRender0 = new FrameBuffer(width, height);
    this._fboRender1 = new FrameBuffer(width, height);
    this._fboRenderBg = new FrameBuffer(width, height);
    this._fboRenderDecoration = new FrameBuffer(width, height);
    this._fboOutput = new FrameBuffer(width, height);

    this._fboRender0.bind();
    GL.clear(0, 0, 0, 0);
    this._fboRender0.unbind();
    this._fboRender1.bind();
    GL.clear(0, 0, 0, 0);
    this._fboRender1.unbind();

    const bg = Config.bgColor.map((v) => v / 255);
    this._fboOutput.bind();
    GL.clear(bg[0], bg[1], bg[2], 1);
    this._fboOutput.unbind();

    const colors = [[255, 255, 255]];
    this._textureHex = generateHexTexture(width, height, colors, 0);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._drawSnow = new DrawSnow();

    this._drawFrame = new DrawFrame();
    this._drawCombine = new DrawCombine();
    this._drawCompose = new DrawCompose();

    const colors = getColorTheme();
    let colorUniforms = colors.reduce((a, b) => {
      a = a.concat(b);
      return a;
    }, []);
    colorUniforms = colorUniforms.map((v) => v / 255);

    const fog = Config.fogColor.map((v) => v / 255);
    this._drawStrokes = new DrawStrokes();

    this._drawBelts0 = new DrawBelts()
      .bindTexture("uHeightMap", this._textureHeight0, 0)
      .uniform("uSeedColor", random(100))
      .uniform("uBound", [5, 0])
      .uniform("uHeight", Config.mountainHeight)
      .uniform("uColors", "vec3", colorUniforms)
      .uniform("uFogStrength", Config.fogStrength)
      .uniform("uFogColor", fog);

    this._drawBelts1 = new DrawBelts()
      .bindTexture("uHeightMap", this._textureHeight1, 0)
      .uniform("uSeedColor", random(100))
      .uniform("uBound", [5, 0])
      .uniform("uHeight", Config.mountainHeight)
      .uniform("uColors", "vec3", colorUniforms)
      .uniform("uFogStrength", Config.fogStrength)
      .uniform("uFogColor", fog);

    this._drawMountain = new DrawMountain()
      .uniform("uBound", [5, 0])
      .uniform("uHeight", Config.mountainHeight)
      .bindTexture("uHeightMap0", this._textureHeight0, 0)
      .bindTexture("uHeightMap1", this._textureHeight1, 1);
  }

  update() {
    if (this.stage === 0) {
      return;
    }
    // if (hasRendered && Config.stopAfterRender) return;
    if (this._drawBelts0.hasFinished) {
      this.stage = 2;
      return;
    }

    const bg = Config.bgColor.map((v) => v / 255);
    GL.setMatrices(this.camera);

    // draw mountains
    this._fboRender0.bind();
    GL.viewport(0, -screenOffset, GL.width, GL.height);
    this.containerMountain.rotationY = this.rotation0;
    GL.setModelMatrix(this.containerMountain.matrix);
    this._drawBelts0.draw();
    this._fboRender0.unbind();

    this._fboRender1.bind();
    GL.viewport(0, -screenOffset, GL.width, GL.height);
    this.containerMountain.rotationY = this.rotation1;
    GL.setModelMatrix(this.containerMountain.matrix);
    this._drawBelts1.draw();
    this._fboRender1.unbind();

    this._fboRenderDecoration.bind();
    GL.clear(0, 0, 0, 0);
    GL.setModelMatrix(this.containerDecoration.matrix);
    this._drawSnow.uniform("uOffset", this._drawBelts0.percent).draw();
    this._fboRenderDecoration.unbind();

    // combine
    this._fboRender.bind();
    GL.clear(bg[0], bg[1], bg[2], 1);
    this._drawCombine
      .bindTexture("uMap0", this._fboRender0.texture, 0)
      .bindTexture("uMap1", this._fboRender1.texture, 1)
      .bindTexture("uDecorationMap", this._fboRenderDecoration.texture, 2)
      .bindTexture("uBackgroundMap", this._fboRenderBg.texture, 3)
      .uniform("uRatio", GL.aspectRatio)
      .uniform("uBgColor", bg)
      .uniform("uWithSnow", Config.withSnow ? 1.0 : 0.0)
      .uniform("uShade", Config.mountainShade ? 1.0 : 0.0)
      .draw();

    Config.withFrame &&
      this._drawFrame
        .uniform("uWidth", 0.03)
        .uniform("uColor", bg)
        .uniform("uRatio", GL.aspectRatio)
        .draw();
    this._fboRender.unbind();
  }

  render() {
    if (this.stage === 0) {
      return;
    }

    if (hasRendered) return;
    let g = 1;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);
    GL.disable(GL.DEPTH_TEST);

    if (this.stage === 1) {
      this._textureHighlight = getHighlightMap(this._fboRender, 1.675);
      this._drawCompose
        .bindTexture("uMap", this._fboRender.texture, 0)
        .bindTexture("uHighlightMap", this._textureHighlight, 1)
        .bindTexture("uLookupMap", this._textureLookup, 2)
        .bindTexture("uHexMap", this._textureHex, 3)
        .uniform("uRatio", GL.aspectRatio)
        .uniform("uSeedPixelated", this._seedPixelated)
        .uniform("uStretchLine", Config.withStretchLine ? 1.0 : 0.0)
        .uniform("uPixelated", Config.pixelated ? 1.0 : 0.0)
        .uniform("uHighlightStrength", 1)
        .draw();
      // console.log("Drawing stage 0", this._drawBelts0.percent);
    } else if (this.stage === 2) {
      this._fboOutput.bind();
      GL.setMatrices(this.cameraOrtho);
      this._drawStrokes
        .bindTexture("uMap", this._fboRender.texture, 0)
        .uniform("uViewport", [GL.width, GL.height])
        .draw();
      this._fboOutput.unbind();

      // this._textureHighlight = getHighlightMap(this._fboOutput, 1.475);
      this._textureHighlight = getHighlightMap(this._fboOutput, 1.275);
      this._drawCompose
        .bindTexture("uMap", this._fboOutput.texture, 0)
        .bindTexture("uHighlightMap", this._textureHighlight, 1)
        .bindTexture("uLookupMap", this._textureLookup, 2)
        .bindTexture("uHexMap", this._textureHex, 3)
        .uniform("uRatio", GL.aspectRatio)
        .uniform("uSeedPixelated", this._seedPixelated)
        .uniform("uStretchLine", Config.withStretchLine ? 1.0 : 0.0)
        .uniform("uPixelated", Config.pixelated ? 1.0 : 0.0)
        .uniform("uHighlightStrength", 1)
        .draw();
    }

    if (this._drawStrokes.percent >= 1) {
      hasRendered = true;
      if (Config.autoSave) {
        saveImage(GL.canvas, `${getDateString()}`);
      }
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    const canvasScale = 2;
    let s = Math.max(canvasScale, devicePixelRatio);
    // s = 1;
    const width = w;
    const height = h;

    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
    hasRendered = false;
  }
}

export default SceneApp;
