import { NextResponse } from "next/server";
import {
  CreateNewReferrerRequest,
  CreateNewReferrerResponse,
} from "../types/create-new-referrer";
import { extractClientIP } from "../../utils/ip-extraction";

const ADD_NEW_REFERER_API_URL =
  "https://f9c1eloq82.execute-api.us-east-1.amazonaws.com/admin/add-new-referrer";

export async function POST(request: Request) {
  try {
    const body: CreateNewReferrerRequest = await request.json();
    const { first_name, last_name, email, phone, fingerprint } = body;

    // Extract IP from request (overrides any client-provided IP)
    const clientIP = extractClientIP(request);

    // Log request data
    console.log("[AddNewReferrer] Request data:", {
      clientIP,
      fingerprint,
      email: email?.substring(0, 3) + "***",
    });

    const response = await fetch(ADD_NEW_REFERER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        phone,
        ip: clientIP,
        fingerprint: fingerprint || "unknown",
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to add new referrer" },
        { status: response.status }
      );
    }

    const data: CreateNewReferrerResponse = await response.json();
    console.log("add referrer response", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding new referrer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
