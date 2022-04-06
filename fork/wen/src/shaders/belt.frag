// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vColor;
varying vec3 vPosOffset;

uniform float uFogStrength;
uniform vec3 uFogColor;

void main(void) {
    float fog = smoothstep(0.5, 0.1, vPosOffset.y);
    fog = pow(fog, 2.0) * uFogStrength;
    vec3 color = mix(vColor, uFogColor, fog);

    gl_FragColor = vec4(color, 1.0);
}