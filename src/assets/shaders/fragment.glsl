precision highp float;

const int COLOR_COUNT = 4;
const float MIX_COLOR_SIZE = 0.5;
const float MIX_BRIGHT_THRESHOLD = 0.43;
uniform float mixColorRatio;
uniform vec3 bgColor;
uniform vec3 colors[COLOR_COUNT];
uniform vec2 colorCenter[COLOR_COUNT];
uniform float uTime;
varying vec2 uv;

// 平滑插值函数
float fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// 线性插值函数
float lerp(float a, float b, float t) {
    return a + t * (b - a);
}

// 伪随机梯度生成函数
float gradient(float x) {
    return fract(sin(x) * 43758.5453) * 0.5 - 0.25; // 生成 -0.25 到 0.25 之间的伪随机数
}

// 1D 噪声函数
float noise(float x) {
    float i = floor(x);
    float f = x - i;
    float u = fade(f);

    float grad1 = gradient(i);
    float grad2 = gradient(i + 1.0);

    return lerp(grad1 * f, grad2 * (f - 1.0), u);
}

void main() {
    float mRate = 0.0;
    float tRate = 0.0;
    float rates[COLOR_COUNT];
    for (int i = 0; i < COLOR_COUNT; i++) {
        vec2 offset = vec2(noise(uTime + colorCenter[i][0] * 3.0 + float(i)), noise(uTime + colorCenter[i][1] * 7.0 + float(i)));
        float d = distance(uv + offset, colorCenter[i]);
        rates[i] = d < MIX_COLOR_SIZE ? (MIX_COLOR_SIZE - d): 0.0;
        mRate = max(mRate, rates[i]);
        tRate += rates[i];
    }
    mRate = mRate < MIX_BRIGHT_THRESHOLD ? (tRate > MIX_BRIGHT_THRESHOLD ? MIX_BRIGHT_THRESHOLD : tRate) : mRate;
    vec3 mixColor = vec3(0.0);
    for (int i = 0; i < COLOR_COUNT; i++) {
        mixColor += colors[i] * rates[i];
    }
    mixColor = mixColor / tRate * mRate * mixColorRatio + bgColor * (1.0 - mRate * mixColorRatio);

    gl_FragColor = vec4(mixColor, 1);
}