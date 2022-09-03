varying vec2 vUv;
varying float noise;
varying float displacement;
uniform sampler2D alphaMap;

void main() {
// vec2 uv =  vUv;
  //compose the colour using the UV coordinate
  //and modulate it with the noise like ambient occlusion
  // vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
float vAmount=texture2D(alphaMap, vUv).x;

vec3 color = vec3( vec2(displacement/10.), displacement/10. );


// vec3 water=(smoothstep(0.01,0.90,height)-smoothstep(0.34,0.35,height))*vec3(0.0,0.0,1.0);


  gl_FragColor = vec4( color*0.9 ,vAmount+0.1 );
}