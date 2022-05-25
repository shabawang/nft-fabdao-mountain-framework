// copy.frag

#define LUT_FLIP_Y

precision highp float;

uniform float uRatio;
uniform sampler2D uLookupMap;
uniform vec3 uColors[5];

varying vec3 vExtra;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#define PI 3.141592653589793


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

void main(void) {
    float a = 0.0;
    float r = 0.15;
    vec2 uv = gl_PointCoord - .5;
    uv.y /= uRatio;
    uv += 0.5;


    for(int i=0; i<5; i++) {
        float theta = float(i) / 5.0 * PI * 2.0 + vExtra.z * PI;
        vec2 c = rotate(vec2(0.3, 0.0), theta) + 0.5;

        float d = distance(uv, c);
        a += smoothstep(r, r - 0.1, d);
    }

    if(a <= 0.1) {
        discard;
    }
    

    // apply color lookup
    float noiseColor = mod(vExtra.x + vExtra.y + vExtra.z, 1.0);
    vec3 color = vec3(1.0);
    if(noiseColor < 0.2) {
        color = uColors[0];
    } else if(noiseColor < 0.4) {
        color = uColors[1];
    } else if(noiseColor < 0.6) {
        color = uColors[2];
    } else if(noiseColor < 0.8) {
        color = uColors[3];
    } else {
        color = uColors[4];
    }
    color = mix(color, vec3(1.0), .75);
    gl_FragColor = lookup(vec4(color, 1.0), uLookupMap);
}