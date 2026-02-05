/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ticket } from "@/lib/models/Ticket";
import { createTicketSchema } from "@/lib/schemas/ticket.schema";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

  const filter: any = {};
  if (q) filter.$or = [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tickets = await Ticket.find(filter).sort({ createdAt: sort });
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  console.log("backend-form", body);

  const data = createTicketSchema.parse(body);

  const ticket = await Ticket.create(data);
  return NextResponse.json(ticket, { status: 201 });
}


export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const deleted = await Ticket.findByIdAndDelete(params.id);

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