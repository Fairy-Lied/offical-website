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
  safelist: [
    'md:flex-row',
    'md:flex-col',
    'md:items-center',
    'md:justify-between',
    'md:gap-0',
    'md:gap-8',
    'md:px-[140px]',
    'md:px-[120px]',
    'md:w-[320px]',
    'md:w-[180px]',
    'md:w-[100px]',
    'md:w-[60px]',
    'md:h-[420px]',
    'md:h-[180px]',
    'md:text-[30px]',
    'md:text-[34px]',
    'md:text-sm',
    'md:text-[13px]',
    'md:mt-0',
    'md:py-[10px]',
    'md:p-[14px]',
    'md:rounded',
    'md:grid-cols-4',
    'md:grid-cols-3',
    'md:hidden',
  ],
  theme: {
    extend: {
      colors: {
        // V2 设计配色
        'primary-accent': 'var(--primary-accent)',
        'primary-accent-hover': 'var(--primary-accent-hover)',
        'primary-dark': 'var(--primary-dark)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-card': 'var(--bg-card)',
        'text-title': 'var(--text-title)',
        'text-body': 'var(--text-body)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-accent': 'var(--border-accent)',
      },
      boxShadow: {
        'red': 'var(--shadow-red)',
        'dark': 'var(--shadow-dark)',
      },
      fontFamily: {
        'metal': ['Cinzel', 'serif'],
        'sans': ['Inter', 'Roboto', 'Noto Sans SC', 'sans-serif'],
      },
      transitionDuration: {
        'hover': '180ms',
        'press': '120ms',
      },
    },
  },
  plugins: [],
}
