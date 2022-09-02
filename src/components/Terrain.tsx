import { useEffect, useRef } from 'react'
import {
  AmbientLight,
  BufferAttribute,
  Color,
  DynamicDrawUsage,
  Fog,
  InterleavedBufferAttribute,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  Scene,
  Texture,
  TextureLoader
} from 'three'
import { clock } from './Canvas'
import map from '../assets/marble.png'

const count = 20
const width = 50

export default function Terrain({ scene }: { scene: Scene }) {
  const positionsRef = useRef<BufferAttribute | InterleavedBufferAttribute>()
  const zRef = useRef<BufferAttribute | InterleavedBufferAttribute>()

  useEffect(() => {
    const init = (map: Texture) => {
      const camera = scene.userData.camera
      const fog = new Fog('#000000')
      scene.fog = fog
      const mesh = new Mesh()
      const geometry = new PlaneGeometry(width, width, count, count)
      // geometry.center()
      positionsRef.current = geometry.attributes.position

      const terrainMaterial = new MeshPhongMaterial({
        fog: true,
        // wireframe: true,
        color: '#ffffff',
        map: map,
        reflectivity: 1,
        emissive: '#dddddd'
      })

      mesh.material = terrainMaterial
      mesh.geometry = geometry
      mesh.position.z = 0

      camera.far = 100
      camera.position.z = 20
      camera.position.y = 2

      mesh.rotation.x = -0.47 * Math.PI
      mesh.rotation.z = MathUtils.degToRad(90)
      scene.add(mesh)
      ;(positionsRef.current as any)?.setUsage(DynamicDrawUsage)
      geometry.setAttribute(
        'myZ',
        new BufferAttribute(
          new Float32Array(geometry.attributes.position.array.length / 3),
          1
        )
      )
      zRef.current = geometry.attributes.myZ

      for (let i = 0; i < geometry.attributes.position.array.length; i++) {
        ;(geometry.attributes.myZ.array as any[])[i] = MathUtils.randInt(0, 5)
      }

      const line = new LineSegments(
        geometry,
        new LineBasicMaterial({
          color: '#000',
          fog: true
        } as any)
      )
      line.rotation.x = -0.47 * Math.PI
      line.rotation.z = MathUtils.degToRad(90)
      scene.add(line)

      const pointLight = new PointLight('#aaaaee')
      pointLight.intensity = 0.3
      pointLight.position.set(
        mesh.position.x,
        mesh.position.y + 5,
        mesh.position.z
      )
      pointLight.lookAt(mesh.position)
      const light = new AmbientLight('#aaaaee')
      light.intensity = 0.1
      scene.add(light)
      scene.add(pointLight)
      scene.background = new Color('#eeeeee')
    }

    new TextureLoader().load(map, init)
  }, [scene])

  useEffect(() => {
    const render = () => {
      if (!positionsRef.current || !zRef.current) return

      let t_vertex_Array = positionsRef.current.array as any[]
      let t_myZ_Array = zRef.current.array as any[]
      // console.log(t_myZ_Array)
      for (let i = 0; i < t_vertex_Array.length; i++) {
        t_vertex_Array[i * 3 + 2] =
          Math.sin(i + clock.getElapsedTime() * 0.8) * t_myZ_Array[i]
      }
      positionsRef.current.needsUpdate = true
    }
    const animate = () => {
      render()
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return <></>
}
