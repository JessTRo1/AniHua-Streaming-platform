import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code',
      }
    })
  ],
  shortcuts: {
    // Anihua specific shortcuts
    'anime-card': 'relative overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-300',
    'anime-title': 'text-white text-lg font-semibold truncate',
    'section-title': 'text-2xl font-bold text-white mb-6',
    'btn-primary': 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors',
    'btn-secondary': 'bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors',
    'container-main': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'grid-anime': 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
    'player-control': 'bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full backdrop-blur-sm transition-colors',
  },
  theme: {
    colors: {
      // Anihua streaming platform colors
      primary: {
        50: '#fee7ef',
        100: '#fdd0df',
        200: '#faa0bf',
        300: '#f871a0',
        400: '#f54180',
        500: '#f31260', 
        600: '#c20e4d',
        700: '#920b3a',
        800: '#610726',
        900: '#310413'
      },
      anime: {
        dark: '#0a0a12',
        darker: '#07070d',
        card: '#1a1a2e',
        accent: '#ff2e63'
      }
    },
    animation: {
      keyframes: {
        'slide-up': '{0% { transform: translateY(100%); opacity: 0 } 100% { transform: translateY(0); opacity: 1 }}',
        'fade-in': '{0% { opacity: 0 } 100% { opacity: 1 }}',
        'pulse-slow': '{0%, 100% { opacity: 1 } 50% { opacity: .5 }}'
      }
    }
  }
})