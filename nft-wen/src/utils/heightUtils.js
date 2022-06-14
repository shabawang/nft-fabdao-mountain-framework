import { GL } from "alfrid";
export const getStartEnd = (fbo) => {
  const { gl } = GL;

  const { width, height } = fbo;
  const pixelsLeft = new Uint8Array(height * 4);
  const pixelsRight = new Uint8Array(height * 4);
  fbo.bind();
  gl.readPixels(
    0,
    0,
    1,
    gl.drawingBufferHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixelsLeft
  );

  gl.readPixels(
    width - 1,
    0,
    1,
    gl.drawingBufferHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixelsRight
  );

  let startY = height;
  for (let i = height - 1; i >= 0; i--) {
    const a = pixelsLeft[i * 4 + 3];
    if (a > 0) {
      startY = i;
      break;
    }
  }
  startY = height - startY;

  let endY = height;
  for (let i = height - 1; i >= 0; i--) {
    const a = pixelsRight[i * 4 + 3];
    if (a > 0) {
      endY = i;
      break;
    }
  }
  endY = height - endY;

  fbo.unbind();

  return { startY, endY };
};
