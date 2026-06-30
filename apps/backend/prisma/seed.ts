import { PrismaClient, PerfilUsuario, Sexo, StatusPaciente, TipoResponsavel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação do banco de dados...');

  // 1. Criar senha criptografada
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 2. Criar ou atualizar o Administrador Conectar
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@conectar.com' },
    update: {
      nome: 'Administrador Conectar',
      senha: hashedPassword,
      perfil: PerfilUsuario.ADMINISTRADOR,
      ativo: true,
    },
    create: {
      nome: 'Administrador Conectar',
      email: 'admin@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.ADMINISTRADOR,
      ativo: true,
    },
  });
  console.log(`✔ Administrador criado/atualizado: ${admin.email}`);

  // 3. Criar ou atualizar o Paciente Fictício
  const paciente = await prisma.paciente.upsert({
    where: { cpf: '000.000.000-00' },
    update: {
      nome: 'Lucas Mendes',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2018-05-15'),
      status: StatusPaciente.ATIVO,
      ativo: true,
    },
    create: {
      id: 'pac-1',
      nome: 'Lucas Mendes',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2018-05-15'),
      status: StatusPaciente.ATIVO,
      ativo: true,
      cpf: '000.000.000-00',
    },
  });
  console.log(`✔ Paciente criado/atualizado: ${paciente.nome}`);

  // 4. Criar ou atualizar o Responsável (Portal dos Pais)
  const responsavel = await prisma.responsavel.findFirst({
    where: { email: 'mariana.mendes@email.com' }
  });

  if (responsavel) {
    await prisma.responsavel.update({
      where: { id: responsavel.id },
      data: {
        nome: 'Mariana Mendes',
        senhaPortal: hashedPassword,
        ativoPortal: true,
        pacienteId: paciente.id,
      }
    });
    console.log(`✔ Responsável atualizado: mariana.mendes@email.com`);
  } else {
    const newResponsavel = await prisma.responsavel.create({
      data: {
        nome: 'Mariana Mendes',
        email: 'mariana.mendes@email.com',
        senhaPortal: hashedPassword,
        ativoPortal: true,
        pacienteId: paciente.id,
        grauParent: TipoResponsavel.MAE,
      }
    });
    console.log(`✔ Responsável criado: ${newResponsavel.email}`);
  }

  console.log('✨ Banco de dados semeado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a semeação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
