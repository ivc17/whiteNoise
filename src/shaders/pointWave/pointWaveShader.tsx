/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import frag from '!raw-loader!./pointWave.frag'
// @ts-ignore
import vert from '!raw-loader!./pointWave.vert'
import { Color } from 'three'

export const PointWaveShader = {
  uniforms: {
    color: { value: new Color('#000000') }
  },
  vertexShader: vert,
  fragmentShader: frag
}
