import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import autoprefixer from 'autoprefixer'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      customCollections: {
        base: FileSystemIconLoader('./src/assets/icons', (svg) =>
          svg
            .replace(/fill="[^"]+"/gi, 'fill="currentColor"')
            .replace(/<svg/, '<svg class="icon" style="display:block"')
        )
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}) // add options if needed
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
