// basic.vert

precision highp float;
attribute vec3 aVertexPosition;

uniform vec3 uPosOffset;
uniform vec3 uExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uHeightMap;
uniform vec3 uColors[5];
uniform vec2 uBound;
uniform float uSeedColor;
uniform float uHeight;

varying vec3 vColor;
varying vec3 vPosOffset;

#pragma glslify: map        = require(./glsl-utils/map.glsl)
#pragma glslify: snoise     = require(./glsl-utils/snoise.glsl)
#pragma glslify: rotate     = require(./glsl-utils/rotate.glsl)

#define PI 3.141592653589793

void main(void) {
    vec3 pos = aVertexPosition;
    pos.z *= mix(1.0, 2.0, uPosOffset.y) * 0.005;
    float theta = -smoothstep(0.5, 0.0, uPosOffset.x) * PI * 0.35 * uExtra.z;
    pos.yz = rotate(pos.yz, theta);
    
    pos.z += uPosOffset.x;


    float u = map(pos.x, -uBound.x, uBound.x, 0.0, 1.0);
    float v = map(uPosOffset.x, uBound.y, uBound.y + uBound.x * 2.0, 0.0, 1.0);
    float h = texture2D(uHeightMap, vec2(u, v)).r;

    pos.y += h * uHeight + uPosOffset.z * 0.01;
    
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);


    vPosOffset = uPosOffset.xxx / 10.0;

    // color
    float t = 0.05;
    float noiseColor = snoise(vec3(pos.zz, uSeedColor)) * .5 + .5;
    noiseColor += mix(-t, t, uExtra.z);

    vec3 color = vec3(1.0);
    if(noiseColor < 0.2) {
        color = uColors[0];
    } else if(noiseColor < 0.4) {
        color = uColors[1];
    } else if(noiseColor < 0.6) {
        color = uColors[2];
    } else if(noiseColor < 0.8) {
        color = uColors[3];
    } else {
        color = uColors[4];
    }

    if(uExtra.x > 0.85) {
        float n = snoise(vec3(pos.xz, 0.0) * 2.0) * .5 + .5;
        color += n;
    }

    vColor = color * mix(0.8, 1.0, uExtra.y);
}