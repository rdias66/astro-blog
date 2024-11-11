---
author: Rodrigo Dias
pubDatetime: 2024-11-11T14:11:52.737Z
title: Infraestrutura AWS com OpenTofu
slug: infra-aws-com-open-tofu
featured: true
tags:
  - devops
  - iac
  - opentofu
  - dai-repo
description: Configuração da seção do OpenTofu no repositório auxiliar de deploy para AWS(dai-repo) 
---

Neste post, vamos explorar em detalhes a configuração necessária para criar uma infraestrutura na AWS utilizando IaC com o OpenTofu. Esse tutorial usa como referência o repositório auxiliar de deploy para AWS, o `aws-dai-repo`, que serve de base para exemplificar todo o fluxo.

Para entender melhor o uso de módulos no OpenTofu, podemos compará-los a classes na programação orientada a objetos. Assim como classes definem características e comportamentos que são especificados ao criar uma instância dessa classe, os módulos definem recursos de infraestrutura que serão criados, configurados e gerenciados de forma modular e reutilizável. Nesta estrutura, vamos configurar uma infraestrutura AWS que suporta um aplicativo full stack (backend, frontend e banco de dados), usando instâncias baseadas nos módulos de serviços da AWS. Para um entendimento mais aprofundado do planejamento, confira este post sobre  [Planejamento DevOps para Deploy na AWS](https://blog.rdias66.codes/posts/planejamento-devops-para-deploy-aws).

> Antes de avançarmos, é importante ter toda a configuração inicial pronta no console da AWS e no ambiente local (como AWS CLI, Git etc.). Caso precise de ajuda com essa etapa, você pode seguir este guia: [Configuração necessária no console AWS e setup local para deploy](https://blog.rdias66.codes/posts/configuracao-aws-console-e-local-para-deploy) 


Esses primeiros passos girarão em torno do repositório auxiliar, entao vamos começar clonando o repositório aws-dai-repo em sua máquina. No diretório de sua preferência, execute:

`git clone https://github.com/rdias66/aws-dai-repo.git`


Neste post, vamos explorar em detalhes a configuração necessária para criar uma infraestrutura na AWS utilizando IaC com o OpenTofu. Esse tutorial usa como referência o repositório auxiliar de deploy para AWS, o aws-dai-repo, que serve de base para exemplificar todo o fluxo.

Para entender melhor o uso de módulos no OpenTofu, podemos compará-los a classes na programação orientada a objetos. Assim como classes definem características e comportamentos que são especificados ao criar uma instância, os módulos definem recursos de infraestrutura que serão criados, configurados e gerenciados de forma modular e reutilizável. Nesta estrutura, vamos configurar uma infraestrutura AWS que suporta um aplicativo full stack (backend, frontend e banco de dados), usando instâncias baseadas nos módulos de serviços da AWS. Para um entendimento mais aprofundado do planejamento, confira este post sobre Planejamento DevOps para Deploy na AWS.

Vamos começar clonando o repositório aws-dai-repo em sua máquina. No diretório de sua preferência, execute:

```bash
git clone https://github.com/rdias66/aws-dai-repo.git
```

Para entender mais sobre a estrutura do dai-repo, recomendo também o post: [O que é o dai-repo?](https://blog.rdias66.codes/posts/o-que-e-o-dai-repo)

## Estrutura do diretório `tofu/`

Neste tutorial, nosso foco será no diretório `tofu/`. Ele contém duas pastas principais:

- **modules/**: Aqui estão os módulos de serviços, que são configurações reutilizáveis de infraestrutura. Usando a analogia anterior, esses módulos são como classes que definem moldes para criar serviços específicos no ambiente de produção.

- **production/**: Esta pasta é o módulo de produção, onde fazemos o instanciamento completo da infraestrutura. Ela usa os módulos para criar instâncias de serviços (como EC2, RDS, ECR), definir variáveis de ambiente que o OpenTofu usará, e configurar as regras de segurança da estrutura (grupos de segurança).

A seguir a estrutura detalhada do diretório com uma breve descrição, os arquivos contém comentarios explicativos em todos os arquivos.

```bash

└── tofu/                 
    ├── modules/           
        ├── ec2/           
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── ecr/
            ├── main.tf
            └── variables.tf       
        ├── rds/            
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── s3/            
            ├── main.tf
            ├── variables.tf
            └── outputs.tf    
        └── vpc/        
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
    └── production/
        ├── security-groups/ #configurações de acesso e permissões entre si e para a internet
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── main.tf #instanciamento dos modulos necessários para infraestura, neste nível que rodaremos os comandos tofu(init play apply)
        ├── variables.tf # organização de variaveis a partir das variaveis de ambiente
        └── terraform.tfvars.example # exemplo de arquivo de variaveis de ambiente, funcionamento similar às .envs 
```

## Execução da IaC:

1 - Criar e popular o arquivo `terraform.tfvars`, criado no mesmo nivel que o seu exemplo. Esse exemplo ja tem configurado em si todos os valores necessários para a estrutura de nosso planejamento, mas caso tenha curiosidade ou queira ter certeza que tudo isso esteja de acordo com suas necessidades, de uma olhada na documentação da AWS para estes serviços.

- [AWS Regions and Availability Zones](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html)
- [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Amazon EC2 Instance Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html)
- [Amazon Machine Images (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [Using Bucket Policies in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-bucket-policies.html)

2 - Inicializar o OpenTofu:

Com tudo configurado, inicie o OpenTofu executando o seguinte comando no nível de diretório `production/`:

```bash
tofu init
```
Esse comando inicializa o diretório de trabalho para OpenTofu, baixando os plugins e módulos necessários para o provedor de AWS.

3 - Planejar a Execução:

Para revisar as mudanças que o OpenTofu aplicará, execute:

```bash
tofu plan
```
O comando tofu plan mostra um resumo de todas as alterações que o OpenTofu fará em sua infraestrutura. Essa etapa é crucial para identificar possíveis problemas antes da aplicação das configurações.

4 - Corrigir Configurações se Necessário:

Se o OpenTofu mostrar mensagens de erro ou inconsistências durante o planejamento, ajuste os valores conforme recomendado. A CLI do OpenTofu fornece detalhes sobre o que precisa ser corrigido.

5 - Aplicar as Configurações:

Após confirmar que o plano de execução está correto, aplique as configurações com
```bash
tofu apply
```

6 - Verificar e Ajustar Configurações se Necessário:

Caso ocorram erros durante a aplicação, o OpenTofu mostrará instruções para correção. Revise as configurações e execute novamente tofu apply até que a infraestrutura seja criada com sucesso.

Ao final, você terá uma infraestrutura básica na AWS, configurada e pronta para o deploy do seu aplicativo. Essa configuração inclui a rede (VPC), instâncias EC2, um banco de dados RDS, repositórios ECR para imagens Docker, um bucket S3 para armazenamento e a chave .pem para acesso SSH entre sua máquina e sua EC2 criada em no diretório raiz do dai-repo. Guarde muito bem e faça backups desta chave! 


