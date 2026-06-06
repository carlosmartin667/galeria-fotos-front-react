import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { callDevTool, devToolEndpoints, type DevToolEndpoint } from '@/services/dev-tools/devToolsApi';
import { SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';

export function AdminDevToolsPage() {
  const [selected, setSelected] = useState<DevToolEndpoint>(devToolEndpoints[0]);
  const mutation = useMutation({
    mutationFn: (path: string) => callDevTool(path),
  });

  return (
    <section>
      <h1 className="h3">DevTools</h1>
      <p className="text-secondary">Pruebas controladas contra endpoints de diagnostico.</p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {devToolEndpoints.map((tool) => (
          <button
            className="btn btn-outline-dark btn-sm"
            key={tool.path}
            type="button"
            onClick={() => {
              setSelected(tool);
              mutation.mutate(tool.path);
            }}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h6">{selected.label}</h2>
          <pre className="metadata-box bg-light p-3 rounded mb-0">
            <SanitizedMetadata value={mutation.data ?? mutation.error ?? { estado: 'Sin ejecutar' }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
