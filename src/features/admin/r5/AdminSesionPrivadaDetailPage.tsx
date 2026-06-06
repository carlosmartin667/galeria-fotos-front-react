import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { cambiarEstadoSesionPrivadaAdmin, createStorageKeyFotoPrivadaAdmin, getFotosPrivadasAdmin, getSesionPrivadaAdmin } from '@/services/admin/sesionesPrivadasAdminApi';
import { AdminPageHeader, DateValue, MoneyValue, SanitizedMetadata, StatusBadge } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';
import { NotasInternasPanel } from '@/shared/components/admin/NotasInternasPanel';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';

export function AdminSesionPrivadaDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [storageKeyGenerado, setStorageKeyGenerado] = useState(false);
  const sesion = useQuery({ queryKey: queryKeys.admin.sesionPrivada(id), queryFn: () => getSesionPrivadaAdmin(id), enabled: Boolean(id) });
  const fotos = useQuery({ queryKey: queryKeys.admin.fotosPrivadas(id), queryFn: () => getFotosPrivadasAdmin(id), enabled: Boolean(id) });
  const estado = useMutation({ mutationFn: () => cambiarEstadoSesionPrivadaAdmin(id, 'Entregada', 'Cambio desde panel admin'), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.sesionPrivada(id) }) });
  const storageKey = useMutation({
    mutationFn: () => createStorageKeyFotoPrivadaAdmin(id, { nombreArchivo }),
    onSuccess: () => { setStorageKeyGenerado(true); setNombreArchivo(''); },
  });

  if (sesion.isLoading) return <LoadingState />;
  if (!sesion.data) return <EmptyState title="Sesion privada no encontrada" />;

  return (
    <section>
      <AdminPageHeader title={sesion.data.titulo ?? 'Sesion privada'} description="Detalle administrativo" action={<Link className="btn btn-outline-dark btn-sm" to="/admin/sesiones-privadas">Volver</Link>} />
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <p><strong>Cliente:</strong> {sesion.data.clienteNombre ?? sesion.data.clienteId ?? '-'}</p>
          <p><strong>Fecha:</strong> <DateValue value={sesion.data.fechaSesionUtc} /></p>
          <p><strong>Precio:</strong> <MoneyValue value={sesion.data.precioPaquete ?? undefined} /></p>
          <p><strong>Estado:</strong> <StatusBadge value={sesion.data.estado ?? sesion.data.activa} /></p>
          <button className="btn btn-sm btn-dark" type="button" onClick={() => estado.mutate()}>Cambiar estado</button>
        </div>
      </div>
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h2 className="h5">Fotos privadas</h2>
          <div className="d-flex gap-2 mb-3">
            <input className="form-control" aria-label="Nombre archivo privado" placeholder="archivo.jpg" value={nombreArchivo} onChange={(event) => setNombreArchivo(event.target.value)} />
            <button className="btn btn-outline-dark" type="button" disabled={!nombreArchivo.trim()} onClick={() => storageKey.mutate()}>Preparar archivo</button>
          </div>
          {storageKeyGenerado ? <p className="small text-secondary">Archivo preparado sin exponer datos privados.</p> : null}
          <AdminTable
            caption="Fotos privadas de sesion"
            rows={fotos.data ?? []}
            columns={[
              { header: 'Archivo', render: (foto) => foto.nombreArchivo ?? foto.id },
              { header: 'Precio', render: (foto) => <MoneyValue value={foto.precioUnitario} /> },
              { header: 'Estado', render: (foto) => <StatusBadge value={foto.activa} /> },
              { header: 'Metadata', render: (foto) => <SanitizedMetadata value={foto} /> },
            ]}
          />
        </div>
      </div>
      <NotasInternasPanel entidadTipo="SesionPrivada" entidadId={id} />
    </section>
  );
}
