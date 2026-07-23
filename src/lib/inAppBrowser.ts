export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Instagram|FBAN|FBAV|FB_IAB|FBIOS|TikTok|Line\/|MicroMessenger|Twitter/i.test(ua);
}

export function detectInAppName(): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "Facebook";
  if (/TikTok/i.test(ua)) return "TikTok";
  if (/Line\//i.test(ua)) return "Line";
  if (/MicroMessenger/i.test(ua)) return "WeChat";
  if (/Twitter/i.test(ua)) return "Twitter";
  return null;
}

export async function copyCurrentUrl(): Promise<boolean> {
  const url = typeof window !== "undefined" ? window.location.href : "";
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function openInExternalBrowser() {
  const url = window.location.href;
  const ua = navigator.userAgent || "";
  // Android Instagram/Facebook: intent:// scheme forces Chrome
  if (/Android/i.test(ua)) {
    const cleanUrl = url.replace(/^https?:\/\//, "");
    window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    return;
  }
  // Fallback: open in new tab
  window.open(url, "_blank", "noopener,noreferrer");
}
