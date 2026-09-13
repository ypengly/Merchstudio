// Thin fetch wrapper: attaches the access token, refreshes it once on a 401, and
// normalizes error responses into thrown Error objects with a readable message.

const API_BASE = "/api";

function getTokens() {
  const raw = localStorage.getItem("merchstudio.auth");
  return raw ? (JSON.parse(raw) as { accessToken: string; refreshToken: string }) : null;
}

function setTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  if (tokens) localStorage.setItem("merchstudio.auth", JSON.stringify(tokens));
  else localStorage.removeItem("merchstudio.auth");
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  if (!res.ok) {
    setTokens(null);
    return null;
  }
  const data = await res.json();
  setTokens(data);
  return data.accessToken as string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  isFormData?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}, retried = false): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {};
  if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;
  if (!options.isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.isFormData ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && !retried) {
    const newToken = await refreshAccessToken();
    if (newToken) return request<T>(path, options, true);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errBody.error ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", body: formData, isFormData: true }),
  setTokens,
  getTokens,
};
