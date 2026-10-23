# Website content plan: implementation checklist

Tracks `docs/website-content-plan.md` (unchanged) against the site. Status as of 20 October 2026, branch `new-flame-logo`.

Legend: **Done** = implemented as written in the plan. **Partial** = some of it. **Blocked** = needs a decision or facts we don't have. **Not started** = out of scope for this pass.

## Homepage (plan section 4)

| # | Section | Component | Status | Notes / open questions |
| --- | --- | --- | --- | --- |
| 1 | Hero | `hero.tsx` | Partial | Headline, second line, subhead, primary CTA and micro-trust line use the plan's Bulgarian copy. The secondary CTA reads „Вижте как работи“ and scrolls to the steps. The plan wants „· 84 сек.“ and a video, but the explainer video (`media/kov4-explainer.mp4`) isn't embedded on the site. Decision: host it (32 MB, so probably not in the repo) and add a player. The visual is still the illustrated stage; the plan says to swap in the real screen once it exists. |
| 2 | Proof bar | `platforms.tsx` | Done | „Поръчки от“ → „Директно в“ касата · кухненския принтер · екрана, plus the honest status line („одобрението е в процес“). Switch to „Approved integration partner“ only when a platform approves us. Client logos stay behind `NEXT_PUBLIC_SHOW_SAMPLE_PROOF`. |
| 3 | Problem | `problem.tsx` | Done | The five situations as the plan words them, plus the quantified example (80 × 1 min = 40 h/month), labelled as an example. |
| 4 | How it works | `process.tsx` | Partial | Three steps with the plan's copy. Not included: the "from signed pilot to first live order: X days" line (the plan says to wait for the first pilot). Video is not embedded (see #1). |
| 5 | Features | `features.tsx` | Not started | Still the old English copy. The plan wants the five MVP features with a per-platform ✓ row, which depends on the capability matrix being verified in a sandbox. |
| 6 | Time and money calculator | new | Not started | Needs the price (below). |
| 7 | Reliability | `reliability.tsx` (new) | Partial | Four points implemented. Left out on purpose: support hours and the status-page link, because we haven't chosen hours and there is no status page. |
| 8 | POS integrations grid | new | Blocked | Needs the live / in development / on request status for Microinvest, Barsy, BeMODY and Eltrade. The FAQ names them as connectors we are working on without stating a status. |
| 9 | Pricing | new | Blocked | Needs the price, setup fee, notice period and whether the founding-partner offer is real. |
| 10 | Pilot offer | `process.tsx` | Partial | The terms ("first month free, no contract, tablets stay as backup") appear in the steps banner. The four-step pilot list and the founding-partner offer are not added. |
| 11 | Team | new | Blocked | Needs photos, names, roles, address and phone. |
| 12 | Proof | `case-studies.tsx` | Done | Stays hidden without the sample flag; there are no real pilots yet. |
| 13 | FAQ | `faq.tsx` | Done | The plan's 11 questions in its order, plus the scraping question kept from the old FAQ. The "ready-made product? not off the shelf" answer is deleted. Platform-page links are not added because those pages don't exist. |
| 14 | Final CTA and contact | `contact.tsx`, `market.tsx` | Not started | The form and the contact section are still English. The plan's form changes (four required fields, POS dropdown, the "Nikolay will call you" success message), the Viber button and the phone number are not done. |

Other homepage sections (`features`, `solutions`, `integrations`, `showcase`, `principles`, `market`, contact form, footer) are still English. The page is currently mixed-language until they are translated. The plan also says to move `solutions.tsx` and the IT hub diagram off the homepage; not done.

## Site-wide

| Item | Status | Notes |
| --- | --- | --- |
| `<html lang>` | Done | `bg`. |
| Navigation and header CTA | Done | Bulgarian labels; „Заявете пилот“. |
| Page title and meta description | Done | Taken from the plan's copy bank. |
| `/en` English mirror, hreflang | Not started | The plan wants Bulgarian at `/` and English at `/en`. The old English copy was replaced, not mirrored, so English currently only survives in the untranslated sections. |
| Headline font | Done | Fraunces has no Cyrillic, so headlines would have fallen back to a system serif. Replaced with Source Serif 4. |
| Footer: KOVEX EOOD, ЕИК, address, phone, links | Blocked | Needs company details. The trademark disclaimer is kept. |
| Mobile bottom bar (Pilot, Call/Viber) | Not started | Needs the phone number. |
| Analytics goals | Not started | |
| Structured data (Organization, SoftwareApplication, FAQPage) | Not started | |

## Other pages (plan section 5)

Not started: `/integracii/*`, `/kasi/*`, `/ceni`, `/pilot`, `/za-nas`, `/nadezhdnost`, `/sigurnost-i-danni`, legal pages, `/partnyori`, `/rakovodstva`, `/en/...`. Most need the decisions below.

## Decisions needed from the founders (plan section 9)

- Price per location, setup fee, notice period, founding-partner offer.
- Company details to publish: KOVEX EOOD, ЕИК, address, phone.
- Support hours we can actually keep (the reliability section leaves them out).
- Domain and email: `kov4.com` / `hello@kov4.com` on the site, `nikolay@kov4.org` in platform outreach.
- First POS connector, and the live / in development status of each Bulgarian POS.
- Whether to host the explainer video on the site.
- A native Bulgarian speaker who works in a restaurant should read the copy; everything beyond the plan's own strings (problem bodies, FAQ answers, step wording) was written for this pass.

## Claims deliberately kept out

Following plan section 3: no "official partner", no client or order counts, no "no more tablets", no "works with every POS", no fiscal-receipt claims, no reject/cancel on Glovo.
