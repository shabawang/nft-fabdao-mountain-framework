// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uOffset;
uniform float uScale;
uniform vec2 uViewport;

varying vec3 vColor;
varying vec3 vExtra;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#pragma glslify: _normalize    = require(./glsl-utils/normalize.glsl)
#pragma glslify: easing    = require(glsl-easings/circular-in-out.glsl)


#define PI 3.14159265

const float radius = 0.15;
float particleSize(vec4 screenPos, mat4 mtxProj, vec2 viewport, float radius) {
	return viewport.y * mtxProj[1][1] * radius / screenPos.w;
}


void main(void) {
    float scale = clamp(uOffset * 2.0 - aNormal.x, 0.0, 1.0);
    vec3 pos = aVertexPosition;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    // gl_PointSize = mix(0.5, 2.0, aNormal.y) * scale * 30.0;
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport, radius) * mix(0.5, 2.0, aNormal.y) * uScale;

    vExtra = aNormal;
}