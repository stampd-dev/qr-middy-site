import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref } = body;

    if (!ref || typeof ref !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ref parameter" },
        { status: 400 }
      );
    }

    // Get the external metrics API URL from environment variable
    const metricsApiUrl = process.env.METRICS_API_URL;

    if (!metricsApiUrl) {
      // If no external API configured, just log (for development)
      console.log(`[Metrics] QR code scanned: ${ref}`);
      return NextResponse.json({ success: true, logged: true });
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
          ref,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Metrics] Request processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
