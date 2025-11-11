import { NextResponse } from "next/server";
import { GetTopCodesResponse } from "../types/get-top-codes";

const TOP_CODES_API_URL =
  "https://9zkwe85qj4.execute-api.us-east-1.amazonaws.com/public-metrics/get-top-codes";

export async function GET() {
  try {
    // TODO: Implement actual top codes retrieval logic
    const response = await fetch(TOP_CODES_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("[GetTopCodes] API error: ", response.status);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve top codes" },
        { status: response.status }
      );
    }

    const data: GetTopCodesResponse = await response.json();
    console.log("[GetTopCodes] Response: ", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GetTopCodes] Request processing error:", error);
    const response: GetTopCodesResponse = {
      success: false,
      message: "Internal server error",
      mostRipples: {
        first: {
          name: "",
          totalUniqueScans: 0,
        },
        second: {
          name: "",
          totalUniqueScans: 0,
        },
      },
      furthestRipples: {
        first: {
          name: "",
          locations: [],
        },
        second: {
          name: "",
          locations: [],
        },
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
