import type { ProxyOptions } from "vite";

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

/**
 * 创建代理，用于解析 .env.development 代理配置
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  // console.log("createProxy", list);
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const httpsRE = /^https:\/\//;
    const isHttps = httpsRE.test(target);
    // console.log("!!!!!!!!!!", prefix, target);
    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ""),
      bypass(req, res, options: any) {
        const proxyURL = options.target + options.rewrite(req.url);
        console.log(proxyURL);
        // console.log("客户端请求的真正地址：", proxyURL);
        res.setHeader("REAL-URL", proxyURL); // 设置响应头在浏览器中可见
      },
      // https is require secure=false
      ...(isHttps ? { secure: false } : {})
    };
  }
  return ret;
}
