import { ReactNode, useEffect } from 'react'
import { Scene } from 'three'
import { cleanaupAll } from '../utils/cleanupAll'

export default function BaseSceneBlock({
  children,
  scene
}: {
  children?: ReactNode
  scene?: Scene
}) {
  useEffect(() => {
    cleanaupAll(scene)

    return () => {
      cleanaupAll(scene)
    }
  }, [scene])

  return <>{children}</>
}
