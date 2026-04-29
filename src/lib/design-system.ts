/**
 * Shikshak Unified Design System
 * Handles both Adaptive Calm (Accessible) and Vibrant Neo-Brutalism themes.
 */

export const calmStyles = {
  card: "border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardLight: "bg-gray-100 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardGray: "bg-gray-50 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  btnPrimary: "bg-gray-200 text-black font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-300 transition-colors inline-flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-gray-100",
  btnSecondary: "bg-white text-black border-2 border-gray-200 font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-colors inline-flex items-center gap-2 focus:ring-4 focus:ring-gray-100",
  tag: "bg-white text-black font-medium px-4 py-1.5 rounded-full inline-block border border-gray-200",
  tagLight: "bg-gray-200 text-black font-medium px-4 py-1.5 rounded-full inline-block",
  sectionTitle: "text-3xl md:text-4xl font-semibold text-black tracking-tight leading-tight",
  textMuted: "text-gray-600 leading-relaxed text-base md:text-lg",
  textBase: "text-black leading-relaxed text-base md:text-lg",
  label: "font-medium text-black text-sm mb-2",
  input: "w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-black focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all bg-white",
  logo: "w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-sm",
};

export const neoStyles = {
  card: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  cardLight: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  cardGray: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnPrimary: "bg-[#86EFAC] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-flex items-center gap-2",
  btnSecondary: "bg-[#FEF08A] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-flex items-center gap-2",
  tag: "bg-[#FDA4AF] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm",
  tagLight: "bg-[#D8B4FE] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm",
  sectionTitle: "text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none text-left",
  textMuted: "text-black font-bold leading-tight text-base md:text-lg",
  textBase: "text-black font-bold leading-tight text-base md:text-lg",
  label: "font-black text-black text-sm mb-1 uppercase",
  input: "w-full border-4 border-black px-4 py-2 text-black font-bold focus:bg-[#FEF08A] outline-none transition-all bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  logo: "w-12 h-12 bg-[#86EFAC] border-4 border-black flex items-center justify-center text-black font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
};

export const neoColors = ["bg-[#FEF08A]", "bg-[#FDA4AF]", "bg-[#86EFAC]", "bg-[#D8B4FE]", "bg-[#FDBA74]"];

export const getStyles = (theme: "calm" | "neo") => theme === "neo" ? neoStyles : calmStyles;
