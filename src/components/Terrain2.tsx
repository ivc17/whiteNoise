import { useEffect } from 'react'
import {
  Color,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SpotLight,
  TextureLoader,
  Vector2
} from 'three'
import BaseSceneBlock from './BaseSceneBlock'
import displacementUrl from '../assets/displacement.png'
import alphaUrl from '../assets/alphamap.png'
import normalUrl from '../assets/normalmap.jpeg'
import { clock } from './Canvas'

const count = 70
const width = 50

const geometry = new PlaneGeometry(width, width, count, count)
const normalMap = new TextureLoader().load(normalUrl)
const alphaMap = new TextureLoader().load(alphaUrl)
const displacementMap = new TextureLoader().load(displacementUrl)

export default function Terrain2({ scene }: { scene: Scene }) {
  useEffect(() => {
    if (!scene) return
    let mounted = true
    const camera = scene.userData.camera
    // const fog = new Fog('#00ff00')
    // scene.fog = fog
    const mesh = new Mesh()

    normalMap.wrapS = RepeatWrapping
    normalMap.wrapT = RepeatWrapping
    normalMap.repeat.set(10, 10)

    const terrainMaterial = new MeshPhongMaterial({
      // fog: true,
      // wireframe: true,
      color: '#cccccc',
      // map: textureMap,

      // emissive: 'rgba(255,255,255,0.1)',
      displacementMap: displacementMap,
      alphaMap: alphaMap,
      transparent: true,
      displacementScale: 15,
      depthTest: false,
      normalMap: normalMap,
      normalScale: new Vector2(5, 1)
    })
    terrainMaterial.side = DoubleSide
    mesh.material = terrainMaterial
    mesh.geometry = geometry

    camera.far = 100
    camera.position.y = 20
    camera.position.z = 40
    camera.lookAt(mesh.position)
    // camera.position.y = 2

    mesh.rotation.x = -0.47 * Math.PI
    mesh.position.y = -5
    mesh.castShadow = true
    mesh.receiveShadow = true
    // mesh.rotation.z = MathUtils.degToRad(90)
    scene.add(mesh)

    const pointLight = new SpotLight('#cccccc', 1, 100)
    pointLight.decay = 0.1
    pointLight.lookAt(mesh.position)
    pointLight.position.y = 50

    const hemiLight = new HemisphereLight(0xaaaaaa, 0x000000, 0.1)
    hemiLight.position.set(0, 5, 0)
    scene.add(hemiLight)
    scene.add(pointLight)

    scene.background = new Color(0x000000)

    // camera.position.y = 8
    const render = () => {}
    const animate = () => {
      if (mounted) {
        render()

        if (mesh.rotation.z > 2 * Math.PI) {
          mesh.rotation.z = 0
        }
        mesh.rotation.z = clock.getElapsedTime() / 8
        requestAnimationFrame(animate)
      }
    }
    animate()
    return () => {
      mounted = false
    }
  }, [scene])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
