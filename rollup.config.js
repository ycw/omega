import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import path from 'path';

const pluginsJs = [
  typescript(),
  terser({
    format: {
      comments: false
    }
  })
];

const pluginsDts = [dts()];

const config = [];
for (const name of fs.readdirSync('src')) {
  const index = new URL(path.join('src', name, 'index.ts'), import.meta.url);
  if (!fs.existsSync(index)) continue;
  config.push({
    input: `src/${name}/index.ts`,
    output: { file: `dist/${name}.js` },
    external: [/^three(?:\/|$)/],
    plugins: pluginsJs
  }, {
    input: `src/${name}/index.ts`,
    output: { file: `dist/${name}.d.ts` },
    plugins: pluginsDts
  });
}

export default config;