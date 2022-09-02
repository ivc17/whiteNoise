import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

export const cleanUpComposer=(composer:EffectComposer|undefined) =>{
  if (!composer) return; 
  for (let pass of composer.passes) {
  composer.removePass(pass)
}
}