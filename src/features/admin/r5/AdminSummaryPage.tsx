import { useQuery } from '@tanstack/react-query';
import { adminSummaryConfigs } from './adminPageConfigs';
import { AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';

type AdminSummaryConfigKey = keyof typeof adminSummaryConfigs;

export function AdminSummaryPage({ title, queryKey, queryFn, configKey }: { title?: string; queryKey?: readonly unknown[]; queryFn?: () => Promise<unknown>; configKey?: AdminSummaryConfigKey }) {
  const config = configKey ? adminSummaryConfigs[configKey] : undefined;
  const resolvedTitle = title ?? config?.title;
  const resolvedQueryKey = queryKey ?? config?.queryKey;
  const resolvedQueryFn = queryFn ?? config?.queryFn;

  if (!resolvedTitle || !resolvedQueryKey || !resolvedQueryFn) return <ErrorState title="Configuracion no disponible." />;
  const query = useQuery({ queryKey: resolvedQueryKey, queryFn: resolvedQueryFn });
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState />;
  return <section><AdminPageHeader title={resolvedTitle} description="Resumen administrativo" /><div className="card border-0 shadow-sm"><div className="card-body"><SanitizedMetadata value={query.data ?? {}} /></div></div></section>;
}
