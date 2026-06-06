import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Deliberadamente no mostramos stacktrace ni payloads en UI.
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <main className="container py-5">
            <ErrorState
              title="Algo salio mal."
              message="La interfaz encontro un error seguro de mostrar. Recarga la pagina para continuar."
              actionLabel="Recargar"
              onAction={this.reload}
            />
          </main>
        )
      );
    }

    return this.props.children;
  }
}
