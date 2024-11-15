precision highp float;

const int COLOR_COUNT = 4;
const float MIX_COLOR_SIZE = 0.5;
const float MAX_MIX_BRIGHT = 0.43;
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

// 连续噪声函数
float noise(float x) {
    float i = floor(x);
    float f = x - i;
    float u = fade(f);

    float grad1 = gradient(i);
    float grad2 = gradient(i + 1.0);

    return lerp(grad1 * f, grad2 * (f - 1.0), u);
}

void main() {
    float mRate = 0.0; // 最大混合透明度
    float tRate = 0.0; // 总混合透明度
    float rates[COLOR_COUNT]; // 每个颜色的混合透明度
    vec3 mixColor = vec3(0.0); // 混合后的颜色
    for (int i = 0; i < COLOR_COUNT; i++) {
        vec2 offset = vec2(noise(uTime + colorCenter[i][0] * 3.0 + float(i)), noise(uTime + colorCenter[i][1] * 7.0 + float(i)));
        float d = distance(uv + offset, colorCenter[i]);
        rates[i] = d < MIX_COLOR_SIZE ? (MIX_COLOR_SIZE - d): 0.0;
        mixColor += colors[i] * rates[i]; // 叠加前景色，离前景色中心点越远，叠加程度越低

        mRate = max(mRate, rates[i]);
        tRate += rates[i];
    }

    // 计算混合透明度，为避免离前景色中心点过远的坐标颜色过于接近背景色，允许低于MAX_MIX_BRIGHT透明度的颜色叠加透明度
    mRate = mRate < MAX_MIX_BRIGHT ? (tRate > MAX_MIX_BRIGHT ? MAX_MIX_BRIGHT : tRate) : mRate;
    mixColor = mixColor / tRate * mRate * mixColorRatio; // 计算前景混合后的颜色
    mixColor += bgColor * (1.0 - mRate * mixColorRatio); // 混合背景色

    gl_FragColor = vec4(mixColor, 1);
}