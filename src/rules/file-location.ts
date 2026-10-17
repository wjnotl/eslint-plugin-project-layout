import type { Rule } from "eslint";
import type { FileLocationOptions } from "../types";
import { matchesGlob } from "../utils/glob";
import { getDirectory, getFilename, getRelativePath } from "../utils/path";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure files are stored in configured allowed directories",
      recommended: false,
      url: "https://github.com/USERNAME/eslint-plugin-project-layout/blob/main/docs/rules/file-location.md",
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
              required: ["files", "allowedDirectories"],
              properties: {
                files: {
                  type: "string",
                  minLength: 1,
                },
                allowedDirectories: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 1,
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
      invalidLocation:
        'File "{{filename}}" is in "{{directory}}", which is not an allowed directory. Allowed directories: {{allowedDirectories}}.',
    },
  },

  create(context: Rule.RuleContext) {
    const config: FileLocationOptions = context.options[0] ?? { patterns: [] };
    const filepath = getRelativePath(context);
    const filename = getFilename(filepath);
    const directory = getDirectory(filepath);

    const matchedPattern = config.patterns.find((pattern) =>
      matchesGlob(pattern.files, filepath)
    );

    if (!matchedPattern) {
      return {};
    }

    const isAllowed = matchedPattern.allowedDirectories.some((allowedDirectory) =>
      matchesGlob(allowedDirectory, directory)
    );

    if (isAllowed) {
      return {};
    }

    return {
      Program(node) {
        context.report({
          node,
          messageId: "invalidLocation",
          data: {
            filename,
            directory,
            allowedDirectories: matchedPattern.allowedDirectories.join(", "),
          },
        });
      },
    };
  },
};

export default rule;
