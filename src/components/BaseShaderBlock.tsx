import { useEffect } from 'react'
import { Scene, Shader } from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { cleanaupAll } from '../utils/cleanupAll'

export default function BaseShaderBlock({
  scene,
  shader
}: {
  scene?: Scene
  shader: Shader
}) {
  useEffect(() => {
    if (scene) {
      cleanaupAll(scene)
      const composer: EffectComposer = scene.userData.composer
      const renderPass = new RenderPass(scene, scene.userData.camera)
      composer.addPass(renderPass)
      const shaderPass = new ShaderPass(shader)

      composer.addPass(shaderPass)
    }
    return () => {
      cleanaupAll(scene)
    }
  }, [scene, shader])

  return <></>
}
