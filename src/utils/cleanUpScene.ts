export const cleanUpScene = ( node:any, recursive = true ):void => {
  if ( !node ) return;

  if ( recursive && node.children)
    for ( const child of node.children )
    cleanUpScene( child , recursive );
 
  node.geometry && node.geometry.dispose();
  node.clear()
  if ( !node.material ) return;

  const materials = node.material.length === undefined ? [ node.material ] : node.material

  for ( const material of materials ) {

      for ( const key in material ) {

        const value = material[key];

        if ( value && typeof value === 'object' && 'minFilter' in value )
          value.dispose();

      }

      material && material.dispose();    
      
  }

}

// export const cleanUpScene = (scene: any) => {
//   console.log(scene?.children)
//   if (!scene) return
//   scene.clear()
  // scene.traverse((object:any )=> {
  //   if (!object.isMesh) return
	
  //   console.log('dispose geometry!')
  //   object.geometry.dispose()

  //   if (object.material.isMaterial) {
  //     cleanMaterial(object.material)
  //   } else {
  //     // an array of materials
  //     for (const material of object.material) cleanMaterial(material)
  //   }
  // })
// }

// const cleanMaterial = (material:any ) => {
// 	console.log('dispose material!')
// 	material.dispose()

// 	// dispose textures
// 	for (const key of Object.keys(material)) {
// 		const value = material[key]
// 		if (value && typeof value === 'object' && 'minFilter' in value) {
// 			console.log('dispose texture!')
// 			value.dispose()
// 		}
// 	}
// }