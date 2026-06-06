import type { Evento } from './evento';
import type { Foto } from './foto';
export interface Favorito { id?: string; eventoId?: string; fotoId?: string; evento?: Evento; foto?: Foto; creadoUtc?: string; }
