
module.exports = {
  
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d65032',
        'orange-mge':'#ff3d08',
        'secondary':'#181818',
        'dark':'#000000',
        'dark-gray':'#5E656D',

      },
      fontFamily: {
        "ea-football": ['ea-football', 'sans-serif'],
        "street-fighter": ['street-fighter', 'sans-serif'],
        "free-fire": ['free-fire', 'sans-serif'],
        custom: ['nightWarrior', 'sans-serif'],
        pilot: ['pilot', 'sans-serif'],
        juvanze: ['juvanze', 'sans-serif'],
        valorant: ['valorant', 'sans-serif']

      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    } 
  },
  plugins: [],
}