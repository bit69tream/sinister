#version 100

precision mediump float;

varying vec2 fragTexCoord;

uniform float health;

uniform sampler2D texture0;
uniform vec4 colDiffuse;

uniform vec4 goodColor;
uniform vec4 badColor;


vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
              d / (q.x + e),
              q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx,
                   clamp(p - K.xxx, 0.0, 1.0),
                   c.y);
}

void main() {
  vec4 origColor = texture2D(texture0, fragTexCoord) * colDiffuse;
  float v = rgb2hsv(origColor.rgb).z;

  if (v == 0.) {
    finalColor = origColor;
    return;
  }

  vec3 goodColorAdjusted = rgb2hsv(goodColor.rgb);
  goodColorAdjusted.z = v;
  goodColorAdjusted = hsv2rgb(goodColorAdjusted);

  vec3 badColorAdjusted = rgb2hsv(badColor.rgb);
  badColorAdjusted.z = v;
  badColorAdjusted = hsv2rgb(badColorAdjusted);

  if ((1. - fragTexCoord.y) > health) {
    gl_FragColor = vec4(badColorAdjusted, 1.);
  } else {
    gl_FragColor = vec4(goodColorAdjusted, 1.);
  }
}
