/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crm: {
          bg: {
            deep: '#0B0F19',
            surface: '#0F172A',
            elevated: '#1E293B',
          },
          glass: {
            DEFAULT: 'rgba(30, 41, 59, 0.7)',
            surface: 'rgba(30, 41, 59, 0.7)',
            hover: 'rgba(51, 65, 85, 0.75)',
            border: 'rgba(255, 255, 255, 0.08)',
            'border-subtle': 'rgba(255, 255, 255, 0.04)',
            'border-active': 'rgba(99, 102, 241, 0.5)',
          },
          stage: {
            new: '#0284C7',        // Sky
            contacted: '#D97706',  // Amber
            qualified: '#7C3AED',  // Violet
            won: '#059669',        // Emerald
            lost: '#E11D48',       // Rose
          },
        },
      },
      backgroundImage: {
        'metric-total': 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(30, 58, 138, 0.1) 100%)',
        'metric-qualified': 'linear-gradient(135deg, rgba(225, 29, 72, 0.3) 0%, rgba(88, 28, 135, 0.1) 100%)',
        'metric-won': 'linear-gradient(135deg, rgba(5, 150, 105, 0.3) 0%, rgba(19, 78, 74, 0.1) 100%)',
        'metric-pipeline': 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(49, 46, 129, 0.1) 100%)',
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%)',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
