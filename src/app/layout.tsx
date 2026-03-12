import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Toolkit — Product Manager's All-in-One Workspace",
  description:
    "Dashboard, Feature Prioritizer, PRD Generator. PM을 위한 올인원 실무 도구.",
  openGraph: {
    title: "PM Toolkit",
    description: "PM을 위한 올인원 실무 도구",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-gradient-radial noise-overlay">{children}</body>
    </html>
  );
}
