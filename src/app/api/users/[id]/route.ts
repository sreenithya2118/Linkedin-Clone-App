import { NextRequest, NextResponse } from "next/server";

import { backendApiFetch } from "@/lib/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");

    const response = await backendApiFetch(`/posts/profile/${params.id}`, {
      headers: authHeader ? { Authorization: authHeader } : undefined
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("User profile proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
