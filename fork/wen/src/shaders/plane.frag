// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vColor;
varying vec3 vPosOffset;
varying vec4 vWsPos;
uniform float uFogStrength;
uniform vec3 uFogColor;
uniform vec3 uCenter;
uniform vec3 uSeeds;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    float fog = smoothstep(0.25, 0.05, vPosOffset.y);
    fog = pow(fog, 2.0) * uFogStrength;
    vec3 color = mix(vColor, uFogColor, fog * 0.8);

    // float d = distance(vWsPos.xz, uCenter.xz);
    // d += snoise(vec3(vWsPos.xz, uSeeds.x) * 0.5) * 0.2;

    // float skipChance = snoise(vec3(uSeeds.y * 50.0, vWsPos.xz) * 10.0) * 0.5 + 0.8;

    // d = sin(d * 5.0);
    // if(d > skipChance) { 
    //     discard;
    // }


    gl_FragColor = vec4(color, 1.0);
}