import { useEffect, useRef } from 'react'
import { DoubleSide, Mesh, Scene, ShaderMaterial, SphereGeometry } from 'three'
import { TerrainShader } from '../shaders/terrain/terrainShader'
import BaseSceneBlock from './BaseSceneBlock'
import { clock } from './Canvas'

const count = 100
const width = 10

export default function Terrain({ scene }: { scene: Scene }) {
  const uniformsRef = useRef<any>({
    iTime: { value: 0 }
  })

  useEffect(() => {
    const mesh = new Mesh()

    // const geometry = new PlaneGeometry(width, width, count, count)
    const geometry = new SphereGeometry(width, width, width, count, count)
    geometry.center()
    mesh.rotateX(30)

    const material = new ShaderMaterial({
      ...TerrainShader,
      uniforms: uniformsRef.current
    })
    material.side = DoubleSide

    mesh.geometry = geometry
    mesh.material = material

    scene.add(mesh)

    const animate = () => {
      uniformsRef.current.iTime.value = clock.getElapsedTime()
      requestAnimationFrame(animate)
    }
    animate()
  }, [scene])

  return <BaseSceneBlock></BaseSceneBlock>
}
