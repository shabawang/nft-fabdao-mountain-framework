// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uHeightMap0;
uniform sampler2D uHeightMap1;
uniform vec2 uBound;
uniform float uHeight;

varying vec3 vColor;
varying vec3 vPosition;


#pragma glslify: map        = require(./glsl-utils/map.glsl)

void main(void) {
    vec3 pos = aVertexPosition;
    pos.z += 2.5;

    float u = map(pos.x, -uBound.x, uBound.x, 0.0, 1.0);
    float v = map(pos.z, uBound.y, uBound.y + uBound.x * 2.0, 0.0, 1.0);
    float h0 = texture2D(uHeightMap0, vec2(u, v)).r;
    float h1 = texture2D(uHeightMap1, vec2(u, v)).r;
    float h = max(h0, h1);

    pos.y += h * uHeight;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vColor = vec3(u, v, 0);
}