/*
const {build} = require('esbuild');

build({
  entryPoints: ['src/queue/index.ts', 'src/abort/index.ts'],
  bundle: true,
  target: 'es2016',
  platform: 'browser'
}).catch(() => process.exit(1))
*/
require("esbuild")
  .build({
    entryPoints: ["queue/index.ts", "abort/index.ts", "fork/index.ts"],
    platform: "browser",
    target: "es2016",
    outdir: "dist",
    bundle: true,
  })
  .catch(() => process.exit(1));
