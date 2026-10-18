import type { Rule } from "eslint";
import type { FileLocationOptions, FileLocationRuleItem } from "../types";
import { matchesAnyDirectoryPattern, matchesAnyGlob } from "../utils/glob";
import { getDirectory, getFilename, getRelativePath } from "../utils/path";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure files are stored in configured allowed directories",
      recommended: false,
      url: "https://github.com/wjnotl/eslint-plugin-project-layout/blob/main/docs/rules/file-location.md",
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
              required: ["files"],
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
                allowedDirs: {
                  oneOf: [
                    { type: "string", minLength: 1 },
                    {
                      type: "array",
                      minItems: 1,
                      items: { type: "string", minLength: 1 },
                    },
                  ],
                },
                disallowedDirs: {
                  oneOf: [
                    { type: "string", minLength: 1 },
                    {
                      type: "array",
                      minItems: 1,
                      items: { type: "string", minLength: 1 },
                    },
                  ],
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
      invalidLocation:
        'File "{{filename}}" is in "{{directory}}", which is not an allowed directory. Allowed directories: {{allowedDirs}}.',
      disallowedLocation:
        'File "{{filename}}" is in "{{directory}}", which is a disallowed directory.',
    },
  },

  create(context: Rule.RuleContext) {
    const config: FileLocationOptions = context.options[0] ?? { patterns: [] };

    // Check global ignoredFiles
    if (config.ignoredFiles) {
      const globalFilepath = getRelativePath(context, config.basePath);
      if (matchesAnyGlob(config.ignoredFiles, globalFilepath)) {
        return {};
      }
    }

    let matchedPattern: FileLocationRuleItem | undefined;
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
    const directory = getDirectory(filepath);

    const disallowed = matchedPattern.disallowedDirs;
    const allowed = matchedPattern.allowedDirs;

    // Check disallowedDirs first
    if (disallowed && matchesAnyDirectoryPattern(disallowed, directory)) {
      return {
        Program(node) {
          context.report({
            node,
            messageId: "disallowedLocation",
            data: {
              filename,
              directory,
            },
          });
        },
      };
    }

    // Check allowedDirs
    if (allowed) {
      const isAllowed = matchesAnyDirectoryPattern(allowed, directory);

      if (!isAllowed) {
        const allowedDirsText = Array.isArray(allowed)
          ? allowed.join(", ")
          : allowed;

        return {
          Program(node) {
            context.report({
              node,
              messageId: "invalidLocation",
              data: {
                filename,
                directory,
                allowedDirs: allowedDirsText,
              },
            });
          },
        };
      }
    }

    return {};
  },
};

export default rule;
