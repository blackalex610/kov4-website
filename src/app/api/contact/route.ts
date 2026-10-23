import { getLeadProvider } from "@/lib/leads/deliver";
import { validateLead } from "@/lib/leads/schema";

/** Minimum time between the form rendering and submitting. Faster is almost always a bot. */
const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 1000 * 60 * 60 * 24;

/** Best-effort, per-instance rate limit. Put a WAF or edge rule in front for real abuse. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function fail(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, code, message, ...extra }, { status });
}

export async function POST(request: Request) {
  const now = Date.now();

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "unsupported", "Изпратете формуляра във формат JSON.");
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json", "Данните от формуляра не можаха да бъдат прочетени. Презаредете страницата и опитайте отново.");
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.warn("[contact] honeypot triggered, submission ignored");
    return Response.json({ ok: true });
  }

  const startedAt = Number(body.startedAt);
  const elapsed = now - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return fail(400, "timing", "Формулярът е изпратен твърде бързо. Изчакайте малко и го изпратете отново.");
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) {
    return fail(429, "rate_limited", "Твърде много заявки от тази връзка. Опитайте отново след няколко минути.");
  }

  const result = validateLead(body);
  if (!result.ok) {
    return fail(422, "invalid", "Някои полета изискват внимание.", { errors: result.errors });
  }

  const provider = getLeadProvider();
  if (!provider) {
    console.error("[contact] No lead provider configured. Set LEAD_PROVIDER (see .env.example).");
    return fail(503, "not_configured", "Формулярът все още не е свързан с пощенска кутия, затова данните ви не бяха изпратени.");
  }

  try {
    await provider.send(result.lead, {
      submittedAt: new Date(now).toISOString(),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });
  } catch (error) {
    console.error(`[contact] Delivery via ${provider.id} failed`, error);
    return fail(502, "delivery_failed", "Данните ви не можаха да бъдат доставени. Нищо не е запазено.");
  }

  return Response.json({ ok: true });
}
