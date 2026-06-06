import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/app/providers/AuthProvider';
import { isAdminRole } from '@/config/roles';
import { routes } from '@/config/routes';
import type { ApiError } from '@/services/api/apiError';

const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa tu nombre.').max(160, 'El nombre es demasiado largo.'),
    email: z.string().email('Ingresa un email valido.'),
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirma la contrasena.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contrasenas no coinciden.',
  });

type RegisterForm = z.infer<typeof registerSchema>;

function defaultPath(roles: string[]) {
  return roles.some(isAdminRole) ? routes.admin.dashboard : routes.user.dashboard;
}

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async ({ confirmPassword: _confirmPassword, ...payload }) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      const session = await registerUser(payload);
      if (session) {
        navigate(defaultPath(session.user.roles), { replace: true });
        return;
      }
      setSuccessMessage('Cuenta creada. Ya podes iniciar sesion.');
      navigate(routes.auth.login, {
        replace: true,
        state: { message: 'Cuenta creada. Ya podes iniciar sesion.' },
      });
    } catch (error) {
      setApiError((error as ApiError).message ?? 'No pudimos crear la cuenta.');
    }
  });

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-3">Crear cuenta</h1>
              {apiError ? <div className="alert alert-danger">{apiError}</div> : null}
              {successMessage ? <div className="alert alert-success">{successMessage}</div> : null}
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="nombre">
                    Nombre
                  </label>
                  <input className="form-control" id="nombre" autoComplete="name" aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'nombre-error' : undefined} {...register('nombre')} />
                  {errors.nombre ? <div className="text-danger small mt-1" id="nombre-error">{errors.nombre.message}</div> : null}
                </div>
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
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                  />
                  {errors.password ? <div className="text-danger small mt-1" id="password-error">{errors.password.message}</div> : null}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirmar contrasena
                  </label>
                  <input
                    className="form-control"
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword ? (
                    <div className="text-danger small mt-1" id="confirmPassword-error">{errors.confirmPassword.message}</div>
                  ) : null}
                </div>
                <button className="btn btn-dark w-100" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear cuenta'}
                </button>
              </form>
              <p className="small text-secondary mt-3 mb-0">
                Ya tenes cuenta? <Link to={routes.auth.login}>Ingresar</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
