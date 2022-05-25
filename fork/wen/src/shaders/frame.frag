// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform float uWidth;
uniform float uRatio;
uniform float uSeed;
uniform vec3 uColor;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)

void main(void) {
    vec2 t = vTextureCoord;
    t.y /= uRatio;
    vec3 n = curlNoise(vec3(t, uSeed) * 3.0);
    vec2 uv = vTextureCoord + n.xy * 0.0015;

    uv = abs(uv - 0.5);
    float a0 = smoothstep(0.5 - uWidth, 0.5 - uWidth + 0.001, uv.x); 

    float w = uWidth * uRatio;
    float a1 = smoothstep(0.5 - w, 0.5 - w + 0.001 * uRatio, uv.y); 

    float a = max(a0,a1);
    gl_FragColor = vec4(uColor * 1.05, a);
} 