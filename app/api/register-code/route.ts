import { NextResponse } from "next/server";
import {
  RegisterCodeRequest,
  RegisterCodeResponse,
} from "../types/register-code";
import { extractClientIP, getIPHeaders } from "../../utils/ip-extraction";

const REGISTER_API_URL =
  "https://f9c1eloq82.execute-api.us-east-1.amazonaws.com/admin/register-code";

export async function POST(request: Request) {
  try {
    const body: RegisterCodeRequest = await request.json();
    const { code, firstName, lastName, email, phone, nickname, fingerprint } =
      body;

    // Extract IP from request if not provided
    const clientIP = extractClientIP(request);
    const ipHeaders = getIPHeaders(request);

    // Log all fingerprint and IP data
    console.log("[RegisterCode] Fingerprint data:", {
      clientIP,
      fingerprint,
      ipHeaders,
      userAgent: request.headers.get("user-agent"),
      code,
      email: email?.substring(0, 3) + "***", // Partial email for logging
    });

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid code parameter" },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid firstName" },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid lastName" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid email" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid phone" },
        { status: 400 }
      );
    }

    if (!nickname || typeof nickname !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid nickname" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          firstName,
          lastName,
          email,
          phone,
          nickname,
          ip: clientIP,
          fingerprint: fingerprint || "unknown",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[RegisterCode] API error: ${response.status} - ${errorText}`
        );
        const errorResponse: RegisterCodeResponse = {
          success: false,
          message: `Failed to register code: ${response.status}`,
        };
        return NextResponse.json(errorResponse, { status: response.status });
      }

      const data: RegisterCodeResponse = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("[RegisterCode] Failed to call external API:", error);
      const errorResponse: RegisterCodeResponse = {
        success: false,
        message: "Failed to connect to registration service",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  } catch (error) {
    console.error("[RegisterCode] Request processing error:", error);
    const response: RegisterCodeResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
