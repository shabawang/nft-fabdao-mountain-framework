// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uTranslate;

varying vec3 vExtra;

void main(void) {
    vec3 pos = aVertexPosition * vec3(0.0, 1.0, 0.0) + uTranslate;
    pos.x += aVertexPosition.y * 0.05;
    pos.xy += aExtra.xy;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    float t = smoothstep(0.0, 5.0, aVertexPosition.y);
    t = mix(1.2, 1.0, t);
    t = pow(t, 3.0) * mix(0.5, 1.0, aExtra.z);

    gl_PointSize = mix(5.0, 10.0, aVertexPosition.x) * t * 2.0;

    vec3 g = vec3(aVertexPosition.z);
    g *= mix(0.5, 1.0, aExtra.z);
    vExtra = vec3(g);
}