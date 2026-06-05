import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { callDevTool } from './adminService';

const devTools = [
  { label: 'Ping', path: '/dev-tools/ping' },
  { label: 'Bad Request', path: '/dev-tools/errors/bad-request' },
  { label: 'Internal Controlled', path: '/dev-tools/errors/internal-controlled' },
  { label: 'Null Data', path: '/dev-tools/payloads/null-data' },
  { label: 'Sensitive Metadata', path: '/dev-tools/payloads/sensitive-metadata' },
];

export function AdminDevToolsPage() {
  const [selected, setSelected] = useState(devTools[0]);
  const mutation = useMutation({
    mutationFn: (path: string) => callDevTool(path),
  });

  return (
    <section>
      <h1 className="h3">DevTools</h1>
      <p className="text-secondary">Pruebas controladas contra endpoints de diagnostico.</p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {devTools.map((tool) => (
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
            {JSON.stringify(mutation.data ?? mutation.error ?? { estado: 'Sin ejecutar' }, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}
