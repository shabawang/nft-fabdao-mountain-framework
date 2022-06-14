// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform vec3 uBgColor;

void main(void) {
    float a = smoothstep(0.2, 0.5, vTextureCoord.y) * 0.75;
    vec3 color = mix(uBgColor, vec3(0.0), a);
    gl_FragColor = vec4(color, 1.0);
}