import { describe, expect, it } from "vitest";
import { formatPostDate } from "./format-date";

describe("formatPostDate", () => {
  it("formats yyyy-mm-dd dates without timezone conversion", () => {
    expect(formatPostDate("2026-06-26")).toBe("2026/06/26");
  });
});
