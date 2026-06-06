import type { PortfolioItem } from './portfolio';
import type { Promocion } from './promocion';
import type { ServicioFotografia } from './servicio';
import type { Testimonio } from './testimonio';

export interface SitioHome {
  titulo?: string;
  subtitulo?: string;
  descripcion?: string;
  serviciosDestacados?: ServicioFotografia[];
  portfolioDestacado?: PortfolioItem[];
  promocionesDestacadas?: Promocion[];
  testimoniosDestacados?: Testimonio[];
}

export interface SitioContacto {
  email?: string;
  telefono?: string;
  whatsApp?: string;
  direccion?: string;
  instagram?: string;
  facebook?: string;
}
