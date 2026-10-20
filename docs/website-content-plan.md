# Website content plan: trustworthy and high-converting

As of 20 October 2026. This plan covers what kov4.com should say, page by page, so a Sofia restaurant owner trusts us enough to book a pilot. It pulls together the business research (ICP list, platform API access, the Restimo playbook) and a review of how Restimo, Deliverect, Otter and the local competitors sell the same product.

**The one-line verdict:** the current site sells a consultancy ("free workflow assessment", "not off the shelf"), but the business is a product: one screen and one printer for Glovo, Wolt and Bolt Food, with orders going into the restaurant's POS. The site has to sell that product in Bulgarian, with a clear price and a no-risk pilot. It also has to stay as honest as it is today, because honesty is the only proof we have until the first pilots go live.

---

## 1. What we're selling (single source of truth)

Every page should agree with this section. If a fact here changes, update the site.

| Topic | Fact | Source |
| --- | --- | --- |
| Company | KOVEX EOOD, trading as kov4. Contact: Nikolay Yordanov. | Glovo onboarding email, 19 Oct 2026 |
| Product | Middleware that receives Glovo, Wolt and Bolt Food orders through their official APIs, shows them on one screen, prints one kitchen ticket format and passes orders to the POS. It also syncs sold-out items, pauses and prep times back to the apps. | Playbook, "How Restimo works" |
| MVP features | 1) all three apps on one web screen (any cheap Android tablet), with sound and auto-accept; 2) automatic kitchen ticket per order via cloud printer; 3) one switch for sold out / store paused on all three apps; 4) prep time and "ready" set once; 5) SMS or call to the manager if an order sits unaccepted 3 min, and paging us if a platform connection drops. | Playbook, "Build first" |
| Where we win | Bulgarian POS connectors (Microinvest, Barsy, BeMODY, Eltrade), with fiscal receipts left to the certified POS under Наредба Н-18. Also Bulgarian-language UI and support, same-day install in Sofia, support on Viber/WhatsApp during dinner service, and one flat price. | Playbook, "Then, where you beat them" |
| ICP | A Sofia restaurant or café on all three apps (Glovo, Wolt and Bolt Food), with real order volume on each and no integration yet. About 237 venues match. | `icp/`, Sofia ICP leads sheet |
| Platform access | Glovo: onboarding request sent 19 Oct 2026, awaiting reply. Bolt: request forwarded internally. Wolt: request form, then sandbox, QA demo, one pilot venue, rollout. | Delivery API access notes |
| Hard limits | Glovo orders can't be rejected or cancelled through the API. Glovo's web app is still needed for courier issues, bags, schedule changes and support ("does not replace our Webapp 100%"). Every platform launches an integrator with one pilot venue first. | Glovo Partners API docs |
| Competition | No Bulgarian product owns this. Restimo and Deliverect don't list Bulgaria on Wolt. Six Wolt-approved integrators cover Bulgaria (Outcon, Appy Solutions, GetOrder, Bitebell, CaptainSpec, ChoiceQR), and none is a known brand with Sofia restaurants. TabL sells QR menus and courier dispatch; its marketplace story is one vague line. | Playbook, "Competition in Bulgaria" |
| Price benchmark | Restimo: €39 per location per month for integrations, €39 setup, +€12 per POS integration, 14-day trial. GetOrder (Poster marketplace): 14-day test, from 575 UAH per restaurant per month. | restimo.com/en/pricing, joinposter.com |

---

## 2. What the competitors' sites teach us

### What each site does

| Site | Hero promise | Proof they show | Price shown? | Worth copying | Worth avoiding |
| --- | --- | --- | --- | --- | --- |
| [Restimo](https://www.restimo.com/en) | "All-in-one solution for modern restaurants" | 20M+ orders, 2,400+ clients, 100+ cities, 5 countries; 6 client logos; 5 named testimonials with headshots and job titles; 13 press and partner logos; full legal entity, address, tax ID and phone in the footer | Yes, per location, with add-ons and a 14-day trial | A page per integration with a feature checklist that also lists what is **not** supported; named testimonials tied to concrete results ("got rid of over 100 tablets across our chain"); a public price list | Vague hero; typos in headlines; the same stat shown as 2,000+ and 2,400+; a "Get started" button linked to `#`; 16 feature tiles that bury the core job |
| [Deliverect](https://www.deliverect.com/en) | "AI omnichannel digital ordering solutions" | 1.5B+ orders, 80K locations, 65+ countries; KFC, Burger King, Taco Bell logos; Little Caesars case study; "99.998% store uptime" | No: "custom quote" | An uptime figure as a trust signal; a pricing FAQ that answers "how much", "what happens when I sign up" and "how does it pay for itself" | Enterprise jargon; stats that differ between pages (65+ vs 52 countries); no price |
| [Otter](https://www.tryotter.com/) | "Designed by and for restaurant operators" | 100,000+ restaurants; logos; customer stories by first name and venue | Yes, three tiers ($79, $178, $278) with the fine print | Operational promises a restaurant owner cares about ("set up in 7 days or less", "24/7 support", "offline mode"); a comparison table against named alternatives; an FAQ grouped by topic (setup, hardware, pricing) | Overloaded mega-menu |
| [Wolt for merchants, Bulgaria](https://merchant.wolt.com/en/bgr/solution/integrations) | Orders straight to your POS | Wolt's own integration-partner directory | n/a | It tells merchants that onboarding onto an existing integration takes about 1–2 weeks. Once we're listed, we can quote that and link to our directory entry. | n/a |
| GetOrder, ChoiceQR, TabL | Hub, QR menu or "connect external order channels" | Marketplace listings and platform logos | GetOrder only | n/a | A vague delivery story with no menu or stock sync is TabL's gap. Don't be vague. |

### Five lessons

1. **Proof is specific and named.** The strong testimonials name a person, a role, a venue and one concrete result. Logos without results are weaker.
2. **A public price converts small restaurants.** Restimo and Otter show prices; Deliverect, which sells to chains, doesn't. Our buyer is an owner of one to three locations, so we show the price.
3. **Say what isn't supported.** Restimo's Glovo page lists "not supported" items. That candour is rare and builds trust with operators who have been burned before.
4. **Consistency is a trust signal.** Every competitor has a mismatched number, a typo or a dead button somewhere. A clean, consistent Bulgarian site is an easy edge.
5. **Nobody speaks Bulgarian.** None of these sites addresses a Sofia owner in Bulgarian, with a Sofia phone number, a local POS on the list and someone who can come round before Friday service.

---

## 3. Trust at zero clients: what we can honestly claim

We have no live clients yet, so the site can't lean on numbers or logos. EU misleading-advertising rules apply to business-to-business marketing too, so invented clients, results or quotes are off the table (see `src/content/sample-proof.ts`, which keeps the fictional ones behind a flag). Credibility has to come from things we can show today.

| We can show now | How it appears on the site |
| --- | --- |
| Real people | Founder photos, names, a mobile number and a Viber/WhatsApp button. "You'll talk to the people who build it." |
| A real company | KOVEX EOOD, ЕИК (linked to the Commercial Register), registered address, in the footer and on About. Bulgaria's Electronic Commerce Act requires the provider's name, address and registration details anyway. |
| The product | Screen recordings of the real order screen and a printed ticket, from sandbox orders, once built. Until then keep the illustrations, labelled as illustrations, as the site does now. Also the existing 84-second explainer video, with its tagline „Приеми. Готово.“ |
| How we work with the platforms | An honest status line: "Officially integrating through the Glovo, Wolt and Bolt Food partner APIs. Approval for Bulgaria is in progress." Once a platform approves us, change this to "Approved integration partner" and link to the platform's own listing. |
| Risk reversal | Pilot terms: free first month, no setup fee, no contract, cancel any time. The tablets keep working alongside the integration, so nothing breaks if we do. |
| Reliability design | Alerts for unaccepted orders, retries, an event log, and a public status page (see section 5). |
| Data handling | GDPR, EU hosting, a data processing agreement on request, and least-access API permissions. |
| Local fit | Named Bulgarian POS systems, labelled honestly as "live" or "in development"; Bulgarian UI; an on-site install in Sofia. |
| Real scarcity | "Founding partner programme: 10 Sofia venues, price locked for 24 months." Use this only if we mean it, and show places left only if the counter is real. |

### What the site must never say

- "Official partner" or "certified" for a platform before that platform has approved us. Platform logos are fine to name compatibility; they must not imply endorsement. The footer disclaimer stays.
- "No more tablets." Glovo's own docs say its web app is still needed. Say "one screen instead of three; the tablets stay as a backup."
- "Works with every POS." List the ones that work, and label the ones being built.
- Any count of clients, orders or uptime that isn't real and current.
- "Reject orders" as a feature on Glovo, where the API doesn't allow it. Feature lists must be per platform (section 5).
- That we issue fiscal receipts. The certified POS does.
- Anything built on scraped data. The FAQ says "we don't scrape", so don't publish a "Sofia delivery report" or similar made from the lead-research scrape.

---

## 4. Homepage, section by section

The site's language should be **Bulgarian first, English second** (`/` in Bulgarian, `/en` in English). Today `<html lang="en">` and every string is English, which is the single biggest conversion leak for this ICP. Inter and IBM Plex Mono already load Cyrillic.

The order below follows how an owner decides: "is this for me?" → "does it work?" → "can I trust them?" → "what does it cost?" → "what happens if I say yes?". The "Today" column maps each section to the existing components.

| # | Section | Job | Today |
| --- | --- | --- | --- |
| 1 | Hero | Say what it is in 5 seconds | `hero.tsx`: rewrite the copy |
| 2 | Proof bar | Platforms, POS, status | `platforms.tsx`: adapt |
| 3 | Problem | "That's my counter" | `problem.tsx`: keep, tighten |
| 4 | How it works | Three steps, with video | `showcase.tsx` + video: adapt |
| 5 | Features | The MVP five, per platform | `features.tsx`: re-scope |
| 6 | Time and money | Calculator | New |
| 7 | Reliability | What if it breaks | Part of `integrations.tsx`: promote |
| 8 | POS integrations | "Does it work with my POS?" | New (from `integrations.tsx`) |
| 9 | Pricing | One price | New |
| 10 | Pilot offer | Risk reversal | `process.tsx`: rewrite as the pilot |
| 11 | Team | Real people in Sofia | New |
| 12 | Proof | Pilots, quotes | `case-studies.tsx`: only real content |
| 13 | FAQ | Objections | `faq.tsx`: rewrite |
| 14 | Final CTA + contact | Book | `contact.tsx` + `market.tsx`: merge |

`solutions.tsx` (grocery, retail, florists) and the IT-team hub diagram dilute the restaurant pitch. Move them to `/za-it` and `/drugi-biznesi` pages, or cut them, until there are clients outside food service.

### 1. Hero

- **Headline (BG):** „Glovo, Wolt и Bolt Food — на един екран.“
- **Second line:** „Поръчките влизат директно в касата и в кухнята. Без преписване.“
- **Subhead:** „Изчерпан продукт спирате веднъж — и трите приложения се обновяват. За ресторанти и кафенета в София.“
- **Primary CTA:** „Заявете безплатен пилот“ (scrolls to the form).
- **Secondary CTA:** „Вижте как работи · 84 сек.“ (opens the explainer video).
- **Micro-trust under the buttons:** „Първи месец безплатно · Без договор · Таблетите остават като резерва.“
- **Visual:** keep the photo + POS-queue composition, and replace the illustration with the real screen as soon as it exists.

English version: "Glovo, Wolt and Bolt Food on one screen. Orders go straight to your POS and kitchen, with no re-typing."

### 2. Proof bar

- „Поръчки от“ Glovo · Wolt · Bolt Food → „директно в“ касата · кухненския принтер · екрана.
- The status line from section 3 ("Officially integrating through the partner APIs… approval in progress"), then "Approved integration partner" with links once true.
- Later: real client logos, but only with written permission.

### 3. Problem

Keep the current five situations, written as the owner would say them: „Трима таблета на бара“, „Преписване на поръчки в касата в най-натовареното време“, „Спиране на изчерпан продукт в три приложения“, „Пропусната поръчка, защото таблетът е заглушен“, „Отчети от три различни места“. Add one quantified line, labelled as an example: "80 orders a day × 1 minute of re-typing = 40 hours a month." This matches the explainer video.

### 4. How it works (three steps)

1. **Свързваме приложенията.** „Вие ни давате достъп като търговец, ние свързваме Glovo, Wolt и Bolt Food през официалните им API.“
2. **Настройваме менюто и принтера.** „Сверяваме продуктите и добавките с вашата каса. Идваме на място в София.“
3. **Приемате. Готово.** „Поръчките идват на един екран и се печатат сами. Таблетите остават включени като резерва през пилота.“

Put a line on timing next to step 3: "From signed pilot to first live order: usually X days." Leave it out until the first pilot gives us a real number.

### 5. Features

Lead with the five MVP features (section 1) and show each one as it really behaves. Each tile gets a small "Glovo ✓ Wolt ✓ Bolt ✓" row that matches the platform matrix in section 5. Move the IT-heavy items (idempotency, data translation) to the platform pages.

### 6. Time and money calculator

This is the main conversion tool. The inputs are orders per day on each app, minutes per manual entry (default 1) and the staff hourly cost (blank, owner fills it). The output is hours per month spent re-typing, their cost, and a comparison with our monthly price. Label the result „Ориентировъчно“ (an estimate). The CTA under the result is „Заявете пилот“.

### 7. Reliability: "what if it breaks on a Friday night?"

This is the owner's biggest fear, and no competitor answers it on the homepage.

- „Таблетите на платформите остават включени през пилота — ако нещо спре, поръчките пак идват.“
- An alert to the manager's phone if an order sits unaccepted 3 minutes.
- We're paged automatically if a platform connection drops.
- Every order event is logged, and failed sends are retried (the existing log tile).
- Support by phone and Viber during service hours. State the hours, for example 11:00–23:00, 7 days.
- A link to the public status page.

### 8. POS integrations

Show a grid of Bulgarian POS systems with honest labels: „Работи“ (live), „В разработка“ (in development) and „По заявка“ (on request). Candidates are Microinvest, Barsy, BeMODY and Eltrade. Below the grid: „Касата ви не е в списъка? Кажете ни коя е — така решаваме коя да свържем следваща.“ This also tells us which POS the 237 leads use, which is an open question in the playbook. Explain fiscal receipts in one line: the receipt stays with the certified POS.

### 9. Pricing

Show one plan with one price per location, in € excluding VAT, said plainly. Restimo charges €39 + €39 setup + €12 for a POS connector, so about €51 a month with a setup fee. A flat price at or under that, with no setup fee, beats it in one glance. The founders set the number (section 9).

Suggested layout:

- **„Един обект“:** €__ / месец, без ДДС. Includes all three apps, the order screen, kitchen printing, sold-out sync, alerts, one POS connector, an on-site install in Sofia, and Bulgarian support.
- **Options:** printer or tablet rental; chains with 5+ locations („Обадете се“).
- **Terms in plain words:** monthly, cancel with 30 days' notice, no setup fee, first month free.
- **What's not included:** platform commissions (unchanged; we don't touch them) and fiscal devices.

### 10. Pilot offer

The current four-step "assessment" process becomes the pilot:

1. A 20-minute call, or we visit.
2. We connect one location (the platforms require this).
3. Two weeks of live service with the tablets running in parallel.
4. You decide. If it hasn't saved you time, you pay nothing.

Add the founding-partner offer here if it's real.

### 11. Team

Add photos, names and roles, one line on why we're building this, a Sofia address and a mobile number. For a new vendor, this is the strongest trust element available. Restimo leads with stats because it has them; we lead with faces because we don't.

### 12. Proof (once real)

Use the `case-studies.tsx` layout with real pilots only (section 6 says what to collect). Until then, hide the section, as the flag already does.

### 13. FAQ

Rewrite it around the questions owners actually ask, in this order:

1. „Трябва ли да сменя касата си?“ No. Name the POS systems that work.
2. „Ще спрат ли таблетите?“ They stay as a backup. Explain what the Glovo web app is still needed for.
3. „Колко струва и има ли договор?“ The price and the terms.
4. „Какво става, ако системата спре в петък вечер?“ The fallback, the alerts and the support hours.
5. „Официални ли сте за Glovo/Wolt/Bolt?“ The honest status, kept current.
6. „Влияе ли на комисионните на платформите?“ No.
7. „Колко време отнема свързването?“ A real number once we have one; Wolt's 1–2 weeks for existing integrations can be quoted once we're listed.
8. „Как става фискалният бон?“ The POS issues it under Н-18.
9. „Какво точно може и какво не може за всяка платформа?“ Link to the platform pages.
10. „Кой има достъп до данните ни?“ GDPR, EU hosting, a DPA.
11. „Работите ли извън София?“ Sofia first; Plovdiv and Varna on request.

Delete the current "Is there a ready-made product? Not off the shelf" answer. It contradicts the product.

### 14. Final CTA and contact

- **Headline:** „Пробвайте един месец. Таблетите остават като резерва.“
- **Form:** see section 7.
- **Alongside the form:** a Viber/WhatsApp button, a phone number, the reply-time promise („Отговаряме до 2 часа в работно време“) and the founders' photos.

### Footer

Keep the trademark disclaimer. Add KOVEX EOOD, ЕИК, the registered address and a phone number, plus links to Terms, Privacy, Cookies, DPA, Status, About and the platform pages.

---

## 5. Other pages

| Page | Why it matters | Content |
| --- | --- | --- |
| `/integracii/glovo`, `/wolt`, `/bolt-food` | Owners search „Glovo каса интеграция“ and similar. Restimo has a page per platform. | What works, as a table: receive, accept, reject, ready, menu sync, item availability, pause store, hours. Mark each ✓ / ✗ / "via the platform's own app", copying Restimo's "not supported" candour. Add what the restaurant needs (an active platform contract, admin access), the setup steps, and platform-specific FAQ. |
| `/kasi/<pos>` | „Microinvest Glovo“ is exactly what the ICP types into Google. | One page per POS: status, what syncs, how receipts work, and whether we partner with the vendor. |
| `/ceni` | A public price is a conversion lever for small owners. | The plan, the terms, a calculator link and a pricing FAQ (Deliverect's set is a good list: how much, what's included, what happens when I sign up, how it pays for itself). |
| `/pilot` | Paid search and outreach land here. | One page, one offer: pilot terms, three steps, the form. No navigation clutter. Use it as the link in the 237-lead outreach. |
| `/za-nas` | Who we are | Team, company details, why we exist, a photo in a Sofia kitchen. |
| `/nadezhdnost` + a status page | Answers the Friday-night fear | Fallback design, alerts, monitoring, support hours, incident history. Host the status page on a hosted status service. |
| `/sigurnost-i-danni` | Data questions from chains and accountants | GDPR, the DPA, EU hosting, the access we request and why, sub-processors. |
| `/obshti-usloviya`, `/poveritelnost`, `/biskvitki` | Legal and trust | The existing privacy page, completed with the company details; terms covering liability for lost orders (an open risk in the playbook); a cookie notice if analytics set cookies. |
| `/partnyori` | POS vendors and accountants who refer clients | A referral offer and a co-sell page for POS vendors. |
| `/rakovodstva` (guides) | SEO and pre-sale trust | Short, useful Bulgarian articles: "How to pause a dish on Glovo, Wolt and Bolt", "What to check before connecting a delivery app to your POS", "Н-18 and delivery orders: the receipt question, explained", once an accountant confirms it. |
| `/en/...` | Foreign-owned chains and the platforms' partner teams | An English mirror of the homepage, pricing and platform pages. |

### Platform capability matrix (to verify before publishing)

Draft from the API research. Confirm each cell in the sandbox before it goes on a page.

| Capability | Glovo | Wolt | Bolt Food |
| --- | --- | --- | --- |
| New orders arrive automatically | ✓ webhook | ✓ webhook | ✓ webhook |
| Accept order | Auto-accept fallback | ✓ | ✓ |
| Reject or cancel order | ✗ in the Glovo web app | ✓ | ✓ |
| Mark ready / prep time | Check | ✓ | Check |
| Menu sync | Check | ✓ (required) | ✓ pushMenu |
| Sold-out item | Check | ✓ | ✓ updateMenuItemAvailability |
| Pause store / hours | Check | ✓ venue API | ✓ pauseOrders, schedule |
| Courier issues, bags, support | Glovo web app | Platform | Platform |

Bolt's endpoint names come from a third-party copy of the API and are unconfirmed with Bolt.

---

## 6. The proof roadmap

Collect proof from day one of the first pilot. Ask for permission in the pilot agreement, not afterwards.

| Stage | What to show | How to get it |
| --- | --- | --- |
| Now (0 clients) | Team, company details, the explainer video, honest platform status, the pilot terms, the reliability design | Already possible |
| Platform approved | "Approved integration partner" plus links to the platform's listing, for example developer.wolt.com/integration-partners | When each approval lands |
| First pilot live | A real screen recording of a real order in a real kitchen (with permission), and the first named quote | Film during the first Friday service |
| 3–5 pilots | Before/after case studies: minutes saved per day, mis-keyed orders before vs after, time to first live order. Name, role, venue, photo. | Measure a baseline in week 0 and repeat in week 2 |
| 10+ venues | A logo strip, a live counter of real orders processed, Google reviews on the KOVEX business profile | Ask each happy client for a Google review |
| POS vendor partnership | "Built with BeMODY" or similar co-branded pages | Vendor agreement |

**Pilot measurement template:** for each pilot, record orders per day per app, minutes of manual entry per order (timed), orders mis-keyed per week, unaccepted or missed orders per week, and time from signature to first live order. Measure in week 0 and week 2. These are the numbers the case studies and the calculator defaults will use.

---

## 7. Conversion mechanics

### Calls to action

- Use one primary action everywhere: „Заявете безплатен пилот“. The secondary is „Обадете ни се“ or Viber. Drop the "assessment" wording.
- Keep a sticky header button, and on mobile a bottom bar with "Pilot" and "Call/Viber". Most owners will open the site on a phone, between services.
- Make the primary CTA reachable on every screen without scrolling more than one section.

### The form

The current form has ten fields. It qualifies well but asks a lot of someone holding a phone in a kitchen. Recommended:

- **Required:** name, phone (Viber-friendly), venue name, which apps they're on (checkboxes: Glovo, Wolt, Bolt Food).
- **Optional:** email, POS system (dropdown with the Bulgarian POS list + "Other" + "Don't know"), number of locations, a note.
- Drop "business type" and "main challenge" from the first step. Ask them on the call.
- After submitting, show who will call ("Nikolay will call you today or tomorrow") and the reply-time promise.
- Keep the existing spam protection and the email fallback when delivery fails.

The phone number matters more than the email for this buyer, and leads with all three apps are the ICP, so the form should flag them for us.

### Other levers

- **Pre-filled outreach links:** `/pilot?venue=<name>` personalises the headline for the 237-lead outreach („Пилот за <name>“).
- **Calendar booking** on the thank-you page, for owners who prefer to pick a slot.
- **Speed:** keep the site static and the homepage light. The current Next.js build already prerenders it.
- **Measurement:** track CTA clicks, form starts and submissions, phone and Viber clicks, and video plays (Vercel Web Analytics). Pick one goal: a pilot request.

### SEO basics

- Bulgarian titles and descriptions per page, `hreflang` bg/en, and schema.org `Organization`, `SoftwareApplication` (with `offers`) and `FAQPage`.
- A Google Business Profile for KOVEX in Sofia, which later collects reviews.
- Target terms: „интеграция Glovo каса“, „Wolt POS интеграция“, „Bolt Food таблет“, „поръчки от Glovo в касата“, „<POS> Glovo“.

---

## 8. Copy bank

| Use | Bulgarian | English |
| --- | --- | --- |
| Hero | Glovo, Wolt и Bolt Food — на един екран. | Glovo, Wolt and Bolt Food on one screen. |
| Hero line 2 | Поръчките влизат директно в касата и в кухнята. | Orders go straight to your POS and kitchen. |
| Sold-out | Изчерпано веднъж. Спряно навсякъде. | Sold out once. Paused everywhere. |
| Tagline (from the video) | Приеми. Готово. | Accept. Done. |
| Risk reversal | Първи месец безплатно. Без договор. Таблетите остават като резерва. | First month free. No contract. Your tablets stay as a backup. |
| Reliability | Ако нещо спре, поръчките пак идват на таблета — и ние разбираме първи. | If anything stops, orders still reach the tablet, and we know first. |
| Honesty | Ако интеграцията не си струва за вас, ще ви го кажем. | If an integration isn't worth it for you, we'll tell you. |
| Local | Идваме на място в София. Поддръжка на български, по време на работа на кухнята. | We come to you in Sofia. Support in Bulgarian, during service hours. |
| Platform status | Свързваме се през официалните партньорски API на Glovo, Wolt и Bolt Food. | We connect through the official Glovo, Wolt and Bolt Food partner APIs. |
| Fiscal | Фискалният бон остава във вашата каса. | The fiscal receipt stays with your POS. |
| CTA | Заявете безплатен пилот | Request a free pilot |
| Form success | Благодарим! Николай ще ви се обади днес или утре. | Thanks! Nikolay will call you today or tomorrow. |

Have a native speaker who works in a restaurant read the Bulgarian copy before launch. Owners spot translated-sounding copy at once.

---

## 9. Decisions the founders need to make

- [ ] **Positioning:** confirm that the site sells the product (pilot, then subscription) and not a consultancy. Most of this plan assumes yes.
- [ ] **Price:** the per-location monthly price, whether there's a setup fee, the notice period, and whether the founding-partner offer is real.
- [ ] **Domain and email:** the site uses `kov4.com` / `hello@kov4.com`, while platform outreach went from `nikolay@kov4.org`. Pick one and use it everywhere. Platforms and clients will compare.
- [ ] **Company details** to publish: KOVEX EOOD, ЕИК, address, phone.
- [ ] **First POS connector:** decide from the POS answers collected on outreach calls.
- [ ] **Support hours** we can actually keep, because the site will promise them.
- [ ] **Liability terms** for an order lost through our system.
- [ ] **Naming competitors:** recommendation: compare against "three tablets" and "international hubs" in general, not Restimo by name. EU rules allow comparative advertising only when it's objective and verifiable, and it invites a reply we can't win yet.

## 10. Launch checklist (content)

- [ ] Bulgarian homepage live at `/`, English at `/en`, `lang` set per page.
- [ ] Hero, how it works, pricing, pilot, reliability, team, FAQ and contact rewritten as above.
- [ ] Platform status line matches reality on the day of launch.
- [ ] No fictional proof: `NEXT_PUBLIC_SHOW_SAMPLE_PROOF` off in production.
- [ ] Feature claims checked against the platform capability matrix.
- [ ] Footer and About show the company name, ЕИК, address and phone.
- [ ] Terms, privacy, cookies and DPA pages published and reviewed.
- [ ] Form delivers to a real inbox or CRM, with a test submission received (README "Before launch").
- [ ] Phone and Viber links tested on Android and iPhone.
- [ ] Analytics goal set to "pilot request".
- [ ] A native-speaker read of all Bulgarian copy.

## Sources

- Restimo: [homepage](https://www.restimo.com/en), [pricing](https://www.restimo.com/en/pricing), [Glovo integration page](https://www.restimo.com/en/integrations/glovo), [clients](https://www.restimo.com/en/clients)
- [Deliverect homepage](https://www.deliverect.com/en) and [pricing](https://www.deliverect.com/en/pricing)
- [Otter homepage](https://www.tryotter.com/)
- [Wolt for merchants, Bulgaria: integrations](https://merchant.wolt.com/en/bgr/solution/integrations) and [Wolt integration partners](https://developer.wolt.com/integration-partners)
- [GetOrder on the Poster marketplace](https://joinposter.com/en/applications/getorder)
- [Glovo Partners API](https://api-docs.glovoapp.com/partners/index.html), [Wolt: getting started for restaurants](https://developer.wolt.com/docs/getting-started/restaurant), [Bolt developer portal](https://developer.bolt.eu/food/main/)
- Internal: the "Building a better Restimo – Bulgaria playbook" doc (17 Oct 2026), the Sofia ICP leads sheet, the delivery API access notes, and this repository's current site, README and explainer video.
