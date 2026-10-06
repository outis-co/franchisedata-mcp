import { describe, it, expect } from "vitest";
import { compactResponse, formatResponse } from "../src/transformer.js";

describe("compactResponse", () => {
  it("strips null and undefined fields recursively", () => {
    const input = {
      brand: "Taco Bell",
      units: 7784,
      missingNote: null,
      optionalFlag: undefined,
      nested: {
        established: 1962,
        obsoleteField: null,
      },
    };

    const output = compactResponse(input);
    expect(output).toEqual({
      brand: "Taco Bell",
      units: 7784,
      nested: {
        established: 1962,
      },
    });
  });

  it("strips empty arrays and empty objects", () => {
    const input = {
      brand: "McDonald's",
      locations: [],
      emptyConfig: {},
      financials: {
        medianAuv: 3800000,
        emptyNotes: [],
      },
    };

    const output = compactResponse(input);
    expect(output).toEqual({
      brand: "McDonald's",
      financials: {
        medianAuv: 3800000,
      },
    });
  });

  it("strips metadata keys", () => {
    const input = {
      slug: "subway",
      name: "Subway",
      raw_hash: "0xdeadbeef",
      _meta: { server: "us-east" },
    };

    const output = compactResponse(input);
    expect(output).toEqual({
      slug: "subway",
      name: "Subway",
    });
  });

  it("calculates token savings in formatResponse", () => {
    const payload = {
      brand: "Starbucks",
      note1: null,
      note2: null,
      note3: null,
      emptyList: [],
      active: true,
    };

    const { formatted, tokenEstimateSavings } = formatResponse(payload, true);
    expect(tokenEstimateSavings).toBeGreaterThan(30);
    expect(formatted).toEqual({
      brand: "Starbucks",
      active: true,
    });
  });
});
