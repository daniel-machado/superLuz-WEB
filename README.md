# 🌐 Superluz Web

Aplicação web moderna desenvolvida em **React + Vite + TypeScript**, com design responsivo e integração de múltiplas bibliotecas para dashboards, formulários e animações.

---

## 🚀 Tecnologias Principais

- [React 18](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router v7](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [FullCalendar](https://fullcalendar.io/)
- [ApexCharts](https://apexcharts.com/)
- [Yup](https://github.com/jquense/yup)
- [React Hook Form](https://react-hook-form.com/)

---

## 🛠️ Pré-requisitos

Antes de começar, verifique se você tem instalado em sua máquina:

- **Node.js** (versão 18 ou superior)  
- **npm** (instalado junto com o Node)  

Para verificar:
```bash
node -v
npm -v
```

---

## 💻 Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/superluz-web.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd superluz-web
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. O projeto estará disponível em:
   ```
   http://localhost:5173/
   ```

---

## 🏗️ Gerar a Versão de Produção

Para criar a build otimizada (usada para deploy em produção, como no AWS S3):

```bash
npm run build
```

Isso executa o TypeScript e o processo de build do Vite, gerando a pasta:

```
dist/
```

Todo o conteúdo dentro de `dist/` pode ser enviado para o seu ambiente de hospedagem (ex: **Amazon S3**, **CloudFront**, **Vercel**, etc).

---

## 📁 Estrutura Simplificada do Projeto

```
superluz-web/
├── public/                # Arquivos públicos (favicon, ícones, etc.)
├── src/
│   ├── assets/            # Imagens e ícones
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas principais
│   ├── routes/            # Rotas da aplicação
│   ├── services/          # Conexões com API
│   ├── styles/            # Configurações do Tailwind
│   ├── App.tsx            # Componente raiz
│   └── main.tsx           # Ponto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧠 Dica

Durante o desenvolvimento, qualquer alteração no código é automaticamente refletida no navegador graças ao **hot reload** do Vite 🔥.

---

## 🧾 Licença

Este projeto está sob a licença **MIT** — sinta-se livre para usar e modificar.

---

📦 **Autor:** Daniel Machado  
💡 *Desenvolvido com foco em performance, clareza e escalabilidade.*



