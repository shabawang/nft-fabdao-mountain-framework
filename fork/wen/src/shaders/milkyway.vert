// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;
attribute vec4 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uRotation;
uniform float uRange;

varying vec2 vTextureCoord;
varying vec4 vExtra;
varying vec3 vPosOffset;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#define PI 3.141592653

void main(void) {
    float scale = mix(0.05, 0.2, aPosOffset.z);
    if(aExtra.w > 0.5) scale = mix(0.1, 0.4, aPosOffset.z) * 0.1;
    vec3 pos = aVertexPosition * scale;

    pos.xy = rotate(pos.xy, aExtra.x * PI * 2.0);
    pos.xy += aPosOffset.xy;
    pos.y -= sin((aPosOffset.x)/8.0) * 4.0;
    pos.xy = rotate(pos.xy, uRotation);

    pos.y += 15.0;
    pos.z -= 15.0;
    

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vExtra = aExtra;
    vPosOffset = aPosOffset;
}