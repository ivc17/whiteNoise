/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import frag from '!raw-loader!./terrain.frag'
// @ts-ignore
import vert from '!raw-loader!./terrain.vert'

export const TerrainShader = {
  vertexShader: vert,
  fragmentShader: frag
}
