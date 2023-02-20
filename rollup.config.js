const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const iifeNS = require("rollup-plugin-iife-namespace");

module.exports = {
  input: "src/index.ts",
  output: {
    file: "dist/cdn/calj.min.js",
    format: "iife",
    name: "CalJ",
  },
  plugins: [
    typescript({ module: "esnext", declaration: false }),
    iifeNS(),
    terser(),
  ],
};
