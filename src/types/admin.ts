export interface AdminMetric { label: string; value: string | number; href?: string; }
export interface AdminListItem { id: string; titulo?: string; nombre?: string; estado?: string; fechaUtc?: string; activo?: boolean; [key: string]: unknown; }
