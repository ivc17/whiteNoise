// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import frag from '!raw-loader!./noise.frag'

const NoiseShader = {

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

export { NoiseShader };