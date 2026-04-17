import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { createVitePlugins } from "./build/plugins.js";
import pkg from "./package.json";
import dayjs from "dayjs";
import { wrapperEnv } from "./build/getEnv.js";
import { createProxy } from "./build/proxy.js";

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/var.scss";`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0"
      },
      // Load proxy configuration from .env.development
      // proxy: utils.createProxy(viteEnv.VITE_PROXY)
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: createVitePlugins(viteEnv),
    // esbuild: {
    //   pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    // },
    build: {
      outDir: "dist",
      minify: "esbuild",
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      sourcemap: process.env.NODE_ENV === "development",
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 50000,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            // 1. 拆分 node_modules 依赖：按包名拆分，避免把所有第三方合并到一个 huge vendor-other
            if (id.includes("node_modules")) {
              const seg = id.toString().split("node_modules/")[1];
              if (seg) {
                const parts = seg.split("/");
                let packageName = parts[0];
                // 处理 scoped 包 @scope/name
                if (packageName.startsWith("@") && parts.length > 1) {
                  packageName = `${packageName}/${parts[1]}`;
                }
                // 将包名中的斜杠转换为安全的 chunk 名称
                const chunkName = `vendor-${packageName.replace("@", "").replace("/", "-")}`;

                // 对部分大包单独处理（可按需增减）
                const bigLibs = ["element-plus", "axios", "echarts"];
                if (bigLibs.includes(packageName) || packageName.startsWith("@element-plus")) {
                  return `vendor-${packageName.replace("/", "-")}`;
                }

                // 其他包按包名拆分
                return chunkName;
              }
              return "vendor-other";
            }

            // 2. 按 src/views 下的页面目录拆分 chunk，避免把所有页面合并到一个超大 chunk
            try {
              const viewMatch = id.replace(/\\/g, "/").match(/\/src\/views\/([^\/]+)/);
              if (viewMatch && viewMatch[1]) {
                return `view-${viewMatch[1]}`;
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }
    }
  };
});
