import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import { dts } from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import obfuscator from 'rollup-plugin-obfuscator';
import cfg from "./config.json"
export default [
    {
        module: "ESNext",
        input: 'src/index.ts',
        output: [
            {
                file: `${cfg.output}/${cfg.filePrefix}.cjs.js`,
                format: 'cjs',
                exports: 'named',
            },
            {
                file: `${cfg.output}/${cfg.filePrefix}.esm.js`,
                format: 'esm',
            }
        ],
        external: [
            'koffi'
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                useTsconfigDeclarationDir: true,
                clean: true
            }),
            terser(),
            obfuscator({
                target: "node",
                renamePropertiesMode: 'safe',
                compact: true,
            }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled'
            }),
            copy({
                targets: [
                    { src: 'template/index.js', dest: cfg.output },
                    { src: 'source', dest: cfg.output },
                ]
            })
        ]
    },
    {
        input: 'dist/types/index.d.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es'
        },
        plugins: [dts()]
    }
];
