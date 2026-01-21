# Walkthrough - Rádio Studio PWA

**Status**: Concluído 🚀

Este projeto transformou a "Rádio Studio" em uma Progressive Web App (PWA) de alta performance, com estética "Gospel Neon" e funcionalidades interativas de engajamento.

## 🌟 Funcionalidades Entregues

### 1. Experiência de Áudio Imersiva
*   **Player Persistente**: A música continua tocando enquanto você navega (HTML5 Audio + Context API).
*   **Controles de Bloqueio**: Integração com **Media Session API** permite controlar (Play/Pause/Next) direto da tela de bloqueio do celular ou smartwatch.
*   **Visualizer & Lyrics**: A Home exibe a capa do álbum com brilho dinâmico e a letra da música sincronizada.

### 2. Design "Gospel Neon" (Dark Glassmorphism)
*   **Tema**: Fundo *Deep Navy* (`#0f172a`) com acentos em *Luminous Cyan* e *Divine Gold*.
*   **Interface**: Elementos translúcidos (Glassmorphism), sombras coloridas e tipografia moderna (*Inter* + *Outfit*).
*   **Responsividade**: Layout fluido que se adapta de desktops a celulares (com Bottom Navigation em mobile).

### 3. Engajamento & Gamificação
*   **Top 40 (Charts)**: Ranking visual das músicas mais votadas.
*   **Programação Visual**: Agenda colorida por categoria de programa.
*   **Pedido de Música (AI)**: Fluxo completo onde o usuário pesquisa uma música e recebe uma resposta simulada do estúdio (Powered by Gemini Logic).

### 4. Tecnologia PWA
*   **Instalável**: Pode ser adicionado à tela inicial do Android/iOS como um app nativo.
*   **Offline Ready**: O app carrega instantaneamente mesmo sem internet (cache de assets).

## 🛠️ Stack Tecnológico
*   **Core**: React 19 + TypeScript + Vite.
*   **Estilo**: Tailwind CSS v4 (Configuração Customizada).
*   **PWA**: `vite-plugin-pwa` (Manifest + Service Workers).
*   **Icons**: Material Symbols (Google).

## 📱 Como Testar
1.  **Mobile**: Acesse o link do Vercel no Chrome (Android) ou Safari (iOS).
2.  **Instalar**: Toque em "Adicionar à Tela de Início".
3.  **Radio Play**: Dê play em qualquer música e bloqueie a tela para testar o som de fundo.

---

*Projeto desenvolvido pela Antigravity Agent.*
