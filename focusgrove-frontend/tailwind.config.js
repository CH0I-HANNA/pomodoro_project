/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-orange": "#16AEA5",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },

        // 🟢 Tooltip 등장 애니메이션 추가
        fadeInScale: {
          "0%": {
            opacity: 0,
            transform: "scale(0.88)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      },
      animation: {
        shake: "shake 0.45s ease-in-out",

        // 🟢 Tooltip 적용될 animation 등록
        fadeInScale: "fadeInScale 0.18s ease-out",
      },
    },
  },
  plugins: [],
};
