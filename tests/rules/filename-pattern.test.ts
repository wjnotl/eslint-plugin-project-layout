import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import filenamePattern from "../../src/rules/filename-pattern";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("filename-pattern", filenamePattern, {
  valid: [
    // 1. Simple filenameRegex without dirs
    {
      code: "const x = 1;",
      filename: "src/core/db/schemas/user.schema.ts",
      options: [
        {
          patterns: [
            {
              files: "src/core/db/schemas/*.ts",
              filenameRegex: "^[a-z0-9-]+\\.schema\\.ts$",
            },
          ],
        },
      ],
    },
    // 3. New filenameRegex with dirs (level: 1, exact casing)
    {
      code: "const x = 1;",
      filename: "src/components/Button/Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              dirs: {
                component: { level: 1 },
              },
              filenameRegex: "^{component}\\.tsx$",
            },
          ],
        },
      ],
    },
    // 4. Exact casing preserved (e.g. "aUtH" stays "aUtH")
    {
      code: "const x = 1;",
      filename: "src/modules/aUtH/aUtH.service.ts",
      options: [
        {
          patterns: [
            {
              files: "src/modules/*/*.ts",
              dirs: {
                module: { level: 1 },
              },
              filenameRegex: "^{module}\\.service\\.ts$",
            },
          ],
        },
      ],
    },
    // 5. dirs with regex replace (strips "-module" suffix)
    {
      code: "const x = 1;",
      filename: "src/modules/auth-module/auth.service.ts",
      options: [
        {
          patterns: [
            {
              files: "src/modules/*/*.ts",
              dirs: {
                module: {
                  level: 1,
                  replace: { from: "-module$", to: "" },
                },
              },
              filenameRegex:
                "^({module}\\.(routes|service)|index-{module})\\.ts$",
            },
          ],
        },
      ],
    },
    // 6. index-{module}.ts matched via dirs replace
    {
      code: "const x = 1;",
      filename: "src/modules/auth-module/index-auth.ts",
      options: [
        {
          patterns: [
            {
              files: "src/modules/*/*.ts",
              dirs: {
                module: {
                  level: 1,
                  replace: { from: "-module$", to: "" },
                },
              },
              filenameRegex:
                "^({module}\\.(routes|service)|index-{module})\\.ts$",
            },
          ],
        },
      ],
    },
    // 7. Case transformation (kebab-case folder -> PascalCase file)
    {
      code: "const x = 1;",
      filename: "src/components/user-profile/UserProfile.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              dirs: {
                component: { level: 1, case: "pascal" },
              },
              filenameRegex: "^{component}\\.tsx$",
            },
          ],
        },
      ],
    },
    // 8. Multiple directories (level: 2 and level: 1 combined)
    {
      code: "const x = 1;",
      filename: "src/features/billing-feature/button/billing-Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/features/*/*/*.tsx",
              dirs: {
                feature: {
                  level: 2,
                  replace: { from: "-feature$", to: "" },
                },
                component: {
                  level: 1,
                  case: "pascal",
                },
              },
              filenameRegex: "^{feature}-{component}\\.tsx$",
            },
          ],
        },
      ],
    },
    // 9. Array of file globs
    {
      code: "const x = 1;",
      filename: "src/services/billing/billing.service.ts",
      options: [
        {
          patterns: [
            {
              files: ["src/modules/*/*.ts", "src/services/*/*.ts"],
              dirs: {
                mod: { level: 1 },
              },
              filenameRegex: "^{mod}\\.service\\.ts$",
            },
          ],
        },
      ],
    },
    // 10. Global ignoredFiles
    {
      code: "const x = 1;",
      filename: "src/modules/auth/index.ts",
      options: [
        {
          ignoredFiles: ["**/index.ts"],
          patterns: [
            {
              files: "src/modules/*/*.ts",
              filenameRegex: "^{dir}\\.service\\.ts$",
            },
          ],
        },
      ],
    },
    // 11. Pattern-level ignoredFiles
    {
      code: "const x = 1;",
      filename: "src/modules/auth/setup.ts",
      options: [
        {
          patterns: [
            {
              files: "src/modules/*/*.ts",
              ignoredFiles: ["**/setup.ts"],
              dirs: {
                mod: { level: 1 },
              },
              filenameRegex: "^{mod}\\.service\\.ts$",
            },
          ],
        },
      ],
    },
    // 12. Monorepo basePath scenario
    {
      code: "const x = 1;",
      filename: "apps/api/src/modules/auth/auth.service.ts",
      options: [
        {
          basePath: "apps/api",
          patterns: [
            {
              files: "src/modules/*/*.ts",
              dirs: {
                mod: { level: 1 },
              },
              filenameRegex: "^{mod}\\.service\\.ts$",
            },
          ],
        },
      ],
    },
  ],

  invalid: [
    // 1. Mismatch with dirs variable
    {
      code: "const x = 1;",
      filename: "src/components/Button/Modal.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              dirs: {
                component: { level: 1 },
              },
              filenameRegex: "^{component}\\.tsx$",
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "invalidFilename",
          data: {
            filename: "Modal.tsx",
            regex: "^Button\\.tsx$",
          },
        },
      ],
    },
    // 2. Reject index-other when only index-{module} is allowed
    {
      code: "const x = 1;",
      filename: "src/modules/auth/index-other.ts",
      options: [
        {
          patterns: [
            {
              files: "src/modules/*/*.ts",
              dirs: {
                module: { level: 1 },
              },
              filenameRegex:
                "^({module}\\.(routes|service)|index-{module})\\.ts$",
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "invalidFilename",
          data: {
            filename: "index-other.ts",
            regex: "^(auth\\.(routes|service)|index-auth)\\.ts$",
          },
        },
      ],
    },
    // 3. Undefined dir variable in filenameRegex
    {
      code: "const x = 1;",
      filename: "src/components/Button/Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filenameRegex: "^{unknown}\\.tsx$",
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "undefinedDirToken",
          data: {
            token: "unknown",
          },
        },
      ],
    },
    // 4. Insufficient directory depth for requested level
    {
      code: "const x = 1;",
      filename: "Button.tsx",
      options: [
        {
          patterns: [
            {
              files: "*.tsx",
              dirs: {
                mod: { level: 2 },
              },
              filenameRegex: "^{mod}\\.tsx$",
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "insufficientDirDepth",
          data: {
            level: "2",
            filename: "Button.tsx",
          },
        },
      ],
    },
  ],
});
