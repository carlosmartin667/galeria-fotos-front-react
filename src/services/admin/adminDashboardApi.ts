import { adminGetOne } from './adminHttp';
export const getAdminDashboard = () => adminGetOne<Record<string, unknown>>('/Admin/dashboard');
