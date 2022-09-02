
attribute float scale;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = 4.;

  gl_Position = projectionMatrix * mvPosition;
}