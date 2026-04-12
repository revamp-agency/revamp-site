"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLenis } from "@/components/SmoothScroll";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navKeys = ["servizi", "foundingClients", "about", "contact"] as const;

const navHrefs: Record<string, string> = {
  servizi: "/servizi",
  foundingClients: "/clienti-fondatori",
  about: "/chi-siamo",
  contact: "/contatti",
};

export default function TopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const lenis = useLenis();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Determine active nav key from pathname
  useEffect(() => {
    const match = navKeys.find((key) => pathname === navHrefs[key]);
    setActiveKey(match ?? null);
  }, [pathname]);

  // Auto-expand on scroll past 50vh
  useEffect(() => {
    if (!lenis) return;
    const handler = ({ scroll }: { scroll: number }) => {
      const threshold = window.innerHeight * 0.5;
      setExpanded(scroll > threshold);
    };
    lenis.on("scroll", handler);
    return () => {
      lenis.off("scroll", handler);
    };
  }, [lenis]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    document.documentElement.classList.add("transitioning-theme");
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(
      () => document.documentElement.classList.remove("transitioning-theme"),
      350
    );
  };

  const nextLocale = locale === "it" ? "en" : "it";

  return (
    <>
      {/* Desktop nav — dynamic island pill */}
      <nav className="fixed top-6 right-8 z-50 hidden md:block">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="flex items-center gap-1 rounded-full bg-bg-secondary/85 backdrop-blur-xl border border-glass-border px-3 py-2"
        >
          {/* Nav links — only when expanded */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                {navKeys.map((key) => (
                  <Link
                    key={key}
                    href={navHrefs[key]}
                    className="relative px-3 py-1.5 font-body font-medium text-[14px] tracking-[0.01em] text-text-secondary transition-colors duration-200 hover:text-text-primary whitespace-nowrap"
                  >
                    {activeKey === key && (
                      <motion.div
                        layoutId="nav-selector"
                        className="absolute inset-0 rounded-full bg-amber/20 border border-amber/40"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{t(key)}</span>
                  </Link>
                ))}

                {/* Divider */}
                <div className="w-px h-5 bg-glass-border mx-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-glass-border mx-1" />

          {/* Language toggle */}
          <Link
            href={pathname}
            locale={nextLocale}
            className="px-2 py-1 font-body text-[13px] font-bold text-text-secondary transition-colors duration-200 hover:text-text-primary uppercase"
          >
            {nextLocale}
          </Link>

          {/* Divider — only when collapsed (hamburger visible) */}
          {!expanded && (
            <>
              <div className="w-px h-5 bg-glass-border mx-1" />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </motion.div>

        {/* Dropdown menu when hamburger is clicked (collapsed state) */}
        <AnimatePresence>
          {menuOpen && !expanded && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 rounded-2xl bg-bg-secondary/90 backdrop-blur-xl border border-glass-border p-3 min-w-[180px]"
            >
              {navKeys.map((key) => (
                <Link
                  key={key}
                  href={navHrefs[key]}
                  className="relative block px-4 py-2.5 font-body font-medium text-[14px] text-text-secondary transition-colors duration-200 hover:text-text-primary rounded-lg"
                >
                  {activeKey === key && (
                    <motion.div
                      layoutId="nav-selector-dropdown"
                      className="absolute inset-0 rounded-lg bg-amber/20 border border-amber/40"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t(key)}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile nav */}
      <nav className="fixed top-4 right-4 z-50 md:hidden">
        <div className="flex items-center gap-1 rounded-full bg-bg-secondary/85 backdrop-blur-xl border border-glass-border px-3 py-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-text-primary"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          <div className="w-px h-5 bg-glass-border mx-1" />

          <Link
            href={pathname}
            locale={nextLocale}
            className="px-2 py-1 font-body text-[13px] font-bold text-text-secondary transition-colors duration-200 hover:text-text-primary uppercase"
          >
            {nextLocale}
          </Link>

          <div className="w-px h-5 bg-glass-border mx-1" />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-text-primary"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 rounded-2xl bg-bg-secondary/90 backdrop-blur-xl border border-glass-border p-3 min-w-[200px]"
            >
              {navKeys.map((key) => (
                <Link
                  key={key}
                  href={navHrefs[key]}
                  className="relative block px-4 py-3 font-body font-medium text-[15px] text-text-secondary transition-colors duration-200 hover:text-text-primary rounded-lg"
                >
                  {activeKey === key && (
                    <motion.div
                      layoutId="nav-selector-mobile"
                      className="absolute inset-0 rounded-lg bg-amber/20 border border-amber/40"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t(key)}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
