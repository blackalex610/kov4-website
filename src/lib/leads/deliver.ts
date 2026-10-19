import "server-only";

import { createHmac } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { summarizeLead, type Lead } from "./schema";

/**
 * Lead delivery adapter. Pick a provider with LEAD_PROVIDER:
 *
 *   webhook  POST JSON to LEAD_WEBHOOK_URL (Make, Zapier, n8n, Slack workflow, your CRM…).
 *            Optional LEAD_WEBHOOK_SECRET adds an X-Signature-256 HMAC header.
 *   resend   Email via the Resend API. Needs RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM.
 *   file     Append to .leads/leads.jsonl. Local development only: serverless
 *            hosts have a read-only or ephemeral filesystem.
 *
 * If LEAD_PROVIDER is unset or incomplete, the API refuses the submission with a
 * clear error and the form offers an email fallback. Nothing is silently dropped.
 */

export type LeadMeta = { submittedAt: string; userAgent: string | null; referer: string | null };

type Provider = { id: string; send: (lead: Lead, meta: LeadMeta) => Promise<void> };

export function getLeadProvider(): Provider | null {
  const id = process.env.LEAD_PROVIDER?.trim().toLowerCase();

  if (id === "webhook" && process.env.LEAD_WEBHOOK_URL) return { id, send: sendWebhook };
  if (id === "resend" && process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO && process.env.LEAD_EMAIL_FROM)
    return { id, send: sendResend };
  if (id === "file") return { id, send: sendFile };

  return null;
}

async function sendWebhook(lead: Lead, meta: LeadMeta) {
  const body = JSON.stringify({ type: "lead.created", lead, meta });
  const headers: Record<string, string> = { "content-type": "application/json" };
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (secret) headers["x-signature-256"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  const res = await fetch(process.env.LEAD_WEBHOOK_URL!, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function sendResend(lead: Lead, meta: LeadMeta) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM,
      to: process.env.LEAD_EMAIL_TO!.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `Workflow assessment request: ${lead.businessName}`,
      text: `${summarizeLead(lead)}\n\n---\nSubmitted ${meta.submittedAt}\nPage: ${meta.referer ?? "unknown"}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

async function sendFile(lead: Lead, meta: LeadMeta) {
  const dir = path.join(process.cwd(), ".leads");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify({ lead, meta })}\n`, "utf8");
}
