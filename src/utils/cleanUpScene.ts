export const cleanUpScene = ( node:any, recursive = true ):void => {

  if ( !node ) return;

  if ( recursive && node.children)
    for ( const child of node.children )
    cleanUpScene( child , recursive );

  node.geometry && node.geometry.dispose();
  
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