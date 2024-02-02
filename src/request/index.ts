import { URLS } from "@constants/index";
import { clearAccountToken, getUserData } from "@utils/index";

interface RequestOptions {
  body?: Record<string, unknown>;
  account?: `0x${string}` | undefined;
  needAuth?: boolean | undefined;
}

export function getDefaultHeaders(needAuth = true) {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  if (needAuth) {
    const token = getUserData()?.token;
    !!token && headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export const request = async (url: string, method: string, options?: RequestOptions) => {
  const headers = getDefaultHeaders(options?.needAuth);

  // const response = await fetch(`${API_BASE_URL}${url}`, {
  const response = await fetch(`/api/api${url}`, {
    method,
    headers,
    credentials: "include",
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    // Token expired
    const res = await response.json();
    if (response.status === 401) {
      if (res?.message === "Unauthorized") {
        clearAccountToken();
        window.location.href = URLS.LOGIN;
        return;
      }
    }
    throw new Error(`${response.status} - ${res.message || response.statusText}`);
  }

  return response.json();
};

export async function get(url: string, options?: RequestOptions) {
  return request(url, "GET", options);
}

export async function post(url: string, options?: RequestOptions) {
  return request(url, "POST", options);
}

export async function put(url: string, options?: RequestOptions) {
  return request(url, "PUT", options);
}
