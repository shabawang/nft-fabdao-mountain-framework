// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uColors[5];
varying vec3 vColor;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#define PI 3.141592653

void main(void) {
    vec3 pos = aVertexPosition;
    pos *= mix(0.5, 1.0, aExtra.z);
    pos.x += mix(0.1, 0.5, aExtra.x);
    pos.x *= 16.0;
    pos.xy = rotate(pos.xy, aExtra.y * PI * 2.0);

    pos *= aPosOffset.z;

    pos.y += 15.0;
    pos.z -= 15.0;
    pos.xy += aPosOffset.xy;
    

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    float noiseColor = mod(aExtra.x + aExtra.y + aExtra.z, 1.0);
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
    vColor = mix(color, vec3(1.0), .7);
    // vColor = color;
}