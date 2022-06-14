// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vExtra;

void main(void) {
    vec3 pos = aVertexPosition * mix(1.0, 5.0, aExtra.x) * 0.04;
    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vExtra = aExtra;
}