# Guia de Deploy (Vercel + Supabase)

Siga estes passos para colocar sua Rádio Studio no ar.

## 1. GitHub (Código Fonte)
O código já foi enviado para o seu repositório:
`https://github.com/gilcleber/Radio-Studio`

## 2. Configurar Vercel (Hospedagem)
1.  Acesse [vercel.com](https://vercel.com) e faça login.
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Selecione **"Continue with GitHub"**.
4.  Na lista de repositórios, encontre `Radio-Studio` e clique em **"Import"**.

## 3. Configurar Variáveis de Ambiente (Supabase)
Na tela de configuração do projeto no Vercel ("Configure Project"):
1.  Abra a seção **"Environment Variables"**.
2.  Adicione as seguintes chaves (copie do seu arquivo `.env.local`):

| Key (Nome) | Value (Valor) |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://xtrkjgkytonckzjhtesp.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Copie a chave longa do seu arquivo .env.local)* |
| `GEMINI_API_KEY` | *(Se estiver usando a IA, coloque sua chave aqui)* |

3.  Clique em **"Add"** para cada uma.

## 4. Finalizar
1.  Clique no botão **"Deploy"**.
2.  Aguarde a construção (Build).
3.  🎉 **Pronto!** O Vercel vai gerar um link (ex: `radio-studio.vercel.app`).

## 5. Dica Pro (PWA)
Para o ícone funcionar perfeitamente ao instalar no celular, o Vercel cuida de tudo, desde que os arquivos `manifest.webmanifest` e imagens estejam na pasta `public` (o que nós já fizemos!).
