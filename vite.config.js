import { defineConfig , loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  base:"/",
  plugins: [react(),svgr(),tsconfigPaths(),],
  server: {
    port: 3000, 
    open: true,   
    host:true,
    
  },
  build:{
    outDir:"dist",
    emptyOutDir:true
  },
  define:{
     'process.env': env
  }
}
});
