import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contrato.findMany({
      include: { paciente: true },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.contrato.findMany({
      where: { pacienteId },
    });
  }

  async create(data: any) {
    const contrato = await this.prisma.contrato.create({
      data: {
        ...data,
        valorMensal: data.valorMensal !== undefined ? Number(data.valorMensal) : null,
        qtdParcelas: data.qtdParcelas !== undefined ? Number(data.qtdParcelas) : 1,
        diaVencimento: data.diaVencimento !== undefined ? Number(data.diaVencimento) : 10,
      }
    });

    if (contrato.assinado) {
      await this.gerarFinanceiroContrato(contrato.id);
    }
    return contrato;
  }

  private saveBase64Signature(base64Data: string, contratoId: string): string {
    try {
      const dir = join(process.cwd(), 'storage/contratos');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');
      const filename = `signature-${contratoId}-${Date.now()}.png`;
      const filepath = join(dir, filename);
      fs.writeFileSync(filepath, buffer);
      return `/storage/contratos/${filename}`;
    } catch (e) {
      console.error('Erro ao salvar assinatura em imagem:', e);
      return '';
    }
  }

  async sign(id: string, assinaturaBase64?: string) {
    let assinaturaUrl: string | null = null;
    if (assinaturaBase64) {
      assinaturaUrl = this.saveBase64Signature(assinaturaBase64, id);
    }

    const contrato = await this.prisma.contrato.update({
      where: { id },
      data: {
        assinado: true,
        assinadoEm: new Date(),
        assinaturaUrl,
      },
    });

    await this.gerarFinanceiroContrato(id);
    return contrato;
  }

  async gerarFinanceiroContrato(contratoId: string) {
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId },
      include: { paciente: true }
    });

    if (contrato && contrato.valorMensal && !contrato.gerouFinanceiro) {
      const valor = Number(contrato.valorMensal);
      const parcelas = contrato.qtdParcelas || 1;
      const diaVenc = contrato.diaVencimento || 10;
      
      const today = new Date();
      
      for (let i = 0; i < parcelas; i++) {
        const vencimento = new Date(today.getFullYear(), today.getMonth() + i, diaVenc);
        const refMes = `${vencimento.getFullYear()}-${String(vencimento.getMonth() + 1).padStart(2, '0')}`;
        
        await this.prisma.lancamento.create({
          data: {
            tipo: 'RECEITA',
            descricao: `[Contrato Mensalidade] Parc. ${i + 1}/${parcelas} - ${contrato.paciente.nome}`,
            valor,
            status: 'PENDENTE',
            vencimento,
            pacienteId: contrato.pacienteId,
            referencia: refMes,
            contratoId: contrato.id,
            observacoes: `Parcela gerada automaticamente a partir do contrato "${contrato.titulo}".`,
            contaCaixa: 'Caixa Geral'
          }
        });
      }
      
      await this.prisma.contrato.update({
        where: { id: contratoId },
        data: { gerouFinanceiro: true }
      });
    }
  }

  async delete(id: string) {
    return this.prisma.contrato.delete({
      where: { id },
    });
  }

  async updateCaminho(id: string, caminho: string) {
    return this.prisma.contrato.update({
      where: { id },
      data: { caminho },
    });
  }

  // ─── MODELOS DE CONTRATOS (TEMPLATES CRUD) ────────────────────────────────

  async findAllTemplates() {
    const list = await this.prisma.modeloContrato.findMany();
    if (list.length === 0) {
      // Seed default templates if database is empty
      const seeds = [
        {
          titulo: "Contrato de Prestação de Serviços Clínicos",
          tipo: "contrato",
          descricao: "Contrato padrão de prestação de serviços de apoio à aprendizagem e terapias multidisciplinares.",
          conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS CLÍNICOS E TERAPÊUTICOS

Pelo presente instrumento particular de contrato, de um lado INSTITUTO CONECTAR LTDA, CNPJ 12.345.678/0001-99, e de outro o RESPONSÁVEL LEGAL do Paciente abaixo qualificado, ajustam a prestação de serviços de terapias multidisciplinares.

CLÁUSULA PRIMEIRA - DO OBJETO: O objeto do presente contrato é o atendimento clínico multidisciplinar focado no desenvolvimento do paciente.
CLÁUSULA SEGUNDA - DOS VALORES: O valor e periodicidade dos pagamentos serão acertados individualmente em conformidade com o plano de atendimento terapêutico definido pela equipe clínica.

São Paulo, _____ de _________________ de 2026.
___________________________________________________
Assinatura do Responsável Legal`
        },
        {
          titulo: "Termo de Consentimento Livre (LGPD)",
          tipo: "lgpd",
          descricao: "Termo de coleta e tratamento de dados sensíveis e clínicos conforme a Lei Geral de Proteção de Dados.",
          conteudo: `TERMO DE CONSENTIMENTO E ESCLARECIMENTO - LGPD

Em conformidade com a Lei nº 13.709/18 - Lei Geral de Proteção de Dados (LGPD), eu autorizo o INSTITUTO CONECTAR LTDA a coletar, tratar e armazenar os dados pessoais e dados pessoais sensíveis do paciente sob minha responsabilidade.

O tratamento dos dados tem como finalidade exclusiva o acompanhamento terapêutico e elaboração do plano de tratamento multidisciplinar. Os dados não serão compartilhados com terceiros sem autorização prévia por escrito.

São Paulo, _____ de _________________ de 2026.
___________________________________________________
Assinatura do Responsável Legal`
        },
        {
          titulo: "Termo de Autorização de Uso de Imagem e Voz",
          tipo: "autorizacao_imagem",
          descricao: "Termo autorizando o uso de gravações e fotos de atividades terapêuticas para fins pedagógicos ou redes sociais.",
          conteudo: `TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM E VOZ

Eu, na qualidade de responsável legal do paciente, autorizo o INSTITUTO CONECTAR LTDA a utilizar fotos e/ou gravações de áudio e vídeo contendo a imagem e voz do paciente em atividades terapêuticas.

Esta autorização é concedida a título gratuito, abrangendo a veiculação em redes sociais oficiais da clínica e materiais pedagógicos internos.

São Paulo, _____ de _________________ de 2026.
___________________________________________________
Assinatura do Responsável Legal`
        },
        {
          titulo: "Ficha de Evolução Clínica - Contingência (Offline)",
          tipo: "outro",
          descricao: "Ficha em branco para preenchimento de evolução terapêutica em caso de queda do sistema ou funcionamento offline.",
          conteudo: `FICHA DE EVOLUÇÃO CLÍNICA MULTIDISCIPLINAR (CONTINGÊNCIA OFFLINE)
----------------------------------------------------------------------
IDENTIFICAÇÃO DO ATENDIMENTO:
Paciente: ___________________________________________________________
Terapeuta: __________________________________________________________
Data da Sessão: ___/___/2026   Horário: ____:____ às ____:____
Especialidade: [ ] Psicopedagogia  [ ] Psicologia  [ ] Fonoaudiologia
               [ ] T. Ocupacional  [ ] Neuropsicologia  [ ] Outro

----------------------------------------------------------------------
1. OBJETIVOS E ATIVIDADES DA SESSÃO:
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________

2. EVOLUÇÃO CLÍNICA / COMPORTAMENTO DO PACIENTE:
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________

3. ORIENTAÇÕES AOS PAIS / TAREFA DOMICILIAR:
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________

4. PRÓXIMA META DO ATENDIMENTO:
______________________________________________________________________
______________________________________________________________________

----------------------------------------------------------------------
São Paulo, _____ de _________________ de 2026.

___________________________________________________
Assinatura do Profissional Responsável`
        }
      ];

      for (const s of seeds) {
        await this.prisma.modeloContrato.create({ data: s });
      }
      return this.prisma.modeloContrato.findMany();
    }
    return list;
  }

  async createTemplate(data: any) {
    return this.prisma.modeloContrato.create({ data });
  }

  async updateTemplate(id: string, data: any) {
    return this.prisma.modeloContrato.update({
      where: { id },
      data,
    });
  }

  async deleteTemplate(id: string) {
    return this.prisma.modeloContrato.delete({
      where: { id },
    });
  }

  async updateModeloArquivoUrl(id: string, arquivoUrl: string) {
    return this.prisma.modeloContrato.update({
      where: { id },
      data: { arquivoUrl },
    });
  }
}
