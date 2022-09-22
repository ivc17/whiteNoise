import { useEffect } from 'react'
import { AsciiEffect } from '../utils/AsciiEffect'
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'
import BaseSceneBlock from './BaseSceneBlock'

export default function Ascii({
  scene,
  renderer
}: {
  scene: Scene
  renderer: WebGLRenderer | undefined
}) {
  useEffect(() => {
    const geometry = new BoxGeometry(2, 2, 2)
    geometry.center()

    const material = new MeshPhongMaterial({ color: new Color(0x00ffff) })
    const mesh = new Mesh(geometry, material)
    mesh.rotation.set(10, 10, 10)
    scene.add(mesh)

    const light = new PointLight(new Color(0xffffff), 1)
    light.lookAt(mesh.position)
    light.position.set(0, 10, 0)
    scene.add(light)

    function animate() {
      requestAnimationFrame(animate)

      mesh.rotation.x += 0.01
    }
    animate()
  }, [scene])

  useEffect(() => {
    let mounted = true
    if (!renderer || !scene.userData.element) return
    const element = scene.userData.element

    const effect = new AsciiEffect(renderer, element, ' .:-+*=%@#', {
      invert: true
    })
    const { top, left } = element.getBoundingClientRect()
    effect.setSize(window.innerWidth, window.innerHeight)
    const domStyle = effect.domElement.style
    domStyle.color = '#ffffff'
    domStyle.width = '100%'
    domStyle.height = '100%'
    domStyle.transform = `translate(-${
      left + (window.innerWidth > 400 ? 50 : 0)
    }px, -${top}px)`

    element.style.overflow = 'hidden'
    element.style.backgroundColor = '#000000'
    element.append(effect.domElement)

    const render = () => {
      effect.render(scene, scene.userData.camera)
    }

    function animate() {
      if (mounted) {
        requestAnimationFrame(animate)

        render()
      }
    }
    animate()
    return () => {
      mounted = false
    }
  }, [renderer, scene, scene.userData.element])

  return <BaseSceneBlock></BaseSceneBlock>
}
