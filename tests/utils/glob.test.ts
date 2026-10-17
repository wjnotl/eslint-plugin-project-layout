import { describe, it, expect } from "vitest";
import { escapeRegex, globToRegExp, matchesGlob } from "../../src/utils/glob";

describe("glob utils", () => {
  describe("escapeRegex", () => {
    it("escapes regex special characters", () => {
      expect(escapeRegex("foo.bar-baz$test?")).toBe("foo\\.bar-baz\\$test\\?");
    });
  });

  describe("globToRegExp", () => {
    it("matches single asterisks within path segments", () => {
      const reg = globToRegExp("src/*.ts");
      expect(reg.test("src/index.ts")).toBe(true);
      expect(reg.test("src/components/index.ts")).toBe(false);
    });

    it("matches double asterisks across path segments", () => {
      const reg = globToRegExp("src/**/*.ts");
      expect(reg.test("src/components/button/button.ts")).toBe(true);
      expect(reg.test("src/index.ts")).toBe(true);
      expect(reg.test("tests/index.ts")).toBe(false);
    });
  });

  describe("matchesGlob", () => {
    it("matches glob path patterns with slashes", () => {
      expect(matchesGlob("src/**/*.tsx", "src/components/Button.tsx")).toBe(true);
      expect(matchesGlob("src/**/*.tsx", "test/Button.tsx")).toBe(false);
    });

    it("matches pattern without slashes against basename", () => {
      expect(matchesGlob("*.test.ts", "src/components/button.test.ts")).toBe(true);
      expect(matchesGlob("*.test.ts", "src/components/button.ts")).toBe(false);
    });
  });
});
