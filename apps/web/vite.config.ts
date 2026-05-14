import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'yjs',
      'y-websocket',
      'y-prosemirror',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-collaboration',
      '@tiptap/extension-collaboration-cursor',
    ],
  },
  server: {
    fs: {
      allow: [
        // search up for workspace root
        path.resolve(__dirname, '../../'),
      ],
    },
  },
})
