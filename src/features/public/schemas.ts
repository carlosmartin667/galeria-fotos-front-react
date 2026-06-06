import { z } from 'zod';

export const presupuestoSchema = z.object({
  nombre: z.string().min(2, 'Ingresa tu nombre.').max(160),
  email: z.string().email('Ingresa un email valido.'),
  whatsApp: z.string().max(64).optional(),
  tipoEvento: z.string().max(120).optional(),
  servicioId: z.string().optional(),
  fechaTentativaUtc: z.string().optional(),
  lugar: z.string().max(240).optional(),
  cantidadInvitados: z.coerce.number().int().positive().optional().or(z.literal('')),
  mensaje: z.string().min(5, 'Contanos que necesitas.').max(2000),
});

export type PresupuestoForm = z.infer<typeof presupuestoSchema>;

export const testimonioSchema = z.object({
  nombreCliente: z.string().min(2, 'Ingresa tu nombre.').max(160),
  emailCliente: z.string().email('Ingresa un email valido.').optional().or(z.literal('')),
  texto: z.string().min(10, 'El testimonio debe tener al menos 10 caracteres.').max(2000),
  calificacion: z.coerce.number().int().min(1).max(5),
});

export type TestimonioForm = z.infer<typeof testimonioSchema>;

export const disponibilidadSchema = z.object({
  desde: z.string().min(1, 'Selecciona fecha desde.'),
  hasta: z.string().min(1, 'Selecciona fecha hasta.'),
});

export type DisponibilidadForm = z.infer<typeof disponibilidadSchema>;
