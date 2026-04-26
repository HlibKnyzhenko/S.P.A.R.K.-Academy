import { ClerkProvider } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";

import { clerkAppearance } from "../lib/clerk-theme";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "S.P.A.R.K. Academy",
  description: "Supporting Progress and Rising Knowledge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
