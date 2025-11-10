import { NextRequest, NextResponse } from "next/server";

import { backendApiFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const response = await backendApiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}