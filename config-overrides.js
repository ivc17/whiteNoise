/* config-overrides.js */
module.exports = function override(config, env) {

  const rawLoader = {
    test: /\.(frag|vert)$/,
    use: [
      {
        loader: require.resolve('raw-loader'),
        options: {
          esModule: false
        }
      }
    ]
  };

  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;
  oneOf.unshift(rawLoader);

  // config.module.rules.unshift({
  //   test: /\.frag$/,
  //   use: [
  //     {
  //       loader: require.resolve('raw-loader'),
  //       options: {
  //         esModule: false
  //       }
  //     }
  //   ]
  // })

  console.debug(config)
  return config
}
