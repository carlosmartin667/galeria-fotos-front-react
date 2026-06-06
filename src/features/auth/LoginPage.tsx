import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/app/providers/AuthProvider';
import { isAdminRole } from '@/config/roles';
import { getSafeReturnUrl, routes } from '@/config/routes';
import type { ApiError } from '@/services/api/apiError';

const loginSchema = z.object({
  email: z.string().email('Ingresa un email valido.'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
});

type LoginForm = z.infer<typeof loginSchema>;

function defaultPath(roles: string[]) {
  return roles.some(isAdminRole) ? routes.admin.dashboard : routes.user.dashboard;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const stateMessage =
    location.state && typeof location.state === 'object' && 'message' in location.state
      ? String(location.state.message)
      : null;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      const session = await login(values);
      navigate(getSafeReturnUrl(searchParams.get('returnUrl')) || defaultPath(session.user.roles), { replace: true });
    } catch (error) {
      setApiError((error as ApiError).message ?? 'No pudimos iniciar sesion.');
    }
  });

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-3">Ingresar</h1>
              {stateMessage ? <div className="alert alert-success">{stateMessage}</div> : null}
              {apiError ? <div className="alert alert-danger">{apiError}</div> : null}
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input className="form-control" id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
                  {errors.email ? <div className="text-danger small mt-1" id="email-error">{errors.email.message}</div> : null}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Contrasena
                  </label>
                  <input
                    className="form-control"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                  />
                  {errors.password ? <div className="text-danger small mt-1" id="password-error">{errors.password.message}</div> : null}
                </div>
                <button className="btn btn-dark w-100" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>
              <p className="small text-secondary mt-3 mb-0">
                No tenes cuenta? <Link to={routes.auth.register}>Crear cuenta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
