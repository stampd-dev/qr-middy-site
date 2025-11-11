import { NextResponse } from "next/server";
import {
  GetMetricsByCodeRequest,
  GetMetricsByCodeResponse,
} from "../types/get-metrics-by-code";

const METRICS_API_URL =
  "https://9zkwe85qj4.execute-api.us-east-1.amazonaws.com/public-metrics/get-metrics-by-code";

export async function POST(request: Request) {
  try {
    const body: GetMetricsByCodeRequest = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid code parameter" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(METRICS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[GetMetricsByCode] API error: ${response.status} - ${errorText}`
        );
        const errorResponse: GetMetricsByCodeResponse = {
          success: false,
          message: `Failed to retrieve metrics: ${response.status}`,
          registered: false,
          record: {
            PK: "",
            SK: "",
            referalCode: code,
            createdAt: "",
            updatedAt: "",
            totalScans: 0,
            uniqueScans: 0,
            ipUsage: {},
            splashLocations: [],
            referrerEmail: "",
            referrerName: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            referrerTag: "",
            coinNumber: "",
            kickstarterUrl: "",
          },
        };
        return NextResponse.json(errorResponse, { status: response.status });
      }

      const data: GetMetricsByCodeResponse = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("[GetMetricsByCode] Failed to call external API:", error);
      const errorResponse: GetMetricsByCodeResponse = {
        success: false,
        message: "Failed to connect to metrics service",
        registered: false,
        record: {
          PK: "",
          SK: "",
          referalCode: code,
          createdAt: "",
          updatedAt: "",
          totalScans: 0,
          uniqueScans: 0,
          ipUsage: {},
          splashLocations: [],
          referrerEmail: "",
          referrerName: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          referrerTag: "",
          coinNumber: "",
          kickstarterUrl: "",
        },
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  } catch (error) {
    console.error("[GetMetricsByCode] Request processing error:", error);
    const response: GetMetricsByCodeResponse = {
      success: false,
      message: "Internal server error",
      registered: false,
      record: {
        PK: "",
        SK: "",
        referalCode: "",
        createdAt: "",
        updatedAt: "",
        totalScans: 0,
        uniqueScans: 0,
        ipUsage: {},
        splashLocations: [],
        referrerEmail: "",
        referrerName: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        referrerTag: "",
        coinNumber: "",
        kickstarterUrl: "",
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
