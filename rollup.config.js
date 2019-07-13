import pkg from './package.json'
import { rollup } from "@ttungbmt/module-config";

const input = './src/index'

export default [
    rollup(input, [
        {file: pkg.module, format: 'es'},
        {file: pkg.main, format: 'umd', name: 'reduxNoty'},
    ], {
        pkg
    }),
]