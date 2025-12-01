/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors (Yellow/Gold) - Already match the image
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706", // Main gold from logo
          700: "#b45309", // Darker gold from logo
        },
        // Secondary/Accent colors (Purple) - Already match the image
        accent: {
          400: "#c084fc",
          500: "#a855f7", // Purple from gradient
          600: "#9333ea",
          700: "#7e22ce", // Darker purple from gradient
        },
        // Supporting colors
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        // Add black for background
        black: "#000000",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #d97706 0%, #a855f7 50%, #7e22ce 100%)",
        "gradient-primary-light":
          "linear-gradient(135deg, #fffbeb 0%, #faf5ff 100%)",
        "gradient-accent": "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
        "gradient-radial": "radial-gradient(circle, #d97706 0%, #b45309 100%)",
        "gradient-conic":
          "conic-gradient(from 0deg, #d97706, #a855f7, #7e22ce, #d97706)",
        "grid-pattern":
          "linear-gradient(90deg, rgba(217, 119, 6, 0.1) 1px, transparent 1px), linear-gradient(rgba(217, 119, 6, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "300%": "300%",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-down": "fadeInDown 0.8s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "slide-left": "slideLeft 0.8s ease-out",
        "slide-right": "slideRight 0.8s ease-out",
        float: "float 6s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "bounce-slow": "bounceSlow 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        gradient: "gradient 8s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "spin-slow": "spinSlow 3s linear infinite",
        "ping-slow": "pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scale-in": "scaleIn 0.5s ease-out",
        "rotate-in": "rotateIn 0.8s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(0)" },
          "75%": { transform: "translateY(-5px)" },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(217, 119, 6, 0.2)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 10px rgba(217, 119, 6, 0.1)",
          },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-1deg)" },
          "75%": { transform: "rotate(1deg)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pingSlow: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        rotateIn: {
          "0%": { opacity: "0", transform: "rotate(-10deg)" },
          "100%": { opacity: "1", transform: "rotate(0)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(217, 119, 6, 0.2)",
        "glow-lg": "0 0 40px rgba(217, 119, 6, 0.3)",
        "glow-accent": "0 0 20px rgba(147, 51, 234, 0.2)",
      },
    },
  },
  plugins: [],
};
