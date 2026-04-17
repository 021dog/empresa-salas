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

## Integrações Adicionais

- **E-mails**: Configure `RESEND_API_KEY` para habilitar notificações automáticas.
- **Monitoramento**: Configure `VITE_SENTRY_DSN` para rastreamento de erros em tempo real.
- **Automação**: Configure `N8N_WEBHOOK_URL` para disparar fluxos no n8n após novas reservas.

O sistema possui fallback automático para dados locais caso as chaves não sejam fornecidas, permitindo testes imediatos.
