import { PORT6 } from "./servicePort";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");

const renderingPrefix = `${PORT6}/rendering/`;

export const getServerBaseUrl = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || "";
  if (!serverUrl || serverUrl === "/") return window.location.origin;
  return trimTrailingSlash(serverUrl);
};

export const joinServerUrl = (path = "") => {
  if (!path) return getServerBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getServerBaseUrl()}${normalizedPath}`;
};

export const getRenderingPath = (url = "") => {
  if (!url) return "";
  return `${renderingPrefix}${trimLeadingSlash(url)}`;
};

export const getRenderingUrl = (url = "") => {
  const renderingPath = getRenderingPath(url);
  return renderingPath ? joinServerUrl(renderingPath) : "";
};

export const stripRenderingUrl = (url = "") => {
  if (!url) return "";

  const normalizedUrl = url.trim();
  const absolutePrefix = joinServerUrl(renderingPrefix);

  if (normalizedUrl.startsWith(absolutePrefix)) {
    return normalizedUrl.slice(absolutePrefix.length);
  }

  if (normalizedUrl.startsWith(renderingPrefix)) {
    return normalizedUrl.slice(renderingPrefix.length);
  }

  return normalizedUrl;
};
