import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminDevToolsPage } from './AdminDevToolsPage';

describe('AdminDevToolsPage', () => {
  it('renderiza botones basicos', () => {
    const client = new QueryClient();

    render(
      <QueryClientProvider client={client}>
        <AdminDevToolsPage />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('button', { name: 'Ping' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bad Request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sensitive Metadata' })).toBeInTheDocument();
  });
});
