import assert from "node:assert/strict";
import test from "node:test";
import { buildPayload } from "../lib/enquiry.ts";
import { validateEnquiry } from "../lib/enquiry-server.ts";

test("buildPayload includes AI metadata and NDPA consent", () => {
  const answers = {
    goal: "Bespoke logistics platform for Lagos merchants",
    brand: "",
    website: "",
    software: "Multi-role courier dispatch dashboard",
    budget: "₦2.5M",
    timing: "8 weeks",
    name: "Emeka",
    email: "emeka@logistics.ng",
    company: "SwiftLog",
  };

  const payload = buildPayload(
    ["software"],
    false,
    "custom-software",
    answers,
    { id: "123e4567-e89b-12d3-a456-426614174000", startedAt: Date.now() - 5000, companyWebsite: "" },
    {
      consent: true,
      assistantUsed: true,
      aiRecommendedPackage: "custom-software",
    }
  );

  assert.equal(payload.consent, true);
  assert.equal(payload.assistantUsed, true);
  assert.equal(payload.aiRecommendedPackage, "custom-software");
});

test("server validation extracts consent and assistant flags", () => {
  const submission = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    startedAt: 1_700_000_000_000,
    companyWebsite: "",
  };

  const payload = {
    services: ["software"],
    helpMeDecide: false,
    packageId: "custom-software",
    project: {
      goal: "Fintech escrow tool",
      software: "Escrow smart contracts API",
      budget: "₦3,000,000",
      timing: "Q2",
    },
    contact: {
      name: "Chidi",
      email: "chidi@fintech.ng",
      company: "EscrowNg",
    },
    submission,
    consent: true,
    assistantUsed: true,
    aiRecommendedPackage: "custom-software",
  };

  const result = validateEnquiry(payload, submission.startedAt + 2000);
  assert.equal(result.success, true);
  if (result.success) {
    assert.ok(result.data.consentAt);
    assert.equal(result.data.assistantUsed, true);
    assert.equal(result.data.aiRecommendedPackage, "custom-software");
  }
});

test("velocity calculation identifies on-track vs slip-risk conditions", () => {
  const calculateRisk = (currentSprint: number, totalSprints: number, progressPercent: number) => {
    const expected = (currentSprint / totalSprints) * 100;
    const variance = progressPercent - expected;
    if (variance < -15) return "Slip Risk";
    if (variance < 0) return "Moderate Variance";
    return "On Track";
  };

  assert.equal(calculateRisk(3, 6, 50), "On Track");
  assert.equal(calculateRisk(4, 6, 40), "Slip Risk");
  assert.equal(calculateRisk(3, 6, 45), "Moderate Variance");
});

