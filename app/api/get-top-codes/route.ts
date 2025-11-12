import { NextResponse } from "next/server";
import { GetTopCodesResponse } from "../types/get-top-codes";

export async function GET() {
  try {
    const response = await fetch(
      "https://9zkwe85qj4.execute-api.us-east-1.amazonaws.com/public-metrics/get-top-codes"
    );

    if (!response.ok) {
      console.error(
        "[GetTopCodes] External API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        {
          success: false,
          message: `External API error: ${response.status}`,
          furthest: [],
          most: [],
        },
        { status: response.status }
      );
    }

    const data: GetTopCodesResponse = await response.json();
    console.log("[GetTopCodes] External API response:", {
      success: data.success,
      mostCount: data.most?.length || 0,
      furthestCount: data.furthest?.length || 0,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GetTopCodes] Failed to call external API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to metrics service",
        furthest: [],
        most: [],
      },
      { status: 500 }
    );
  }
}
