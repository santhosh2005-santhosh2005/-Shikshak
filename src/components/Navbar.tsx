import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility, AccessibilitySettings } from "@/components/AccessibilitySettings";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { text: "Home", href: "/" },
    { text: "Start Learning", href: "/tests" },
    { text: "Progress", href: "/improve" },
    { text: "AI Chat", href: "/ai-chat" },
    { text: "Dashboard", href: "/teacher-dashboard" },
    { text: "Report", href: "/parent-digest" },
    { text: "Support", href: "/support" },
    { text: "About", href: "/about" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
      <div className="container px-4">
        <div className={`flex items-center justify-between p-4 transition-all duration-300 ${
          isNeo 
          ? "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
          : "bg-white/80 backdrop-blur-md rounded-2xl border shadow-sm"
        }`}>
          <Link to="/" className="flex items-center gap-2">
            <div className={`h-10 w-10 flex items-center justify-center font-black text-2xl ${isNeo ? "bg-black text-white" : "bg-primary text-white rounded-xl"}`}>S</div>
            <span className={`text-2xl font-black uppercase tracking-tighter ${isNeo ? "text-black" : "text-slate-900"}`}>Shikshak</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                to={link.href}
                className={`px-3 py-2 text-xs xl:text-sm font-black uppercase transition-all ${
                  isActive(link.href)
                    ? (isNeo ? "bg-black text-white" : "text-primary bg-primary/10 rounded-lg")
                    : (isNeo ? "text-black hover:bg-black/5" : "text-slate-600 hover:text-primary")
                }`}
              >
                {link.text}
              </Link>
            ))}
            
            <div className="ml-4 flex items-center space-x-2 border-l pl-4 border-black/10">
              <AccessibilitySettings showFloatingButton={false} />
              {user ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut()}
                  className={isNeo ? "border-4 border-black font-black uppercase rounded-none" : "rounded-xl"}
                >
                  Sign Out
                </Button>
              ) : (
                <Link to="/signin">
                  <Button 
                    size="sm" 
                    className={isNeo ? "bg-black text-white border-4 border-black font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none" : "rounded-xl"}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            <AccessibilitySettings showFloatingButton={false} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={isNeo ? "border-4 border-black rounded-none" : ""}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden"
          >
            <div className={`p-6 ${isNeo ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "bg-white rounded-3xl border shadow-xl shadow-slate-200/50 backdrop-blur-xl"}`}>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.text}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 font-black uppercase text-sm ${isActive(link.href) ? "bg-black text-white" : "hover:bg-slate-100"}`}
                  >
                    {link.text}
                  </Link>
                ))}
                <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
                  {user ? (
                     <Button variant="outline" className={isNeo ? "border-4 border-black font-black rounded-none" : "rounded-xl"} onClick={() => signOut()}>Sign Out</Button>
                  ) : (
                    <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button className={`w-full ${isNeo ? "border-4 border-black font-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "rounded-xl"}`}>Sign In</Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
