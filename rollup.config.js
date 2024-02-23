import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from "rollup-plugin-generate-package-json";
import { terser } from "rollup-plugin-terser"
const packageJson = require('./package.json');

const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    useTsconfigDeclarationDir: true,
  }),
  terser(),
];

const folders = ["components", "engine"];
const folderBuilds = folders.map(folder => {
  return {
    input: `src/${folder}/index.ts`,
    output: {
      file: `dist/${folder}/index.js`,
      sourcemap: true,
      exports: "named",
      format: "esm"
    },
    plugins: [
      ...plugins,
      generatePackageJson({
        baseContents: {
          name: `${packageJson.name}/${folder}`,
          private: true,
          main: "../cjs/index.js", // --> points to cjs format entry point of whole library
          module: "./index.js", // --> points to esm format entry point of individual component
          types: "./index.d.ts",
        }
      })
    ],
    external: ["react", "react-dom"]
  }
})

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "named"
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        exports: "named"
      }
    ],
    plugins,
    external: ["react", "react-dom"]
  },
  ...folderBuilds
]