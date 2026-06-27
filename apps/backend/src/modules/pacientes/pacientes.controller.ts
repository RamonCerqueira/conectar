import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ListarPacientesQueryDto } from './dto/listar-pacientes.dto';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo paciente' })
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pacientes com filtros e busca' })
  findAll(@Query() query: ListarPacientesQueryDto) {
    return this.pacientesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar paciente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.remove(id);
  }

  @Post(':id/foto')
  @ApiOperation({ summary: 'Upload da foto do paciente' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/pacientes'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `foto-${req.params.id}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Apenas imagens são aceitas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadFoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pacientesService.updateFoto(id, file.path);
  }

  // ─── Sub-recursos ─────────────────────────────────────────────
  @Get(':id/prontuarios')
  @ApiOperation({ summary: 'Histórico de prontuários do paciente' })
  getProntuarios(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.getProntuarios(id);
  }

  @Get(':id/agendamentos')
  @ApiOperation({ summary: 'Agendamentos do paciente' })
  getAgendamentos(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.getAgendamentos(id);
  }

  @Get(':id/evolucao')
  @ApiOperation({ summary: 'Linha do tempo de evolução' })
  getEvolucao(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.getEvolucao(id);
  }

  @Get(':id/financeiro')
  @ApiOperation({ summary: 'Histórico financeiro do paciente' })
  getFinanceiro(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.getFinanceiro(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Timeline completa do paciente' })
  getTimeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.getTimeline(id);
  }
}
