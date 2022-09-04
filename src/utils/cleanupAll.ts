import { Color, Scene } from "three";
import { cleanUpComposer } from "./cleanUpComposer";
import { cleanUpScene } from "./cleanUpScene";
import { resetCamera } from "./resetCamera";

export function cleanaupAll(scene?: Scene) {
  if (!scene) return; 
  cleanUpComposer(scene?.userData.composer)
  cleanUpScene(scene)
  resetCamera(scene.userData.camera)
  scene.background = new Color('#ffffff')
  scene.userData.element.innerHTML = ''
  scene.userData.element.style.backgroundColor='transparent'
}