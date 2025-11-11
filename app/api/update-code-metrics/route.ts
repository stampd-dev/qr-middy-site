import { NextResponse } from "next/server";
import {
  UpdateCodeMetricsRequest,
  UpdateCodeMetricsResponse,
} from "../types/update-code-metrics";

export async function POST(request: Request) {
  try {
    const body: UpdateCodeMetricsRequest = await request.json();
    const { code, metrics } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid code parameter" },
        { status: 400 }
      );
    }

    if (!metrics) {
      return NextResponse.json(
        { success: false, message: "Missing metrics parameter" },
        { status: 400 }
      );
    }

    // Get the external metrics API URL from environment variable
    const metricsApiUrl = process.env.METRICS_API_URL;

    if (!metricsApiUrl) {
      // If no external API configured, just log (for development)
      console.log(`[Metrics] QR code scanned: ${code}`);
      const response: UpdateCodeMetricsResponse = {
        success: true,
        message: "Metrics logged locally",
      };
      return NextResponse.json(response);
    }

    // Call external metrics API
    try {
      const response = await fetch(metricsApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.METRICS_API_KEY && {
            Authorization: `Bearer ${process.env.METRICS_API_KEY}`,
          }),
        },
        body: JSON.stringify({
          code,
          metrics,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error(`[Metrics] API error: ${response.status}`);
      }
    } catch (error) {
      console.error("[Metrics] Failed to call external API:", error);
      // Don't throw - we want to return success even if external API fails
    }

    const response: UpdateCodeMetricsResponse = {
      success: true,
      message: "Metrics updated successfully",
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[Metrics] Request processing error:", error);
    const response: UpdateCodeMetricsResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
