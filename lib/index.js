const helperPluginUtils = require('@babel/helper-plugin-utils');
const presetReact = require('@babel/preset-react').default;
const pluginTransformOptimiseJsx = require('./plugins/transform-optimise-jsx');

module.exports = helperPluginUtils.declare((api, opts) => {
  api.assertVersion(7);

  const pragma = opts.pragma || 'React.createElement';
  const pragmaFrag = opts.pragmaFrag || 'React.Fragment';
  const pragmaAs = opts.pragmaAs || '__jsx';
  const pragmaFragAs = opts.pragmaFragAs || '__jsxFrag';

  return {
    presets: [
      [
        presetReact,
        {
          ...opts,
          pragma: pragmaAs,
          pragmaFrag: pragmaFragAs,
        },
      ],
    ],
    plugins: [
      [
        pluginTransformOptimiseJsx,
        {
          pragma,
          pragmaAs,
          pragmaFrag,
          pragmaFragAs,
        },
      ],
    ],
  };
});
