import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ArquivosService } from './arquivos.service';

const uploadDir = join(process.cwd(), process.env.STORAGE_PATH || './storage', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@ApiTags('arquivos')
@ApiBearerAuth()
@Controller('arquivos')
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  @Get()
  findAll() {
    return this.arquivosService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.arquivosService.findByPaciente(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    return this.arquivosService.create({
      pacienteId: body.pacienteId || null,
      nome: body.nome || file.originalname,
      nomeOriginal: file.originalname,
      caminho: `/storage/uploads/${file.filename}`,
      tipo: body.tipo || 'DOCUMENTO',
      mimeType: file.mimetype,
      tamanho: file.size,
    });
  }

  @Post()
  create(@Body() data: any) {
    return this.arquivosService.create(data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.arquivosService.delete(id);
  }
}

