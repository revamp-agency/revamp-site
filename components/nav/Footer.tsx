"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";

const menuKeys = ["servizi", "foundingClients", "about", "contact"] as const;

const menuAnchors: Record<string, string> = {
  servizi: "#servizi",
  foundingClients: "#clienti-fondatori",
  about: "#chi-siamo",
  contact: "#contatti",
};

const linkClass =
  "font-body text-[16px] text-text-secondary transition-colors duration-200 hover:text-text-primary";

const columnHeadingClass =
  "font-body font-bold text-[13px] uppercase tracking-[0.08em] text-text-tertiary mb-6";

export default function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-bg-primary px-6 py-12 md:px-20 md:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Columns */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display font-black text-[24px] tracking-tight text-text-primary"
            >
              REVAMP
            </Link>
            <p className="mt-4 font-body text-[16px] leading-relaxed text-text-secondary max-w-[280px]">
              {tCommon("tagline")}
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className={columnHeadingClass}>{tFooter("menu")}</h4>
            <ul className="flex flex-col gap-3">
              {menuKeys.map((key) => (
                <li key={key}>
                  <a href={menuAnchors[key]} className={linkClass}>
                    {tNav(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={columnHeadingClass}>{tFooter("contact")}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <span className={linkClass}>{tFooter("email")}</span>
              </li>
              <li>
                <span className={linkClass}>{tFooter("whatsapp")}</span>
              </li>
              <li>
                <span className={linkClass}>{tFooter("phone")}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={columnHeadingClass}>{tFooter("legal")}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="/privacy" className={linkClass}>
                  {tFooter("privacy")}
                </a>
              </li>
              <li>
                <a href="/cookies" className={linkClass}>
                  {tFooter("cookies")}
                </a>
              </li>
              <li>
                <a href="/terms" className={linkClass}>
                  {tFooter("terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 md:flex-row">
          <p className="font-body text-[14px] leading-normal text-text-tertiary">
            {tFooter("copyright")}
          </p>

          {/* Language toggle */}
          <div className="flex items-center gap-1 font-body text-[14px] font-medium">
            <Link
              href={pathname}
              locale="it"
              className={`transition-colors duration-200 ${
                locale === "it"
                  ? "text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              IT
            </Link>
            <span className="text-text-tertiary">/</span>
            <Link
              href={pathname}
              locale="en"
              className={`transition-colors duration-200 ${
                locale === "en"
                  ? "text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
