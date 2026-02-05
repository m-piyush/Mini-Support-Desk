import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { updateCommentSchema } from "@/lib/schemas/comment.schema";

/* ---------------- GET SINGLE COMMENT ---------------- */
export async function GET(
  _req: Request,
  context: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  await connectDB();
  const { commentId } = await context.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return NextResponse.json(
      { message: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(comment);
}

/* ---------------- UPDATE COMMENT ---------------- */
export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  await connectDB();
  const { commentId } = await context.params;

  const body = await req.json();
  const data = updateCommentSchema.parse(body);

  const updated = await Comment.findByIdAndUpdate(
    commentId,
    data,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ---------------- DELETE COMMENT ---------------- */
export async function DELETE(
  _req: Request,
  context: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  await connectDB();
  const { commentId } = await context.params;

  const deleted = await Comment.findByIdAndDelete(commentId);

  if (!deleted) {
    return NextResponse.json(
      { message: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Comment deleted successfully" },
    { status: 200 }
  );
}
