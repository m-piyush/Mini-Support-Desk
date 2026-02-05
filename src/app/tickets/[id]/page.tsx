"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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

type Comment = {
  _id: string;
  message: string;
  authorName?: string;
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

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  /* -------- Comment Form State -------- */
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  /* -------- Edit / Delete Comment State -------- */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");

  /* -------- Update Comment Mutation -------- */
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, message }: { commentId: string; message: string }) => {
      const res = await fetch(
        `/api/tickets/${id}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );
      if (!res.ok) throw new Error("Failed to update comment");
    },
    onSuccess: () => {
      setEditingId(null);
      setEditMessage("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  /* -------- Delete Comment Mutation -------- */
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(
        `/api/tickets/${id}/comments/${commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  /* -------- Ticket Query -------- */
  const { data: ticket, isLoading } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res = await fetch(`/api/tickets/${id}`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      return res.json();
    },
    enabled: !!id,
  });

  /* -------- Comments Query -------- */
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await fetch(`/api/tickets/${id}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!id,
  });

  /* -------- Add Comment Mutation -------- */
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/tickets/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          authorName,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");
    },
    onSuccess: () => {
      setMessage("");
      setAuthorName("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  /* -------------------- States -------------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  const statusColor = statusColors[ticket.status];
  const priorityColor = priorityColors[ticket.priority];

  /* -------------------- UI -------------------- */

  return (
    <>
      <main className="max-w-7xl bg-slate-50  mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Ticket Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}
                >
                  {ticket.priority} Priority
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {ticket.title}
              </h2>

              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {ticket.description}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                Created on {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Add Comment */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add Comment
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <textarea
                  placeholder="Write your comment..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />

                <div className="flex justify-end">
                  <button
                    disabled={!message || addCommentMutation.isPending}
                    onClick={() => addCommentMutation.mutate()}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – COMMENTS */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Comments ({comments.length})
            </h3>

            {comments.length === 0 && (
              <p className="text-gray-500 text-sm">
                No comments yet.
              </p>
            )}

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  {editingId === c._id ? (
                    <>
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={updateCommentMutation.isPending}
                          onClick={() =>
                            updateCommentMutation.mutate({
                              commentId: c._id,
                              message: editMessage,
                            })
                          }
                          className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {c.message}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-500">
                          {c.authorName || "Anonymous"} •{" "}
                          {new Date(c.createdAt).toLocaleString()}
                        </div>

                        <div className="flex gap-3 text-xs">
                          <button
                            onClick={() => {
                              setEditingId(c._id);
                              setEditMessage(c.message);
                            }}
                            className="text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this comment?")) {
                                deleteCommentMutation.mutate(c._id);
                              }
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </>
  );
}
