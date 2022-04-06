// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uSeed;
uniform float uNoiseScale;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

#define LEVEL 8

float fbm(vec3 p) {
    float n = 0.0;
    for(int i=0; i<LEVEL; i++) {
        float mul = pow(2.0, float(i));
        n += snoise(p * mul) / mul;
    }

    return n;
}

void main(void) {
    float n = fbm(vec3(vTextureCoord, uSeed) * uNoiseScale * 1.0) * .5 + .5;

    float t = smoothstep(1.0, 0.0, vTextureCoord.y);
    t = pow(t, 2.0);
    n *= t;

    gl_FragColor = vec4(vec3(n), 1.0);
}