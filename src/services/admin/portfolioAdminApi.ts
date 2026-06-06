import type { PortfolioItem } from '@/types/portfolio'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getPortfolioAdmin = () => adminGetList<PortfolioItem>('/Portfolio/admin');
export const createPortfolioAdmin = (payload: Partial<PortfolioItem>) => adminPost('/Portfolio', payload);
export const updatePortfolioAdmin = (id: string, payload: Partial<PortfolioItem>) => adminPut(`/Portfolio/${id}`, payload);
