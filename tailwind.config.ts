import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Enhanced feedback states
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
          light: "var(--info-light)",
          border: "var(--info-border)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
          light: "var(--warning-light)",
          border: "var(--warning-border)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
          light: "var(--error-light)",
          border: "var(--error-border)",
        },
        // Data visualization colors
        data: {
          positive: "var(--data-positive)",
          negative: "var(--data-negative)",
          neutral: "var(--data-neutral)",
          primary: "var(--data-primary)",
          secondary: "var(--data-secondary)",
          tertiary: "var(--data-tertiary)",
        },
        // Trust signal colors
        trust: {
          verified: "var(--trust-verified)",
          secure: "var(--trust-secure)",
          certified: "var(--trust-certified)",
          warning: "var(--trust-warning)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      // Motion design tokens
      transitionDuration: {
        instant: "var(--motion-instant)",
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)",
        slower: "var(--motion-slower)",
      },
      transitionTimingFunction: {
        linear: "var(--ease-linear)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        'in-out': "var(--ease-in-out)",
        back: "var(--ease-back)",
        bounce: "var(--ease-bounce)",
      },
      // Touch target and interaction sizes
      spacing: {
        'touch-min': "var(--touch-target-min)",
        'distance-sm': "var(--distance-sm)",
        'distance-md': "var(--distance-md)",
        'distance-lg': "var(--distance-lg)",
        'distance-xl': "var(--distance-xl)",
      },
      // State tokens for interactions
      opacity: {
        'state-hover': "var(--state-hover-opacity)",
        'state-active': "var(--state-active-opacity)",
        'state-disabled': "var(--state-disabled-opacity)",
      },
      ringWidth: {
        'focus': "var(--state-focus-width)",
      },
      ringOffsetWidth: {
        'focus': "var(--state-focus-offset)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        pointsGlow: {
          "0%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          },
          "100%": {
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "points-glow": "pointsGlow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
