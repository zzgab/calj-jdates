const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');

module.exports = {
    input: 'src/lib/index.ts',
    output: {
        file: 'dist/jdates.min.js',
        format: 'cjs',
    },
    plugins: [typescript({module: "esnext"}), terser()],
};