import { describe, expect, it } from "vitest";
import {
  applyCase,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from "../../src/utils/casing";

describe("casing utils", () => {
  it("converts to PascalCase", () => {
    expect(toPascalCase("user-profile")).toBe("UserProfile");
    expect(toPascalCase("user_profile")).toBe("UserProfile");
    expect(toPascalCase("userProfile")).toBe("UserProfile");
    expect(toPascalCase("UserProfile")).toBe("UserProfile");
  });

  it("converts to camelCase", () => {
    expect(toCamelCase("user-profile")).toBe("userProfile");
    expect(toCamelCase("UserProfile")).toBe("userProfile");
    expect(toCamelCase("user_profile")).toBe("userProfile");
  });

  it("converts to kebab-case", () => {
    expect(toKebabCase("UserProfile")).toBe("user-profile");
    expect(toKebabCase("userProfile")).toBe("user-profile");
    expect(toKebabCase("user_profile")).toBe("user-profile");
  });

  it("converts to snake_case", () => {
    expect(toSnakeCase("UserProfile")).toBe("user_profile");
    expect(toSnakeCase("user-profile")).toBe("user_profile");
    expect(toSnakeCase("userProfile")).toBe("user_profile");
  });

  it("applies case or preserves exact original if undefined", () => {
    expect(applyCase("aUtH", undefined)).toBe("aUtH");
    expect(applyCase("auth-module", "pascal")).toBe("AuthModule");
    expect(applyCase("auth-module", "kebab")).toBe("auth-module");
    expect(applyCase("auth-module", "camel")).toBe("authModule");
    expect(applyCase("auth-module", "snake")).toBe("auth_module");
  });
});
