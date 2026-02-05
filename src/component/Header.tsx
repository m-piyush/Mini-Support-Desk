"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const config =
    pathname === "/tickets"
      ? { label: "+ Create Ticket", href: "/create" }
      : { label: "View Tickets", href: "/tickets" };

  return (
    <header className="bg-indigo-600 text-white py-4 shadow">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="hover:opacity-90 transition">
          <h1 className="text-xl font-semibold cursor-pointer">
            Mini Support Desk
          </h1>
        </Link>
        <Link
          href={config.href}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
        >
          {config.label}
        </Link>
      </div>
    </header>
  );
}
