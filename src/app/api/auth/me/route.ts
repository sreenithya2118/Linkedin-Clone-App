import { NextRequest, NextResponse } from "next/server";

import { backendApiFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await backendApiFetch("/auth/me", {
      method: "GET",
      headers: {
        Authorization: authHeader
      }
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Fetch current user proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}