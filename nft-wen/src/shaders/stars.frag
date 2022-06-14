// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vExtra;

void main(void) {
    float g = pow(vExtra.y, 2.0);
    g = mix(0.98, 1.0, g);
    gl_FragColor = vec4(vec3(g), 1.0);
}