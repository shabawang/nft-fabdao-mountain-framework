// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

uniform float uThreshold;

void main(void) {
    vec3 color = texture2D(texture, vTextureCoord).rgb;
    float br = length(color);
    if(br < uThreshold) {
        br = 0.0;
    }

    gl_FragColor = vec4(color * br, 1.0);
}