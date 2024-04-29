# GLSL tips

## 颜色空间转换

```glsl

vec3 rgb2hsl(in vec3 c) {
	vec3 hsl;
	float maxc = max(c.r, max(c.g, c.b));
	float minc = min(c.r, min(c.g, c.b));
	float l = (minc + maxc) * 0.5;
	if (minc != maxc) {
		float d = maxc - minc;
		hsl.y = (l < 0.5) ? d / (maxc + minc) : d / (2.0 - maxc - minc);
		hsl.x = (maxc == c.r) ? (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0) : ((maxc == g) ? (c.b - c.r) / d + 2.0 : (c.r - c.g) / d + 4.0);
		hsl.x /= 6.0;
	}
	hsl.z = l;
	return hsl;
}
vec3 hslToRgb(vec3 c) {
	vec3 rgb;

	float h = c.x;
	float s = c.y;
	float l = c.z;

	if (s == 0.0) {
		rgb.r = l;
		rgb.g = l;
		rgb.b = l;
	} else {
		float q = (l < 0.5) ? l * (1.0 + s) : l + s - l * s;
		float p = 2.0 * l - q;
		rgb.r = hueToRgb(p, q, h + 0.33333333333333);
		rgb.g = hueToRgb(p, q, h);
		rgb.b = hueToRgb(p, q, h - 0.33333333333333);
	}
	return rgb;
}

float hueToRgb(float p, float q, float t) {
	if (t < 0.0)
		t += 1.0;
	if (t > 1.0)
		t -= 1.0;
	if (t < 1.0 / 6.0)
		return p + (q - p) * 6.0 * t;
	if (t < 1.0 / 2.0)
		return q;
	if (t < 2.0 / 3.0)
		return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
	return p;
}

vec3 labToRgb(vec3 c) {
	float y = (c.x + 16.0) / 116.0;
	float x = c.y / 500.0 + y;
	float z = y - c.z / 200.0;

	x = (x > 0.206893) ? x * x * x : (x - 16.0 / 116.0) / 7.787;
	y = (y > 0.206893) ? y * y * y : (y - 16.0 / 116.0) / 7.787;
	z = (z > 0.206893) ? z * z * z : (z - 16.0 / 116.0) / 7.787;

	float r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	float g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	float b = x * 0.0557 + y * -0.2040 + z * 1.0570;

	r = (r > 0.0031308) ? (1.055 * pow(r, 1.0 / 2.4) - 0.055) : 12.92 * r;
	g = (g > 0.0031308) ? (1.055 * pow(g, 1.0 / 2.4) - 0.055) : 12.92 * g;
	b = (b > 0.0031308) ? (1.055 * pow(b, 1.0 / 2.4) - 0.055) : 12.92 * b;

	vec3 rgb;
	rgb.r = r;
	rgb.g = g;
	rgb.b = b;

	return rgb;
}
```


## Luma

```glsl
// L = 0.2126 * R + 0.7152 * G + 0.0722 * B
vec3 LumaFactorRGB = vec3(0.2126, 0.7152, 0.0722);
vec3 LumaFactorRGBA = vec3(0.2126, 0.7152, 0.0722, 0.0);

vec3 luma(vec3 x) {
	return dot(LumaFactorRGB, x);
}
vec4 luma(vec4 x) {
	return dot(LumaFactorRGBA, x);
}
```
