import { describe, it, expect } from "vitest";
import {
  normalizePath,
  getRelativePath,
  getFilename,
  getDirectory,
  getDirectoryAtLevel,
} from "../../src/utils/path";

describe("path utils", () => {
  describe("normalizePath", () => {
    it("converts Windows backslashes to forward slashes", () => {
      expect(normalizePath("src\\components\\Button.tsx")).toBe(
        "src/components/Button.tsx"
      );
    });

    it("collapses repeated slashes", () => {
      expect(normalizePath("src///components//Button.tsx")).toBe(
        "src/components/Button.tsx"
      );
    });
  });

  describe("getRelativePath", () => {
    it("removes cwd prefix and leading ./", () => {
      const context = {
        filename: "C:/projects/app/src/index.ts",
        cwd: "C:/projects/app",
      };
      expect(getRelativePath(context)).toBe("src/index.ts");
    });

    it("handles legacy getFilename and getCwd methods", () => {
      const context = {
        getFilename: () => "/app/src/index.ts",
        getCwd: () => "/app",
      };
      expect(getRelativePath(context)).toBe("src/index.ts");
    });

    it("strips basePath when provided", () => {
      const context = {
        filename: "C:/projects/monorepo/packages/ui/src/Button.tsx",
        cwd: "C:/projects/monorepo",
      };
      expect(getRelativePath(context, "packages/ui")).toBe("src/Button.tsx");
    });

    it("strips basePath when filename is already relative", () => {
      const context = {
        filename: "packages/ui/src/Button.tsx",
      };
      expect(getRelativePath(context, "packages/ui")).toBe("src/Button.tsx");
    });
  });

  describe("getFilename", () => {
    it("returns filename from path", () => {
      expect(getFilename("src/components/Button.tsx")).toBe("Button.tsx");
    });
  });

  describe("getDirectory", () => {
    it("returns directory from path", () => {
      expect(getDirectory("src/components/Button.tsx")).toBe("src/components");
    });
  });

  describe("getDirectoryAtLevel", () => {
    it("returns directory segment at level 1 (immediate parent)", () => {
      expect(getDirectoryAtLevel("src/components/Button/Button.tsx", 1)).toBe(
        "Button"
      );
    });

    it("returns directory segment at level 2 (grandparent)", () => {
      expect(getDirectoryAtLevel("src/components/Button/Button.tsx", 2)).toBe(
        "components"
      );
    });

    it("returns null for invalid levels", () => {
      expect(getDirectoryAtLevel("src/components/Button/Button.tsx", 0)).toBe(
        null
      );
      expect(getDirectoryAtLevel("src/components/Button/Button.tsx", 10)).toBe(
        null
      );
    });
  });
});
