/**
 * BookLeaf Knowledge Base, split by category so each AI call only receives
 * the part it needs (instead of the whole KB on every request).
 */

export const COMPANY = `BookLeaf Publishing is a self-publishing company in India and the US.
Packages: Standard Free (no upfront cost) and Bestseller Breakthrough (premium, paid, with marketing and distribution add-ons).
We handle cover design, typesetting, ISBN assignment, printing, distribution and royalty management.
In-house printing facility and warehouse are in Delhi. Print partners: Repro India and Epitome Books.`;

export const TONE = `TONE GUIDELINES
- Empathetic and professional. Authors are partners, not customers to be managed.
- Acknowledge the author's concern before jumping to solutions.
- Be specific: use the actual numbers, dates and statuses given in the facts. No vague reassurance.
- If something is BookLeaf's fault (delayed royalty, ISBN error), own it directly. No corporate deflection.
- If escalation or investigation is needed, give a clear timeline (e.g. "within 48 hours"), never open-ended promises.
- Never blame the author, even if the delay is on their side. Frame it collaboratively.
- Always end with a clear next step for the author and/or the BookLeaf team.`;

export const CATEGORY_KB = {
    "Royalty & Payments": `ROYALTY POLICY
- 80/20 split: 80% of net profit per book goes to the author, 20% to BookLeaf.
- Net profit = MRP minus printing cost, platform commission (Amazon/Flipkart) and shipping charges.
- Royalties are calculated quarterly and paid within 45 days of the quarter ending.
- Minimum payout threshold is Rs 1,000. Below it, royalties roll over to the next quarter.
- Payouts are bank transfers to the account linked in the author's dashboard.
- Authors can see a per-platform royalty breakdown in their dashboard.
HANDLING
- "No royalty yet": acknowledge frustration, explain the quarterly cycle and 45-day window, ask them to confirm bank details are linked, give the specific next payout date. If genuinely overdue, escalate with a 48-hour resolution timeline.
- "Royalty too low": explain the net profit calculation, offer a detailed line-by-line breakdown, do not be defensive.`,

    "ISBN & Metadata Issues": `ISBN POLICY
- Every book gets a unique ISBN assigned by BookLeaf, registered under BookLeaf's publisher imprint.
- An author who wants an ISBN under their own imprint must obtain it independently.
- ISBN errors (duplicate, wrong book linked) are HIGH PRIORITY and escalated to the production team.
HANDLING
- ISBN mismatch or error: treat as a serious data issue, confirm immediate escalation to the production team, give a 48-hour resolution timeline.
- Metadata updates (description etc.) can be submitted via the dashboard or by emailing the BookLeaf team. Changes reflect on platforms in 3-5 business days.`,

    "Printing & Quality": `PRINTING POLICY
- In-house printing handles most orders. Overflow or special formats go to Repro India or Epitome Books.
- Standard print turnaround: 5-7 business days from order confirmation.
- Quality issues (misprints, binding defects, colour inconsistency): BookLeaf arranges a FREE reprint after verification. The author may need to share photos of the defective copy.
HANDLING
- Apologise sincerely, ask for photos of the defective copies, confirm a free reprint once verified, give a 5-7 business day timeline for the reprint.`,

    "Distribution & Availability": `DISTRIBUTION POLICY
- Books are listed on Amazon India, Flipkart, Amazon US, Amazon UK and the BookLeaf Store.
- New listings go live within 7-10 business days after publication is complete.
- "Unavailable" on a platform usually means a stock sync issue. The team can trigger a re-sync within 24-48 hours.
HANDLING
- Explain it is typically a stock sync issue, confirm you are triggering a re-sync with the distribution team, set the 24-48 hour expectation.`,

    "Book Status & Production Updates": `PRODUCTION STAGES
Manuscript Received -> Editing (if opted) -> Cover Design -> Typesetting -> Proofreading -> ISBN Assignment -> Printing -> Distribution Setup -> Published & Live.
- Authors are emailed at each stage.
- Delays typically happen at Cover Design (waiting for author approval) and Proofreading (revision rounds).
HANDLING
- Use the actual production status from the book facts. If delayed, be honest about why (e.g. waiting for proof approval) without blaming the author, and give a specific updated timeline.`,

    "General Inquiry": `GENERAL HANDLING
- Metadata updates (e.g. book description on Amazon after going live) can be submitted through the dashboard or by emailing the BookLeaf team. Changes typically reflect on platforms within 3-5 business days.
- If you do not have enough information to answer, say what the team will check and give a 48-hour timeline.`,
};