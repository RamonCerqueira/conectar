# Landing page — referência Instituto Conectar

Layout responsivo baseado na referência fornecida, com logo e imagens enviados nos ZIPs. As imagens de ambientes são renderizações do projeto arquitetônico.

## Contato
Configure no ambiente de build:
- NEXT_PUBLIC_WHATSAPP_NUMBER: número oficial com código do país e DDD, somente dígitos.
- NEXT_PUBLIC_CLINIC_ADDRESS: endereço completo para o link do Google Maps.

O WhatsApp (71) 99955-0803 e o endereço em Lauro de Freitas informados pelo proprietário são os valores padrão. As variáveis permitem substituí-los no build. O chat existente depende de NEXT_PUBLIC_API_URL.

## Materiais
- public/brand: logo e símbolo fornecidos.
- public/media: ambientes e cards convertidos para WebP; vídeo fornecido convertido para H.264, 960×540, 15 fps, sem áudio com carregamento sob demanda.
- A referência contém uma foto da fundadora que não consta dos ZIPs. Por solicitação do proprietário, public/leliane.jpg contém uma foto provisória de banco de imagens. Substitua este arquivo pela foto oficial; ajuste o alt no componente ReferenceLanding.tsx. Fonte provisória: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2.

## Verificação
pnpm --filter landingpage build

Nenhuma alteração em módulos clínicos ou banco de dados.
