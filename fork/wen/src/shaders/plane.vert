// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uHeightMap;
uniform float uMaxHeight;
uniform float uPlaneSize;
uniform float uDir;
uniform float uMoonPos;

uniform vec3 uColors[5];

varying vec2 vTextureCoord;
varying vec3 vColor;
varying vec3 vPosOffset;
varying vec4 vWsPos;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    vec3 pos = aVertexPosition;
    pos.z *= mix(0.5, 2.0, aExtra.z);
    float offset = uPlaneSize * uDir * mix(0.5, 1.0, aExtra.x);
    pos.x += offset;
    pos.xz = rotate(pos.xz, aPosOffset.x * uDir);
    pos.x -= offset;
    
    pos.z += aPosOffset.z;
    vec2 uv = pos.xz / uPlaneSize * .5 + .5;
    uv.y = 1.0 - uv.y;


    float h = texture2D(uHeightMap, uv).r;
    pos.y = h * uMaxHeight;
    pos.y += aExtra.y * 0.01;

    vWsPos = uModelMatrix * vec4(pos, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * vWsPos;
    vTextureCoord = uv;

    vPosOffset = (vWsPos.zzz / uPlaneSize * .5 + .5);

    // color
    float noiseColor = aExtra.x;
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

    if(aExtra.x > 0.9) {
        float n = snoise(vec3(pos.xz, 0.0) * 2.0) * .5 + .5;
        color += n * 0.8;
    }


    // reflection
    float n = snoise(vec3(pos.xz, 0.0) * 25.0) * .5 + .5;

    float t = abs(vWsPos.x - uMoonPos);
    t = smoothstep(2.0, 0.0, t); // shooting start
    // t = smoothstep(3.0, 1.0, t);
    t = pow(t, 2.5);
    n *= t;
    color += n * 0.9;


    vColor = color * mix(0.8, 1.0, aExtra.y);
}