import { defineConfig } from 'tsup';

// Bundles the server into one file. `@pc-builder/shared` ships as TypeScript source, so it has to
// be bundled in (everything else stays a normal dependency installed on the host).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  noExternal: ['@pc-builder/shared'],
  clean: true,
});
