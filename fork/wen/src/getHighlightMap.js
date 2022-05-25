import { GL, Draw, Geom, ShaderLibs, FrameBuffer } from "alfrid";
import fs from "shaders/highlight.frag";

const getHighlightMap = (mFbo, mThreshold = 1.5) => {
  const fbo = new FrameBuffer(mFbo.width, mFbo.height, {
    type: GL.FLOAT,
  });

  new Draw()
    .setMesh(Geom.bigTriangle())
    .useProgram(ShaderLibs.bigTriangleVert, fs)
    .setClearColor(0, 0, 0, 1)
    .bindFrameBuffer(fbo)
    .bindTexture("texture", mFbo.texture, 0)
    .uniform("uThreshold", mThreshold)
    .draw();

  return fbo.texture;
};

export default getHighlightMap;
