const { template, types: t } = require('@babel/core');
const { codeFrameColumns } = require('@babel/code-frame');
const babelHelpers = require('@babel/helper-plugin-utils');
const pluginSyntaxJsx = require('@babel/plugin-syntax-jsx');

const COMMENT_TEXT = 'Injected by babel-preset-react-optimised';

module.exports = babelHelpers.declare((api, opts) => {
  api.assertVersion(7);

  const pragma = opts.pragma || 'React.createElement';
  const pragmaFrag = opts.pragmaFrag || 'React.Fragment';
  const pragmaAs = opts.pragmaAs || '__jsx';
  const pragmaFragAs = opts.pragmaFragAs || '__jsxFrag';

  const visitor = {
    VariableDeclarator: {
      enter(path, state) {
        checkIfRedeclared(path, pragmaAs);
        checkIfRedeclared(path, pragmaFragAs);
      },
    },
    JSXElement(path, state) {
      state.set('usedJsx', true);
    },
    JSXFragment(path, state) {
      state.set('usedFragment', true);
    },
    Program: {
      enter(path, state) {
        state.set('usedJsx', false);
        state.set('usedFragment', false);
      },
      exit(path, state) {
        if (state.get('usedJsx')) {
          insertStatementAfterDeclaration(
            getObject(pragma),
            t.addComment(
              template.statement(`const ${pragmaAs} = ${pragma};`)(),
              'leading',
              COMMENT_TEXT
            )
          );
        }

        if (state.get('usedFragment')) {
          insertStatementAfterDeclaration(
            getObject(pragmaFrag),
            t.addComment(
              template.statement(`const ${pragmaFragAs} = ${pragmaFrag};`)(),
              'leading',
              COMMENT_TEXT
            )
          );
        }

        function insertStatementAfterDeclaration(variableName, statement) {
          let declaration;
          const binding = path.scope.getBinding(variableName);
          if (binding) {
            declaration = binding.path.findParent(path =>
              path.parentPath.isProgram()
            );
          }

          if (declaration) {
            declaration.insertAfter(statement);
          } else {
            path.unshiftContainer('body', statement);
          }
        }
      },
    },
  };

  return {
    name: 'transform-optimise-jsx',
    inherits: pluginSyntaxJsx.default,
    visitor,
  };
});

function isInserted(node) {
  // check for leading comments
  const comments = node.leadingComments;
  return comments && comments[0] && comments[0].value === COMMENT_TEXT;
}

function checkIfRedeclared(path, name) {
  if (
    path.get('id').equals('name', name) &&
    !isInserted(path.parentPath.node)
  ) {
    throw new Error(
      `babel-preset-react-optimised: "${name}" is used by the plugin. You should avoid declaring a variable named "${name}"`
    );
  }
}

function getObject(memberExpressionString) {
  return memberExpressionString.split('.')[0];
}
