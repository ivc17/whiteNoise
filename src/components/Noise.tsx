import { Scene } from 'three'
import BaseBlock from './BaseShaderBlock'
import { NoiseShader } from '../shaders/noise/noiseShader'

export default function Noise({ scene }: { scene?: Scene }) {
  return <BaseBlock scene={scene} shader={NoiseShader}></BaseBlock>
}
