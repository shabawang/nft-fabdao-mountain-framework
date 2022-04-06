import { GL, Draw, Geom, ShaderLibs, FrameBuffer } from "alfrid";
import { random } from "./";
import fs from "shaders/height.frag";

const generateHeight = (mSize, mNoiseScale = 1) => {
  const fbo = new FrameBuffer(mSize, mSize, {
    type: GL.FLOAT,
  });

  new Draw()
    .setMesh(Geom.bigTriangle())
    .useProgram(ShaderLibs.bigTriangleVert, fs)
    .setClearColor(0, 0, 0, 1)
    .bindFrameBuffer(fbo)
    .uniform("uSeed", random())
    .uniform("uNoiseScale", mNoiseScale)
    .draw();

  return fbo.texture;
};

export default generateHeight;
