import { useEffect } from 'react'
import { Scene } from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { MetalShader } from '../shaders/metal/metalShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export default function Metal({ scene }: { scene?: Scene }) {
  useEffect(() => {
    if (scene) {
      const composer: EffectComposer = scene.userData.composer
      composer.passes.length = 0
      const renderPass = new RenderPass(scene, scene.userData.camera)
      composer.addPass(renderPass)
      const shaderPass = new ShaderPass(MetalShader)

      composer.addPass(shaderPass)
    }
  }, [scene])

  return <></>
}
