import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─── Segurança ───────────────────────────────────────────────
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));
  app.use(compression());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // ─── CORS ────────────────────────────────────────────────────
  const allowedOrigins = [
    'https://app.institutoconectar.genioplay.com.br',
    'https://institutoconectar.genioplay.com.br',
    'https://api.institutoconectar.genioplay.com.br',
    process.env.FRONTEND_URL,
    'http://localhost:5202',
    'http://localhost:5303',
    'http://localhost:8000',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.genioplay.com.br')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });

  // ─── Prefixo Global ──────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Validação Global ─────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Arquivos Estáticos (Storage) ────────────────────────────
  app.useStaticAssets(
    join(process.cwd(), process.env.STORAGE_PATH || './storage'),
    { prefix: '/storage' },
  );

  // ─── Swagger ─────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Instituto Conectar — API')
      .setDescription('API do sistema de gestão clínica')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('refreshToken')
      .addTag('auth', 'Autenticação e autorização')
      .addTag('pacientes', 'Gestão de pacientes')
      .addTag('profissionais', 'Gestão de profissionais')
      .addTag('agenda', 'Agendamentos e consultas')
      .addTag('prontuarios', 'Prontuário eletrônico')
      .addTag('financeiro', 'Controle financeiro')
      .addTag('relatorios', 'Relatórios e exportações')
      .addTag('ia', 'IA com Google Gemini')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // ─── Start ───────────────────────────────────────────────────
  const port = process.env.BACKEND_PORT || 5101;
  await app.listen(port);
  console.log(`\n🏥 Instituto Conectar API rodando em: http://localhost:${port}/api`);
  console.log(`📖 Swagger disponível em: http://localhost:${port}/api/docs\n`);
}

bootstrap();
