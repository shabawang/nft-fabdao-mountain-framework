// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform vec3 uColor;
uniform float uSeed;
uniform float uFull;
uniform float uNoiseDetail;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

#define LEVEL 10

float fbm(vec3 p) {
    float n = 0.0;

    for(int i=0; i<LEVEL; i++) {
        float mul = pow(2.0, float(i));
        n += snoise(p * mul) / mul;
        p.xy = rotate(p.xy, 1.0);
    }

    return n * .5 + .5;
}

void main(void) {
    float d = distance(vTextureCoord, vec2(.5));
    if(d > .5) {
        discard;
    }

    float r = 0.02;
    // float r = 0.1;
    d = distance(vTextureCoord, vec2(0.5-r, 0.5+r));
    if(d < 0.5-r && uFull < 0.5) {
        discard;
    }

    float g = fbm(vec3(vTextureCoord, uSeed) * uNoiseDetail) * .5 + .5;
    g = mix(g, 1.0, .5);

    gl_FragColor = vec4(uColor * g, 1.0);
}