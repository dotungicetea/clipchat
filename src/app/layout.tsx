import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@styles/globals.css";

const AppProvider = dynamic(() => import("@/providers/app.provider"), { ssr: true });
const Navbar = dynamic(() => import("@components/Navbar"), { ssr: false });
const WagmiProvider = dynamic(() => import("@/providers/wagmi.provider"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coffee Club",
  description:
    "A marketplace for your friend group — What would be the liquid valuation of your first-degree friend group? Coffee Club is a web3 marketplace to trade key tokens that lets you apply to be part of private groups on Telegram.",
  manifest: "/manifest.json",
  openGraph: {
    images: "https://i.imgur.com/agRrdEd.png",
  },
  twitter: {
    images: "https://i.imgur.com/agRrdEd.png",
    card: "summary_large_image",
    title: "Coffee Club",
    description:
      "A marketplace for your friend group — What would be the liquid valuation of your first-degree friend group? Coffee Club is a web3 marketplace to trade key tokens that lets you apply to be part of private groups on Telegram.",
  },
  icons: {
    apple: ["/icon.svg"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider>
          <AppProvider>
            <main className="no-scrollbar flex min-h-screen flex-col items-center bg-black font-mono text-white">
              <div className="h-full w-full max-w-md">{children}</div>
            </main>
            <Navbar />
          </AppProvider>
        </WagmiProvider>
        <ToastContainer
          position="top-center"
          theme="dark"
          hideProgressBar
          closeButton={false}
          className={"!w-full max-w-md !px-[15px]"}
        />
      </body>
    </html>
  );
}
