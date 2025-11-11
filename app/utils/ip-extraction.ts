// utils/ip-extraction.ts
// Server-side IP extraction utility for Next.js/Amplify
import requestIp from "request-ip";

/**
 * Validates if an IP address is valid and not a localhost address
 */
function isValidPublicIP(ip: string | null | undefined): boolean {
  if (!ip || ip === "unknown") {
    return false;
  }

  // Filter out localhost addresses
  const localhostIPs = [
    "::1",
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "::",
    "::ffff:127.0.0.1",
  ];

  const normalizedIP = ip.trim().toLowerCase();
  if (localhostIPs.includes(normalizedIP)) {
    return false;
  }

  // Check if it's a localhost IPv6 variant
  if (
    normalizedIP.startsWith("::ffff:127.") ||
    normalizedIP.startsWith("::ffff:0.0.0.0")
  ) {
    return false;
  }

  return true;
}

/**
 * Extracts the client IP address from request headers.
 * Works with AWS Amplify/CloudFront which uses various headers.
 * Uses request-ip package for reliable IP extraction.
 */
export function extractClientIP(request: Request): string {
  // Convert Next.js Request to a format request-ip can use
  // request-ip expects headers as a plain object
  const headers: Record<string, string | string[] | undefined> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Create a mock request object with headers for request-ip
  // request-ip expects an object with headers, connection, and socket properties
  type RequestIPRequest = {
    headers: Record<string, string | string[] | undefined>;
    connection?: { remoteAddress?: string };
    socket?: { remoteAddress?: string };
  };

  const mockReq: RequestIPRequest = {
    headers,
    connection: {},
    socket: {},
  };

  try {
    const ip = requestIp.getClientIp(mockReq);
    if (ip && isValidPublicIP(ip)) {
      return ip;
    }
  } catch (error) {
    console.error("[IP Extraction] Error using request-ip:", error);
  }

  // Fallback: manual extraction if request-ip fails
  // Check x-forwarded-for (most common, but can contain multiple IPs)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    // Find the first valid public IP (skip localhost/proxy IPs)
    for (const ip of ips) {
      if (isValidPublicIP(ip)) {
        return ip;
      }
    }
  }

  // Check Cloudflare header
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP && isValidPublicIP(cfConnectingIP)) {
    return cfConnectingIP;
  }

  // Check x-real-ip
  const xRealIP = request.headers.get("x-real-ip");
  if (xRealIP && isValidPublicIP(xRealIP)) {
    return xRealIP;
  }

  // Check x-client-ip
  const xClientIP = request.headers.get("x-client-ip");
  if (xClientIP && isValidPublicIP(xClientIP)) {
    return xClientIP;
  }

  // AWS Amplify/CloudFront specific headers
  // CloudFront sets these headers with the viewer's IP
  const cloudFrontViewerAddress = request.headers.get(
    "cloudfront-viewer-address"
  );
  if (cloudFrontViewerAddress) {
    // Format: "IP:PORT" - extract just the IP
    const ip = cloudFrontViewerAddress.split(":")[0];
    if (isValidPublicIP(ip)) {
      return ip;
    }
  }

  // Additional CloudFront headers (if available)
  const cloudFrontForwardedFor = request.headers.get(
    "cloudfront-forwarded-for"
  );
  if (cloudFrontForwardedFor) {
    const ips = cloudFrontForwardedFor.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (isValidPublicIP(ip)) {
        return ip;
      }
    }
  }

  // If we still don't have a valid IP, return "unknown" instead of localhost
  console.warn(
    "[IP Extraction] Could not extract valid public IP, all headers:",
    getIPHeaders(request)
  );
  return "unknown";
}

/**
 * Gets all relevant headers for debugging IP extraction
 */
export function getIPHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  const headerNames = [
    "x-forwarded-for",
    "cf-connecting-ip",
    "x-real-ip",
    "x-client-ip",
    "x-forwarded",
    "forwarded",
    "via",
    "x-amzn-trace-id", // AWS X-Ray
    "cloudfront-viewer-address", // AWS CloudFront/Amplify
    "cloudfront-viewer-country", // AWS CloudFront/Amplify
    "cloudfront-forwarded-for", // AWS CloudFront/Amplify
  ];

  headerNames.forEach((name) => {
    const value = request.headers.get(name);
    if (value) {
      headers[name] = value;
    }
  });

  return headers;
}
