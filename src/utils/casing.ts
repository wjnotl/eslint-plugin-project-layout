import type { CaseType } from "../types";

/**
 * Splits a string into words based on camelCase, PascalCase, kebab-case, snake_case, or spaces.
 */
function splitWords(str: string): string[] {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Converts a string to PascalCase (e.g. "user-profile" -> "UserProfile").
 */
export function toPascalCase(str: string): string {
  const words = splitWords(str);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Converts a string to camelCase (e.g. "user-profile" -> "userProfile").
 */
export function toCamelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return "";
  const first = words[0].toLowerCase();
  const rest = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  return first + rest;
}

/**
 * Converts a string to kebab-case (e.g. "UserProfile" -> "user-profile").
 */
export function toKebabCase(str: string): string {
  const words = splitWords(str);
  return words.map((word) => word.toLowerCase()).join("-");
}

/**
 * Converts a string to snake_case (e.g. "UserProfile" -> "user_profile").
 */
export function toSnakeCase(str: string): string {
  const words = splitWords(str);
  return words.map((word) => word.toLowerCase()).join("_");
}

/**
 * Transforms a string according to the specified case type.
 */
export function applyCase(str: string, caseType?: CaseType): string {
  if (!caseType) return str;
  switch (caseType) {
    case "pascal":
      return toPascalCase(str);
    case "camel":
      return toCamelCase(str);
    case "kebab":
      return toKebabCase(str);
    case "snake":
      return toSnakeCase(str);
    default:
      return str;
  }
}
