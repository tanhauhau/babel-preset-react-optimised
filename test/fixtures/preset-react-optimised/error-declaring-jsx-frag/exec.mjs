expect(() => {
  transform(
    `
    function App() {
      const __jsxFrag = 1;
      return <div></div>;
    }
  `,
    {
      presets: ['../../../../lib'],
    }
  );
}).toThrow(
  'babel-preset-react-optimised: "__jsxFrag" is used by the plugin. You should avoid declaring a variable named "__jsxFrag"'
);
