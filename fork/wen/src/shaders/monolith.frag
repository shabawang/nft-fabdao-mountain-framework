// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vExtra;

uniform vec3 uColors[5];

#pragma glslify: diffuse    = require(./glsl-utils/diffuse.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#define LIGHT vec3(0.9, 1.0, 1.0)

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    float n = snoise(vPosition * 20.0) * .5 + .5;
    n = clamp(n, 0.0, 1.0);

    float g = diffuse(vNormal, LIGHT, 0.2);


    float noiseColor = vExtra.y;
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
    color = mix(color, vec3(1.0), .65);
    gl_FragColor = vec4(vec3(g) * mix(0.8, 1.2, n) * color, 1.0);
}