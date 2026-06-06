import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminListConfigs } from './adminPageConfigs';
import { AdminFiltersBar, AdminPageHeader, SanitizedMetadata, StatusBadge } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

interface Config<T> { title: string; queryKey: readonly unknown[]; queryFn: () => Promise<T[]>; description?: string; }

type AdminListConfigKey = keyof typeof adminListConfigs;

function resolveConfig<T>(config?: Config<T>, configKey?: AdminListConfigKey) {
  return config ?? (configKey ? adminListConfigs[configKey] : undefined);
}

export function AdminGenericListPage<T extends { id?: string; nombre?: string; titulo?: string; estado?: string; activo?: boolean; email?: string }>({ config, configKey }: { config?: Config<T>; configKey?: AdminListConfigKey }) {
  const resolvedConfig = resolveConfig(config, configKey) as Config<T> | undefined;
  if (!resolvedConfig) return <ErrorState title="Configuracion no disponible." />;
  const [filter, setFilter] = useState('');
  const query = useQuery({ queryKey: resolvedConfig.queryKey, queryFn: resolvedConfig.queryFn });
  const rows = useMemo(() => asArray<T>(query.data).filter((row) => sanitizeSensitiveText(row).toLowerCase().includes(filter.toLowerCase())), [filter, query.data]);
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState />;
  return <section><AdminPageHeader title={resolvedConfig.title} description={resolvedConfig.description ?? 'Gestion administrativa'} /><AdminFiltersBar><input className="form-control" aria-label="Filtro" placeholder="Filtrar" value={filter} onChange={(e)=>setFilter(e.target.value)} /></AdminFiltersBar><AdminTable caption={`Listado de ${resolvedConfig.title}`} rows={rows} columns={[{header:'Nombre',render:(r)=>r.nombre??r.titulo??r.email??r.id??'-'},{header:'Estado',render:(r)=><StatusBadge value={r.estado??r.activo}/>},{header:'Metadata',render:(r)=><SanitizedMetadata value={r}/>}]} /></section>;
}
