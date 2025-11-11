import { NextResponse } from "next/server";
import {
  AddNewReferrerRequest,
  AddNewReferrerResponse,
} from "../types/add-new-referrer";

export async function POST(request: Request) {
  try {
    const body: AddNewReferrerRequest = await request.json();
    const { firstName, lastName, email, phone } = body;

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

    // TODO: Implement actual referrer creation logic
    const response: AddNewReferrerResponse = {
      success: true,
      qrCodeLink: "",
      qrCodeImage: "",
      message: "Referrer added successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[AddNewReferrer] Request processing error:", error);
    const response: AddNewReferrerResponse = {
      success: false,
      qrCodeLink: "",
      qrCodeImage: "",
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

