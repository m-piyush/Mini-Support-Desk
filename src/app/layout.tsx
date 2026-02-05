import Providers from "./providers";
import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* Header - fixed height */}
          <Header />

          {/* Main content - scrollable */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Footer - fixed height */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
