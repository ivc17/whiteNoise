import { useEffect } from 'react'
import {
  DoubleSide,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader
} from 'three'
import { TerrainShader } from '../shaders/terrain/terrainShader'
import BaseSceneBlock from './BaseSceneBlock'
import { clock } from './Canvas'
import alphaMapUrl from '../assets/alphamap.png'

const count = 70
const width = 180

let texture: Texture

new TextureLoader().load(alphaMapUrl, (tex) => {
  texture = tex
})

export default function Terrain({ scene }: { scene: Scene }) {
  useEffect(() => {
    if (!scene) return
    let mounted = true
    const uniforms: any = {
      iTime: { value: 0 },
      alphaMap: { value: texture }
    }

    const camera = scene.userData.camera
    const geometry = new PlaneGeometry(width, width, count, count)
    // const geometry = new SphereGeometry(width, count, count)
    geometry.center()

    const material = new ShaderMaterial({
      vertexShader: TerrainShader.vertexShader,
      fragmentShader: TerrainShader.fragmentShader,
      uniforms: uniforms
    })

    material.side = DoubleSide
    const mesh = new Mesh(geometry, material)
    mesh.rotateX(30)
    mesh.position.z = -20
    // mesh.scale.set(0.2, 0.2, 0.2)

    camera.position.y = 20
    camera.position.z = 80
    camera.rotation.x = -0.5
    camera.far = 300

    scene.add(mesh)

    const animate = () => {
      if (mounted) {
        uniforms.iTime.value = clock.getElapsedTime()
        const speed = 0.00002
        camera.position.x =
          camera.position.x * Math.cos(speed) +
          camera.position.z * Math.sin(speed)
        camera.position.z =
          camera.position.z * Math.cos(speed) -
          camera.position.x * Math.sin(speed)

        requestAnimationFrame(animate)
      }
    }
    animate()
    return () => {
      mounted = false
    }
  }, [scene])

  return <BaseSceneBlock></BaseSceneBlock>
}
