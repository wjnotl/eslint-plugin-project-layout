import type { Rule } from "eslint";
import { rules, filenamePattern, fileLocation } from "./rules";

export interface PluginMeta {
  name: string;
  version: string;
}

export interface ESLintPlugin {
  meta: PluginMeta;
  rules: Record<string, Rule.RuleModule>;
  configs: {
    recommended: Record<string, unknown>;
    [key: string]: unknown;
  };
}

const meta: PluginMeta = {
  name: "eslint-plugin-project-layout",
  version: "1.1.0",
};

const configs: ESLintPlugin["configs"] = {
  recommended: {},
};

const plugin: ESLintPlugin = {
  meta,
  rules,
  configs,
};

// Self-referencing plugin in flat config
configs.recommended = {
  plugins: {
    "project-layout": plugin,
  },
  rules: {},
};

export { meta, configs, rules, filenamePattern, fileLocation, plugin };
export * from "./types";
export * from "./utils/casing";
export * from "./utils/glob";
export * from "./utils/path";

export default plugin;
