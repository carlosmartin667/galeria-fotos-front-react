import type { Testimonio } from '@/types/testimonio'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getTestimoniosAdmin = () => adminGetList<Testimonio>('/Testimonios/admin');
export const updateTestimonioAdmin = (id: string, payload: Partial<Testimonio>) => adminPut(`/Testimonios/${id}`, payload);
export const publicarTestimonioAdmin = (id: string) => adminPost(`/Testimonios/${id}/publicar`);
export const ocultarTestimonioAdmin = (id: string) => adminPost(`/Testimonios/${id}/ocultar`);
