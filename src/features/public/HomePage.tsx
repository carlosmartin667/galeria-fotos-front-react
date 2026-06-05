export function HomePage() {
  return (
    <>
      <section className="gf-public-hero">
        <div className="container">
          <div className="col-12 col-lg-7">
            <h1 className="display-5 fw-semibold">GaleriaFotos</h1>
            <p className="lead">
              Frontend React paralelo para validar la nueva experiencia sobre el backend .NET existente.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-5" id="servicios">
        <h2 className="h4">Servicios</h2>
        <p className="text-secondary">Base publica inicial para fotografia de eventos, portfolio y contacto.</p>
      </section>
      <section className="container py-5 border-top" id="portfolio">
        <h2 className="h4">Portfolio</h2>
        <p className="text-secondary">El consumo de contenido publico queda preparado para futuras iteraciones.</p>
      </section>
      <section className="container py-5 border-top" id="contacto">
        <h2 className="h4">Contacto</h2>
        <p className="text-secondary">Los formularios publicos se integraran manteniendo los endpoints actuales.</p>
      </section>
    </>
  );
}
