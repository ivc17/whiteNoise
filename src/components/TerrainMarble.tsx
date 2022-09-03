import { useEffect, useRef } from 'react'
import {
  BufferAttribute,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Fog,
  HemisphereLight,
  InterleavedBufferAttribute,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Scene,
  SpotLight,
  TextureLoader
} from 'three'
import { clock } from './Canvas'
import BaseSceneBlock from './BaseSceneBlock'
import mapUrl from '../assets/marble.png'

const count = 20
const width = 50

export default function TerrainMarble({ scene }: { scene: Scene }) {
  const positionsRef = useRef<BufferAttribute | InterleavedBufferAttribute>()
  const zRef = useRef<BufferAttribute | InterleavedBufferAttribute>()

  useEffect(() => {
    const camera = scene.userData.camera
    const fog = new Fog('#000000')
    scene.fog = fog
    const mesh = new Mesh()
    const geometry = new PlaneGeometry(width, width, count, count)
    // geometry.center()
    positionsRef.current = geometry.attributes.position

    const map = new TextureLoader().load(mapUrl)

    const terrainMaterial = new MeshPhongMaterial({
      fog: true,
      // wireframe: true,
      color: '#cccccc',
      // map: map,
      reflectivity: 0.5,
      emissiveMap: map,
      shininess: 1
      // displacementMap: map
    })
    terrainMaterial.side = DoubleSide
    mesh.material = terrainMaterial
    mesh.geometry = geometry
    // mesh.position.z = 0

    camera.far = 100
    camera.position.z = 20
    camera.position.y = 2

    mesh.rotation.x = -0.47 * Math.PI
    mesh.castShadow = true
    mesh.receiveShadow = true
    // mesh.rotation.z = MathUtils.degToRad(90)
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

    // const line = new LineSegments(
    //   geometry,
    //   new LineBasicMaterial({
    //     color: '#000',
    //     fog: true
    //   } as any)
    // )
    // line.rotation.x = -0.47 * Math.PI
    // // line.rotation.z = MathUtils.degToRad(90)
    // scene.add(line)

    const pointLight = new SpotLight('#F6F8ED', 1, 100)
    pointLight.decay = 1
    pointLight.power = 1
    pointLight.position.y = 10
    pointLight.position.z = -15
    pointLight.lookAt(mesh.position)

    const hemiLight = new HemisphereLight(0xf6f8ed, 0x000000, 0.7)
    hemiLight.position.set(0, 5, 0)
    scene.add(hemiLight)
    scene.add(pointLight)

    scene.background = new Color('#eeeeee')
    camera.position.y = 8
    const render = () => {
      if (!positionsRef.current || !zRef.current) return

      let t_vertex_Array = positionsRef.current.array as any[]
      let t_myZ_Array = zRef.current.array as any[]

      for (let i = 0; i < t_vertex_Array.length; i++) {
        t_vertex_Array[i * 3 + 2] =
          Math.sin(i + clock.getElapsedTime() * 0.8) * t_myZ_Array[i]
      }
      positionsRef.current.needsUpdate = true
      // camera.zoom = 0.5
      // // if (frame > 500) frame = 0
      // // if (camera.position.x > 1) cameraDx = -cameraDx
      const speed = 0.006
      camera.position.x =
        camera.position.x * Math.cos(speed) +
        camera.position.z * Math.sin(speed)
      camera.position.z =
        camera.position.z * Math.cos(speed) -
        camera.position.x * Math.sin(speed)

      camera.position.y += Math.sin(speed * 1.5)
      camera.lookAt(mesh.position)
    }
    const animate = () => {
      render()
      requestAnimationFrame(animate)
    }
    animate()
  }, [scene])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
