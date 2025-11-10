import { NextRequest, NextResponse } from "next/server";

import { backendApiFetch } from "@/lib/backend";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await backendApiFetch(`/posts/${params.id}/comments`, {
      method: "GET"
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get comments proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const payload = await request.json();

    const response = await backendApiFetch(`/posts/${params.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Create comment proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
