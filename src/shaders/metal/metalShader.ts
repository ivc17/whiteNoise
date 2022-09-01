// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import frag from '!raw-loader!./metalWave.frag'

const MetalShader = {

  uniforms: {
		'iTime': { value: 0},
	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader:frag 
};

export { MetalShader };