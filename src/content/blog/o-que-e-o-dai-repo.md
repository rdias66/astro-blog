---
author: Rodrigo Dias  
pubDatetime: 2024-10-31T14:17:52.737Z  
title: O que é o DAI-repo?  
slug: o-que-e-o-dai-repo  
featured: true  
tags:
  - dai-repo  
description: Descrição da função e organização do repositório de auxílio de deploy DAI-repo.  
---

Antes de colocarmos a mão na massa, é importante trazer uma visão geral da estrutura e da ideia por trás do DAI-repo. Esse repositório foi criado para centralizar todas as ferramentas e utilidades essenciais ao fluxo de publicação de um aplicativo. Vamos entender como ele foi estruturado.

### Estrutura do Repositório

O repositório é organizado em três diretórios principais, cada um com um papel específico no processo de deploy:

#### 1. `reverse-proxy/`

Este diretório centraliza a configuração do reverse-proxy e dos certificados DNS necessários para a disponibilização pública do domínio do projeto. A escolha de reverse-proxy aqui foi o **Nginx**, rodando em um container Docker gerado pelo `docker-compose` presente nesta pasta. Essa configuração resulta em uma instância Nginx, configurada a partir do arquivo `conf.d/nginx.conf`, que gerencia as requisições e respostas dos domínios e subdomínios da aplicação para os containers de backend e frontend.

#### 2. `scripts/`

O diretório `scripts/` armazena e organiza os scripts de preparação do ambiente de deploy. Ele cobre a instalação e configuração de ferramentas essenciais na VM ou instância EC2, incluindo pacotes, Docker, Docker Compose, redes, e criação de usuários no sistema operacional para conexões SSH. Assim como rotinas de limpeza do docker e ecr que serão configurados via _crontab_.

#### 3. `tofu/`

Este é o diretório onde a IaC (Infraestrutura como Código) é modularizada e criada. No caso deste exemplo ([aws-dai-repo](https://github.com/rdias66/aws-dai-repo)), o DAI-repo foi desenvolvido para deploy na AWS, mas há uma versão para Azure também caso tenha interesse([azure-dai-repo](https://github.com/rdias66/azure-dai-repo)). Este post traz uma visão geral das pastas e arquivos principais, mas abordaremos em um post separado os detalhes dos módulos de serviços da AWS.

### Estrutura de Diretórios e arquivos

Abaixo, está a estrutura básica de diretórios e arquivos do DAI-repo(mais detalhes da seção tofu no post [Infraestrutura AWS com OpenTofu](https://blog.rdias66.codes/posts/infra-aws-com-open-tofu)):

```bash
└── reverse-proxy/ 
    ├── docker-compose.yml    
    └── nginx/           
       ├── certs/
       └── conf.d/
           └── nginx.conf        

├── scripts/
    ├── setup.sh
    ├── clean-docker.sh
    └── clean-ecr.sh

└── tofu/                 
    ├── modules/           
        ├── ec2/           
        ├── ecr/    
        ├── rds/            
        ├── s3/             
        └── vpc/            
    └── production/
        ├── security-groups/
```

Em geral esse repositório serve como um ponto único de gestão para todas as etapas de configuração buscando tornar  o processo de deploy mais organizado e eficiente.