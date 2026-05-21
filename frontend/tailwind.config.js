export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-page)',
        surface: 'var(--color-surface)',
        'surface-inner': 'var(--color-surface-inner)',
        'surface-inner-hover': 'var(--color-surface-inner-hover)',
        border: 'var(--color-border)',
        content: {
          primary: 'var(--color-content-primary)',
          body: 'var(--color-content-body)',
          muted: 'var(--color-content-muted)',
          hint: 'var(--color-content-hint)',
        },
        status: {
          success: { bg: 'var(--color-status-success-bg)', text: 'var(--color-status-success-text)' },
          warning: { bg: 'var(--color-status-warning-bg)', text: 'var(--color-status-warning-text)' },
          info: { bg: 'var(--color-status-info-bg)', text: 'var(--color-status-info-text)' },
          danger: { bg: 'var(--color-status-danger-bg)', text: 'var(--color-status-danger-text)' },
        },
        role: {
          admin: { bg: '#1e2d4a', text: '#7eb8f7' },
          customer: { bg: '#1e2d4a', text: '#7eb8f7' },
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
