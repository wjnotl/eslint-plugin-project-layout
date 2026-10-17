import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import fileLocation from "../../src/rules/file-location";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("file-location", fileLocation, {
  valid: [
    {
      code: "const x = 1;",
      filename: "tests/unit/Button.test.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**", "src/**/__tests__"],
            },
          ],
        },
      ],
    },
    {
      code: "const x = 1;",
      filename: "src/components/__tests__/Button.test.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**", "src/**/__tests__"],
            },
          ],
        },
      ],
    },
    {
      // Non-matching file shouldn't be linted
      code: "const x = 1;",
      filename: "src/components/Button.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**"],
            },
          ],
        },
      ],
    },
    {
      // Monorepo / override scenario with basePath
      code: "const x = 1;",
      filename: "packages/ui/tests/Button.test.ts",
      options: [
        {
          basePath: "packages/ui",
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**"],
            },
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: "src/components/Button.test.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**", "src/**/__tests__"],
            },
          ],
        },
      ],
      errors: [
        {
          message:
            'File "Button.test.ts" is in "src/components", which is not an allowed directory. Allowed directories: tests/**, src/**/__tests__.',
        },
      ],
    },
  ],
});

