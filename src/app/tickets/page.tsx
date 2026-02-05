"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

/* -------------------- Types -------------------- */

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
};

/* -------------------- Color Maps -------------------- */

const statusColors: Record<TicketStatus, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
};

const priorityColors: Record<TicketPriority, string> = {
  LOW: "bg-gray-200 text-gray-700",
  MEDIUM: "bg-yellow-200 text-orange-700",
  HIGH: "bg-red-200 text-red-700",
};

/* -------------------- Component -------------------- */

export default function TicketsPage() {
  const queryClient = useQueryClient();

  /* -------- Fetch Tickets -------- */
  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async (): Promise<Ticket[]> => {
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
  });

  /* -------- Delete Mutation -------- */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ticket");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // ⛔ stop Link navigation
    e.stopPropagation();

    const confirmed = confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  /* -------------------- UI -------------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading tickets...</p>
      </div>
    );
  }

  return (
    <>
      

      {/* Main */}
      <main className="flex flex-col bg-slate-50 px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Support Tickets
        </h2>

        {tickets.length === 0 && (
          <div className="text-center text-gray-500">
            No tickets found. Create your first one.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => {
            const statusColor = statusColors[ticket.status];
            const priorityColor = priorityColors[ticket.priority];

            return (
              <Link
                key={ticket._id}
                href={`/tickets/${ticket._id}`}
                className="relative bg-white rounded-xl shadow hover:shadow-md transition p-5 block"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, ticket._id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
                  title="Delete Ticket"
                >
                  🗑️
                </button>

                <div className="flex gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {ticket.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="text-xs text-gray-500 mt-4">
                  Created on{" "}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

    </>
  );
}
