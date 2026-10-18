import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import fileLocation from "../../src/rules/file-location";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("file-location", fileLocation, {
  valid: [
    // 1. allowedDirs (array)
    {
      code: "const x = 1;",
      filename: "src/core/db/schemas/user.schema.ts",
      options: [
        {
          patterns: [
            {
              files: "*.schema.ts",
              allowedDirs: ["src/core/db/schemas"],
            },
          ],
        },
      ],
    },
    // 3. Array of files with allowedDirs
    {
      code: "const x = 1;",
      filename: "src/modules/auth/auth.routes.ts",
      options: [
        {
          patterns: [
            {
              files: ["*.routes.ts", "*.service.ts"],
              allowedDirs: ["src/modules/*"],
            },
          ],
        },
      ],
    },
    // 4. Regex pattern for directory (starts with ^)
    {
      code: "const x = 1;",
      filename: "src/modules/auth/dtos/login.dto.ts",
      options: [
        {
          patterns: [
            {
              files: "*.dto.ts",
              allowedDirs: ["^src/modules/[a-z0-9-]+/dtos$"],
            },
          ],
        },
      ],
    },
    // 5. disallowedDirs (valid outside disallowed directory)
    {
      code: "const x = 1;",
      filename: "tests/mocks/user.mock.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.mock.ts",
              disallowedDirs: ["src/core/**", "src/public/**"],
            },
          ],
        },
      ],
    },
    // 6. Global ignoredFiles
    {
      code: "const x = 1;",
      filename: "src/setup.test.ts",
      options: [
        {
          ignoredFiles: ["**/setup.test.ts"],
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirs: ["tests/**"],
            },
          ],
        },
      ],
    },
    // 7. Pattern-level ignoredFiles
    {
      code: "const x = 1;",
      filename: "src/fixtures/mock.test.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              ignoredFiles: ["**/fixtures/**"],
              allowedDirs: ["tests/**"],
            },
          ],
        },
      ],
    },
    // 8. Monorepo basePath scenario
    {
      code: "const x = 1;",
      filename: "packages/ui/tests/Button.test.ts",
      options: [
        {
          basePath: "packages/ui",
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirs: ["tests/**"],
            },
          ],
        },
      ],
    },
  ],

  invalid: [
    // 1. File in forbidden/unallowed directory (allowedDirs)
    {
      code: "const x = 1;",
      filename: "src/components/Button.test.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirs: ["tests/**"],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "invalidLocation",
          data: {
            filename: "Button.test.ts",
            directory: "src/components",
            allowedDirs: "tests/**",
          },
        },
      ],
    },
    // 2. File in disallowed directory (disallowedDirs)
    {
      code: "const x = 1;",
      filename: "src/core/auth.mock.ts",
      options: [
        {
          patterns: [
            {
              files: "**/*.mock.ts",
              disallowedDirs: ["src/core/**"],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: "disallowedLocation",
          data: {
            filename: "auth.mock.ts",
            directory: "src/core",
          },
        },
      ],
    },
  ],
});
