import { NextRequest, NextResponse } from "next/server";

import { backendApiFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const response = await backendApiFetch(`/posts/${params.id}/like`, {
      method: "POST",
      headers: {
        Authorization: authHeader
      }
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Toggle like proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}