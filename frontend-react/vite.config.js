import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],

    server: {
        port: 3000,
        strictPort: true,

        // --- КРИТИЧНЕ ВИПРАВЛЕННЯ: PROXY ---
        proxy: {
            // Перенаправляє запити з /api на ваш Spring Boot бекенд
            '/api': {
                // У Docker Compose бекенд доступний через сервіс 'backend' на порту 8080
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, ''), // Не обов'язково, якщо Spring Boot очікує /api
            },
        },
        // --- КІНЕЦЬ ВИПРАВЛЕННЯ ---
    }
})