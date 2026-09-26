import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            // فهرست کلمه‌ها تقریباً هیچ‌وقت عوض نمی‌شود ولی حجمش زیاد است، و کد
            // برنامه برعکس. جدا کردنشان یعنی با هر به‌روزرسانی، کاربر فقط تکه‌ی
            // کوچکِ برنامه را دوباره می‌گیرد و فهرست از کش می‌آید.
            { name: 'dictionary', test: /src[\\/]data[\\/]dictionary/ },
          ],
        },
      },
    },
  },
})
