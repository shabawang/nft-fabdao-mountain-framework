// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec2 vPosition;
varying vec3 vExtra;

uniform float uSeed;
uniform sampler2D uMap;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    vec3 color = texture2D(uMap, vUV).rgb;
    color = mix(color, vec3(0.0), .15  * vExtra.y);

    float a = mix(0.1, 0.25, vExtra.z) * 0.75;

    gl_FragColor = vec4(color, a);
}