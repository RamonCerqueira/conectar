import { SetMetadata } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';

export const PERFIS_KEY = 'perfis';
export const Perfis = (...perfis: PerfilUsuario[]) => SetMetadata(PERFIS_KEY, perfis);
