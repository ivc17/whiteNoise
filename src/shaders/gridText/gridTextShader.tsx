/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import frag from '!raw-loader!./gridText.frag'
// @ts-ignore
import vert from '!raw-loader!./gridText.vert'

export const GridTextShader = {
  uniforms: {
    iTime: { value: 0 },
    uTexture: { value: null }
  },
  vertexShader: vert,
  fragmentShader: frag
}
