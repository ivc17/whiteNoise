import { ReactNode, useEffect } from 'react'
import { Scene } from 'three'
import { cleanUpScene } from '../utils/cleanUpScene'

export default function BaseSceneBlock({
  children,
  scene
}: {
  children?: ReactNode
  scene?: Scene
}) {
  useEffect(() => {
    return () => {
      cleanUpScene(scene)
    }
  }, [scene])

  return <>{children}</>
}
