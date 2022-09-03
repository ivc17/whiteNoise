import { useEffect, useRef } from 'react'
import {
  DoubleSide,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry
} from 'three'
import { TerrainShader } from '../shaders/terrain/terrainShader'
import BaseSceneBlock from './BaseSceneBlock'
import { clock } from './Canvas'

const count = 30
const width = 10

export default function Terrain({ scene }: { scene: Scene }) {
  const uniformsRef = useRef<any>({
    iTime: { value: 0 }
  })

  useEffect(() => {
    const mesh = new Mesh()

    // const geometry = new PlaneGeometry(width, width, count, count)
    const geometry = new SphereGeometry(width, count, count)
    geometry.center()
    mesh.rotateX(30)

    const material = new ShaderMaterial({
      vertexShader: TerrainShader.vertexShader,
      fragmentShader: TerrainShader.fragmentShader,
      uniforms: uniformsRef.current
    })
    material.side = DoubleSide

    mesh.geometry = geometry
    mesh.material = material
    mesh.position.z = -20

    scene.add(mesh)

    const animate = () => {
      uniformsRef.current.iTime.value = clock.getElapsedTime()
      requestAnimationFrame(animate)
    }
    animate()
  }, [scene])

  return <BaseSceneBlock></BaseSceneBlock>
}
