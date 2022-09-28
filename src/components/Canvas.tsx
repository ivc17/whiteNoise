import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Clock, MathUtils, Scene, WebGLRenderer } from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { screens } from '../constants'
import { genKey } from '../utils/genKey'

export const sceneCountH = 3
export const sceneCountV = 3

const rtParameters = {
  stencilBuffer: true
}

// const screensStateOn= {
//   metal: false,
//   noise: false,
//   pointWav: false,
//   terrainMarble: false,
//   terrain: false,
//   terrain2: false,
//   twist: false,
//   twistText: false,
//   barbedWire: false,
//   gridText: false,
//   ascii: false
// }

const screensStateOn = [
  //metal
  true,
  //noise
  true,
  // pointWav
  true,
  //terrainMarble
  true,
  //terrain
  true,
  //terrain2
  true,
  // twist
  true,
  // twistText
  true,
  // barbedWire
  false,
  // gridText
  true,
  //ascii
  false
]

const defaultDisplays = [
  screens.twist,
  screens.noise,
  screens.pointWav,
  screens.terrainMarble,
  screens.terrain2,
  screens.gridText,
  screens.metal,
  screens.terrain,
  screens.twistText
]

export const clock = new Clock(true)

const updateFnFactory = (screenNum: number, setOnDisplay: any) => {
  const fn = () => {
    setTimeout(fn, MathUtils.randInt(15, 17) * 1000)
    setOnDisplay((prev: any) => {
      const newArr = [...prev]
      const { key, id } = genKey(screensStateOn, false)
      screensStateOn[prev[screenNum].id] = false
      screensStateOn[id] = true
      newArr[screenNum] = screens[key as keyof typeof screens]
      return newArr
    })
  }
  setTimeout(fn, MathUtils.randInt(7, 9) * 1000)
}

const mouseEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLDivElement
  target.classList.add('active')
}

const mouseLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLDivElement
  target.classList.remove('active')
}

export default function Canvas() {
  const rendererRef = useRef<WebGLRenderer>()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [onDisplay, setOnDisplay] =
    useState<{ id: number; component: React.FC<any> }[]>(defaultDisplays)

  const updateSize = useCallback(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const width = canvas!.clientWidth
    const height = canvas!.clientHeight

    if (canvas!.width !== width || canvas!.height !== height) {
      rendererRef.current?.setSize(width, height, false)
    }

    const content = document.querySelectorAll('#content div')
    const arr = Array.from(content) as HTMLDivElement[]
    arr.forEach((el) => {
      el.style.width = `${100 / sceneCountH}%`
      el.style.height = `${100 / sceneCountV}%`
    })
  }, [])

  useEffect(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    const content = document.getElementById('content') as HTMLDivElement
    updateSize()
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
      updateSize()
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

        element.addEventListener('mouseenter', mouseEnter)
        element.addEventListener('mouseleave', mouseLeave)

        scene.userData.element = element
        content!.appendChild(element)

        const camera = new THREE.PerspectiveCamera(
          50,
          window.innerHeight / sceneCountV / (window.innerWidth / sceneCountH),
          1,
          50
        )
        camera.position.z = 10
        scene.userData.camera = camera

        // const controls = new OrbitControls(
        //   scene.userData.camera,
        //   scene.userData.element
        // )
        // controls.minDistance = 2
        // controls.maxDistance = 20
        // controls.enablePan = false
        // controls.enableRotate = true
        // controls.enableZoom = true
        // scene.userData.controls = controls

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
      setScenes(sceneTemp)
      renderer.setPixelRatio(window.devicePixelRatio)
      clock.start()
    }

    init()
    Array.from(Array(sceneCountH * sceneCountV).keys()).forEach((_, idx) => {
      updateFnFactory(idx, setOnDisplay)
    })
    // updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [updateSize])

  const render = useCallback(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement

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

      camera.aspect = width / height // not changing in this example
      camera.updateProjectionMatrix()

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

    return () => {
      scenes.forEach((scene) => {
        scene.userData.element.removeEventListener('mouseenter', mouseEnter)
        scene.userData.element.removeEventListener('mouseleave', mouseEnter)
      })
    }
  }, [scenes])

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
      {onDisplay.map(({ component }, idx) => {
        const Content = component as any

        return (
          <Content
            scene={scenes[idx]}
            key={idx}
            renderer={rendererRef.current}
          />
        )
      })}
      {/*kinetic typography,ascii rose, deck,infoglitch,Butterfly,GhoseMouse,Fractal,BlackPlanet,,particle/snow,cloud,glitch,matric rain ,mosaic,lightning(flash)*/}
    </>
  )
}
