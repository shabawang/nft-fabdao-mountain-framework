// copy.frag

#define LUT_FLIP_Y

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uMap;
uniform sampler2D uHighlightMap;
uniform sampler2D uLookupMap;
uniform sampler2D uHexMap;
uniform sampler2D uDecorationMap;

uniform float uStretchLine;
uniform float uRatio;
uniform float uSeedStretch;
uniform float uSeedPixelated;
uniform float uPixelated;
uniform float uHighlightStrength;


vec4 lookup(in vec4 textureColor, in sampler2D lookupTable) {
    #ifndef LUT_NO_CLAMP
        textureColor = clamp(textureColor, 0.0, 1.0);
    #endif

    mediump float blueColor = textureColor.b * 63.0;

    mediump vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);

    mediump vec2 quad2;
    quad2.y = floor(ceil(blueColor) / 8.0);
    quad2.x = ceil(blueColor) - (quad2.y * 8.0);

    highp vec2 texPos1;
    texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

    #ifdef LUT_FLIP_Y
        texPos1.y = 1.0-texPos1.y;
    #endif

    highp vec2 texPos2;
    texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

    #ifdef LUT_FLIP_Y
        texPos2.y = 1.0-texPos2.y;
    #endif

    lowp vec4 newColor1 = texture2D(lookupTable, texPos1);
    lowp vec4 newColor2 = texture2D(lookupTable, texPos2);

    lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
    return newColor;
}

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

#define LEVEL_PIXELATE 5
#define LEVEL_DETAIL 0.25

vec3 pixelate(vec2 p, sampler2D texture) {
    vec3 color = vec3(0.5);

    for(int i=0; i<LEVEL_PIXELATE; i++) {
        float mul = pow(2.0, float(i));
        vec2 gap = 0.1 / mul * vec2(1.0, 1.0 * uRatio) * LEVEL_DETAIL;
        vec2 uv = floor(vTextureCoord / gap) * gap + 0.5 * gap;
        vec3 colorPixelate = texture2D(texture, uv).rgb;

        if( i < 1) {
            color = colorPixelate;
        } else {
            color = mix(color, colorPixelate, 1.0 / mul);
        }
    }


    return color;
}

vec3 greyscale(vec3 color, float str) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), str);
}

vec3 greyscale(vec3 color) {
    return greyscale(color, 1.0);
}


void main(void) {
    vec2 uv;
    float hex = texture2D(uHexMap, vTextureCoord).r;
    vec4 color = texture2D(uMap, vTextureCoord);
    vec4 colorDecorated = texture2D(uDecorationMap, vTextureCoord);
    

    // apply hex pattern
    color.rgb += hex * 0.1;

    // stretching
    float loc = 0.5;
    float v = (vTextureCoord.y - 0.5) * 0.005 + loc;
    uv = vec2(vTextureCoord.x, v);
    vec3 colorStretch = texture2D(uMap, uv).rgb;
    float br = length(colorStretch);

    float t = 0.5;
    float brStretch = snoise(vec3(vTextureCoord.x * 20.0, vTextureCoord.y, uSeedStretch)) * t + 1.0 - t;
    brStretch = smoothstep(0.2, 0.8, brStretch);

    color.rgb += colorStretch * step(1.3, br) * 0.05 * uStretchLine * brStretch;

    // pixelated
    uv = vec2(vTextureCoord);
    uv.y /= uRatio;
    float n = snoise(vec3(uv, uSeedPixelated) * 2.0) * .5 + .5;
    n = mix(0.0, 0.8, n) * uPixelated;

    vec3 colorPixelated = pixelate(uv, uMap);
    color.rgb = mix(color.rgb, colorPixelated, n);

    // apply curve
    color.rgb = smoothstep(vec3(0.0), vec3(1.0), color.rgb);

    // apply greyscale
    color.rgb = greyscale(color.rgb, .25);

    // apply color lookup
    color = lookup(color, uLookupMap);

    // add decoration
    color = mix(color, colorDecorated, colorDecorated.a);

    vec3 highlight = texture2D(uHighlightMap, vTextureCoord).rgb;
    vec3 highlightPixelated = pixelate(uv, uHighlightMap).rgb;
    highlight.rgb = mix(highlight.rgb, highlightPixelated, n);
    color.rgb += highlight * 0.6 * uHighlightStrength;
    

    gl_FragColor = color;
    // gl_FragColor = vec4(vec3(brStretch), 1.0);
}