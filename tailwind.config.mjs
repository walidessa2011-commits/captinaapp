/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#ff0000", // Pure Red
                    light: "#ff3333",
                    dark: "#cc0000",
                    soft: "#fff5f5",
                },
                secondary: {
                    DEFAULT: "#ff8c00", // Darker Orange
                    dark: "#e67e00",
                },
                neutral: {
                    50: "#f8f9fa",
                    100: "#e9ecef",
                    200: "#dee2e6",
                    800: "#343a40",
                    900: "#212529",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["Tajawal", "Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                "2xl": "1.25rem",
                "3xl": "2rem",
                "4xl": "2.5rem",
                "5xl": "3.5rem",
            },
            boxShadow: {
                'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.03)',
                'active': '0 15px 35px -5px rgba(255, 0, 0, 0.3)',
            }
        },
    },
    plugins: [],
};
