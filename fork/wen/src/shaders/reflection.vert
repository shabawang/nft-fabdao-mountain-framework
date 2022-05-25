// basic.vert

precision highp float;
attribute vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uTranslate;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    vec3 pos = aVertexPosition * vec3(1.0, 0.0, 1.0) + uTranslate;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    gl_PointSize = mix(5.0, 10.0, aVertexPosition.y);
}