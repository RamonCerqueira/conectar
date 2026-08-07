import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Retorna a lista de contatos do sistema (destacando Recepção e Profissionais/Salas)
   * com estatísticas de mensagens não lidas e informações de sala.
   */
  async getContatosChat(usuarioId: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        ativo: true,
        id: { not: usuarioId },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        perfil: true,
        ultimoLogin: true,
        profissional: {
          select: {
            id: true,
            especialidade: true,
            registro: true,
            cor: true,
            salas: {
              select: {
                sala: {
                  select: {
                    id: true,
                    nome: true,
                    cor: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { perfil: 'asc' },
        { nome: 'asc' },
      ],
    });

    // Buscar mensagens não lidas agrupadas por remetente para o usuário logado
    const mensagensNaoLidas = await this.prisma.mensagemChatInterno.groupBy({
      by: ['remetenteId'],
      where: {
        destinatarioId: usuarioId,
        lida: false,
      },
      _count: {
        id: true,
      },
    });

    const mapNaoLidas = new Map<string, number>();
    mensagensNaoLidas.forEach((item) => {
      mapNaoLidas.set(item.remetenteId, item._count.id);
    });

    // Mapear resultado formatado com status da sala e etiquetas
    return usuarios.map((user) => {
      const salasProfissional = user.profissional?.salas?.map((s) => s.sala.nome) || [];
      const salaNome = salasProfissional.length > 0 ? salasProfissional.join(', ') : null;

      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        foto: user.foto,
        perfil: user.perfil,
        isRecepcao: user.perfil === 'RECEPCAO',
        isProfissional: !!user.profissional,
        especialidade: user.profissional?.especialidade || null,
        salaNome: salaNome,
        corAgenda: user.profissional?.cor || '#6b7280',
        naoLidas: mapNaoLidas.get(user.id) || 0,
        online: user.ultimoLogin
          ? new Date().getTime() - new Date(user.ultimoLogin).getTime() < 15 * 60 * 1000
          : false,
      };
    });
  }

  /**
   * Obtém o histórico de mensagens 1:1 entre dois usuários
   */
  async getHistoricoMensagens(usuarioId: string, outroUsuarioId: string) {
    // Buscar histórico de mensagens trocadas no chat 1:1
    const mensagens = await this.prisma.mensagemChatInterno.findMany({
      where: {
        OR: [
          { remetenteId: usuarioId, destinatarioId: outroUsuarioId },
          { remetenteId: outroUsuarioId, destinatarioId: usuarioId },
        ],
      },
      orderBy: { criadoEm: 'asc' },
      take: 100,
    });

    // Marcar como lidas todas as mensagens que o outro usuário enviou para este usuário
    await this.prisma.mensagemChatInterno.updateMany({
      where: {
        remetenteId: outroUsuarioId,
        destinatarioId: usuarioId,
        lida: false,
      },
      data: {
        lida: true,
        lidaEm: new Date(),
      },
    });

    return mensagens;
  }

  /**
   * Envia uma mensagem direta 1:1 e armazena no banco de dados
   */
  async enviarMensagem(remetenteId: string, destinatarioId: string, conteudo: string) {
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Conteúdo da mensagem não pode ser vazio');
    }

    const mensagem = await this.prisma.mensagemChatInterno.create({
      data: {
        remetenteId,
        destinatarioId,
        conteudo: conteudo.trim(),
      },
      include: {
        remetente: {
          select: {
            id: true,
            nome: true,
            perfil: true,
            foto: true,
          },
        },
      },
    });

    this.logger.log(`Mensagem Chat 1:1 enviada de ${remetenteId} para ${destinatarioId}`);
    return mensagem;
  }

  /**
   * Marca como lidas as mensagens vindas de um remetente específico
   */
  async marcarComoLidas(usuarioLogadoId: string, remetenteId: string) {
    await this.prisma.mensagemChatInterno.updateMany({
      where: {
        remetenteId,
        destinatarioId: usuarioLogadoId,
        lida: false,
      },
      data: {
        lida: true,
        lidaEm: new Date(),
      },
    });
    return { success: true };
  }

  /**
   * Obtém a contagem total de mensagens não lidas recebidas pelo usuário
   */
  async getTotalNaoLidas(usuarioId: string) {
    const total = await this.prisma.mensagemChatInterno.count({
      where: {
        destinatarioId: usuarioId,
        lida: false,
      },
    });
    return { total };
  }
}
