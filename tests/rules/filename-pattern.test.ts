import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import filenamePattern from "../../src/rules/filename-pattern";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("filename-pattern", filenamePattern, {
  valid: [
    {
      code: "const x = 1;",
      filename: "src/components/Button/Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: { regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
              relationships: [
                {
                  target: "directory",
                  level: 1,
                  comparison: "equals",
                  value: "filename-stem",
                  removeSuffix: [".tsx"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "const x = 1;",
      filename: "tests/Button.test.ts",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: { regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
            },
          ],
        },
      ],
    },
    {
      // Monorepo / override scenario with basePath
      code: "const x = 1;",
      filename: "packages/ui/src/components/Button/Button.tsx",
      options: [
        {
          basePath: "packages/ui",
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: { regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
              relationships: [
                {
                  target: "directory",
                  level: 1,
                  comparison: "equals",
                  value: "filename-stem",
                  removeSuffix: [".tsx"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: "src/components/button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: { regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
            },
          ],
        },
      ],
      errors: [
        {
          message:
            'Filename "button.tsx" does not match the required pattern "^[A-Z][a-zA-Z0-9]+\\.tsx$".',
        },
      ],
    },
    {
      code: "const x = 1;",
      filename: "src/components/Header/Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: { regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
              relationships: [
                {
                  target: "directory",
                  level: 1,
                  comparison: "equals",
                  value: "filename-stem",
                  removeSuffix: [".tsx"],
                },
              ],
            },
          ],
        },
      ],
      errors: [
        {
          message:
            'Filename "Button.tsx" does not satisfy its relationship with directory "Header".',
        },
      ],
    },
  ],
});
