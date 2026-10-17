import type { Rule } from "eslint";
import type { FileLocationOptions, FileLocationRuleItem } from "../types";
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
          basePath: {
            type: "string",
          },
          patterns: {
            type: "array",
            items: {
              type: "object",
              required: ["files", "allowedDirectories"],
              properties: {
                basePath: {
                  type: "string",
                },
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

    let matchedPattern: FileLocationRuleItem | undefined;
    let matchedFilepath = "";

    for (const pattern of config.patterns) {
      const effectiveBasePath = pattern.basePath ?? config.basePath;
      const filepath = getRelativePath(context, effectiveBasePath);

      if (matchesGlob(pattern.files, filepath)) {
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

    const isAllowed = matchedPattern.allowedDirectories.some(
      (allowedDirectory) => matchesGlob(allowedDirectory, directory)
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
            allowedDirectories: matchedPattern!.allowedDirectories.join(", "),
          },
        });
      },
    };
  },
};

export default rule;
