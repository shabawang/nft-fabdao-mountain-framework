// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uMap0;
uniform sampler2D uMap1;
uniform sampler2D uDecorationMap;
uniform sampler2D uBackgroundMap;
uniform float uRatio;
uniform float uWithSnow;
uniform float uShade;
uniform vec3 uBgColor;

void main(void) {
    vec4 color0 = texture2D(uMap0, vTextureCoord);
    vec4 color1 = texture2D(uMap1, vTextureCoord);
    vec4 decoration = texture2D(uDecorationMap, vTextureCoord);
    vec4 bg = texture2D(uBackgroundMap, vTextureCoord);

    bg = mix(vec4(uBgColor, 1.0), bg, bg.a * 0.5 * uShade);

    vec4 color = mix(color0, color1, color1.a);

    if(color.a > 0.0) {
        // blend mode
        color.rgb = max(color0.rgb, color1.rgb);
    } else {
        color = bg;
    }

    // vignette
    vec2 uv = abs(vTextureCoord - 0.5);
    uv.x *= uRatio;
    float d = length(uv);

    float br = smoothstep(0.6, 0.2, d);
    br = mix(br, 1.0, .7);
    color.rgb *= br;

    color = mix(color, decoration, decoration.a * uWithSnow);

    gl_FragColor = color;
}