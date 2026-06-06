import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/queryKeys';
import { getFaqItems } from '@/services/faq/faqApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function FaqPage() {
  const [search, setSearch] = useState('');
  const faq = useQuery({ queryKey: queryKeys.faq.list(), queryFn: getFaqItems });
  const filtered = useMemo(() => (faq.data ?? []).filter((item) => `${item.pregunta} ${item.respuesta} ${item.categoria ?? ''}`.toLowerCase().includes(search.toLowerCase())), [faq.data, search]);
  if (faq.isLoading) return <LoadingState />;
  if (faq.isError) return <main className="container py-5"><ErrorState /></main>;

  return (
    <main className="container py-5">
      <Seo title="FAQ" description="Preguntas frecuentes sobre servicios fotograficos." />
      <h1 className="h3">Preguntas frecuentes</h1>
      <label className="form-label" htmlFor="faqSearch">Buscar</label>
      <input id="faqSearch" className="form-control mb-3" value={search} onChange={(event) => setSearch(event.target.value)} />
      {filtered.length === 0 ? <EmptyState title="Sin preguntas" /> : null}
      <div className="accordion" id="faqAccordion">
        {filtered.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${item.id}`}>
                {item.pregunta}
              </button>
            </h2>
            <div id={`faq-${item.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
              <div className="accordion-body">{item.respuesta}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
