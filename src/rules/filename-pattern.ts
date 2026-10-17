import type { Rule } from "eslint";
import type { FilenamePatternOptions } from "../types";
import { matchesGlob } from "../utils/glob";
import { getDirectoryAtLevel, getFilename, getRelativePath } from "../utils/path";
import { getComparisonValue, relationshipMatches } from "../utils/relationship";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Validate filename patterns and configurable filename-path relationships",
      recommended: false,
      url: "https://github.com/USERNAME/eslint-plugin-project-layout/blob/main/docs/rules/filename-pattern.md",
    },
    schema: [
      {
        type: "object",
        required: ["patterns"],
        properties: {
          patterns: {
            type: "array",
            items: {
              type: "object",
              required: ["files", "filename"],
              properties: {
                files: {
                  type: "string",
                  minLength: 1,
                },
                filename: {
                  type: "object",
                  required: ["regex"],
                  properties: {
                    regex: {
                      type: "string",
                      minLength: 1,
                    },
                  },
                  additionalProperties: false,
                },
                relationships: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["target", "level", "comparison", "value"],
                    properties: {
                      target: {
                        enum: ["directory"],
                      },
                      level: {
                        type: "integer",
                        minimum: 1,
                      },
                      comparison: {
                        enum: ["equals", "matches"],
                      },
                      value: {
                        enum: ["filename", "filename-stem"],
                      },
                      removeSuffix: {
                        type: "array",
                        items: {
                          type: "string",
                        },
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
      invalidFilename: 'Filename "{{filename}}" does not match the required pattern "{{regex}}".',
      invalidRelationship:
        'Filename "{{filename}}" does not satisfy its relationship with directory "{{directory}}".',
      invalidRelationshipConfig:
        'Cannot evaluate the configured filename relationship for "{{filename}}". Check its directory level and settings.',
      invalidRegex: 'The configured filename regex "{{regex}}" is invalid.',
    },
  },

  create(context: Rule.RuleContext) {
    const config: FilenamePatternOptions = context.options[0] ?? { patterns: [] };
    const filepath = getRelativePath(context);
    const filename = getFilename(filepath);

    const matchedPattern = config.patterns.find((pattern) =>
      matchesGlob(pattern.files, filepath)
    );

    if (!matchedPattern) {
      return {};
    }

    let filenameRegex: RegExp;

    try {
      filenameRegex = new RegExp(matchedPattern.filename.regex);
    } catch {
      return {
        Program(node) {
          context.report({
            node,
            messageId: "invalidRegex",
            data: {
              regex: matchedPattern.filename.regex,
            },
          });
        },
      };
    }

    return {
      Program(node) {
        // File name must follow the configured regex
        if (!filenameRegex.test(filename)) {
          context.report({
            node,
            messageId: "invalidFilename",
            data: {
              filename,
              regex: matchedPattern.filename.regex,
            },
          });

          // Do not run relationships on a filename that fails its basic naming convention
          return;
        }

        // File name must satisfy each configured relationship with its directory path
        for (const relationship of matchedPattern.relationships ?? []) {
          const directory = getDirectoryAtLevel(filepath, relationship.level);

          if (relationship.target !== "directory" || directory === null) {
            context.report({
              node,
              messageId: "invalidRelationshipConfig",
              data: { filename },
            });

            continue;
          }

          const filenameValue = getComparisonValue(filename, relationship);

          if (filenameValue === null) {
            context.report({
              node,
              messageId: "invalidRelationshipConfig",
              data: { filename },
            });

            continue;
          }

          const isMatch = relationshipMatches(
            filenameValue,
            directory,
            relationship.comparison
          );

          if (!isMatch) {
            context.report({
              node,
              messageId: "invalidRelationship",
              data: {
                filename,
                directory,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
