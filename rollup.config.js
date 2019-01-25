import typescript from 'rollup-plugin-typescript2'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'FSMShell'
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    filesize()
  ],
}
