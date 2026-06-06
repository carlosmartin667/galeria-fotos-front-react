import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { PortfolioItem } from '@/types/portfolio';

export async function getPortfolioItems() {
  const response = await apiClient.get('/Portfolio');
  return sanitizeSensitiveData(asArray<PortfolioItem>(response.data));
}

export async function getPortfolioItem(id: string) {
  const response = await apiClient.get(`/Portfolio/${id}`);
  return sanitizeSensitiveData(unwrapData<PortfolioItem | null>(response.data, null));
}
