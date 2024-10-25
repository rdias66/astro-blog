# Blog de Tutoriais e Guias para Devs 🚀

Bem-vindo ao repositório do [blog.rdias66.codes](https://blog.rdias66.codes)! Este projeto é um blog dedicado a tutoriais e guias para desenvolvedores interessados em DevOps e desenvolvimento Full Stack, com o objetivo de compartilhar conhecimento e auxiliar desenvolvedores na construção de suas habilidades.

Desenvolvido com [Astro](https://astro.build/), o blog entrega uma experiência de navegação rápida e uma estrutura otimizada para conteúdo técnico.

## 🔧 Tecnologias e Ferramentas

- **Framework**: [Astro](https://astro.build/) - para renderização rápida e otimizada de conteúdo
- **Markdown**: Formato principal para criação de postagens e guias, facilitando a edição e manutenção
- **Estilização**: CSS puro em tags locais/globais

## 🌟 Funcionalidades

- **Conteúdo Técnico**: Foco em DevOps e desenvolvimento Full Stack com tutoriais, dicas e boas práticas
- **Organização de Conteúdo**: Estrutura amigável e bem organizada, ideal para desenvolvedores que buscam aprendizado contínuo
- **SEO Otimizado**: Otimização para search engines baseada no tema Astro-Paper

## 📂 Estrutura do Projeto

```plaintext
.
├── public/              # Arquivos estáticos (imagens, ícones, etc.), além do javascript client-side que o projeto utiliza para algumas funções.
├── src/
│   ├── components/      # Componentes reutilizáveis do Astro
│   ├── content/         # Diretório com postagens em Markdown
│   ├── layouts/         # Layouts para páginas e postagens
│   ├── pages/
│   │   ├── index.astro  # Página inicial
│   │   └── posts/       # Página com todos os posts e a página individual renderizada a partir do 'slug' de cada post
│   │   └── tags/        # Página com todas as tags dos posts e a página individual renderizada a partir de cada tag
│   └── styles/          # Estilos globais
│   └── utils/           # Página com utilitários referentes à funções de interação com a api astro:content(arquivos da "content/")
└── astro.config.mjs     # Configurações do Astro


## 🚀 Executando o Projeto Localmente

Para rodar o projeto localmente, siga estas etapas:

1. Clone o repositório:
    ```bash
    git clone https://github.com/rdias66/astro-blog.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd astro-blog
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
4. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

Acesse [http://localhost:4322](http://localhost:4322) no navegador para visualizar o blog localmente.



📝 Contribuições
Contribuições são bem-vindas! Se você deseja melhorar o blog, fique à vontade para abrir uma issue ou um pull request. Seu feedback é muito importante para mim.

Caso queira copiar o blog e publica-lo com seu conteudo sinta-se livre para isso, siga o meu tutorial de publicação de aplicativos na AWS neste mesmo blog ;)