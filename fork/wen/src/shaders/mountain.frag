// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vColor;

uniform vec3 uBgColor;
uniform vec3 uColor;
uniform float uOpacity;

void main(void) {
    float t = smoothstep(0.0, 0.5, vColor.y);
    // t = mix(0.5, 1.0, t);
    vec3 color = mix(vec3(0.0), uBgColor, t);

    gl_FragColor = vec4(color, 1.0);
}