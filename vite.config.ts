import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import * as path from "path";
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // typings: path.resolve(__dirname, "src/typings"),
      apis: path.resolve(__dirname, "src/apis"),
      assets: path.resolve(__dirname, "src/assets")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自定义的主题色
        additionalData: `@use "@/styles/element/index.scss" as *;`
      }
    }
  },

  server: {
    open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://shenshan.snailes.com:8000", // 接口基地址
        changeOrigin: true,
        secure: false
        // rewrite: (path) => {
        //   console.log(path, path.replace(/^\/api/, ""));
        //   return path.replace(/^\/api/, "");
        // }
      }
    }
  },

  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({ useSource: true }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
});
