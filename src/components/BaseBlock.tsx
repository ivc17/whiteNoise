import { useEffect } from 'react'
import { Scene, Shader } from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export default function BaseBlock({
  scene,
  shader
}: {
  scene?: Scene
  shader: Shader
}) {
  useEffect(() => {
    if (scene) {
      const composer: EffectComposer = scene.userData.composer
      composer.passes.length = 0
      const renderPass = new RenderPass(scene, scene.userData.camera)
      composer.addPass(renderPass)
      const shaderPass = new ShaderPass(shader)

      composer.addPass(shaderPass)
    }
  }, [scene, shader])

  return <></>
}
