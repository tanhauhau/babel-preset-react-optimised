expect(() => {
  transform(
    `
    function App() {
      const __jsx = 1;
      return <div></div>;
    }
  `,
    {
      presets: ['../../../../lib'],
    }
  );
}).toThrow(
  'babel-preset-react-optimised: "__jsx" is used by the plugin. You should avoid declaring a variable named "__jsx"'
);
