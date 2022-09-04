import { useEffect, useRef } from 'react'
import {
  Color,
  CylinderGeometry,
  DoubleSide,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Scene
} from 'three'
import BaseSceneBlock from './BaseSceneBlock'
import { clock } from './Canvas'

export default function Twist({ scene }: { scene: Scene }) {
  const shaderRef = useRef<any>()
  useEffect(() => {
    if (!scene) return
    let mounted = true
    const geometry = new CylinderGeometry(0.3, 1.5, 15, 3, 30)
    geometry.center()

    let mesh = new Mesh(geometry, buildTwistMaterial(2.0))
    mesh.position.z = -3.5
    mesh.castShadow = true //default is false
    mesh.receiveShadow = true
    scene.add(mesh)

    // const planeGeometry = new PlaneGeometry(30, 30, 1, 1)
    // const planeMaterial = new MeshBasicMaterial({
    //   color: new Color('#cccccc'),
    //   reflectivity: 0
    // })

    // const planeMesh = new Mesh(planeGeometry, planeMaterial)
    // planeMesh.position.z = -4
    // planeMesh.receiveShadow = true
    // scene.add(planeMesh)

    const light = new PointLight(new Color('#ffffff'), 1, 10)
    light.decay = 0.5
    light.shadow.camera.near = 0.5 // default
    light.shadow.camera.far = 500 // default
    scene.add(light)

    const line = new LineSegments(
      geometry,
      new LineBasicMaterial({
        color: '#fff',
        fog: true
      } as any)
    )

    scene.add(line)
    scene.background = new Color(0xcccccc)

    function buildTwistMaterial(amount: number) {
      const material = new MeshPhongMaterial({
        color: new Color('#ffffff')
      })
      material.side = DoubleSide
      material.onBeforeCompile = function (shader) {
        shader.uniforms.iTime = { value: 0 }
        shaderRef.current = shader
        shader.vertexShader = 'uniform float iTime;\n' + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          [
            `float theta = sin( iTime + position.y ) / ${amount.toFixed(1)};`,
            'float c = cos( theta );',
            'float s = sin( theta );',
            'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
            'vec3 transformed = vec3( position ) * m;',
            'vNormal = vNormal * m;'
          ].join('\n')
        )

        material.userData.shader = shader
      }

      // Make sure WebGLRenderer doesnt reuse a single program

      material.customProgramCacheKey = function () {
        return amount + ''
      }

      return material
    }

    function animate() {
      if (mounted) {
        requestAnimationFrame(animate)

        render()
        if (shaderRef.current) {
          shaderRef.current.uniforms.iTime.value = clock.getElapsedTime()
        }
      }
    }

    function render() {
      scene.traverse(function (child: any) {
        if (child.isMesh) {
          const shader = child.material.userData.shader

          if (shader) {
            shader.uniforms.iTime.value = performance.now() / 1000
          }
        }
      })
    }

    animate()
    return () => {
      mounted = false
    }
  }, [scene])

  return <BaseSceneBlock scene={scene}></BaseSceneBlock>
}
