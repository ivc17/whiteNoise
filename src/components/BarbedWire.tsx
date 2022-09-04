import { useEffect } from 'react'
import {
  AmbientLight,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CubeTextureLoader,
  Mesh,
  MeshPhysicalMaterial,
  Scene,
  Vector3
} from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { cleanaupAll } from '../utils/cleanupAll'
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const reflectionCube = new CubeTextureLoader()
  .setPath('./textures/')
  .load(['negz', 'negy', 'negx', 'posz', 'posy', 'posx'])

let geometry: BufferGeometry
new GLTFLoader()
  .setDRACOLoader(dracoLoader)
  .load('./models/wire.gltf', (model) => {
    const wireGeometry = (model.scene.children[0] as any)
      .geometry as BufferGeometry
    wireGeometry.center()
    wireGeometry.scale(0.003, 0.003, 0.003)
    const list = []
    for (let i = 0; i < 40; i++) {
      list.push(wireGeometry.clone().translate(1.7 * i, 0, 0))
    }
    geometry = BufferGeometryUtils.mergeBufferGeometries(list)
  })

export default function BarbedWire({ scene }: { scene: Scene }) {
  useEffect(() => {
    if (!scene) return
    let mounted = true

    const init = () => {
      cleanaupAll(scene)

      const camera = scene.userData.camera
      const initialPoints = [
        [-3, 6, -1],
        [5, -1, 5],
        [-3, -1, 3],
        [-7, 5, -2],
        [-4, 0, -8],
        [8, 8, 0],
        [2, -5, 1]
      ]

      const curve: any = new CatmullRomCurve3(
        initialPoints.map((point: any) => new Vector3(...point))
      )
      curve.curveType = 'centripetal'
      curve.closed = true

      // const points = curve.getPoints(50)
      // const line = new LineLoop(
      //   new BufferGeometry().setFromPoints(points),
      //   new LineBasicMaterial({ color: 0x00ff00 })
      // )
      // scene.add(line)

      const mesh = new Mesh(
        geometry,
        new MeshPhysicalMaterial({
          color: new Color(0xcccccc),
          metalness: 0.8,
          envMap: reflectionCube,
          envMapIntensity: 0.5
        })
      )

      camera.lookAt(mesh.position)

      const flow = new Flow(mesh)
      flow.updateCurve(0, curve)
      scene.add(flow.object3D)
      scene.add(new AmbientLight('#ffffff'))

      const animate = () => {
        if (mounted) {
          flow.moveAlongCurve(0.0001)
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    init()

    return () => {
      mounted = false

      cleanaupAll(scene)
    }
  }, [scene])

  return <></>
}
