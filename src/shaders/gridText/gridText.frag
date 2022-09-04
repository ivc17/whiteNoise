uniform sampler2D tDiffuse;
uniform sampler2D uTexture;
varying vec2 vUv;
uniform float iTime;


void main() {
    float offsetx=mod(vUv.x,cos(iTime/2.))*sin(iTime/2.) ;
    float offsety=mod(vUv.y,sin(iTime/2.))*cos(iTime/2.);

    gl_FragColor = texture2D(uTexture, vec2(vUv.x+offsetx,vUv.y-offsety));
}

