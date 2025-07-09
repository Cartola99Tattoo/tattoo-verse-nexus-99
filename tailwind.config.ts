
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				heading: ['Oswald', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#ffeaed',
					100: '#ffd5db',
					200: '#ffacb7',
					300: '#ff8393',
					400: '#ff596f',
					500: '#ea384c',
					600: '#d61f3f',
					700: '#b11633',
					800: '#8d152b',
					900: '#6a1525',
					950: '#470a19'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				red: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
					950: '#450a0a'
				},
				// 99Tattoo specific colors
				tattoo: {
					red: {
						light: '#ff596f',
						DEFAULT: '#ea384c',
						dark: '#d61f3f',
						darker: '#b11633'
					},
					black: {
						light: '#374151',
						DEFAULT: '#000000',
						gray: '#1f2937'
					},
					gray: {
						light: '#f9fafb',
						DEFAULT: '#6b7280',
						dark: '#374151'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				fadeOut: {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				slideIn: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				glow: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' },
					'50%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				bounce: {
					'0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
					'50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out',
				'fade-out': 'fadeOut 0.3s ease-out',
				'slide-in': 'slideIn 0.4s ease-out',
				'slide-up': 'slideUp 0.4s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce': 'bounce 1s infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'red-gradient': 'linear-gradient(to right, #d61f3f, #ea384c, #ff596f)',
				'dark-gradient': 'linear-gradient(to bottom, #000000, #1a1a1a, #000000)',
				'tattoo-gradient': 'linear-gradient(135deg, #dc2626, #ef4444, #f87171)',
				'tattoo-dark': 'linear-gradient(135deg, #000000, #374151, #6b7280)',
				'hero-gradient': 'linear-gradient(135deg, #000000 0%, #1f2937 50%, #7f1d1d 100%)'
			},
			boxShadow: {
				'red-glow': '0 0 20px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)',
				'blue-glow': '0 0 20px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)',
				'green-glow': '0 0 20px rgba(34, 197, 94, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)',
				'enhanced': '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
				'tattoo': '0 10px 25px rgba(220, 38, 38, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
				'tattoo-lg': '0 20px 40px rgba(220, 38, 38, 0.3), 0 8px 16px rgba(0, 0, 0, 0.15)',
				'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
