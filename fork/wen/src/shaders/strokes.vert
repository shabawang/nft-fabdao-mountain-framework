// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uViewport;
uniform float uSeed;
uniform float uOffsetX;
uniform float uOffsetY;

varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec2 vPosition;
varying vec3 vExtra;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: _normalize    = require(./glsl-utils/normalize.glsl)
#define PI 3.14159265


void main(void) {
    vec2 posOffset = aPosOffset.xy;
    posOffset.x += uOffsetX;
    posOffset.y += uOffsetY;

    float n = snoise(vec3(aPosOffset.xy, uSeed) * 0.002);

    vec3 pos = aVertexPosition * mix(0.8, 1.0, aExtra.x);

    // rotation
    vec2 center = vec2(0.0);
    float distToCenter = distance(posOffset.xy, center);
    vec2 dir = normalize(posOffset.xy - center);
    float rotCenter = -atan(dir.y, dir.x);

    // float p = smoothstep(50.0, 250.0, distToCenter);

    // float rot = mix(rotCenter, n*PI, p);
    pos.xy = rotate(pos.xy, n*PI);
    

    pos.xy += posOffset;
    vPosition = posOffset;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vUV = posOffset.xy / ( uViewport * 0.5) * .5 + .5;
    vExtra = aExtra;
}