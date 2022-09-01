#ifdef GL_ES
precision mediump float;
#endif

uniform float iTime;
varying vec2 vUv;

const float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio

float gold_noise(in vec2 xy, in float seed) {
  return fract(tan(distance(xy * PHI, xy) * seed) * (xy.x));
}

// out vec4 rgba, in vec2 xy
void main() {
  gl_FragColor = vec4(gold_noise(vUv * vec2(1000.), fract(iTime) + 3.0),
                      gold_noise(vUv * vec2(1000.), fract(iTime) + 2.0),
                      gold_noise(vUv * vec2(1000.), fract(iTime) + 1.0), 0.4);
}

// float strength = 16.0;

// float grain(in float seed) {
//   float x = (vUv.x + 4.0) * (vUv.y + 4.0) * (seed * 10.0);
//   return (mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.3) - 0.2) *
//          strength;
// }

// void main() {
//   gl_FragColor = vec4(grain(fract(iTime) + 1.0), grain(fract(iTime) + 2.0),
//                       grain(fract(iTime) + 3.0), 1.);
//   //   gl_FragColor = vec4(1., 0., 0., 1.);
// }
