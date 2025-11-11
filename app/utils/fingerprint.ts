// utils/fingerprint.ts
// Client-side browser fingerprinting utility
"use client";

/**
 * Creates a browser fingerprint using various browser characteristics.
 * This helps identify unique users without cookies/localStorage.
 */
export async function createFingerprint(): Promise<string> {
  const components: Record<string, string | number> = {};

  // Screen properties
  if (typeof window !== "undefined" && window.screen) {
    components.screenWidth = window.screen.width;
    components.screenHeight = window.screen.height;
    components.screenColorDepth = window.screen.colorDepth;
    components.screenPixelDepth = window.screen.pixelDepth;
  }

  // Navigator properties
  if (typeof navigator !== "undefined") {
    components.userAgent = navigator.userAgent;
    components.language = navigator.language;
    components.languages = navigator.languages?.join(",") || "";
    components.platform = navigator.platform;
    components.hardwareConcurrency = navigator.hardwareConcurrency || 0;
    // deviceMemory is not in standard Navigator type but exists in some browsers
    components.deviceMemory =
      "deviceMemory" in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0
        : 0;
    components.maxTouchPoints = navigator.maxTouchPoints || 0;
  }

  // Timezone
  try {
    components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    components.timezoneOffset = new Date().getTimezoneOffset();
  } catch {
    // Ignore
  }

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillText("Fingerprint", 2, 2);
      components.canvas = canvas.toDataURL();
    }
  } catch {
    // Ignore
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.webglVendor = gl.getParameter(
          debugInfo.UNMASKED_VENDOR_WEBGL
        );
        components.webglRenderer = gl.getParameter(
          debugInfo.UNMASKED_RENDERER_WEBGL
        );
      }
      components.webglVersion = gl.getParameter(gl.VERSION);
    }
  } catch {
    // Ignore
  }

  // Font detection (simplified - check a few common fonts)
  try {
    const testFonts = [
      "Arial",
      "Verdana",
      "Times New Roman",
      "Courier New",
      "Georgia",
      "Palatino",
      "Garamond",
      "Bookman",
      "Comic Sans MS",
      "Trebuchet MS",
      "Impact",
    ];
    const baseFonts = "monospace, sans-serif, serif";
    const testString = "mmmmmmmmmmlli";
    const testSize = "72px";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const baseWidths: Record<string, number> = {};
      baseFonts.split(",").forEach((baseFont) => {
        ctx.font = `${testSize} ${baseFont}`;
        baseWidths[baseFont] = ctx.measureText(testString).width;
      });

      const detectedFonts: string[] = [];
      testFonts.forEach((font) => {
        let detected = false;
        baseFonts.split(",").forEach((baseFont) => {
          ctx.font = `${testSize} ${font}, ${baseFont}`;
          const width = ctx.measureText(testString).width;
          if (width !== baseWidths[baseFont]) {
            detected = true;
          }
        });
        if (detected) {
          detectedFonts.push(font);
        }
      });
      components.fonts = detectedFonts.join(",");
    }
  } catch {
    // Ignore
  }

  // Create hash from all components
  const fingerprintString = JSON.stringify(components);
  const hash = await hashString(fingerprintString);
  return hash;
}

/**
 * Simple hash function using Web Crypto API
 */
async function hashString(str: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto) {
    // Fallback for environments without crypto
    return simpleHash(str);
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback to simple hash
    return simpleHash(str);
  }
}

/**
 * Simple hash fallback
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}
