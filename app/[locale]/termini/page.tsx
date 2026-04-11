import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export default async function TerminiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const filePath = path.join(process.cwd(), "docs", "legal", `terms_${locale}.md`);
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <section className="mx-auto max-w-3xl px-6 md:px-20 pt-40 pb-20 md:pt-48 md:pb-32">
      <div className="prose-custom">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );
}
