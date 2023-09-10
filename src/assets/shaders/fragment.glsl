precision highp float;
uniform vec2 c1Center;
uniform vec2 c2Center;
uniform vec3 c1Color;
uniform vec3 c2Color;
uniform vec3 backgroundColor;
varying vec2 vTexCoord;

void main() {
    float c1Rate = distance(vTexCoord, c1Center);
    float c2Rate = distance(vTexCoord, c2Center);
    vec3 mixColor1 = mix(c1Color, backgroundColor, c1Rate);
    vec3 mixColor2 = mix(c2Color, backgroundColor, c2Rate);
    gl_FragColor = vec4(mix(mixColor1, mixColor2, 0.5), 1);
}