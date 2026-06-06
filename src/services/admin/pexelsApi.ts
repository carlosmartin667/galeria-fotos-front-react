import { adminPost } from './adminHttp';
export const importarFotosPexelsAdmin = (payload: unknown) => adminPost('/Admin/demo/pexels/importar-fotos', payload);
