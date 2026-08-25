/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                scarlet: {
                    DEFAULT: '#990000',
                    dark: '#7A0000',
                },
                gold: {
                    DEFAULT: '#D4A574',
                    light: '#E5C29A',
                    dark: '#B08856',
                },
                steel: {
                    DEFAULT: '#1E293B',
                    dark: '#0F172A',
                    light: '#334155',
                },
                olive: {
                    DEFAULT: '#4A5D4E',
                    dark: '#2D3A2D',
                },
                sand: {
                    DEFAULT: '#F5F3F0',
                    dark: '#EAE6E1',
                },
                navy: '#0A1B3B',
                cream: '#F5F3F0',
                green: '#2D7A4A',
            },
        },
    },
    plugins: [],
}
