#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D;
varying vec2 vUv;
uniform float iTime;

void main()
{
    vec2 uv =  vUv;

    for(float i = 1.0; i < 10.0; i++){
        uv.x += 0.6 / i * cos(i * 2.5* uv.y + iTime);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
    }
    
    gl_FragColor = vec4(vec3(0.1)/abs(sin(iTime-uv.y-uv.x)),1.0);
}
