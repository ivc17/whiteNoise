
attribute float scale;

void main() {
  gl_PointSize = 4.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}