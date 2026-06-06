import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';

export async function adminGetList<T>(url: string) { const r = await apiClient.get(url); return sanitizeSensitiveData(asArray<T>(r.data)); }
export async function adminGetOne<T>(url: string) { const r = await apiClient.get(url); return sanitizeSensitiveData(unwrapData<T | null>(r.data, null)); }
export async function adminPost<T = unknown>(url: string, payload?: unknown) { const r = await apiClient.post(url, payload); return sanitizeSensitiveData(r.data as T); }
export async function adminPut<T = unknown>(url: string, payload?: unknown) { const r = await apiClient.put(url, payload); return sanitizeSensitiveData(r.data as T); }
export async function adminPatch<T = unknown>(url: string, payload?: unknown) { const r = await apiClient.patch(url, payload); return sanitizeSensitiveData(r.data as T); }
export async function adminDelete<T = unknown>(url: string) { const r = await apiClient.delete(url); return sanitizeSensitiveData(r.data as T); }
