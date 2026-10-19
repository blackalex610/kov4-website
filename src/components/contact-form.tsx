"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/content/site";
import {
  BUSINESS_TYPES,
  CHALLENGES,
  EMPTY_LEAD,
  FIELD_ORDER,
  LOCATION_RANGES,
  PLATFORMS,
  summarizeLead,
  validateLead,
  type LeadErrors,
  type LeadField,
} from "@/lib/leads/schema";
import { buttonClass, cx } from "./ui";

type Values = typeof EMPTY_LEAD;
type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; name: string }
  | { kind: "error"; code: string; message: string };

const inputClass =
  "block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[1rem] text-ink placeholder:text-ink-faint/70 transition-colors hover:border-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none aria-invalid:border-danger aria-invalid:ring-danger/15";

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.925rem] font-medium">
        {label}
        {optional ? <span className="text-[0.8125rem] font-normal text-ink-faint">Optional</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-[0.8125rem] text-ink-faint">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      <FieldError id={id} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
      <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4.2M8 11.2v.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {error}
    </p>
  );
}

function describedBy(id: string, hint: boolean, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_LEAD);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") statusRef.current?.focus();
  }, [status]);

  const set = (field: LeadField, value: string | string[]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const togglePlatform = (value: string) => {
    const current = values.platforms as string[];
    set("platforms", current.includes(value) ? current.filter((p) => p !== value) : [...current, value]);
  };

  const focusFirstError = (errs: LeadErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    el?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const check = validateLead(values);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus({ kind: "idle" });
      focusFirstError(check.errors);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...check.lead, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok: boolean;
        code?: string;
        message?: string;
        errors?: LeadErrors;
      } | null;

      if (res.ok && data?.ok) {
        setStatus({ kind: "success", name: check.lead.name.split(" ")[0] });
        return;
      }
      if (data?.code === "invalid" && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        focusFirstError(data.errors);
        return;
      }
      setStatus({
        kind: "error",
        code: data?.code ?? "unknown",
        message: data?.message ?? "Your details couldn’t be sent.",
      });
    } catch {
      setStatus({
        kind: "error",
        code: "network",
        message: "Your details couldn’t be sent because the connection dropped.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[1.75rem] bg-mist p-8 outline-none sm:p-10">
        <svg viewBox="0 0 40 40" className="size-10 text-brand" aria-hidden>
          <circle cx="20" cy="20" r="19" fill="currentColor" opacity="0.12" />
          <path
            d="M12.5 20.5l5 5 10-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="type-h3 mt-6">Thanks, {status.name}. Your details are with us.</h3>
        <p className="mt-3 max-w-md text-ink-soft">
          We&rsquo;ll read through your setup and reply by email to arrange a short call. If anything changes in the
          meantime, write to{" "}
          <a className="font-medium text-ink underline underline-offset-4" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const mailto = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
    `Workflow assessment request: ${values.businessName || "new enquiry"}`,
  )}&body=${encodeURIComponent(summarizeLead(values))}`;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="contact-title"
      className="rounded-[1.75rem] bg-mist p-6 sm:p-8 lg:p-10"
    >
      {status.kind === "error" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-xl border border-danger/30 bg-danger-tint p-4 text-[0.95rem] outline-none"
        >
          <p className="font-semibold text-danger">{status.message}</p>
          <p className="mt-1 text-ink-soft">
            {status.code === "not_configured" || status.code === "delivery_failed" || status.code === "network"
              ? "Send the same details by email instead. We’ve written the message for you."
              : "Check the form and try again, or email us directly."}
          </p>
          <a href={mailto} className="mt-3 inline-flex font-medium text-ink underline underline-offset-4">
            Email {site.contactEmail}
          </a>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            data-field="name"
            name="name"
            autoComplete="name"
            className={inputClass}
            value={values.name as string}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name", false, errors.name)}
            required
          />
        </Field>
        <Field id="email" label="Work email" error={errors.email}>
          <input
            id="email"
            data-field="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
            value={values.email as string}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email", false, errors.email)}
            required
          />
        </Field>
        <Field id="businessName" label="Business name" error={errors.businessName}>
          <input
            id="businessName"
            data-field="businessName"
            name="businessName"
            autoComplete="organization"
            className={inputClass}
            value={values.businessName as string}
            onChange={(e) => set("businessName", e.target.value)}
            aria-invalid={!!errors.businessName}
            aria-describedby={describedBy("businessName", false, errors.businessName)}
            required
          />
        </Field>
        <Field id="businessType" label="Type of business" error={errors.businessType}>
          <select
            id="businessType"
            data-field="businessType"
            name="businessType"
            className={cx(inputClass, "select-chevron", !values.businessType && "text-ink-faint")}
            value={values.businessType as string}
            onChange={(e) => set("businessType", e.target.value)}
            aria-invalid={!!errors.businessType}
            aria-describedby={describedBy("businessType", false, errors.businessType)}
            required
          >
            <option value="" disabled>
              Choose one
            </option>
            {BUSINESS_TYPES.map((o) => (
              <option key={o.value} value={o.value} className="text-ink">
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset
        className="mt-6"
        aria-invalid={!!errors.locations}
        aria-describedby={errors.locations ? "locations-error" : undefined}
      >
        <legend className="text-[0.925rem] font-medium">Number of locations</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {LOCATION_RANGES.map((o, i) => (
            <label key={o.value} className="relative">
              <input
                type="radio"
                name="locations"
                value={o.value}
                data-field={i === 0 ? "locations" : undefined}
                checked={values.locations === o.value}
                onChange={() => set("locations", o.value)}
                className="peer sr-only"
              />
              <span
                className={cx(
                  "tabular flex h-12 cursor-pointer items-center justify-center rounded-xl border bg-surface text-[0.95rem] font-medium transition-colors",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2",
                  errors.locations ? "border-danger" : "border-line-strong hover:border-ink-faint",
                )}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="locations" error={errors.locations} />
      </fieldset>

      <fieldset
        className="mt-6"
        aria-invalid={!!errors.platforms}
        aria-describedby={["platforms-hint", errors.platforms ? "platforms-error" : ""].join(" ").trim()}
      >
        <legend className="text-[0.925rem] font-medium">Delivery platforms you sell on</legend>
        <p id="platforms-hint" className="mt-0.5 text-[0.8125rem] text-ink-faint">
          Choose all that apply.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORMS.map((o, i) => {
            const checked = (values.platforms as string[]).includes(o.value);
            return (
              <label key={o.value} className="relative">
                <input
                  type="checkbox"
                  name="platforms"
                  value={o.value}
                  data-field={i === 0 ? "platforms" : undefined}
                  checked={checked}
                  onChange={() => togglePlatform(o.value)}
                  className="peer sr-only"
                />
                <span
                  className={cx(
                    "inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border bg-surface px-4 text-[0.95rem] font-medium transition-colors",
                    "peer-checked:border-brand peer-checked:bg-brand-tint peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2",
                    errors.platforms ? "border-danger" : "border-line-strong hover:border-ink-faint",
                  )}
                >
                  <span
                    aria-hidden
                    className={cx(
                      "flex size-4 items-center justify-center rounded-[5px] border transition-colors",
                      checked ? "border-brand bg-brand text-white" : "border-line-strong",
                    )}
                  >
                    {checked ? (
                      <svg viewBox="0 0 12 12" className="size-3">
                        <path
                          d="M2.5 6.2l2.4 2.4 4.6-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  {o.label}
                </span>
              </label>
            );
          })}
        </div>
        <FieldError id="platforms" error={errors.platforms} />
      </fieldset>

      {(values.platforms as string[]).includes("other") ? (
        <div className="mt-4">
          <Field id="otherPlatforms" label="Which other platforms?" error={errors.otherPlatforms}>
            <input
              id="otherPlatforms"
              data-field="otherPlatforms"
              name="otherPlatforms"
              className={inputClass}
              placeholder="For example, your own web ordering"
              value={values.otherPlatforms as string}
              onChange={(e) => set("otherPlatforms", e.target.value)}
              aria-invalid={!!errors.otherPlatforms}
              aria-describedby={describedBy("otherPlatforms", false, errors.otherPlatforms)}
            />
          </Field>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field
          id="software"
          label="POS or business software"
          optional
          hint="Name it if you know it, or write “not sure”."
          error={errors.software}
        >
          <input
            id="software"
            data-field="software"
            name="software"
            className={inputClass}
            value={values.software as string}
            onChange={(e) => set("software", e.target.value)}
            aria-invalid={!!errors.software}
            aria-describedby={describedBy("software", true, errors.software)}
          />
        </Field>
        <Field id="challenge" label="Main challenge" hint="The one that costs you most today." error={errors.challenge}>
          <select
            id="challenge"
            data-field="challenge"
            name="challenge"
            className={cx(inputClass, "select-chevron", !values.challenge && "text-ink-faint")}
            value={values.challenge as string}
            onChange={(e) => set("challenge", e.target.value)}
            aria-invalid={!!errors.challenge}
            aria-describedby={describedBy("challenge", true, errors.challenge)}
            required
          >
            <option value="" disabled>
              Choose one
            </option>
            {CHALLENGES.map((o) => (
              <option key={o.value} value={o.value} className="text-ink">
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <Field
          id="details"
          label="Anything else we should know"
          optional
          hint="Order volumes, current workarounds, timing. Whatever helps."
          error={errors.details}
        >
          <textarea
            id="details"
            data-field="details"
            name="details"
            rows={4}
            className={cx(inputClass, "resize-y")}
            value={values.details as string}
            onChange={(e) => set("details", e.target.value)}
            aria-invalid={!!errors.details}
            aria-describedby={describedBy("details", true, errors.details)}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line-strong/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[0.8125rem] leading-relaxed text-ink-faint">
          We use these details only to reply to your enquiry. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
            privacy notice
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className={buttonClass("primary", "min-w-48 disabled:opacity-80")}
        >
          {submitting ? (
            <>
              <svg viewBox="0 0 20 20" className="spinner size-4" aria-hidden>
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.2" />
                <path
                  d="M18 10a8 8 0 0 0-8-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              Sending…
            </>
          ) : (
            "Send my details"
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? "Sending your details" : ""}
      </p>
    </form>
  );
}
