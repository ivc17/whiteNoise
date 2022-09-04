import { PerspectiveCamera } from "three";
import { sceneCountH, sceneCountV } from "../components/Canvas";

export function resetCamera(camera?: PerspectiveCamera) {
  if (!camera) return
  camera.position.set(0,0,10)
  camera.fov = 50
  camera.aspect=(window.innerHeight / sceneCountV )/ (window.innerWidth / sceneCountH)
  camera.near=1
  camera.far = 50
  camera.focus=10
  camera.rotation.set(0, 0, 0)
  camera.zoom = 1
  camera.scale.set(1, 1, 1)
  camera.up.set(0,  1, 0)

camera.updateProjectionMatrix();

}

