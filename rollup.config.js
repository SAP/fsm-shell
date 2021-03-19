import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'FSMShell',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigDefaults: {
        sourceMap: true,
      },
    }),
    filesize(),
    nodeResolve(),
    commonjs(),
  ],
};
