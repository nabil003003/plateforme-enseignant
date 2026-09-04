import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المنظومة الأكاديمية لاختيار وتقويم المتعلمين | بوابة المدرس",
  description: "منظومة إلكترونية مهنية مخصصة للأساتذة والمدرسين لإدارة لوائح الفصول وإجراء السحب والمشاركة الصفية بأسلوب أكاديمي عادل وموثوق.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2216%22 fill=%22%231e293b%22/><path d=%22M25 70 L50 30 L75 70 Z%22 fill=%22none%22 stroke=%22%23f8fafc%22 stroke-width=%228%22 stroke-linejoin=%22round%22/><circle cx=%2250%22 cy=%2254%22 r=%226%22 fill=%22%2338bdf8%22/></svg>"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('picker_theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var lang = localStorage.getItem('app_lang') || 'ar';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-700 selection:text-white antialiased font-sans transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
