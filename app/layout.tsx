import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'Organizador de Tarefas',
  description: 'App para gerenciar múltiplas listas de tarefas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter} antialiased bg-gray-100 min-h-screen"`}
      >
        {children}
      </body>
    </html>
  );
}
