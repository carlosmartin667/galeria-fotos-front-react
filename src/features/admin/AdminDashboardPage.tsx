export function AdminDashboardPage() {
  return (
    <section>
      <h1 className="h3">Admin Dashboard</h1>
      <p className="text-secondary">Base protegida para operaciones administrativas de GaleriaFotos.</p>
      <div className="row g-3">
        {['Actividad', 'Ventas', 'Operaciones'].map((item) => (
          <div className="col-12 col-md-4" key={item}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6">{item}</h2>
                <p className="small text-secondary mb-0">Integracion incremental con endpoints Admin existentes.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
