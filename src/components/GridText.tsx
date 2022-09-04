import { useEffect, useRef, useState } from 'react'
import { CanvasTexture, RepeatWrapping, Scene, Texture, UVMapping } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GridTextShader } from '../shaders/gridText/gridTextShader'
import { cleanUpComposer } from '../utils/cleanUpComposer'
import BaseSceneBlock from './BaseSceneBlock'

const str = '#WHITE_NOISE'

export default function GridText({ scene }: { scene: Scene }) {
  const pass = useRef<ShaderPass>()
  const [uTexture, setUTexture] = useState<Texture | null>(null)

  useEffect(() => {
    if (scene) {
      cleanUpComposer(scene?.userData.composer)
      const composer: EffectComposer = scene.userData.composer
      const renderPass = new RenderPass(scene, scene.userData.camera)
      composer.addPass(renderPass)
      const shaderPass = new ShaderPass(GridTextShader)
      composer.addPass(shaderPass)
      pass.current = shaderPass
    }
    return () => {
      cleanUpComposer(scene?.userData.composer)
      if (scene) {
        scene.userData.element.innerHTML = ''
      }
    }
  }, [scene])

  useEffect(() => {
    const resize = () => {
      var canvas = document.createElement('canvas')
      canvas.style.position = 'fixed'

      var context = canvas.getContext('2d')
      canvas.width = window.innerWidth / 3
      canvas.height = window.innerHeight / 3

      if (context) {
        context.fillStyle = '#000000'
        context.lineWidth = 2
        context.font = `900 ${100}px Times`

        for (let i = 0; i < 10; i++) {
          context.fillText(str, 0, i * 100, canvas.width)
        }

        setUTexture(
          new CanvasTexture(canvas, UVMapping, RepeatWrapping, RepeatWrapping)
        )
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (pass.current) {
      pass.current.uniforms.uTexture.value = uTexture
    }
  }, [uTexture])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
