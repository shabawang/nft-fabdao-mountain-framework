// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uMap;
uniform sampler2D uDecorationMap;
uniform sampler2D uBackgroundMap;

uniform float uRatio;
uniform float uWithSnow;
uniform float uShade;
uniform vec3 uBgColor;

void main(void) {
    vec4 decoration = texture2D(uDecorationMap, vTextureCoord);
    vec4 bg = texture2D(uBackgroundMap, vTextureCoord);

    decoration *= (1.0 - bg.a);


    bg = mix(vec4(uBgColor, 1.0), bg, bg.a * 0.5 * uShade);

    vec4 color = texture2D(uMap, vTextureCoord);

    color = mix(bg, color, color.a);

    // gradient to bottom
    float d = smoothstep(0.0, 0.35, vTextureCoord.y);
    d = mix(d, 1.0, .05);
    color.rgb = mix(uBgColor * 0.5, color.rgb, d);

    // vignette
    vec2 uv = abs(vTextureCoord - 0.5);
    uv.x *= uRatio;
    d = length(uv);

    float br = smoothstep(0.6, 0.2, d);
    br = mix(br, 1.0, .5);
    color.rgb *= br;

    color = mix(color, decoration, decoration.a);

    

    gl_FragColor = color;
}