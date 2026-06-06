import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { getApiUrl } from '@/config/env';
import { routes } from '@/config/routes';
import { server } from '@/test/msw/server';

function renderAt(path: string) {
  cleanup();
  window.history.pushState({}, 'public', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={queryClient}><AuthProvider><AppRouter /></AuthProvider></QueryClientProvider>);
}

describe('public pages', () => {
  it('lista servicios y CTA presupuesto', async () => {
    renderAt(routes.public.servicios);
    expect(await screen.findByText('Eventos sociales')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /Eventos sociales/i }));
    expect(await screen.findByRole('link', { name: 'Solicitar presupuesto' })).toBeInTheDocument();
  });

  it('muestra portfolio y empty state', async () => {
    renderAt(routes.public.portfolio);
    expect(await screen.findByText('Boda en salon')).toBeInTheDocument();

    server.use(http.get(`${getApiUrl()}/Portfolio`, () => HttpResponse.json({ data: [] })));
    renderAt(routes.public.portfolio);
    expect(await screen.findByText('No hay piezas de portfolio para mostrar.')).toBeInTheDocument();
  });

  it('FAQ filtra preguntas', async () => {
    renderAt(routes.public.faq);
    expect(await screen.findByText('Como contrato?')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Buscar'), 'entregan');
    expect(screen.queryByText('Como contrato?')).not.toBeInTheDocument();
    expect(screen.getByText('Cuando entregan?')).toBeInTheDocument();
  });

  it('presupuesto valida, envia OK y muestra error seguro', async () => {
    renderAt(routes.public.presupuesto);
    await userEvent.click(await screen.findByRole('button', { name: 'Enviar solicitud' }));
    expect(await screen.findByText('Ingresa tu nombre.')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Nombre'), 'Cliente');
    await userEvent.type(screen.getByLabelText('Email'), 'cliente@test.local');
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Necesito presupuesto para un evento.');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }));
    expect(await screen.findByText('Solicitud enviada. Te contactaremos pronto.')).toBeInTheDocument();

    renderAt(routes.public.presupuesto);
    await userEvent.type(await screen.findByLabelText('Nombre'), 'Cliente');
    await userEvent.type(screen.getByLabelText('Email'), 'error@test.local');
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Necesito presupuesto para un evento.');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }));
    expect(await screen.findByText('Solicitud invalida.')).toBeInTheDocument();
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  it('testimonios no muestra email publico y permite submit', async () => {
    renderAt(routes.public.testimonios);
    expect(await screen.findByText('Ana Perez')).toBeInTheDocument();
    expect(screen.queryByText('ana@test.local')).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Nombre'), 'Nuevo Cliente');
    await userEvent.type(screen.getByLabelText('Email'), 'nuevo@test.local');
    await userEvent.type(screen.getByLabelText('Texto'), 'Muy buen servicio y excelente entrega.');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar testimonio' }));
    expect(await screen.findByText('Gracias. Tu testimonio quedara pendiente de aprobacion.')).toBeInTheDocument();
  });
});
