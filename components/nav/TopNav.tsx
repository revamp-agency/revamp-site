"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLenis } from "@/components/SmoothScroll";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const navKeys = ["servizi", "foundingClients", "about", "contact"] as const;

const navHrefs: Record<string, string> = {
  servizi: "/servizi",
  foundingClients: "/clienti-fondatori",
  about: "/chi-siamo",
  contact: "/contatti",
};

export default function TopNav() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!lenis) return;

    function onScroll({ scroll }: { scroll: number }) {
      setScrolled(scroll > 50);
    }

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-20 transition-[background-color,backdrop-filter,border-color] duration-300 ease-out ${
        scrolled
          ? "bg-[rgba(10,10,10,0.85)] backdrop-blur-md border-b border-glass-border"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-black text-[24px] tracking-tight text-text-primary">
          REVAMP
        </Link>

        {/* Links + CTA + language toggle — right */}
        <div className="hidden md:flex items-center gap-8">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              className="font-body font-medium text-[16px] tracking-[0.01em] text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              {t(key)}
            </Link>
          ))}

          <Link
            href="/contatti"
            className="ml-2 inline-flex h-12 items-center justify-center rounded-full bg-amber px-6 font-body font-bold text-[16px] tracking-[0.02em] text-bg-primary transition-transform duration-200 hover:scale-[1.02]"
          >
            {tCommon("cta")}
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => {
                document.documentElement.classList.add("transitioning-theme");
                setTheme(theme === "dark" ? "light" : "dark");
                setTimeout(() => document.documentElement.classList.remove("transitioning-theme"), 350);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Language toggle */}
          <div className="flex items-center gap-1 font-body text-[14px] font-medium">
            <Link
              href={pathname}
              locale="it"
              className={`transition-colors duration-200 ${
                locale === "it" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              IT
            </Link>
            <span className="text-text-tertiary">/</span>
            <Link
              href={pathname}
              locale="en"
              className={`transition-colors duration-200 ${
                locale === "en" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
