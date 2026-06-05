import { useAuth } from '@/app/providers/AuthProvider';

export function UserDashboardPage() {
  const { session } = useAuth();

  return (
    <section>
      <h1 className="h3">Dashboard</h1>
      <p className="text-secondary">Sesion activa para {session?.user.email}.</p>
      <div className="row g-3">
        {['Eventos', 'Carrito', 'Pedidos', 'Descargas'].map((item) => (
          <div className="col-12 col-md-6 col-xl-3" key={item}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6">{item}</h2>
                <p className="small text-secondary mb-0">Modulo pendiente de migracion.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
