import { NextResponse } from "next/server";
import { GetMostRecentRipplesResponse } from "../types/get-recent-ripples";

export async function GET() {
  try {
    const url =
      "https://9zkwe85qj4.execute-api.us-east-1.amazonaws.com/public-metrics/get-most-recent-ripples";
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "[GetMostRecentRipples] External API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        {
          success: false,
          message: `External API error: ${response.status}`,
          ripples: [],
        },
        { status: response.status }
      );
    }

    const data: GetMostRecentRipplesResponse = await response.json();
    console.log("[GetMostRecentRipples] External API response:", {
      success: data.success,
      ripplesCount: data.ripples?.length || 0,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GetMostRecentRipples] Failed to call external API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to metrics service",
        ripples: [],
      },
      { status: 500 }
    );
  }
}
