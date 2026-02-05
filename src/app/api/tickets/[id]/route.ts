/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ticket } from "@/lib/models/Ticket";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const ticket = await Ticket.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(ticket);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // ✅ unwrap params properly
  const { id } = await context.params;

  const deleted = await Ticket.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Ticket not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Ticket deleted successfully" },
    { status: 200 }
  );
}