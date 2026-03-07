/**
 * @Author: 美兰十三 luna_yj@hotmail.com
 * @Date: 2025-06-27 14:34:19
 * @LastEditors: 美兰十三 luna_yj@hotmail.com
 * @LastEditTime: 2025-06-27 14:35:40
 * @FilePath: tailwind.config.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': 'var(--primary-red)',
        'primary-dark': 'var(--primary-dark)',
        'accent-gold': 'var(--accent-gold)',
        'accent-orange': 'var(--accent-orange)',
        'bg-black': 'var(--bg-black)',
        'bg-dark': 'var(--bg-dark)',
        'bg-card': 'var(--bg-card)',
        'text-white': 'var(--text-white)',
        'text-light': 'var(--text-light)',
        'text-gray': 'var(--text-gray)',
        'text-dark': 'var(--text-dark)',
        'border-dark': 'var(--border-dark)',
        'border-light': 'var(--border-light)',
      },
      boxShadow: {
        'red': 'var(--shadow-red)',
        'dark': 'var(--shadow-dark)',
      },
      fontFamily: {
        'metal': ['Cinzel', 'serif'],
        'sans': ['Roboto', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
