// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        path: "path-browserify"
      }
    },
    plugins: [react(), svgr()],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    }
  }
});
export {
  electron_vite_config_default as default
};
