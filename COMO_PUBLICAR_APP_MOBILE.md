# 📱 Guia de Publicação do App "Conectar Família" (Android & iOS)

Este guia ensina como gerar o instalador do aplicativo e publicá-lo na **Google Play Store** e **Apple App Store** utilizando o **Capacitor**.

---

## 🛠️ Estrutura do Projeto Mobile

O projeto mobile está localizado em:
`apps/portal-app/`

- **Framework**: Vite + React 19 + TypeScript + TailwindCSS
- **Motor Mobile**: `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`
- **Identificador Único (App ID)**: `br.com.institutoconectar.familia`
- **Nome do App**: `Conectar Família`
- **Backend Conectado**: `https://api.institutoconectar.net.br/api`

---

## 🚀 1. Passo a Passo para Gerar e Publicar no Android (Google Play Store)

### Requisitos:
- [Android Studio](https://developer.android.com/studio) instalado na sua máquina
- Conta de Desenvolvedor no [Google Play Console](https://play.google.com/console)

### Comandos:
```bash
# 1. Acessar a pasta do aplicativo mobile
cd apps/portal-app

# 2. Instalar dependências (caso seja a primeira vez)
pnpm install

# 3. Gerar o build da aplicação web
pnpm run build

# 4. Adicionar a plataforma Android (apenas na 1ª vez)
npx cap add android

# 5. Sincronizar o código com a pasta Android
npx cap sync android

# 6. Abrir o projeto diretamente no Android Studio
npx cap open android
```

### Gerando o arquivo `.aab` no Android Studio:
1. No menu superior, clique em **Build** > **Generate Signed Bundle / APK**.
2. Selecione **Android App Bundle** e clique em **Next**.
3. Crie ou selecione sua chave de assinatura (`keystore`).
4. Escolha a variante **Release** e clique em **Finish**.
5. O Android Studio gerará o arquivo `app-release.aab`.
6. Basta fazer o upload desse arquivo no **Google Play Console** na faixa de Teste Aberto ou Produção!

---

## 🍏 2. Passo a Passo para Gerar e Publicar no iOS (Apple App Store)

### Requisitos:
- Um computador com **macOS** (MacBook, Mac Mini ou Mac Studio) ou serviço CI/CD na nuvem (Codemagic / GitHub Actions).
- [Xcode](https://developer.apple.com/xcode/) instalado.
- Conta no [Apple Developer Program](https://developer.apple.com/).

### Comandos:
```bash
# 1. Acessar a pasta do aplicativo mobile
cd apps/portal-app

# 2. Gerar o build
pnpm run build

# 3. Adicionar a plataforma iOS (apenas na 1ª vez)
npx cap add ios

# 4. Sincronizar o código
npx cap sync ios

# 5. Abrir no Xcode
npx cap open ios
```

### Enviando para a App Store no Xcode:
1. No Xcode, selecione o alvo **App** e certifique-se de configurar sua equipe em **Signing & Capabilities**.
2. No menu de dispositivos no topo, selecione **Any iOS Device (arm64)**.
3. Clique em **Product** > **Archive**.
4. Quando a janela Organizer abrir, clique em **Distribute App** > **App Store Connect**.
5. O app será enviado automaticamente para o **TestFlight** e ficará pronto para envio para aprovação da Apple!

---

## 🔄 3. Como atualizar o App após fazer alterações no código

Sempre que você alterar telas, cores ou funcionalidades no código:

```bash
cd apps/portal-app
pnpm run build
npx cap sync
```
*O comando `npx cap sync` atualiza automaticamente as pastas nativas do Android e do iOS com a nova versão compilada.*
