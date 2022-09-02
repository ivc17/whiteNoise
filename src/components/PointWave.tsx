import { useCallback, useEffect, useRef } from 'react'
import {
  BufferAttribute,
  InterleavedBufferAttribute,
  Mesh,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial
} from 'three'
import { PointWaveShader } from '../shaders/pointWave/pointWaveShader'
import { cleanUpScene } from '../utils/cleanUpScene'
import { clock } from './Canvas'

const count = 100
const width = 20
const f = 1
const a = 0.5

export default function PointWave({ scene }: { scene?: Scene }) {
  const positionsRef = useRef<BufferAttribute | InterleavedBufferAttribute>()

  const graph = useCallback((x: number, z: number) => {
    const customT = clock.getElapsedTime()
    return (
      Math.sin((x + customT) * f) * a + Math.sin((z + customT) * f * 1.3) * a
    )
    // return Math.sin(f * (x ** 2 + customT)) * a
  }, [])

  useEffect(() => {
    if (scene) {
      const mesh = new Mesh()
      const geometry = new PlaneGeometry(width, width, count, count)
      geometry.center()
      // const material = new PointsMaterial({
      //   color: '#000000',
      //   size: 0.03,
      //   map: texture.current
      // })
      const material = new ShaderMaterial(PointWaveShader)
      const points = new Points(geometry, material)
      positionsRef.current = points.geometry.attributes.position
      mesh.add(points)

      mesh.rotateX(90)
      mesh.rotateZ(15)
      mesh.position.z = 0
      mesh.position.y = 2
      mesh.scale.set(0.7, 0.7, 0.7)
      scene.add(mesh)
    }

    return () => {
      cleanUpScene(scene)
    }
  }, [graph, scene])

  useEffect(() => {
    const render = () => {
      const positionsAttr = positionsRef.current
      if (!positionsAttr) return
      const positions = positionsAttr.array as any
      let i = 0
      for (let xi = 0; xi < count; xi++) {
        for (let zi = 0; zi < count; zi++) {
          let x = positions[i]
          let z = positions[i + 1]
          positions[i + 2] = graph(x, z)
          i += 3
        }
      }
      positionsAttr.needsUpdate = true
    }
    const animate = () => {
      requestAnimationFrame(animate)

      render()
    }
    animate()
  }, [graph])

  return <></>
}
