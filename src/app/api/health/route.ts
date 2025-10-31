import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    "ping": "pong",
    "version": "20251031-0851"
  }, {status: 200})
}