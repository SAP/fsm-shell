import typescript from 'rollup-plugin-typescript2'
import filesize from 'rollup-plugin-filesize'
import typescriptLib from 'typescript'

import pkg from './package.json' with { type: 'json' }

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'FSMShell',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
  ],
  plugins: [
    typescript({
      typescript: typescriptLib,
      tsconfigDefaults: {
        sourceMap: true,
        compilerOptions: {
          importHelpers: false
        }
      }
    }),
    filesize()
  ],
}
