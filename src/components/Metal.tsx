import { Scene } from 'three'
import { MetalShader } from '../shaders/metal/metalShader'

import BaseShaderBlock from './BaseShaderBlock'

export default function Metal({ scene }: { scene?: Scene }) {
  return <BaseShaderBlock shader={MetalShader} scene={scene}></BaseShaderBlock>
}
