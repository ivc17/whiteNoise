import { useEffect } from 'react'
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Scene
} from 'three'
import BaseSceneBlock from './BaseSceneBlock'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js'

export default function BarbedWire({ scene }: { scene: Scene }) {
  useEffect(() => {
    const camera = scene.userData.camera
    const curveHandles: any = []

    const initialPoints = [
      { x: 1, y: 0, z: -1 },
      { x: 1, y: 0, z: 1 },
      { x: -1, y: 0, z: 1 },
      { x: -1, y: 0, z: -1 }
    ]

    const boxGeometry = new BoxGeometry(0.1, 0.1, 0.1)
    const boxMaterial = new MeshBasicMaterial({ color: new Color(0xff00ff) })

    for (const handlePos of initialPoints) {
      const handle = new Mesh(boxGeometry, boxMaterial)
      handle.position.copy(handlePos as any)
      curveHandles.push(handle)
      scene.add(handle)
    }

    const curve: any = new CatmullRomCurve3(
      curveHandles.map((handle: any) => handle.position)
    )
    curve.curveType = 'centripetal'
    curve.closed = true

    const points = curve.getPoints(50)
    const line = new LineLoop(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({ color: 0x00ff00 })
    )

    scene.add(line)

    const geometry = new BoxGeometry(5, 1, 1, 20)
    geometry.center()

    geometry.rotateX(Math.PI)

    const mesh = new Mesh(
      geometry,
      new MeshBasicMaterial({ color: new Color(0x00ff00) })
    )

    camera.lookAt(mesh.position)

    const flow = new Flow(mesh)
    flow.updateCurve(0, curve)
    scene.add(flow.object3D)

    const animate = () => {
      flow.moveAlongCurve(0.001)
      requestAnimationFrame(animate)
    }
    animate()
  }, [scene])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
