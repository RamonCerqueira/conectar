const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const rootEnvPath = path.join(rootDir, '.env');
const rootEnvExamplePath = path.join(rootDir, '.env.example');

const targetApps = [
  'apps/frontend',
  'apps/backend',
  'apps/ai-service',
  'apps/whatsapp-service',
  'apps/landingpage'
];

function syncEnv() {
  console.log('🔄 Sincronizando arquivos .env...');

  // 1. Garante que o .env principal existe
  if (!fs.existsSync(rootEnvPath)) {
    if (fs.existsSync(rootEnvExamplePath)) {
      console.log('📝 Criando arquivo .env na raiz a partir do .env.example...');
      fs.copyFileSync(rootEnvExamplePath, rootEnvPath);
    } else {
      console.error('❌ Arquivo .env ou .env.example não encontrado na raiz!');
      process.exit(1);
    }
  }

  // 2. Copia o .env da raiz para cada uma das aplicações
  targetApps.forEach(appDir => {
    const destDir = path.join(rootDir, appDir);
    
    // Garante que a pasta de destino existe
    if (fs.existsSync(destDir)) {
      const destEnvPath = path.join(destDir, '.env');
      fs.copyFileSync(rootEnvPath, destEnvPath);
      console.log(`✅ .env copiado para: ${appDir}`);
    } else {
      console.warn(`⚠️ Pasta não encontrada: ${appDir}`);
    }
  });

  console.log('\n✨ Sincronização de variáveis de ambiente concluída com sucesso!');
}

syncEnv();
