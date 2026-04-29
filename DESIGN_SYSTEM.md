# 🎨 DysCover - Complete Design System & Theme Guide

## 📋 Project Overview
**DysCover** is a neuro-adaptive learning platform designed for dyslexia screening and personalized education.

---

## 🎨 COLOR THEMES

The app supports **2 UI Themes** that users can toggle:

### **Theme 1: Calm UI (Default - Neuro-Adaptive)**
Designed for minimal cognitive load and stress-free experience.

#### **Color Palette:**
```css
/* Background Colors */
--app-bg: #FAFAFA (light gray-white)
--section-bg: #F3F4F6 (light gray)
--card-bg: #FFFFFF (pure white)

/* Text Colors */
--text-primary: #000000 (black)
--text-muted: #4B5563 (gray-600)
--text-secondary: #6B7280 (gray-500)

/* Accent Colors */
--primary: #3B82F6 (blue-500)
--primary-light: #EFF6FF (blue-50)
--primary-hover: #2563EB (blue-600)

/* Border Colors */
--border-light: #E5E7EB (gray-200)
--border-medium: #D1D5DB (gray-300)

/* Status Colors */
--success: #10B981 (green-500)
--warning: #F59E0B (yellow-500)
--error: #EF4444 (red-500)
--info: #3B82F6 (blue-500)

/* Shadow */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
```

#### **Component Styles (Calm Theme):**
```css
/* Cards */
card: "border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md"
cardLight: "bg-gray-100 border border-gray-200 shadow-sm rounded-3xl p-8 text-black"
cardGray: "bg-gray-50 border border-gray-200 shadow-sm rounded-3xl p-8 text-black"

/* Buttons */
btnPrimary: "bg-gray-200 text-black font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-300 transition-colors inline-flex items-center gap-2 shadow-sm"
btnSecondary: "bg-white text-black border-2 border-gray-200 font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-colors"

/* Tags/Badges */
tag: "bg-white text-black font-medium px-4 py-1.5 rounded-full inline-block border border-gray-200"
tagLight: "bg-gray-200 text-black font-medium px-4 py-1.5 rounded-full inline-block"

/* Typography */
sectionTitle: "text-3xl md:text-4xl font-semibold text-black tracking-tight leading-tight"
textMuted: "text-gray-600 leading-relaxed text-base md:text-lg"
textBase: "text-black leading-relaxed text-base md:text-lg"

/* Form Elements */
input: "w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-black focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all bg-white"
label: "font-medium text-black text-sm mb-2"

/* Logo */
logo: "w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-sm"
```

---

### **Theme 2: Neo-Brutalism (Vibrant)**
Bold, high-contrast design with strong borders and vibrant colors.

#### **Color Palette:**
```css
/* Background */
--app-bg: #FFFFFF (white with grid pattern)
--section-bg: Varies by section (vibrant colors)
--card-bg: #FFFFFF (white)

/* Vibrant Accent Colors */
--neo-yellow: #FEF08A (yellow-200)
--neo-pink: #FDA4AF (red-300)
--neo-green: #86EFAC (green-300)
--neo-purple: #D8B4FE (purple-300)
--neo-orange: #FDBA74 (orange-300)
--neo-blue: #93C5FD (blue-300)

/* Text & Borders */
--text-primary: #000000 (black)
--border-primary: #000000 (black - 4px solid)

/* Shadows (Neo-Brutalist Style) */
shadow-neo: 8px 8px 0px 0px rgba(0, 0, 0, 1)
shadow-neo-sm: 4px 4px 0px 0px rgba(0, 0, 0, 1)
shadow-neo-lg: 12px 12px 0px 0px rgba(0, 0, 0, 1)
```

#### **Component Styles (Neo Theme):**
```css
/* Cards */
card: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
cardLight: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black"
cardGray: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black"

/* Buttons */
btnPrimary: "bg-[#86EFAC] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
btnSecondary: "bg-[#FEF08A] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"

/* Tags/Badges */
tag: "bg-[#FDA4AF] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm"
tagLight: "bg-[#D8B4FE] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm"

/* Typography */
sectionTitle: "text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none text-left"
textMuted: "text-black font-bold leading-tight text-base md:text-lg"
textBase: "text-black font-bold leading-tight text-base md:text-lg"

/* Form Elements */
input: "w-full border-4 border-black px-4 py-2 text-black font-bold focus:bg-[#FEF08A] outline-none transition-all bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
label: "font-black text-black text-sm mb-1 uppercase"

/* Logo */
logo: "w-12 h-12 bg-[#86EFAC] border-4 border-black flex items-center justify-center text-black font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"

/* Background Pattern */
bg-grid: "bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"
```

---

## 📐 TYPOGRAPHY

### **Font Family:**
```css
/* Primary Font */
font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

/* Neo-Brutalism uses same font but heavier weights */
```

### **Font Sizes:**
```css
/* Heading Sizes */
text-7xl: 4.5rem (72px) - Hero titles
text-6xl: 3.75rem (60px) - Page titles
text-5xl: 3rem (48px) - Section titles
text-4xl: 2.25rem (36px) - Sub-sections
text-3xl: 1.875rem (30px) - Card titles
text-2xl: 1.5rem (24px) - Modal titles
text-xl: 1.25rem (20px) - Body large

/* Body Sizes */
text-lg: 1.125rem (18px) - Body text
text-base: 1rem (16px) - Default
text-sm: 0.875rem (14px) - Small text
text-xs: 0.75rem (12px) - Captions
```

### **Font Weights:**
```css
/* Calm Theme */
font-medium: 500
font-semibold: 600
font-bold: 700

/* Neo Theme */
font-bold: 700
font-black: 900 (used extensively)
```

### **Letter Spacing:**
```css
/* Calm Theme */
tracking-tight: -0.025em
tracking-normal: 0em

/* Neo Theme */
tracking-tighter: -0.05em
tracking-wider: 0.05em
uppercase: (all caps with tight tracking)
```

---

## 📏 SPACING SYSTEM

```css
/* Padding/Margin Scale */
space-1: 0.25rem (4px)
space-2: 0.5rem (8px)
space-3: 0.75rem (12px)
space-4: 1rem (16px)
space-6: 1.5rem (24px)
space-8: 2rem (32px)
space-10: 2.5rem (40px)
space-12: 3rem (48px)
space-16: 4rem (64px)
space-20: 5rem (80px)
```

---

## 🎭 COMPONENT PATTERNS

### **1. Hero Section**
```css
/* Layout */
- min-h-screen
- flex items-center justify-center
- text-center OR two-column grid
- padding: pt-24 pb-12 px-4

/* Elements */
- Tags: rounded-full badges at top
- Title: text-5xl to text-8xl, font-black
- Subtitle: text-lg to text-2xl, max-w-2xl
- Buttons: Two CTA buttons (primary + secondary)
- Optional: Image on right side with rotated background accent
```

### **2. Cards**
```css
/* Calm Theme Card */
- border: 1px solid #E5E7EB
- border-radius: 1.5rem (rounded-3xl)
- padding: 2rem (p-8)
- shadow: shadow-sm
- hover: shadow-md transition

/* Neo Theme Card */
- border: 4px solid #000000
- border-radius: 0 (sharp or minimal)
- padding: 1.5rem (p-6)
- shadow: 8px 8px 0px rgba(0,0,0,1)
- hover: translate + reduced shadow
- Background: Vibrant colors (yellow, pink, green, purple)
```

### **3. Buttons**
```css
/* Primary Button (Calm) */
- Background: #E5E7EB
- Border: none
- Border-radius: 9999px (rounded-full)
- Padding: 1rem 2rem
- Font: medium, text-lg
- Hover: darker gray

/* Primary Button (Neo) */
- Background: #86EFAC (green)
- Border: 4px solid black
- Border-radius: minimal
- Padding: 0.75rem 2rem
- Font: black (900), text-lg, uppercase
- Shadow: 4px 4px 0px black
- Hover: translate + no shadow
```

### **4. Form Inputs**
```css
/* Calm Input */
- Border: 2px solid #E5E7EB
- Border-radius: 1rem (rounded-2xl)
- Padding: 0.75rem 1rem
- Focus: border-gray-400 + ring-4

/* Neo Input */
- Border: 4px solid black
- Border-radius: minimal
- Padding: 0.5rem 1rem
- Focus: background changes to #FEF08A
- Shadow: 4px 4px 0px black
```

### **5. Navigation Bar**
```css
/* Desktop Nav */
- Position: fixed top
- Height: auto with padding
- Links: uppercase, font-black, text-xs to text-sm
- Active state: black bg + white text (Neo) OR primary bg (Calm)
- Spacing between links: space-x-1

/* Mobile Menu */
- Position: fixed dropdown
- Background: white
- Border/Shadow: neo style or rounded with shadow
- Padding: p-6
- Full-width links with padding
```

---

## 🌈 SECTION BACKGROUNDS (Neo Theme)

Different sections use different vibrant backgrounds:
```css
Hero: #FFFFFF (white)
Science/Stats: #FDA4AF (pink)
Features: #D8B4FE (purple)
Mission: #FFFFFF (white)
Testimonials: Mixed vibrant colors per card
Child Entry: #D8B4FE (purple)
```

---

## ✨ ANIMATIONS & TRANSITIONS

### **Framer Motion Usage:**
```javascript
// Fade In + Slide Up
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: "easeOut" }}

// Stagger Children
staggerChildren: 0.1

// Hover Effects (Neo)
hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-reduced
```

### **CSS Transitions:**
```css
transition-all duration-500 ease-out
transition-colors
transition-transform duration-700
```

---

## 🎯 ACCESSIBILITY FEATURES

### **Built-in Options:**
1. **Text-to-Speech** - Click any wrapped text to hear it
2. **Large Text Mode** - Increases base font size
3. **High Contrast** - Enhanced color contrast
4. **Reduce Motion** - Disables animations
5. **Dyslexia-Friendly Font** - OpenDyslexic font option
6. **Theme Toggle** - Switch between Calm and Neo

### **TTS Visual Feedback:**
```css
cursor-pointer
hover:bg-yellow-200/50
hover:underline decoration-wavy
transition-all
rounded px-1
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### **Common Patterns:**
```css
/* Grid Layouts */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Typography Scaling */
text-4xl md:text-5xl lg:text-6xl

/* Spacing Scaling */
space-y-6 md:space-y-8

/* Container */
container mx-auto max-w-6xl or max-w-7xl
```

---

## 🎨 SPECIAL EFFECTS

### **Neo-Brutalism:**
```css
/* Grid Background Pattern */
bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]
bg-[size:20px_20px]

/* Rotated Image Containers */
transform rotate-3 or -rotate-2
hover:rotate-0 transition-transform

/* Floating Elements */
animate-bounce
absolute positioning with z-index

/* Selection Color */
selection:bg-[#FEF08A] selection:text-black
```

### **Calm Theme:**
```css
/* Subtle Gradients */
bg-gradient-to-r from-blue-50 to-purple-50

/* Smooth Corners */
rounded-3xl (1.5rem)
rounded-full (9999px)

/* Soft Shadows */
shadow-sm, shadow-md
shadow-xl for modals
```

---

## 🧩 ICON USAGE

**Library:** Lucide React
```javascript
import { ArrowRight, Brain, BookOpen, CheckCircle, MessageSquare, Upload, FileText } from "lucide-react";
```

**Sizing:**
```css
h-4 w-4 - Small (inline with text)
h-5 w-5 - Medium (buttons)
h-6 w-6 - Standard (card headers)
h-8 w-8 - Large (section headers)
h-16 w-16 - Extra large (empty states)
h-20 w-20 - Hero icons
```

---

## 📝 CONTENT GUIDELINES

### **Tone & Voice:**
- Empowering and supportive
- Clear and simple language
- Avoid clinical jargon
- Use "child" not "patient"
- Positive framing

### **Text Formatting:**
```css
/* Headings */
- Uppercase for Neo theme
- Title case for Calm theme
- Short and impactful

/* Body Text */
- Line height: leading-relaxed or leading-tight
- Max width for readability: max-w-2xl or max-w-3xl
- Color: black or gray-600 for secondary
```

---

## 🔧 TAILWIND CONFIGURATION

Key customizations in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      // Custom colors if any
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    boxShadow: {
      neo: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      'neo-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
    }
  }
}
```

---

## 🎯 QUICK REFERENCE CHEAT SHEET

### **To Add a New Card:**
```tsx
<div className={isNeo ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 bg-[#FEF08A]" : "border border-gray-200 shadow-sm rounded-3xl p-8 bg-white"}>
  {/* Content */}
</div>
```

### **To Add a New Button:**
```tsx
<button className={isNeo ? "bg-[#86EFAC] text-black border-4 border-black font-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-gray-200 text-black font-medium px-8 py-4 rounded-full"}>
  Button Text
</button>
```

### **To Add a New Section:**
```tsx
<section className={isNeo ? "border-y-8 border-black bg-[#FDA4AF]" : "border-y border-gray-200 bg-gray-50"}>
  <div className="container mx-auto max-w-6xl px-4 py-20">
    {/* Content */}
  </div>
</section>
```

---

## 📦 TECH STACK

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5.4.10
- **Styling:** Tailwind CSS 3.4+
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **State:** React Context + Hooks
- **Backend:** Supabase
- **AI:** Google Gemini / OpenAI / Groq
- **PDF:** PDF.js
- **TTS:** Web Speech API

---

## 🎨 DESIGN PRINCIPLES

1. **Neuro-Adaptive** - Design adapts to user needs
2. **Accessible First** - WCAG compliance, TTS support
3. **Dual Theme** - Calm for focus, Neo for engagement
4. **Consistent Spacing** - 4px base grid system
5. **High Contrast** - Black text on light backgrounds
6. **Bold Typography** - Clear hierarchy, readable sizes
7. **Playful but Professional** - Especially in Neo theme
8. **Mobile-First** - Responsive across all devices

---

## 📞 CONTACT & SUPPORT

For questions about the design system, refer to:
- Tailwind CSS Documentation: https://tailwindcss.com
- shadcn/ui Components: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion

---

**Last Updated:** April 2025
**Version:** 1.0
