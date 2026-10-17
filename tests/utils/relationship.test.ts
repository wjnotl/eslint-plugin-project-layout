import { describe, it, expect } from "vitest";
import {
  getComparisonValue,
  relationshipMatches,
} from "../../src/utils/relationship";
import type { RelationshipConfig } from "../../src/types";

describe("relationship utils", () => {
  describe("getComparisonValue", () => {
    it("returns full filename when value is 'filename'", () => {
      const config: RelationshipConfig = {
        target: "directory",
        level: 1,
        comparison: "equals",
        value: "filename",
      };
      expect(getComparisonValue("Button.tsx", config)).toBe("Button.tsx");
    });

    it("strips matched suffixes when value is 'filename-stem'", () => {
      const config: RelationshipConfig = {
        target: "directory",
        level: 1,
        comparison: "equals",
        value: "filename-stem",
        removeSuffix: [".component.tsx", ".tsx"],
      };
      expect(getComparisonValue("Button.component.tsx", config)).toBe("Button");
      expect(getComparisonValue("Button.tsx", config)).toBe("Button");
      expect(getComparisonValue("Button.ts", config)).toBe("Button.ts");
    });
  });

  describe("relationshipMatches", () => {
    it("checks exact string equality", () => {
      expect(relationshipMatches("Button", "Button", "equals")).toBe(true);
      expect(relationshipMatches("button", "Button", "equals")).toBe(false);
    });

    it("checks regex matching", () => {
      expect(relationshipMatches("Button", "^Button$", "matches")).toBe(true);
      expect(relationshipMatches("MyButton", "^Button$", "matches")).toBe(false);
      expect(relationshipMatches("button", "Button", "matches")).toBe(false);
    });
  });
});

