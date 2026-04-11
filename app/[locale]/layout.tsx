import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SmoothScroll from "@/components/SmoothScroll";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <SmoothScroll>
        <TopNav />
        {children}
        <Footer />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
