/**
 * Catch-all proxy to NestJS RCF endpoints.
 *
 * Forwards all requests to api.leadprospecting.ai/api/rcf/*
 * Passes Authorization headers for authenticated routes.
 *
 * Not used yet (NestJS RCF module not deployed). Ready for Phase 3+.
 */

import { NextRequest, NextResponse } from "next/server";

const NESTJS_API = "https://api.leadprospecting.ai/api/rcf";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subPath = path.join("/");
  const url = `${NESTJS_API}/${subPath}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const body = await req.text();
      if (body) fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to proxy request to API" },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
