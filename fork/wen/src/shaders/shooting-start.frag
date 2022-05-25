// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vExtra;
uniform vec3 uColor;

void main(void) {
    vec2 uv = gl_PointCoord;
    uv = (uv - 0.5) * 2.0 + 0.5;
    if(distance(uv, vec2(.5)) > .5) discard;
    float g = mix(0.85, 1.0, pow(vExtra.z, 2.0));
    gl_FragColor = vec4(uColor * vec3(g), 1.0);
}