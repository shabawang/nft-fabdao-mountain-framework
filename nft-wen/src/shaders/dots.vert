// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

// instancing
attribute vec2 aPointA;
attribute vec2 aPointB;
attribute vec3 aColor;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uTotal;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

void main(void) {
    vec2 pos = mix(aPointA, aPointB, aVertexPosition.x);
    float index = mod(aVertexPosition.y + aExtra.z, uTotal);
    float z = 0.0;
    if(index > aExtra.x) {
        z = -9999.0;
    }
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, z, 1.0);
    vColor = aColor * mix(0.9, 1.0, aTextureCoord.y);

    gl_PointSize = aExtra.y * mix(0.5, 2.0, aTextureCoord.x);
}