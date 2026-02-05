import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-50 h-[70vh]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Mini Support Desk
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          A simple and efficient ticketing system to create, track, and manage
          support requests with ease.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/tickets"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            View Tickets
          </Link>

          <Link
            href="/create"
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Create Ticket
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          What You Can Do
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🎟️ Manage Tickets
            </h3>
            <p className="text-sm text-gray-600">
              Create, view, and delete support tickets with clear status and
              priority indicators.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              💬 Collaborate with Comments
            </h3>
            <p className="text-sm text-gray-600">
              Add, edit, and delete comments on tickets to keep conversations
              organized.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚡ Fast & Responsive
            </h3>
            <p className="text-sm text-gray-600">
              Built with modern tools like Next.js and React Query for a smooth
              and responsive experience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center py-10 text-sm text-gray-500">
        Built with Next.js, MongoDB, and React Query
      </section>
    </div>
  );
}
