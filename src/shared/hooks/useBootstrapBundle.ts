import { useEffect } from 'react';

let bootstrapBundlePromise: Promise<unknown> | null = null;

export function useBootstrapBundle() {
  useEffect(() => {
    bootstrapBundlePromise ??= import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
}
