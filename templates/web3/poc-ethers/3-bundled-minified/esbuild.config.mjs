import { build } from 'esbuild'

build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: './dist/index.js',
  sourcemap: true,
  minify: true,
  external: []
}).catch(() => process.exit(1))
