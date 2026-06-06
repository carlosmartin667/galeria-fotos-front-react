import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { FaqItem } from '@/types/faq';

export async function getFaqItems() {
  const response = await apiClient.get('/Faq');
  return sanitizeSensitiveData(asArray<FaqItem>(response.data));
}
