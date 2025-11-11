import { NextResponse } from "next/server";
import {
  RegisterCodeRequest,
  RegisterCodeResponse,
} from "../types/register-code";

export async function POST(request: Request) {
  try {
    const body: RegisterCodeRequest = await request.json();
    const { code, firstName, lastName, email, phone, nickname } = body;

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

    // TODO: Implement actual code registration logic
    const response: RegisterCodeResponse = {
      success: true,
      message: "Code registered successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[RegisterCode] Request processing error:", error);
    const response: RegisterCodeResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

