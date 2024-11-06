import { AliasOptions, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const pathAlias: AliasOptions = [
  { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
  {
    find: "@components",
    replacement: path.resolve(__dirname, "src/components"),
  },
  {
    find: "@helper",
    replacement: path.resolve(__dirname, "src/helper"),
  },
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: Number(env.PORT),
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: /^~/, replacement: "" }, ...pathAlias],
    },
    css: {
      modules: {
        generateScopedName: "mii-[local]-[hash:base64:5]",
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "src/styles/vars.less";`,
        },
      },
    },
  };
});
