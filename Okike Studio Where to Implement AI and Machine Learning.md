# Okike Studio: Where to Implement AI and Machine Learning

Oct 22, 2026 · @Cyber Prep

## Overview

Most near-term AI wins for Okike Studio come from LLM APIs on the enquiry flow, the public site and the client portal; real ML needs data the studio has not yet collected.

Okike Studio is an independent brand, product and software studio. The site is built on Next.js (App Router) with GSAP animation, hosted on Vercel. It sells three offers: Starter Site (from ₦150,000, up to 5 pages), Business Pro (from ₦450,000, up to 15 pages) and Custom Software (quoted individually). The funnel is a 3-step enquiry form, then a manual quote, then a client portal with Project Pulse, My Inquiries, Milestones and a Deliverables Vault.

## 1. Enquiry flow (highest value)

The enquiry form is where an AI scoping assistant pays back fastest, because it already has a "Help me decide" option with nothing behind it.

- **Scoping assistant:** replace "Help me decide" with adaptive questions that draft a project brief and suggest Starter, Business Pro or Custom Software.
- **Indicative price range:** show a range in naira, with a human confirming the final quote. This respects the site's "no automatic price total" stance.
- **Triage and summaries:** auto-summarise each enquiry, tag it by service and urgency, and screen out spam before it reaches the studio inbox.

## 2. Public website

On the public site, a grounded chat assistant and page-specific SEO copy are the two cheapest additions.

- **Chat assistant:** answers questions such as "what does Business Pro include?" at any hour, grounded only in the services, pricing and FAQ content.
- **Segment personalisation:** the home page already asks "Where are you now?" with three segments (an idea to shape, an offer to untangle, a next stage to prepare for). Use them to tailor CTAs and content.
- **SEO and accessibility:** every page uses the same meta description ("Structure before scale"). Generate page-specific meta descriptions and image alt text.

## 3. Client portal

The portal already holds structured data (sprints, milestones, deliverables), which makes it the best place to apply AI to data the studio generates anyway.

- **Progress summaries:** auto-written weekly updates from sprint and milestone data.
- **Handover-risk forecasting:** predict whether a target date, such as the Nov 15, 2026 handover shown in Project Pulse, is slipping. Simple velocity-based prediction is enough; deep learning is not needed.
- **Vault Q&A:** semantic search and question answering over documents such as strategy decks.
- **Feedback to tasks:** turn client comments from Figma or email into categorised, assignable tasks.

## 4. Internal studio operations

Internally, AI can speed up quoting and pre-launch checks, while true ML estimation has to wait for project history.

- **Proposals and quotes:** draft them from each enquiry for the studio to review.
- **Hour estimation:** a model trained on past projects (scope in, hours out). This is real ML and needs accumulated history.
- **Automated checks:** run Lighthouse, accessibility and SEO checks before every launch, which the portal's "Quality, Performance & Launch" phase already calls for.
- **First drafts:** copy and positioning research that designers refine.

## 5. New revenue line

An "AI-enabled" tier under Custom Software would let the studio sell AI to Nigerian SMEs directly, rather than only using it internally.

Examples: WhatsApp and website support bots, document processing, demand forecasting and product recommendations.

## Suggested order

Start with LLM-API features now, and begin logging data today so the ML features become possible later.

| Phase | What | Why |
| --- | --- | --- |
| Now | Enquiry assistant, website chat, SEO fixes | LLM API calls only; no training data needed |
| Next | Portal summaries and Vault document Q&A | Uses data the studio already generates |
| Later | Hour estimation, lead scoring, risk prediction | Real ML needs history, so log enquiries, outcomes and hours now |

## Things noticed

Three issues should be settled before AI features touch client data.

- **Portal without sign-in:** the portal page loaded without authentication when fetched, showing project data. It may be demo content, but confirm authentication before adding AI features that read client files.
- **Unfinished content:** the Studio page still shows "\[Team names and roles\]" and a sample image, and the Work page lists "Project 02" and "Project 03" as placeholders. The portal's staging link points to okikestudio.com.
- **Data protection:** if enquiries or client documents are sent to an AI API, the Nigeria Data Protection Act 2023 applies, so a privacy notice and consent are needed.

## Platform gaps

The client portal and public site have gaps beyond AI, and the portal's missing sign-in gate should be fixed before anything else. This review covers only what the pages return to a public request: I could not log in, and I saw no studio-side admin view.

### Fix first

- **Portal is not gated:** /portal, /portal/enquiries, /portal/milestones and /portal/deliverables all loaded without signing in, showing contract status, budget ranges and project names. It may be seed data, but if it is real, add real authentication (Supabase Auth fits the stack), role-based access and per-client data isolation.
- **Dead and wrong links:** every "Download" button and the PDF "Open" button points to #. The Figma link goes to the generic figma.com, and the staging link goes to okikestudio.com, a different domain from okikeenterprises.com.
- **Inconsistent data:** the same project appears as "Venture Identity & Digital Flagship Experience", "Venture Brand & Digital Flagship Experience" and "Aether Venture Brand & Web". Project Pulse says "Sprint 3 of 6, 50%" while Milestones shows four phases over 10 weeks. Portal budgets are in USD ($15k–$30k) while public pricing is in naira.

### Missing from the portal

- **Interaction:** it is read-only apart from "Approve / Discuss Scope". Clients cannot comment on a milestone, approve a deliverable, upload files or message the studio in-app.
- **Money and contracts:** no invoices, payments or e-signature. With naira pricing, Paystack or Flutterwave would fit.
- **Notifications:** no email or WhatsApp alerts when a milestone moves or a file is added.
- **History:** no activity log, and no version history on deliverables beyond a label such as "v1.2".
- **Admin side:** no studio-facing view for updating milestones, files and proposals. If none exists, that data is edited by hand.

### Missing from the public site

- **Trust content:** Work lists one real project, with placeholders for the other two. Studio still shows "\[Team names and roles\]" and a sample image. There are no testimonials or case-study pages.
- **Legal pages:** the footer has no privacy policy or terms, which matters under the Nigeria Data Protection Act 2023 once enquiries are collected.
- **Discoverability:** robots.txt and sitemap.xml both returned errors on fetch, and the public pages share one meta description.
- **Contact and conversion:** no "book a call" option. The email (studio@okike.com) is on a different domain from the site, and the social links appeared as plain text with no URLs.

### Missing for the business

- **Pipeline:** enquiries do not visibly feed a CRM or tracker, so conversion cannot be measured.
- **Data capture:** to enable the later ML features, log enquiries, quotes, outcomes and hours from now on.
- **Analytics:** I could not verify whether any is installed.

## Sources

- [Okike Studio home](https://studio.okikeenterprises.com/)
- [Services](https://studio.okikeenterprises.com/services)
- [Work](https://studio.okikeenterprises.com/work)
- [Studio](https://studio.okikeenterprises.com/studio)
- [Enquiry](https://studio.okikeenterprises.com/enquiry)
- [Client portal](https://studio.okikeenterprises.com/portal)
- [Portal: My Inquiries](https://studio.okikeenterprises.com/portal/enquiries)
- [Portal: Milestones](https://studio.okikeenterprises.com/portal/milestones)
- [Portal: Deliverables](https://studio.okikeenterprises.com/portal/deliverables)
