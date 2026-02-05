import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { createCommentSchema } from "@/lib/schemas/comment.schema";

/* ---------------- GET COMMENTS ---------------- */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id: ticketId } = await context.params;

  const comments = await Comment.find({ ticketId })
    .sort({ createdAt: -1 });

  return NextResponse.json(comments);
}

/* ---------------- CREATE COMMENT ---------------- */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id: ticketId } = await context.params;

  const body = await req.json();
  const data = createCommentSchema.parse(body);

  const comment = await Comment.create({
    ...data,
    ticketId,
  });

  return NextResponse.json(comment, { status: 201 });
}
