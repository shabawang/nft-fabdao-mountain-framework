// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uSeed;
uniform float uNoiseScale;

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
    float noise = fbm(vec3(vTextureCoord, uSeed) * uNoiseScale);

    // gradient drop
    float d = smoothstep(0.2, 0.75, vTextureCoord.y);
    noise += pow(vTextureCoord.y, 2.0) * 1.2;
    d = pow(d, 3.0);
    noise *= d;


    gl_FragColor = vec4(vec3(noise), 1.0);
}