// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uOffset;

varying vec3 vColor;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#pragma glslify: _normalize    = require(./glsl-utils/normalize.glsl)
#pragma glslify: easing    = require(glsl-easings/circular-in-out.glsl)


#define PI 3.14159265

void main(void) {

    vec3 axis = _normalize(aExtra.zxy);
    float theta = mix(-PI, PI, aExtra.y);
    float scale = clamp(uOffset * 2.0 - aExtra.x, 0.0, 1.0);

    vec3 pos = aVertexPosition * mix(1.0, 4.0, aExtra.x) * 0.025 * scale;
    pos.yz *= 0.5;

    pos = rotate(pos, axis, theta);

    vec3 posOffset = aPosOffset;
    // float fall = easing(clamp(uOffset * 2.0 - aExtra.y, 0.0, 1.0));
    // posOffset.y += (1.0 - fall) * aExtra.z * 1.5;
    pos += posOffset;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    float g = mix(0.9, 1.0, aExtra.z);
    vColor = vec3(g);
}