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

Antes de colocarmos a mão na massa, é importante trazer uma visão geral da estrutura e da ideia por trás do DAI-repo. Este repositório foi criado para centralizar todas as ferramentas e utilidades essenciais ao fluxo de publicação de um aplicativo. Vamos entender como ele foi estruturado e como ele pode facilitar a vida de quem gerencia o deploy de aplicações.

## O que é o _dai-repo_?

O DAI-repo (Deploy Assistance Infrastructure Repository) é um repositório projetado para organizar e automatizar tarefas de deploy de forma eficiente. Ele agrupa configurações, scripts e infraestrutura como código (IaC), permitindo que o processo seja replicável e escalável. A ideia é simplificar o gerenciamento de ambientes de deploy, independentemente de sua complexidade.

### Estrutura do Repositório

O repositório é organizado em três diretórios principais, cada um com um papel específico no processo de deploy:

#### 1. `reverse-proxy/`

Este diretório centraliza a configuração do reverse-proxy e dos certificados DNS necessários para a disponibilização pública do domínio do projeto. A escolha de serviço reverse-proxy aqui foi o **Nginx**, que será executado em um container Docker gerado pelo `docker-compose` presente nesta pasta. Essa configuração resulta em uma instância Nginx, configurada a partir do arquivo `conf.d/nginx.conf`, que gerencia as requisições e respostas dos domínios e subdomínios da aplicação para os containers de backend e frontend.

#### 2. `scripts/`

O diretório scripts/ armazena e organiza os scripts de preparação do ambiente de deploy. Estes scripts desempenham tarefas essenciais, como:

* Instalação e configuração de ferramentas: Ferramentas como Docker, Docker Compose, redes Docker, e configurações básicas da máquina (VM ou EC2) são configuradas automaticamente.

* Criação de usuários: Usuários para conexões SSH são criados e configurados com permissões adequadas.

* Manutenção automática: Scripts como clean-docker.sh e clean-ecr.sh implementam rotinas de limpeza do Docker e ECR, podendo ser agendados via crontab.

Com esses scripts, a inicialização do ambiente de deploy torna-se mais simples e previsível.
#### 3. `tofu/`

Este é o coração da Infraestrutura como Código (IaC) do repositório. No caso deste exemplo (aws-dai-repo), o DAI-repo foi desenvolvido para deploy na AWS. No entanto, há uma versão adaptada para Azure (azure-dai-repo).

* Dentro do diretório tofu/, encontramos:

* Módulos reutilizáveis: Diretório modules/, contendo módulos para serviços da AWS como EC2, ECR, RDS, S3 e VPC.

* Configuração de produção: Diretório production/, com arquivos principais (main.tf, variables.tf, outputs.tf) e configurações específicas para a implantação do ambiente de produção.

Em um post futuro, abordaremos em detalhes os módulos e como eles foram construídos.

### Estrutura de Diretórios e arquivos

Abaixo, está a estrutura básica de diretórios e arquivos do DAI-repo(mais detalhes da seção tofu no post [Infraestrutura AWS com OpenTofu](https://blog.rdias66.codes/posts/infra-aws-com-open-tofu)):

```bash
└── reverse-proxy/
    ├── docker-compose.yml     # Define os serviços Docker, incluindo o Nginx
    └── nginx/           
       ├── certs/               # Certificados SSL para domínios e subdomínios
       └── conf.d/             
           └── nginx.conf       # Configuração do reverse-proxy e rotas

├── scripts/
    ├── setup.sh               # Script principal de configuração inicial
    ├── clean-docker.sh        # Script para limpeza de containers e imagens Docker
    └── clean-ecr.sh           # Script para limpeza de repositórios ECR

└── tofu/                 
    ├── modules/           
        ├── ec2/           # Módulo para instâncias EC2
        ├── ecr/           # Módulo para repositórios ECR
        ├── rds/           # Módulo para banco de dados RDS
        ├── s3/            # Módulo para buckets S3
        └── vpc/           # Módulo para criação de VPC
    └── production/         
        ├── security-groups/ # Configurações de grupos de segurança AWS
        ├── main.tf         # Arquivo principal de configuração Terraform
        ├── variables.tf    # Variáveis utilizadas nos módulos
        ├── outputs.tf      # Outputs gerados após o deploy
        ├── terraform.tfvars.example # Exemplo de arquivo de variáveis personalizadas
```

### Por que usar o dai-repo?

A principal vantagem de usar o DAI-repo é centralizar toda a lógica e as ferramentas necessárias para o deploy em um único lugar. Isso torna o processo mais organizado, previsível e fácil de replicar em diferentes ambientes. Além disso, sua modularidade permite adaptações para outras plataformas de nuvem, como Azure, ou até mesmo para soluções on-premises.

Em resumo, o DAI-repo é uma solução prática e eficiente para gerenciar deploys, seja para projetos pequenos ou grandes. Fique ligado nos próximos posts, onde detalharemos aspectos específicos da configuração e utilização!