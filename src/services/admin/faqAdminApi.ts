import type { FaqItem } from '@/types/faq'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getFaqAdmin = () => adminGetList<FaqItem>('/Faq/admin');
export const createFaqAdmin = (payload: Partial<FaqItem>) => adminPost('/Faq', payload);
export const updateFaqAdmin = (id: string, payload: Partial<FaqItem>) => adminPut(`/Faq/${id}`, payload);
