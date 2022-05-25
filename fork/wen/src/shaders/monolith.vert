// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uDir;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec3 vPosition;
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

#define PI 3.14159265

void main(void) {
    float theta = aExtra.x * PI * 2.0;
    vec3 pos = aVertexPosition;
    float s = step(aVertexPosition.y, 0.0);

    float t = smoothstep(0.1, 1.0, aExtra.y);

    pos.xz *= mix(1.0, mix(1.0, 2.0, t), s);

    pos.y += 0.8;
    pos.y *= mix(5.0, 6.0, aPosOffset.y);
    pos.xz *= 0.8;
    pos.xy = rotate(pos.xy, (aExtra.z - 0.5)* 0.5);
    pos.xz = rotate(pos.xz, theta);

    pos *= mix(0.3, 0.5, aExtra.z);

    pos.z -= 1.0;
    pos.y += 1.5;
    pos.xz += aPosOffset.xz;
    pos.z -= 1.0;
    pos.x += 1.2 * uDir;

    t = 0.6;
    pos.xz = rotate(pos.xz, t * uDir);
    

    vec4 wsPos = uModelMatrix * vec4(pos, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * wsPos;
    vPosition = wsPos.xyz;
    vTextureCoord = aTextureCoord;
    vec3 N = aNormal;
    N.xy = rotate(N.xy, (aExtra.z - 0.5)* 0.5);
    N.xz = rotate(N.xz, theta + t * uDir);
    vNormal = N;

    vExtra = aExtra;
}