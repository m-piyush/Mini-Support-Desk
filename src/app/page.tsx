/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-red-600">
      <h1>Welcome to the Mini Ticketing App</h1>
      <p>
        This is a simple ticketing system built with Next.js and React Query.
        You can create, view, and manage support tickets.
      </p>
      <p>
        To get started, navigate to the <a href="/tickets">Tickets</a> page to see all tickets or create a new one.
      </p>
    </div>
  );
}
