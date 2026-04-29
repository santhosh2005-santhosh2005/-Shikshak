# 🧠 DysCover: Empowering Minds Through Early Dyslexia Screening

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**DysCover** is a high-fidelity, accessible screening platform designed to assist in the early identification of dyslexia. By combining cognitive science principles with modern web technology, DysCover provides a stress-free environment for children and adults to understand their unique learning profiles.

---

## 🎯 Our Mission
Dyslexia affects nearly **1 in 10** people globally, yet a staggering **80%** go undiagnosed until adulthood. Early screening is the most critical factor in successful intervention. DysCover’s mission is to:
- **Democratize Access**: Provide free, high-quality screening tools without geographical barriers.
- **Reduce Stigma**: Frame dyslexia as a different way of processing information, not a deficit.
- **Ensure Clarity**: Deliver actionable insights and next-step recommendations for parents and educators.

---

## ✨ Key Features

### 🔍 Comprehensive Screening Suites
Tailored assessments categorized by age groups (6-9, 9-12, and 12+) to ensure age-appropriate cognitive load:
- **Phonological Awarenes**: Identification of phonemes and sound-letter relationships.
- **Working Memory**: Visual and auditory sequencing tasks to measure recall capacity.
- **Rapid Naming & Recognition**: Measuring speed of lexical access using familiar objects and letters.
- **Reading & Orthography**: Analyzing spelling patterns and reading fluency.

### ♿ Accessibility-First Design
Built from the ground up for neurodivergent users:
- **OpenDyslexic Support**: One-click toggle for specialized fonts that reduce letter-swapping.
- **Text-to-Speech (TTS)**: Integrated verbal guidance for all screening questions.
- **Adjustable Spacing**: Control over line and letter spacing to improve readability.
- **High-Contrast Modes**: Color palettes optimized for visual comfort and reduced cognitive strain.

### 📊 Insightful Results Dashboard
After completion, users receive a detailed breakdown:
- **Risk Assessment**: Categorized as Low, Moderate, or High risk based on scoring patterns.
- **Strength Mapping**: Highlights where the user excels (e.g., visual memory vs. phonological processing).
- **Personalized Recommendations**: Guided steps for professional consultation or at-home exercises.

---

## 🛠️ Technical Architecture

### Core Stack
- **Frontend**: React 18 with TypeScript for type-safe state management.
- **UI/UX**: `shadcn/ui` components built on Radix UI primitives for full accessibility.
- **State & Transitions**: `framer-motion` for smooth, non-distracting animations.
- **Persistence & Auth**: `Supabase` for secure user sessions and historical result tracking.
- **Accessibility Engine**: Custom `AccessibilityProvider` context for global preference management.

### Project Structure
```text
mind-spark-clarity-test/
├── src/
│   ├── components/       # Reusable UI (Buttons, Cards, Navbar)
│   ├── context/          # Auth & Accessibility global states
│   ├── hooks/            # Custom logic (useToast, etc.)
│   ├── pages/            # Screening tests & Dashboard views
│   ├── lib/              # Supabase & utility configurations
│   └── types/            # TypeScript interfaces
├── public/               # Static assets & icons
└── tailwind.config.ts    # Custom design tokens
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/PUNISHER1327/mind-spark-clarity-test.git
   cd mind-spark-clarity-test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap
- [ ] **Multi-language Support**: Expanding screening tools to Hindi, Spanish, and French.
- [ ] **AI-Assisted Analysis**: Using ML models to identify subtle pattern markers in response times.
- [ ] **PDF Export**: Allowing users to export result summaries for school specialists.
- [ ] **Professional Portal**: Dedicated dashboard for teachers to manage student screenings.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact & Support
Developed with ❤️ by **Aditya Manhas** and **Hrudhay**

- **Project Team**: [Aditya Manhas](https://github.com/PUNISHER1327) and [Hrudhay](https://github.com/Hrudhay-H)
- **Email**: [aditya1290manhas.com], [hrudhaykumar@gmail.com]
- **Project Link**: [https://github.com/PUNISHER1327/mind-spark-clarity-test](https://github.com/PUNISHER1327/mind-spark-clarity-test)

---
*Disclaimer: DysCover is a screening tool, not a clinical diagnosis. Please consult with a licensed educational psychologist or medical professional for a formal assessment.*
