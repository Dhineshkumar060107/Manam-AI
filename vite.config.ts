import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.FIREBASE_API_KEY': JSON.stringify(env.Firebase_API_KEY),
        'process.env.authDomain': JSON.stringify(env.authDomain),
        'process.env.databaseURL': JSON.stringify(env.databaseURL),
        'process.env.projectId': JSON.stringify(env.projectId),
        'process.env.storageBucket': JSON.stringify(env.storageBucket),
        'process.env.appId': JSON.stringify(env.appId),
        'process.env.messagingSenderId': JSON.stringify(env.messagingSenderId),
        'process.env.measurementId': JSON.stringify(env.measurementId),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
