export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#0f1117',
        surface: '#1a1d27',
        'surface-inner': '#23263a',
        border: '#2e3140',
        content: {
          primary: '#e8eaf2',
          body: '#c4c8dc',
          muted: '#8b90a8',
          hint: '#4a4f66',
        },
        status: {
          success: { bg: '#14301f', text: '#4ade80' },
          warning: { bg: '#2d2010', text: '#fbbf24' },
          info: { bg: '#0e2040', text: '#7eb8f7' },
          danger: { bg: '#2d1010', text: '#f87171' },
        },
        role: {
          admin: { bg: '#1e2d4a', text: '#7eb8f7' },
          customer: { bg: '#1e2d4a', text: '#7eb8f7' }, // Same as admin based on prompt "Customer = blue"
          technician: { bg: '#2d2010', text: '#fbbf24' },
        }
      },
      fontSize: {
        base: '13px',
        label: '11px',
        stat: ['22px', '1.2'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
      },
      borderWidth: {
        DEFAULT: '0.5px', // "0.5px solid #2e3140"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
