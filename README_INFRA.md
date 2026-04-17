# Configuração do Backend (Supabase)

Esta plataforma foi migrada para uma arquitetura Full-Stack real utilizando Supabase.

## Passos para Configuração

1. **Crie um projeto no Supabase**: Acesse [supabase.com](https://supabase.com).
2. **Execute o Schema SQL**: Copie o conteúdo do arquivo `supabase_schema.sql` (na raiz deste projeto) e cole no SQL Editor do dashboard do seu projeto Supabase. Execute para criar todas as tabelas e políticas de segurança.
3. **Configure as Variáveis de Ambiente**:
   - Obtenha a `URL` e a `anon key` em *Project Settings > API*.
   - No painel de segredos do AI Studio (ou arquivo `.env`), configure:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
4. **Habilite Realtime**: No Supabase Dashboard, acesse *Database > Replication* e habilite a publicação `supabase_realtime` para as tabelas `rooms`, `bookings`, `companies` e `waitlist`.

## Google OAuth Setup

1. **Google Cloud Console**: No [Google Cloud Console](https://console.cloud.google.com/), seu projeto já possui o Client ID:
   `868147469607-vqf57314u25u44uj5l14f57s9tc80qf9.apps.googleusercontent.com`
2. **Credenciais**: Verifique se você já tem o `Client Secret` correspondente gerado no Google Cloud.
3. **URIs de Redirecionamento**: Certifique-se de que estas URIs estão salvas no seu Google Cloud Console:
   - `https://ais-dev-5wiybug2nqs3y22pg3sinb-143012680689.us-east1.run.app/auth/callback`
   - `https://ais-pre-5wiybug2nqs3y22pg3sinb-143012680689.us-east1.run.app/auth/callback`
4. **Supabase Dashboard**: No Supabase, ative o provider Google e insira o `Client ID` e o `Client Secret` gerados no Google Cloud.
5. **Configuração de Origem**: Na aba "Site URL" do Supabase, certifique-se de que a URL principal do seu app está listada.

- **E-mails**: Configure `RESEND_API_KEY` para habilitar notificações automáticas.
- **Monitoramento**: Configure `VITE_SENTRY_DSN` para rastreamento de erros em tempo real.
- **Automação**: Configure `N8N_WEBHOOK_URL` para disparar fluxos no n8n após novas reservas.

O sistema possui fallback automático para dados locais caso as chaves não sejam fornecidas, permitindo testes imediatos.
