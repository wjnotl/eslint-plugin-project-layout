import type { Rule } from "eslint";
import type {
  FilenamePatternOptions,
  FilenamePatternRuleItem,
  ReplaceRule,
} from "../types";
import { applyCase } from "../utils/casing";
import { escapeRegex, matchesAnyGlob } from "../utils/glob";
import {
  getDirectoryAtLevel,
  getFilename,
  getRelativePath,
} from "../utils/path";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Validate filename patterns and configurable directory variable tokens",
      recommended: false,
      url: "https://github.com/wjnotl/eslint-plugin-project-layout/blob/main/docs/rules/filename-pattern.md",
    },
    schema: [
      {
        type: "object",
        required: ["patterns"],
        properties: {
          basePath: {
            type: "string",
          },
          ignoredFiles: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
          patterns: {
            type: "array",
            items: {
              type: "object",
              required: ["files", "filenameRegex"],
              properties: {
                basePath: {
                  type: "string",
                },
                files: {
                  oneOf: [
                    { type: "string", minLength: 1 },
                    {
                      type: "array",
                      minItems: 1,
                      items: { type: "string", minLength: 1 },
                    },
                  ],
                },
                ignoredFiles: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
                filenameRegex: {
                  type: "string",
                  minLength: 1,
                },
                dirs: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                    required: ["level"],
                    properties: {
                      level: {
                        type: "integer",
                        minimum: 1,
                      },
                      replace: {
                        oneOf: [
                          {
                            type: "object",
                            required: ["from", "to"],
                            properties: {
                              from: { type: "string" },
                              to: { type: "string" },
                            },
                            additionalProperties: false,
                          },
                          {
                            type: "array",
                            items: {
                              type: "object",
                              required: ["from", "to"],
                              properties: {
                                from: { type: "string" },
                                to: { type: "string" },
                              },
                              additionalProperties: false,
                            },
                          },
                        ],
                      },
                      case: {
                        enum: ["camel", "kebab", "pascal", "snake"],
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidFilename:
        'Filename "{{filename}}" does not match the required pattern "{{regex}}".',
      invalidRegex: 'The configured filename regex "{{regex}}" is invalid.',
      undefinedDirToken:
        'Variable "{{token}}" in filenameRegex is not defined in "dirs".',
      insufficientDirDepth:
        'Cannot evaluate directory level {{level}} for "{{filename}}": directory depth is insufficient.',
    },
  },

  create(context: Rule.RuleContext) {
    const config: FilenamePatternOptions = context.options[0] ?? {
      patterns: [],
    };

    // Check global ignoredFiles
    if (config.ignoredFiles) {
      const globalFilepath = getRelativePath(context, config.basePath);
      if (matchesAnyGlob(config.ignoredFiles, globalFilepath)) {
        return {};
      }
    }

    let matchedPattern: FilenamePatternRuleItem | undefined;
    let matchedFilepath = "";

    for (const pattern of config.patterns) {
      const effectiveBasePath = pattern.basePath ?? config.basePath;
      const filepath = getRelativePath(context, effectiveBasePath);

      if (matchesAnyGlob(pattern.files, filepath)) {
        // Check pattern-specific ignoredFiles
        if (
          pattern.ignoredFiles &&
          matchesAnyGlob(pattern.ignoredFiles, filepath)
        ) {
          continue;
        }

        matchedPattern = pattern;
        matchedFilepath = filepath;
        break;
      }
    }

    if (!matchedPattern) {
      return {};
    }

    const filepath = matchedFilepath;
    const filename = getFilename(filepath);

    const rawRegex = matchedPattern.filenameRegex;
    const tokenMatches = Array.from(rawRegex.matchAll(/\{([a-zA-Z0-9_]+)\}/g));
    let resolvedRegex = rawRegex;

    for (const match of tokenMatches) {
      const token = match[1];
      const dirConfig = matchedPattern.dirs?.[token];

      if (!dirConfig) {
        return {
          Program(node) {
            context.report({
              node,
              messageId: "undefinedDirToken",
              data: { token },
            });
          },
        };
      }

      const rawDir = getDirectoryAtLevel(filepath, dirConfig.level);
      if (rawDir === null) {
        return {
          Program(node) {
            context.report({
              node,
              messageId: "insufficientDirDepth",
              data: {
                level: String(dirConfig.level),
                filename,
              },
            });
          },
        };
      }

      let processedDir = rawDir;

      // Apply regex replacements
      if (dirConfig.replace) {
        const replaceRules: ReplaceRule[] = Array.isArray(dirConfig.replace)
          ? dirConfig.replace
          : [dirConfig.replace];

        for (const rule of replaceRules) {
          try {
            processedDir = processedDir.replace(
              new RegExp(rule.from, "g"),
              rule.to
            );
          } catch {
            // Ignore invalid regex in replace.from
          }
        }
      }

      // Apply casing
      if (dirConfig.case) {
        processedDir = applyCase(processedDir, dirConfig.case);
      }

      // Safely escape directory string before injecting into regex
      const escapedDir = escapeRegex(processedDir);
      resolvedRegex = resolvedRegex.replace(
        new RegExp(`\\{${token}\\}`, "g"),
        escapedDir
      );
    }

    let compiledRegex: RegExp;
    try {
      compiledRegex = new RegExp(resolvedRegex);
    } catch {
      return {
        Program(node) {
          context.report({
            node,
            messageId: "invalidRegex",
            data: { regex: resolvedRegex },
          });
        },
      };
    }

    return {
      Program(node) {
        if (!compiledRegex.test(filename)) {
          context.report({
            node,
            messageId: "invalidFilename",
            data: {
              filename,
              regex: resolvedRegex,
            },
          });
        }
      },
    };
  },
};

export default rule;
