import { useEffect } from 'react'
import {
  AmbientLight,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  Scene,
  TorusGeometry,
  UVMapping
} from 'three'
import BaseSceneBlock from './BaseSceneBlock'

var str = `white_NOIOSE | white_Noise | white_Noise | White_Noise`

export default function TwistText({ scene }: { scene: Scene }) {
  useEffect(() => {
    scene.add(new AmbientLight(0xcccccc))
    const material = new MeshBasicMaterial({
      color: '0xff00ff'
    })

    const mesh = new Mesh(new TorusGeometry(5, 2, 30, 30), material)
    mesh.castShadow = true //default is false
    mesh.receiveShadow = true
    const mesh2 = new Mesh(new TorusGeometry(3, 2, 30, 30), material)
    const mesh3 = new Mesh(new TorusGeometry(1, 2, 30, 30), material)
    scene.add(mesh)
    scene.add(mesh2)
    scene.add(mesh3)

    var canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'

    var context = canvas.getContext('2d')
    canvas.width = 2000
    canvas.height = 1000

    if (context) {
      context.strokeStyle = '#FFFFFF'
      context.lineWidth = 2
      context.font = '100px Orbitron'

      for (let i = 0; i < 10; i++) {
        context.strokeText(str, 0, i * 100, 2000)
      }

      material.map = new CanvasTexture(
        canvas,
        UVMapping,
        RepeatWrapping,
        RepeatWrapping
      )
    }

    function animate() {
      requestAnimationFrame(animate)
      render()
    }

    function render() {
      if (material.map) {
        material.map.offset.x -= 0.001
        material.map.offset.y += 0.001
        material.map.needsUpdate = true
      }
      // mesh.rotation.x += 0.01
      // mesh.rotation.y -= 0.01
      // mesh.rotation.z += 0.01
    }

    animate()
  }, [scene])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
