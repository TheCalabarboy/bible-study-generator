import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'firebase': ['firebase/app', 'firebase/auth'],
          'document-export': ['docx', 'jspdf', 'html2canvas', 'file-saver'],
          'ai-vendor': ['@google/generative-ai'],
          'markdown': ['marked', 'dompurify'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});