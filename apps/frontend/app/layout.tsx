import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased font-sans">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
