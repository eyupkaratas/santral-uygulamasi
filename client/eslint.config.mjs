import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    plugins: ["prettier", "jsx-a11y"],
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier", "plugin:jsx-a11y/recommended"],
  }),
];

export default eslintConfig;
