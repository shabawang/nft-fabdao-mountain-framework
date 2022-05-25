// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vExtra;
varying vec3 vPosOffset;
uniform float uRange;

void main(void) {
    float a = 1.0 - abs((vPosOffset.y + (vExtra.x - 0.5) * 0.3) / uRange);
    float t = a;
    a *= mix(0.4, 0.6, vExtra.z);
    float g = step(uRange * 0.5, vPosOffset.y + (vExtra.y - 0.5) * 0.3);
    gl_FragColor = vec4(vec3(g), a);

    if(vExtra.w > 0.5) {
        if(distance(vTextureCoord, vec2(.5)) > .5) discard;
        t = smoothstep(0.2, 0.8, t) * mix(0.8, 1.0, vExtra.x);
        gl_FragColor = vec4(t);
    }
}