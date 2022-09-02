import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Clock, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Metal from './Metal'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import Noise from './Noise'
import PointWave from './PointWave'

const sceneCountH = 3
const sceneCountV = 3

const rtParameters = {
  stencilBuffer: true
}

export const clock = new Clock(true)

export default function Canvas() {
  const rendererRef = useRef<WebGLRenderer>()
  const [scenes, setScenes] = useState<Scene[]>([])

  useEffect(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    const content = document.getElementById('content') as HTMLDivElement

    if (!canvas || !content) return
    let renderer: WebGLRenderer
    if (!rendererRef.current) {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      rendererRef.current = renderer
    } else {
      renderer = rendererRef.current
    }
    function init() {
      // const geometries = [new THREE.BoxGeometry(2, 2, 2)]

      setScenes([])
      content.innerHTML = ''
      const sceneTemp = []
      for (let i = 0; i < sceneCountH * sceneCountV; i++) {
        const scene = new THREE.Scene()

        // make a list item
        const element = document.createElement('div')
        element.className = 'list-item'
        element.style.width = `${100 / sceneCountH}%`
        element.style.height = `${100 / sceneCountV}%`

        const descriptionElement = document.createElement('div')
        descriptionElement.innerText = 'Scene ' + (i + 1)
        element.appendChild(descriptionElement)

        scene.userData.element = element
        content!.appendChild(element)

        const camera = new THREE.PerspectiveCamera(
          50,
          window.innerHeight / window.innerWidth,
          1,
          50
        )
        camera.position.z = 10
        scene.userData.camera = camera

        const controls = new OrbitControls(
          scene.userData.camera,
          scene.userData.element
        )
        controls.minDistance = 2
        controls.maxDistance = 20
        controls.enablePan = false
        controls.enableRotate = true
        // controls.enableZoom = false
        scene.userData.controls = controls

        // add one random mesh to each scene
        // const geometry = geometries[(geometries.length * Math.random()) | 0]

        // const material = new THREE.PointsMaterial({
        //   color: new THREE.Color().setHSL(Math.random(), 1, 0.75)
        //   // roughness: 0.5,
        //   // metalness: 0,
        //   // flatShading: true
        // })

        // scene.add(new THREE.Mesh(geometry, material))

        const composer = new EffectComposer(
          renderer,
          new THREE.WebGLRenderTarget(
            window.innerWidth / sceneCountH,
            window.innerHeight / sceneCountV,
            rtParameters
          )
        )
        scene.userData.composer = composer
        scene.background = new THREE.Color('#ffffff')
        sceneTemp.push(scene)
      }
      setScenes([...sceneTemp])
      renderer.setPixelRatio(window.devicePixelRatio)
      clock.start()
    }

    init()
  }, [])

  const updateSize = useCallback(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    const width = canvas!.clientWidth
    const height = canvas!.clientHeight

    if (canvas!.width !== width || canvas!.height !== height) {
      rendererRef.current?.setSize(width, height, false)
    }
  }, [])

  const render = useCallback(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    updateSize()

    if (!rendererRef.current) return
    const renderer = rendererRef.current

    canvas!.style.transform = `translateY(${window.scrollY}px)`
    renderer.setClearColor(0xffffff)
    renderer.setScissorTest(false)
    renderer.clear()

    renderer.setClearColor(0xe0e0e0)
    renderer.setScissorTest(true)

    scenes.forEach(function (scene) {
      // so something moves
      // scene.children[0].rotation.y = Date.now() * 0.001

      // get the element that is a place holder for where we want to
      // draw the scene
      const element = scene.userData.element

      // get its position relative to the page's viewport
      const rect = element.getBoundingClientRect()

      // check if it's offscreen. If so skip it
      if (
        rect.bottom < 0 ||
        rect.top > renderer.domElement.clientHeight ||
        rect.right < 0 ||
        rect.left > renderer.domElement.clientWidth
      ) {
        return // it's off screen
      }

      // set the viewport
      const width = rect.right - rect.left
      const height = rect.bottom - rect.top
      const left = rect.left
      const bottom = renderer.domElement.clientHeight - rect.bottom

      renderer.setViewport(left, bottom, width, height)
      renderer.setScissor(left, bottom, width, height)

      const camera = scene.userData.camera

      // camera.aspect = width / height // not changing in this example
      //camera.updateProjectionMatrix();

      //scene.userData.controls.update();

      renderer.render(scene, camera)

      for (
        let i = 0;
        i <= (scene.userData.composer.passes.length - 1 ?? 0);
        i++
      ) {
        const pass = scene?.userData?.composer?.passes[i]
        if (pass?.uniforms && 'iTime' in pass.uniforms) {
          pass.uniforms.iTime.value = clock.getElapsedTime()
        }
      }
      scene.userData.composer.render()
    })
  }, [scenes, updateSize])

  const animate = useCallback(() => {
    render()
    requestAnimationFrame(animate)
  }, [render])

  useEffect(() => {
    animate()
  }, [animate])

  return (
    <>
      <canvas id="c" />
      <div id="content" />
      {scenes[0] && <Metal scene={scenes[0]} />}
      {scenes[1] && <Noise scene={scenes[1]} />}
      {scenes[2] && <PointWave scene={scenes[2]} />}
    </>
  )
}
