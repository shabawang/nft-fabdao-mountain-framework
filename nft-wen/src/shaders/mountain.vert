// basic.vert

precision highp float;
attribute vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uHeightMap;
uniform float uMaxHeight;
uniform float uPlaneSize;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    vec3 pos = aVertexPosition;
    vec2 uv = pos.xz / uPlaneSize * .5 + .5;
    uv.y = 1.0 - uv.y;

    float h = texture2D(uHeightMap, uv).r;
    pos.y = h * uMaxHeight - 0.1;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = uv;
}