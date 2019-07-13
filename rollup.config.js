import pkg from './package.json'
import { rollup } from "@ttungbmt/module-config";

const input = './src/index.js'

rollup.setConfig({
    pkg
})

export default [
    rollup(input, [
        [pkg.main, 'cjs'],
        [pkg.module, 'es'],
        [pkg.unpkg, 'umd', 'reduxNoty'],
    ]),
    rollup(input, [pkg.unpkg, 'umd', 'reduxNoty'], {minify: true}),
];