import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const backfaceVisibility = plugin(function ({ addUtilities }: any) {
  addUtilities({
    ".backface-visible": {
      "backface-visibility": "visible",
      "-moz-backface-visibility": "visible",
      "-webkit-backface-visibility": "visible",
      "-ms-backface-visibility": "visible",
    },
    ".backface-hidden": {
      "backface-visibility": "hidden",
      "-moz-backface-visibility": "hidden",
      "-webkit-backface-visibility": "hidden",
      "-ms-backface-visibility": "hidden",
    },
  });
});

const overflowScrolling = plugin(function ({ addUtilities }: any) {
  addUtilities({
    ".overflow-scroll-touch": {
      "-webkit-overflow-scrolling": "touch",
    },
    ".overflow-scroll-unset": {
      "-webkit-overflow-scrolling": "unset",
    },
  });
});

const perspective = plugin(function ({ addUtilities }: any) {
  addUtilities({
    ".perspective-none": {
      perspective: "none",
    },
    ".perspective-1000": {
      perspective: "1000px",
    },
  });
});

const config: Omit<Config, "content"> = {
  plugins: [backfaceVisibility, overflowScrolling, perspective],
  prefix: "wr-",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        unity: {
          "white-15": "rgba(255, 255, 255, 0.15)",
          "white-50": "rgba(255, 255, 255, 0.50)",
          "white-5": "rgba(255, 255, 255, 0.05)",
          "coinflip-purple-400": "#A67FFF",
          "coinflip-purple-500": "#9155fd",
          "coinflip-purple-700": "#6D28D9",
          "horse-race-blue-400": "#C4F6FE",
          "horse-race-blue-500": "#23D3FF",
          "horse-race-blue-600": "#058AAB",
        },
        pink: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
          950: "#500724",
        },
        grey: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        zinc: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        },
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
          950: "#082F49",
        },
        lime: {
          50: "#F7FEE7",
          100: "#ECFCCB",
          200: "#D9F99D",
          300: "#BEF264",
          400: "#A3E635",
          500: "#84CC16",
          600: "#65A30D",
          700: "#4D7C0F",
          800: "#3F6212",
          900: "#365314",
          950: "#1A2E05",
        },
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        violet: {
          50: "#EDE9FE",
          100: "#DDD6FE",
          200: "#C4B5FD",
          300: "#A78BFA",
          400: "#F5F3FF",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
        red: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        yellow: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
          950: "#422006",
        },
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#052E16",
        },
      },
      borderRadius: {
        xl: "16px",
        lg: "12px",
        md: "10px",
        sm: "6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "timer-progress": {
          "0%": {
            width: "100%",
          },
          "100%": {
            width: "0%",
          },
        },
        "dice-shake": {
          "0%": {
            transform: "translate(1px, 1px) rotate(0deg)",
          },
          "10%": {
            transform: " translate(-1px, -2px) rotate(-1deg)",
          },
          "20%": {
            transform: "translate(-3px, 0px) rotate(1deg)",
          },
          "30%": {
            transform: "translate(3px, 2px) rotate(0deg)",
          },
          "40%": {
            transform: " translate(1px, -1px) rotate(1deg)",
          },
          "50%": {
            transform: "translate(-1px, 2px) rotate(-1deg)",
          },
          "60%": {
            transform: " translate(-3px, 1px) rotate(0deg)",
          },
          "70%": {
            transform: "translate(3px, 1px) rotate(-1deg)",
          },
          "80%": {
            transform: "translate(-1px, -1px) rotate(1deg)",
          },
          "90%": {
            transform: "translate(1px, 2px) rotate(0deg)",
          },
          "100%": {
            transform: "translate(1px, -2px) rotate(-1deg)",
          },
        },
        "left-to-right": {
          "0% ": {
            transform: "translateX(0%)",
          },
          "50%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        "right-to-left": {
          "0%, 100%": {
            left: "-100%",
            opacity: "0",
          },
          "30%, 50%, 70% ": {
            left: "0",
            opacity: "1",
          },
        },

        "roulette-rotation": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
        "roulette-ball-spin": {
          "0%": {
            transform: "translate(-50%, -50%) rotate(0deg)",
          },
          "100%": {
            transform: "translate(-50%, -50%) var(--finishTransform)",
          },
        },
        "roulette-scroll-bottom-ball": {
          "0%": {
            top: "0px",
            opacity: "1",
          },
          "15%": {
            top: "45px",
            opacity: "1",
          },
          "25%": {
            top: "35px",
            opacity: "1",
          },
          "40%": {
            top: "25px",
            opacity: "1",
            transform: "rotate(150deg)",
          },
          "60%": {
            top: "35px",
            opacity: "1",
            transform: "rotate(300deg)",
          },
          "75%": {
            top: "40px",
            opacity: "1",
            transform: "rotate(0deg)",
          },
          "90%": {
            top: "35px",
            opacity: "1",
            transform: "rotate(300deg)",
          },
          // "98%": {

          // },
          "100%": {
            top: "45px",
            opacity: "1",
            transform: "rotate(350deg)",
          },
        },
        "story-duration-bar": {
          from: {
            width: "0%",
          },
          to: {
            width: "100%",
          },
        },
        "keno-gem-flip": {
          from: {
            transform: "rotateY(0deg)",
          },
          to: {
            transform: "rotateY(180deg)",
          },
        },
        "blackjack-highlight": {
          "0%": {
            borderColor: "transparent",
          },
          "50%": {
            borderColor: "#FACC15",
          },
          "100%": {
            borderColor: "transparent",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "timer-progress": "timer-progress linear",
        "dice-shake": "dice-shake 0.5s",
        "left-to-right": "left-to-right .5s linear ",
        "right-to-left": "right-to-left 1.5s ease-out forwards ",
        "roulette-rotation": "roulette-rotation 20s linear infinite",
        "playing-roulette-rotation": "roulette-rotation 4s ease-out forwards",
        "roulette-ball-spin": "roulette-ball-spin 4s forwards",
        "roulette-scroll-bottom-ball":
          "roulette-scroll-bottom-ball 4s forwards",
        "story-duration-bar": "story-duration-bar 5s linear",
        "keno-gem-flip": "keno-gem-flip .5s linear forwards",
        "blackjack-highlight": "blackjack-highlight 2s linear infinite",
      },
      fontSize: {
        small: "13px",
        base: "14px",
        md: "16px",
        lg: "18px",
        xl: "20px",
      },
      backgroundImage: {
        dice: "linear-gradient(318deg, #FFF 17.93%, #B7B7C8 88.39%)",
        "dice-selected":
          "linear-gradient(317.54deg, #30303A 17.93%, #09090B 88.39%),linear-gradient(0deg, #41414C, #41414C)",
        "rps-scene-shadow":
          "radial-gradient(68.75% 68.75% at 50% 31.25%, rgba(9, 9, 11, 0) 52.15%, #09090B 100%)",
        "rps-select":
          " linear-gradient(127deg, rgba(255, 255, 255, 0.15) 13.87%, rgba(255, 255, 255, 0.00) 41.21%)",
        "rps-win":
          "linear-gradient(127deg, rgba(101, 163, 13, 0.35) 13.87%, rgba(101, 163, 13, 0.35) 41.21%) ",
        "rps-win-text": "linear-gradient(180deg, #A6D95C 0%, #65A30D 100%)",
        "rps-lost":
          "linear-gradient(127deg, rgba(220, 38, 38, 0.35) 13.87%, rgba(220, 38, 38, 0.35) 41.21%)",
        "rps-default":
          "linear-gradient(126.52deg, rgba(255, 255, 255, 0.15) 13.87%, rgba(255, 255, 255, 0) 41.21%)",
        "limbo-track":
          "linear-gradient(180deg, rgba(113, 113, 122, 0.20) 0%, rgba(113, 113, 122, 0.00) 100%)",
        "limbo-result":
          "linear-gradient(180deg, rgba(59, 130, 246, 0.20) 0%, rgba(59, 130, 246, 0.00) 100%)",
        "limbo-win":
          "linear-gradient(180deg, rgba(34, 197, 94, 0.20) 0%, rgba(34, 197, 94, 0.04) 100%)",
        "limbo-loss":
          "linear-gradient(180deg, rgba(220, 38, 38, 0.20) 0%, rgba(220, 38, 38, 0.04) 100%)",
        "rotated-header":
          "linear-gradient(180deg, rgba(9, 9, 11, 0.50) 0%, rgba(9, 9, 11, 0.00) 100%)",
        "rotated-footer":
          "linear-gradient(180deg, rgba(9, 9, 11, 0.00) 0%, rgba(9, 9, 11, 0.50) 100%);",
        "plinko-button":
          "url(https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games/plinko/plinko-button.png)",
        "plinko-button-disabled":
          "url(https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games/plinko/plinko-button-disabled.png)",
        "keno-cell-bg":
          "url(https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games/keno/keno-cell-bg.png)",
        "card-bg":
          "url(https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games/baccarat/jb-card-bg.svg)",
        "card-bg-black":
          "url(https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games/baccarat/card-bg-black.png)",
        "royal-flush":
          "linear-gradient(96.9deg, #FACC15 6.45%, #FFE26D 31.6%, #FACC15 51.59%)",
        "jacks-or-better":
          "radial-gradient(122.01% 129.55% at 85.62% -11.36%, #FFA05E 24.51%, #F97316 73.05%)",
        "videopoker-result":
          "radial-gradient(122.01% 129.55% at 85.62% -11.36%, #A3E635 24.51%, #65A30D 73.05%)",
      },
    },
  },

  corePlugins: {
    // preflight: false,
  },
};
export default config;
