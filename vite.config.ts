import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import windicss from "vite-plugin-windicss";
import components from "unplugin-vue-components/vite";
import autoimport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    vue(),
    windicss(),
    components(),
    autoimport({
      imports: "vue",
      include: [/\.vue$/, /\.vue\?vue/],
    }),
  ],
});
