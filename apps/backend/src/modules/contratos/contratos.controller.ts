import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ContratosService } from './contratos.service';

@ApiTags('contratos')
@ApiBearerAuth()
@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload do PDF do contrato assinado/pronto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/contratos'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `contrato-${req.params.id}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(pdf)$/)) {
          return cb(new Error('Apenas arquivos PDF são aceitos'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadPDF(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const caminho = `/storage/contratos/${file.filename}`;
    return this.contratosService.updateCaminho(id, caminho);
  }

  @Get()
  findAll() {
    return this.contratosService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.contratosService.findByPaciente(id);
  }

  // Contract Templates CRUD
  @Get('modelos')
  findAllTemplates() {
    return this.contratosService.findAllTemplates();
  }

  @Post('modelos')
  createTemplate(@Body() data: any) {
    return this.contratosService.createTemplate(data);
  }

  @Post('modelos/:id/upload')
  @ApiOperation({ summary: 'Upload do PDF do modelo de contrato' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/contratos'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `modelo-${req.params.id}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(pdf)$/)) {
          return cb(new Error('Apenas arquivos PDF são aceitos'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadModeloPDF(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const arquivoUrl = `/storage/contratos/${file.filename}`;
    return this.contratosService.updateModeloArquivoUrl(id, arquivoUrl);
  }

  @Put('modelos/:id')
  updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.contratosService.updateTemplate(id, data);
  }

  @Delete('modelos/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.contratosService.deleteTemplate(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.contratosService.create(data);
  }

  @Put(':id/assinar')
  sign(
    @Param('id') id: string,
    @Body() body: { assinaturaBase64?: string },
  ) {
    return this.contratosService.sign(id, body.assinaturaBase64);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contratosService.delete(id);
  }
}
